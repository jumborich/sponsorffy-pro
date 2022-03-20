
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LargeView  from "../profile/LargeView";
import NotFound from "./../error/404";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import _useAxios from "../../utils/_useAxios";
import ProfileAction from "../../redux/profile/action";

const FeedLargeView = () =>{
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state={} } = useLocation();
  const profileAction = new ProfileAction(dispatch);
  const { shared } = useSelector(state => state["profile"])
  const [ status, setStatus ] = useState({});
  
  useEffect(() => {
    // Get a single post 
    if(!Object.keys(shared.modalItem).length){
      _useAxios("GET", {}, `posts/${postId}`)
      .then((resp) =>{
        profileAction.setIsModal(true, resp.data.data) //Set item for large view
      })
      .catch((err) =>{
        // console.log("getPostErr: ",err.response)
        setStatus(err.response.status);
      });
    };

  },[])

  // Takes user back to home page on modal close
  const closeView = () =>navigate(state.from);

  const render = () =>{
    if(status === 404 || status === 500){
      return(
        <NotFound/>
      )
    };

    // Try using view directly here to see if it decreases the content load latency
    return(
      <LargeView
      profileAction={profileAction}
      tabType="post"
      closeView={closeView}
      />
    );
  }

  return render();
};

export default FeedLargeView;;