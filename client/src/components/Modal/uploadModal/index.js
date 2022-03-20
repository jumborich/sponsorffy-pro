import { useSelector } from "react-redux";
import UploadModal from "./upload_modal"

export default function Index (){
  const isUploadModal = useSelector(state => state.navBar.isUploadModal);

  return(
    isUploadModal ? <UploadModal isUploadModal={isUploadModal}/> : null
  )
}