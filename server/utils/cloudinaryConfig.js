const cloudinary = require("cloudinary").v2;
const AppError = require("./appError");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
});

// Begin eager transformations of video
const sharedOpt = {width:640, height:360, crop:"limit", quality:"auto"}
const uploadOptions ={
  resource_type: "video",
  type:"private", 
  eager_async:true, 
  // eager_notification_url:"",
  eager:[
    { fetch_format: "mp4", video_codec: "h265", format: "", ...sharedOpt},
    { fetch_format: "webm", video_codec: "vp9", format: "", ...sharedOpt},  //quality:"auto:qmax_70"
    { fetch_format: "mp4", video_codec: "h264", format: "", ...sharedOpt} 
  ]
}

// Video upload process starts here
const uploadToCloudinary=(media_id, next)=>{
  try{
    return new Promise((resolve, reject) =>{

      const fileUrl = `https://${process.env.AWS_POST_BUCKET_NAME}.s3.amazonaws.com/${process.env.AWS_TEMP_POST_FOLDER}/${media_id}`;

      cloudinary.uploader.upload(fileUrl,uploadOptions, (err, result)=>{
        if(err){
          console.log("cloudinary_err: ",err);
          return next(new AppError("Error uploading media file. Pls try again!",500));
        };

        const derivedUrls = {h265:"",vp9:"",h264:""}, {secure_url, eager} = result;
        Object.keys(derivedUrls).forEach((codec,i ) => derivedUrls[codec] =eager[i].secure_url);

        resolve({fileUrl:secure_url, derivedUrls});
      })
    });
  }
  catch(error){
    console.log("cloudinary_err: ", error);
  }
}

module.exports = uploadToCloudinary;
