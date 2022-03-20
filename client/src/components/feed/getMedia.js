import VideoJS from "./videoJs";
const getMedia = (ImgTag, item, bool=true) =>{
  const {fileType, fileUrl, _id} = item;
  switch (fileType){
    case "image":
      return(
        <ImgTag 
        id={_id} 
        src={fileUrl} 
        className="feed-img" 
        alt="user posted feed multimedia"
        />
      )

    case "video": 
      const vidOptions = {
        poster:item.poster,
        src:fileUrl,
        sources:item.derivedUrls
      };
      return(
        <VideoJS options={vidOptions} id={_id}/>
      )

    default: return null;
  }
};

export default getMedia;