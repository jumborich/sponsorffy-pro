import {useEffect, useRef} from "react";
import videojs from "video.js/dist/alt/video.core.novtt";
// import videojs from "video.js";
import "video.js/dist/video-js.css";

const baseOptions = {
  preload:"none",
  // notSupportedMessage
  playbackRates: [0.5, 1, 1.5, 2],
  disablePictureInPicture:true,
  playsInline: true,
  muted:true, 
  controls: true,
  responsive: true,
  fill: true,
  html5: {
    vhs: {
      enableLowInitialPlaylist: true,
      fastQualityChange: true,
      overrideNative: true,
    },
  },
}

const VideoJS = ({ options, id })=>{
  const videoRef =  useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if(!playerRef.current){
      if(!videoRef.current) return;
      playerRef.current = videojs(videoRef.current, {...baseOptions, ...options});
    }
    else{
      playerRef.current.options_ = {...playerRef.current.options_, ...options};
    }

  },[options]);  

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);  

  return( //data-vjs-player
    <div className="feed-video-wrapper"
      onClick={(e) => e.stopPropagation()}>
      <div className="videojs-wrapper">
        <video 
          id={id}
          ref={videoRef} 
          onClick={(e) => e.stopPropagation()}
          poster={options.poster}  
          disablePictureInPicture={true}
          className="video-js vjs-big-play-centered vjs-control-bar vjs-fill"
        />
       </div>
    </div>
  );
};

export default VideoJS;