const fs = require('fs');
const path= require('path');
const { s3 } = require('./awsConfig');
const { ffmpeg } = require("./ffmpegConfig");
const testModel = require("../models/testModel");

//Sends audio to S3 and returns the url
const uploadFile = (server_Mp3_Path, file_name, callBack) =>{
  fs.readFile(server_Mp3_Path,function (err, data){
    if (!err) {
      let params = {
        Bucket      : process.env.AWS_ACADEMIA_BUCKET_NAME,
        Key         : file_name,
        Body        : data,
        ContentType : 'audio/mp3',
        ACL         : process.env.AWS_ACL
      };

      s3.putObject(params, function(err, data){
        if (!err) {
          let aws_File_Url = `https://${process.env.AWS_ACADEMIA_BUCKET_NAME}.s3.amazonaws.com/${file_name}`;
          callBack(null,aws_File_Url)
          const unlinkCB = (err)=>{
            if(!err) return;
            console.log("unlink err:",err);
          }
          fs.unlink(server_Mp3_Path,unlinkCB); //deleting the mp3 file from server file system
        }
        else {
          callBack(err)
          console.log(err);
        }
      })
    }
  });
}

/**
 * Below converts (a)Blob file to MP3 file,
 * (b)uploads mp3 to aws, (c) saves the fileUrl to mongodb 
 * and (d) Sends responds to client
 */
module.exports = (task,answers,userOwnTestId,req,res) => {

  // 0)For manipulating answers array index:NOTE - The array item assumes Questions from client is not greater than Q7
  const QArray =["Q1","Q2","Q3","Q4","Q5","Q6","Q7"];

  req.files.forEach((file,index)=>{

    let fileInfo = path.parse(file.originalname);

    let file_name=`${req.user.id}_${fileInfo.name}.mp3`;

    let server_Blob_Path = file.path;

    let server_Mp3_Path = `public/test/uploads/mp3/${file_name}`; //where to save the encoded mp3 file on the local server

    //3) Below converts Blob file to MP3 file 
    ffmpeg(server_Blob_Path)
    .toFormat("mp3")
    .on("error", function(err){
      console.log("convert_blob_to_mp3Err: ", err);
    })
    .on('end', function() {

      const ansIndex=QArray.indexOf(file.originalname) //Gets the index of the question on the answers array

      // Saves file to AWS and returns the url
      uploadFile(server_Mp3_Path,file_name,async(err,File_Url)=>{
        if(!err){
          // Callback for deleting processed files from file system
          const unlinkCB = (err)=>{
            if(!err){
              return 
              // console.log("file unlinked");
            }
            console.log("unlink err:",err);
          }

          //4) Updating the answer array with new audioUrl from AWS
          answers[ansIndex] = {
            ...answers[ansIndex], 
            answer:{...answers[ansIndex].answer, audioUrl: File_Url, blob: ""}
          };

          // 5) Update test in Database
          await testModel.findByIdAndUpdate(userOwnTestId, {[`speaking_ans.${task}`]:answers});

          // Send response after successfully processing the last file url in the files array
          if(file.originalname===req.files[req.files.length-1].originalname){

            fs.unlink(server_Blob_Path,unlinkCB); //deleting the blob file from server file system

            res.status(200).json({ status: 'success' })

          } else {
            fs.unlink(server_Blob_Path,unlinkCB); //deleting the blob file from server file system
          }
        }
      });
    })
    .save(server_Mp3_Path)
  })
};