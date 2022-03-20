const AWS = require('aws-sdk');
const fs = require('fs');
const uuid = require('uuid').v4;
const mimeType = require('mime-types');
const AppError = require("./appError");
const postModel = require("../models/postModel");

const s3 = new AWS.S3({ 
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
});

const {AWS_TEMP_POST_FOLDER, AWS_POST_VID_SUB_FOLDER, AWS_POST_BUCKET_NAME, AWS_POST_BUCKET_URL, AWS_ACL } = process.env;
const baseUrl = AWS_POST_BUCKET_URL + "/" + AWS_POST_VID_SUB_FOLDER; //Base url for video uploads


// Returns s3 Param object
const getParams = (path, fileName, ContentType, ORDER="") =>{
  const FOLDER = ORDER && ORDER === "FINAL" ? AWS_POST_VID_SUB_FOLDER : AWS_TEMP_POST_FOLDER; //put video into perm folder if FINAL phase
  return {
    Bucket: AWS_POST_BUCKET_NAME,
    Key: `${FOLDER}/${fileName}`,
    Body: fs.readFileSync(path),
    ContentType,
    ACL: AWS_ACL
  };
}

// Starts the upload process
const UPLOAD = (path, fileName, ContentType, ORDER) =>{
  const params = getParams(path, fileName, ContentType, ORDER)
  return s3.upload(params).promise();
}

// Reads entire directory
const readDirectory = (dirPath, next) =>{
  return new Promise((resolve, reject) =>{
    fs.readdir(dirPath, (err, files) => {
      if(err){
        console.log("readDirectoryErr: ",err);
        return next(new AppError("Server error. Pls try again.", 500));
      }
      resolve(files)
    })
  })
};

// Will delete files after processing/on err
const removeFiles = (path) => fs.rmSync(path, {recursive: true, force: true});

// Upload Image/video files to S3 bucket
const uploadToS3 = async (filePath, originalname, mime, req, next) =>{
  try{
    let sourceName = `${originalname}-${uuid()}`;

    if(mime === "video/mp4"){

      const { videoDir, ORDER } = req;
      sourceName = videoDir.split("/")[2];

      // 1. Read all files in the directory
      const derivedFiles = await readDirectory(videoDir, next);

      // 2. Send to video folder in aws
      const derivedPromise = derivedFiles.map((fname) =>{
        const fullPath = `${filePath}/${fname}`;
        let ContentType = mimeType.lookup(fullPath);
        if(ContentType === false){
          if(fname.startsWith("chunk")) ContentType = "video/iso.segment";
      
          if(fname.startsWith("stream")) ContentType = "application/dash+xml"
        };

        return UPLOAD(fullPath, `${sourceName}/${fname}`, ContentType, ORDER);
      });

      await Promise.all(derivedPromise);
      
      // DONE is used by numVar = 1
      if(ORDER ==="DONE")  removeFiles(videoDir);

      if(ORDER === "FINAL"){
        // Get the parent post using postID and update the derivedUrls
        const derivedUrls = [
          {src: `${baseUrl}/${sourceName}/master.m3u8`, type:"application/x-mpegURL"}, //HLS
          {src: `${baseUrl}/${sourceName}/master.mpd`, type:"application/dash+xml"}, //MPEG-DASH
          {src: `${baseUrl}/${sourceName}/master.mp4`, type:"video/mp4"}, //MP4
        ]

        await postModel.findByIdAndUpdate(req.body?.post_id, {derivedUrls});
        req.media_id = { video:{ ORDER } }; //The object encapsulation is used in the frontend for redux updates.
        removeFiles(videoDir);

      }else{
        req.media_id ={video:{media_id:sourceName, ORDER}};
      };
    }
    else{
      await UPLOAD(filePath, sourceName, mimeType.lookup(filePath))
      
      req.media_id ={image:{media_id:sourceName}}; 

      removeFiles(filePath) // Remove from file system
    };

    next();
  }
  catch(error){
    if(ORDER === "FINAL"){
      console.log("error_uploadToS3: ", error);
      removeFiles(filePath);
      return null
    };

    // Remove all files from file system
    removeFiles(filePath);
    console.log("error_uploadToS3: ", error);
    return next(new AppError("Error uploading media file. Pls try again!",400));
  }
};


/** -------->  Copy files in temporary folder to user-uploads folder used by imgix ------> */

// Returns the params needed for copying files
const copyParams = (media_subfolder, fileName) =>({
  Bucket: AWS_POST_BUCKET_NAME,
  CopySource: `${process.env.AWS_POST_BUCKET_NAME}/${process.env.AWS_TEMP_POST_FOLDER}/${fileName}`,
  Key: `${media_subfolder}/${fileName}` 
});

// Starts the copy process
const COPY = (media_subfolder, fileName) => {
  return s3.copyObject(copyParams(media_subfolder, fileName)).promise();
};

/* Get the keys of all objects with the given prefix: Returns an arr of objects*/
const getKeys = (prefix, next) =>{
  return new Promise((resolve, reject) =>{
    const params ={
      Bucket: AWS_POST_BUCKET_NAME,
      Prefix:`${process.env.AWS_TEMP_POST_FOLDER}/${prefix}`
    };

    s3.listObjectsV2(params, (err, data) =>{
      if(err){
        console.log("getKeysErr: ",err);
        return next(new AppError("Error uploading media file. Pls try again!", 500));
      };
      resolve(data.Contents)
    })
  })
};

// Parent Function used to initiate copy process
const copyFromTemp = async(fileName,fileType, next)=>{ 
  try{
    const img_subfolder = process.env.AWS_POST_IMG_SUB_FOLDER;
    if(fileType ==="image"){
      await COPY(img_subfolder, fileName);

      return fileName; //returns image filename
  
    }else{
      const {poster_name, video_name} = fileName;

      // Get a list of objects with the given prefix
      const vidKeys  = await getKeys(video_name, next);
      const vidPromises = vidKeys.map(({ Key }) => {
        const values = Key.split("/");
        const fname = values[1] + "/" + values[2];
        return COPY(AWS_POST_VID_SUB_FOLDER, fname);
      })

      await Promise.all([ COPY(img_subfolder, poster_name), ...vidPromises]);

      const derivedUrls = [
        {src: `${baseUrl}/${video_name}/master.mp4`, type:"video/mp4"}, //MPEG-DASH
      ]

      return {derivedUrls, fileUrl:`${baseUrl}/${video_name}/master.mp4`}; //returns derived videos and thumbnail urls
    };
  }catch(error){
    console.log("copyFromTemp: ", error)
    next(new AppError("Error with post media. Pls try again.", 400));
  };
}

module.exports = { s3, uploadToS3, copyFromTemp }