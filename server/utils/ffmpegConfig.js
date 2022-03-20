const fs = require("fs");
const AppError = require("./appError");
const {  s3 } = require("./awsConfig");
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// Configure ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// configure probe path
ffmpeg.setFfprobePath(ffprobe.path);

//Removes an entire directory 
const removeFile = (path) =>fs.rmSync(path,{recursive: true, force: true})

// Will extract video file's metadata
const probeVideo = (videoDir, next) =>{
  return new Promise((resolve) =>{
    ffmpeg(`${videoDir}/source.mp4`).ffprobe((err, data) =>{
      if(err){
        removeFile(videoDir);
        return next(new AppError("Error with uploaded file", 500));
      };
      resolve(data);
    })
  })
};

// ----------------- VARIANT-TO-STREAM-MAPPING ------------------
const Hls_maps = (hasAudio, numVar)=>{
  let maps = [];

  for(let i=0; i<numVar; i++){
    if(hasAudio){
      maps =[...maps,"-map 0:0","-map 0:1"]
    }
    else{
      maps =[...maps, "-map 0:0"]
    }
  };

  return maps;
};

const Dash_maps = (numVar)=>{
  let maps = [];

  for(let i=0; i<numVar; i++) maps =[...maps, "-map 0:0"];

  return [...maps,"-map 0:1?"]; //Conditionally selects audio stream
};

// Returns v/a stream mapping to the output variants
const var_stream_map = (hasAudio, numVar) =>{
  let variants ="";

  for(let i =0; i<numVar; i++){
    if(hasAudio){
    if(numVar - i === 1){
      variants +=`v:${i},a:${i}` //No spaces for the last one
    }else{
      variants +=`v:${i},a:${i}  ` // double-spaced 
    }
    }else{
      if(numVar - i === 1){
        variants +=`v:${i}` //No spaces for the last one
      }else{
        variants +=`v:${i}  ` // double-spaced 
      }
    }
  };

  return [`${variants}`]
};

// Returns video sizes/resoln dependent on the number of variants
// const sizeFilter = (varNum,w, h ) =>{ //#DFDFDFEA
//   return `-filter:v:${varNum} scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:#DFDFDFEA,setsar=1`
// }
const getVSizes = (numVar, ORDER) =>{

  // ----> PADDING TO PRESERVE ASPECT RATIO <-----
  // src:"http://localhost:3001/static/video/feed-media-5e72b333-483a-4523-b043-6b7bd13fd3ab/master.mpd" ....E.g
  // src:"http://localhost:3001/static/video/feed-media-4e9cf047-c1cc-4978-816f-92887ec4e6bd/master.mpd" ...E.g
  // if(numVar === 1) return [sizeFilter(0, 320, 240)]; //LD
  // if(numVar === 2) return [sizeFilter(0, 320, 240), sizeFilter(1, 640, 480)]
  // if(numVar === 3) return [sizeFilter(0, 320, 240), sizeFilter(1, 640, 480), sizeFilter(2, 1440, 1080)]
  if(ORDER === "INIT"){
    if(numVar === 2) return ["-filter:v scale=-2:480"]; //SD
    if(numVar === 3) return ["-filter:v scale=-2:720"]; //HD
    // if(numVar === 2) return ["-s:v:0 640x480"]; //SD
    // if(numVar === 3) return ["-s:v:0 960x720"]; //HD
  };

  if(ORDER === "FINAL"){
    if(numVar === 2) return ["-filter:v:0 scale=-2:240", "-filter:v:1 scale=-2:480"]; //SD
    if(numVar === 3) return ["-filter:v:0 scale=-2:240", "-filter:v:1 scale=-2:480", "-filter:v:2 scale=-2:720"]; //HD
  };

  if(numVar === 1) return ["-filter:v scale=-2:240"]; //LD
};

// -----------------> CODECS <-------------------

// Returns audio codec dependent on the number of variants
const getACodec_ABR = (codec_name, bit_rate, numVar, ORDER) =>{
  let aCodec = [];
  let bKb = Math.floor(bit_rate) / 1000; //bitrate in kb/s
  if(codec_name === "aac" && (bKb >= 32 && bKb <= 160)){
    aCodec = ["-c:a copy"]
  }
  else{
    if(ORDER === "INIT") aCodec = ["-c:a aac", "-b:a 128k"];

    if(ORDER === "FINAL"){
      if(numVar === 2) aCodec = ["-c:a:0 aac", "-c:a:1 aac", "-b:a:0 128k", "-b:a:1 128k"];
      if(numVar === 3) aCodec = ["-c:a:0 aac", "-c:a:1 aac", "-c:a:2 aac", "-b:a:0 128k", "-b:a:1 128k", "-b:a:2 128k"];
    };

    if(numVar === 1) aCodec = ["-c:a aac", "-b:a 128k"]; //LD
  }
  return aCodec;
};

// Returns video codec dependent on the number of variants
const getVCodec = (numVar, ORDER) =>{
  if(ORDER === "INIT") return ["-c:v libx264"];
 
  if(ORDER === "FINAL"){
    if(numVar === 2) return ["-c:v:0 libx264", "-c:v:1 libx264"];
    if(numVar === 3) return ["-c:v:0 libx264", "-c:v:1 libx264", "-c:v:2 libx264"];
  };

  if(numVar === 1) return ["-c:v libx264"]; //LD
};

// ------------------> BITRATES <------------------
// Returns video bitrate dependent on the number of variants
const getVBitrate = (numVar, ORDER) =>{
  if(ORDER === "INIT"){
    if(numVar === 2) return ["-b:v 800k"]; //SD
    if(numVar === 3) return ["-b:v 2500k"]; //HD
  };

  if(ORDER === "FINAL"){
    if(numVar === 2) return ["-b:v:0 350k", "-b:v:1 800k"];
    if(numVar === 3) return ["-b:v:0 350k", "-b:v:1 800k", "-b:v:2 2500k"];
  };

  if(numVar === 1) return ["-b:v 350k"]; //LD
};

// ------------------> OPTIONS GETTERS <------------------
const BASE_OPTIONS = (numVar, ORDER, hasAud, acodec, abitrate) =>{
  if(hasAud){
    return [
      ...getVCodec(numVar, ORDER),
      ...getACodec_ABR(acodec, abitrate, numVar, ORDER),
      ...getVBitrate(numVar, ORDER),
      ...getVSizes(numVar, ORDER),
      "-dn", //No data streams are allowed
      "-sn", // No subtitle is allowed
      "-copy_unknown"
      // "-write_tmcd false",
    ]
  }
  else{
    return [
      ...getVCodec(numVar, ORDER),
      ...getVBitrate(numVar, ORDER),
      ...getVSizes(numVar, ORDER),
      "-an", // No Audio present
      "-dn", //No data streams are allowed
      "-sn", // No subtitle is allowed
      "-copy_unknown" //Just copies unknown streams without throwing err
      // "-write_tmcd false",
    ]
  }
};


// For regular mp4 streams
const GET_MP4_OPTS =(numVar, ORDER, hasAud, acodec, abitrate)=>{
  return BASE_OPTIONS(numVar, ORDER, hasAud, acodec, abitrate)
}

// For HLS Adaptive stream
const GET_HLS_OPTS =(numVar, ORDER, hasAud, acodec, abitrate)=>{
  return [
    ...BASE_OPTIONS(numVar, ORDER, hasAud, acodec, abitrate),
    '-start_number 0',
    '-hls_time 6',
    '-hls_list_size 0',
    ...Hls_maps(hasAud, numVar),
    '-f hls', 
    '-var_stream_map', 
    ...var_stream_map(hasAud, numVar),
    '-master_pl_name master.m3u8'
    // `-hls_segment_filename ${output}/v_%v/media%d.ts`
  ]
};

// For DASH streaming
const GET_DASH_OPTS = (numVar, ORDER, hasAud, acodec, abitrate)=>{
  return [
    ...Dash_maps(numVar),
    ...BASE_OPTIONS(numVar, ORDER, hasAud, acodec, abitrate),
    "-f dash",
    "-use_timeline 1",
    "-use_template 1",
    "-seg_duration 5",
    "-init_seg_name stream$RepresentationID$",
    "-media_seg_name chunk$RepresentationID$$Number%02d$",
    "-adaptation_sets", "id=0, streams=v id=1, streams=a?"
  ] 
};

// carries out transcoding for the streaming-protocols (HLS & DASH)
const ffmpromise = (videoDir, output, options, next)=>{
  return new Promise((resolve) =>{
    ffmpeg(`${videoDir}/source.mp4`) 
    .outputOptions([
      "-preset veryfast", 
      "-crf 28", 
      ...options
    ])
    .on("error", function(e, stdout, stderr){
      removeFile(videoDir);
      // Hand the video over to cloudinary if err
      console.log("HLS_ERR: ", stdout, stderr);
      next(new AppError("server error. Pls try again.", 500));
    })
    .on("end", function(){resolve()})
    .save(output);
  })
};

// ORDER:INIT
const progressive = (req, next, HOF, videoHeight) =>{
  let mp4_Output_Options = [];

  // ----------> SELECT RESOLUTION <----------
  if(videoHeight >= 720){ // 720 (HD)
    mp4_Output_Options = HOF(3, GET_MP4_OPTS);
  }
  else{

    if(videoHeight >= 480){ // 480P (SD)
      mp4_Output_Options = HOF(2, GET_MP4_OPTS);
    }
    else{
      // 240P (LD)
      mp4_Output_Options = HOF(1, GET_MP4_OPTS);
    }
  }

  // --------->  BEGIN TRANSCODING  -------->
  return ffmpromise(req.videoDir, `${req.videoDir}/master.mp4`, mp4_Output_Options, next)
};

// ORDER:FINAL
const adaptive = (req, next, HOF, videoHeight) =>{
  let hls_Output_Options = [], dash_Output_Options = [];

  // ----------> SELECT RESOLUTION <----------
  if(videoHeight >= 720){ // 720 (HD)
    hls_Output_Options = HOF(3, GET_HLS_OPTS);
    dash_Output_Options = HOF(3, GET_DASH_OPTS)
  }
  else{
    // 480P (SD)
    hls_Output_Options = HOF(2, GET_HLS_OPTS);
    dash_Output_Options = HOF(2, GET_DASH_OPTS)
  }

  // --------->  BEGIN TRANSCODING  -------->
  const dashPath =`${req.videoDir}/master.mpd`, hlsPath =`${req.videoDir}/v%v.m3u8`;
  
  // const [dash, hls] 
  return Promise.all([
    ffmpromise(req.videoDir, dashPath, dash_Output_Options, next),
    ffmpromise(req.videoDir, hlsPath, hls_Output_Options, next)
  ]);
}

// Will enable transcoding og video to diff codecs, formats, resoln, etc.
const transcodeVideo = async (req, next, metadata) =>{ 
  try{
    // Check that video does not have more than 2 streams (I don't wanna handle that nw)
    if(metadata?.format?.nb_streams > 2){
      return next(new AppError("Too much streams in video. Only 1 video and 1 audio stream is allowed.", 400));
    }
  
    const streamTypes = metadata?.streams.map(stream => stream.codec_type);
  
    const {height, r_frame_rate} = metadata?.streams[0] //Video stream meta
  
    // Checks for streams availability and return output options accordingly
    const HOF = (numVar, optionsCB) =>{ //numVar = number of variant streams

      if(streamTypes.includes("audio")){
        const { codec_name, bit_rate } = metadata?.streams[1] //Audio stream metadata
        return optionsCB(numVar, req.ORDER, true, codec_name, bit_rate);
      }
  
      return optionsCB(numVar, req.ORDER, false)
    };

    // Phase - 1
    if(req.ORDER === "INIT"){
      await progressive(req, next, HOF, height)
    }

    // Phase - 2
    if(req.ORDER === "FINAL"){
      await new Promise((resolve, reject) =>{
        // Need to create this file to avoid dash throwing errs
        fs.open(`${req.videoDir}/master.mpd`,"w", err=>{
          if (err) return reject();
          resolve();
        });
      });

      await adaptive(req, next, HOF, height)
    };

    //Only last/one phase is needed since its LD
    if(height < 480) req.ORDER ="DONE";

  }
  catch(error){
    console.log("transcodeErr: ",error);
    removeFile(req.videoDir)

    // Only send errors on init phase
    if(req.ORDER === "INIT"){
      next(new AppError("server error. Pls try again.", 500));
    }
  }
};

module.exports = { ffmpeg, transcodeVideo, probeVideo };