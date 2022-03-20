const multer = require('multer');
const uuid = require('uuid').v4;
const AppError = require('./appError');
const fileType = require('file-type');
const fs = require('fs');
const sharp = require('sharp');
const { canContest } = require("../utils/verify");
const {transcodeVideo, probeVideo} = require("./ffmpegConfig");
const { uploadToS3 } = require("./awsConfig");

// Will delete files after processing/on err
const removeFile = (path) => fs.rmSync(path,{recursive: true, force: true})

/**Transcodes video and then uploads To S3: NOTE=>req.videoPath IS SET IN MULTER */
const transUpload = async(req, next, mime, originalname, metadata={}) =>{

  // 1. Probe video file for integrity
  if(req.ORDER === "FINAL"){
    metadata = await probeVideo(req.videoDir, next);
  }

  // 2. Transcode video videoDir, req,  next, metadata
  await transcodeVideo(req, next, metadata);

  // 3. Upload to S3 if transcoding goes successfully
  uploadToS3(req.videoDir, originalname, mime, req, next);
}


// Checks media file availability
const exists = (directory, req, next) =>{
  return new Promise((resolve) =>{
    fs.open(`${directory}/master.mp4`, "r", (err,fd)=>{
      if(err) return next(new AppError("Invalid server request", 400));
      resolve(fd);
    })
  })
};

/*Used for splitting video transcoding into 2 phases in order to reduce upload latency on client*/ 
const checkMediaID = async(req, res, next) =>{
  if(!req.body?.media_id){

    canContest(req, next); // Check if user has enough coins

    req.ORDER = "INIT"; //Transcode phase-1
    return next();
  }

  // 1. Check if video file has undergone phase-1 of transcoding
  const directory = `uploads/video/${req.body.media_id}`;

  // a. If (1) is true, check fs if the file exists
  await exists(directory, req, next);

  // b. Transcode phase-2
  req.ORDER = "FINAL";

  // c. video path in fs
  req.videoDir = directory;

  // d. start processing
  transUpload(req, next, "video/mp4", "feed-media")
}

// FOR ALL OTHER UPLOADS IN THE APP: E.g Post components and user profile 
const multerPostUploads = () =>{
  const fileFilter = (req, file, cb) =>{
    const supportedMimes = ["image/jpg", "image/jpeg", "image/png", "image/webp", "video/mp4"];
    if(!supportedMimes.includes(file.mimetype)){
      cb(null, false);
      return cb(new AppError("Unsupported file type.", 400));
    };

    cb(null,true);
  }

  const storage = multer.diskStorage({
    destination:(req,file, cb) =>{
      const fileMime = file.mimetype.split("/")[0];
      if(fileMime === "video"){
        const videoDir = `uploads/${fileMime}/${uuid()}`;
        fs.mkdirSync(videoDir); //creates directory named after videoDir
        req["videoDir"] = videoDir;
        cb(null, videoDir)
      }
      else{
        cb(null, `uploads/${fileMime}`)
      }
    },

    filename:(req,file, cb) =>{
      const ext = file.mimetype.split("/")[1];
      if(req["videoDir"]){
        cb(null, `source.${ext}`)
      }
      else{
        cb(null, `${file.originalname}-${uuid()}.${ext}`)
      };
    }
  });

 return multer({ storage, fileFilter}).single("media") //, limits: { fileSize: 10*1024*1024 } 
};

// FOR ALL MEDIA UPLOADS WHILE A USER TAKES TEST: e.g speaking--> audio blob
const testUploads = ()=>{
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/test/uploads/blob"), // Absolute path

    filename:(req, file, cb) => cb(null,`${file.originalname}_${req.user.id}_${uuid()}`)
  }) 
  return multer({ storage });
};

// Image resizing
const resizeImage = async (imageOptions, next) =>{

  const { Image, format, aspectRatio, resizeW, imageType, path} = imageOptions;

  const newPath = `uploads/image/${imageType}-${uuid()}.${format}`;

  result = await Image.resize(resizeW, Math.round((resizeW/aspectRatio))).toFile(newPath)

  if(!result) return next(new AppError("Image error"), 500);

  removeFile(path) //Remove the old image path from disk
  return newPath;
};

// Image processor
const processImage = async(originalname, size, path, req, next)=>{

  const supportedImgMimes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
  let filePath = ""; //Will hold path to img on local disk and then from imgix

  // 1. Check image true mimetype for only jpeg/jpg and png, webp
  const { mime } = await fileType.fromFile(path);

  if(!supportedImgMimes.includes(mime)){
    removeFile(path)
    return next(
      new AppError("We only support png,jpeg/jpg and webp", 415)
    );
  }

  // 2. Check for image size >! 20mb
  if(size > 20 * 1000 * 1000){
    removeFile(path)
    return next(new AppError("File too large! Image must not exceed 20mb", 413))
  };

  // 3. Send Image to Django server for further processing
  const  Image = sharp(path)

  const { width, height, format } = await Image.metadata();

  const aspectRatio = (width / height);
  
  let imageOptions = { Image, aspectRatio, format, path}

  // Supported widths
  const avatarWidth = 400 //In pixels
  const feedPhotoWidth = 1500 //In pixels

  /** AVATAR IMAGE (max-width: 400px) */
  if(originalname === "avatar"){
    if(width > avatarWidth){
      imageOptions = {...imageOptions, imageType:originalname, resizeW:avatarWidth}
      filePath = await resizeImage(imageOptions, next);
    }else{
      filePath = path;
    }
  }

  /** FEED IMAGE (max-width: 1500px) */
  if(originalname ==="feed-media" || originalname ==="video-thumb"){
    if(width > feedPhotoWidth){
      imageOptions = {...imageOptions, imageType:originalname, resizeW:feedPhotoWidth}
      filePath = await resizeImage(imageOptions, next)
    }else{
      filePath = path;
    }
  };

  // 4. Upload to S3 if processing goes successfully
  await uploadToS3(filePath, originalname, mime, req, next);
}

// Process video files
const processVideo = async(originalname, srcFilePath, req, next)=>{
  const videoMimes = ["video/mp4"];

  // 1. Check video true mimetype for only mp4
  const { mime } = await fileType.fromFile(srcFilePath);

  if(!videoMimes.includes(mime)){
    removeFile(req.videoDir)
    return next(
      new AppError("We only support mp4", 415)
    );
  }
  
  // 2. Probe video file for integrity
  const metadata = await probeVideo(req.videoDir, next);

  const { duration, size } = metadata.format;

  // 1. Ensure video duration >! 35sec
  if(Math.floor(duration) < 5 || Math.floor(duration) > 30){
    removeFile(req.videoDir);
    return next(new AppError("video must be between 5 and 30 seconds", 400));
  }
  
  // 2. Ensure video size doesn't exceed 70 MB
  if(size > 100 * 1000 * 1000){
    removeFile(req.videoDir)
    return next(new AppError("File too large! Video must not exceed 70mb", 413))
  };

  // Start processing
  transUpload(req, next, mime, originalname, metadata)
}

/** Validate and process image/video upload before saving to S3 */
const processMedia = async(req, res, next) =>{
  try{
    const { originalname="", size="", path="", mimetype=""  } = req.file || {};
    
    req.fileType = mimetype; //To be sent back to user for use in createPost

    if(!originalname && req.ORDER !== "FINAL") return next(new AppError("File must contain an originalname(avatar/feed-media)"),400);

    // Process Image Uploads  
    if(mimetype.startsWith('image')) processImage(originalname, size, path, req, next)

    // Process Video Uploads
    if(mimetype.startsWith('video')) processVideo(originalname, path, req, next)
  }
  catch(error){
    return next(new AppError(error,500))
  }
};

module.exports = {checkMediaID, multerPostUploads, processMedia, testUploads}