import MoonLoader from "react-spinners/MoonLoader";
const renderLoader =()=>{
  return(
    <div className="post-feed-spinner" style={{height:'70px', display:'block',margin: '20px auto',position:'relative'}}>
        <div style={{marginTop:'15px', marginBottom:'15px', position:'absolute', left:'50%'}}>
            <MoonLoader size={30}/>
        </div>
    </div>
  )
}

export const UploadSpinner = ({ canSpin }) =>{
  return(
    canSpin?
    <div className="uploadModal-spinner">
      <span>
        <MoonLoader size={80} color="white"/>
      </span>
    </div>
    :null
  )
}
export default renderLoader;