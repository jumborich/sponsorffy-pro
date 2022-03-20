import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import renderLoader from '../../utils/Loader';
import {setCurrentComponent} from '../../redux/navBar/NavActions';

const HandWork = ({ parentName, Feed, PostQuery }) =>{
  const dispatch = useDispatch();
  const {handwork} = useSelector(state => state);
  const [postsFinished, setPostsFinished] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const parentState = handwork;
  const feedCount=handwork.posts.length
  const postQuery = new PostQuery(parentName,parentState,setShowLoader,dispatch);

  // Tells NavBar what component is in display
  useEffect(()=>{
    dispatch(setCurrentComponent("handwork"))
    return()=>{
      dispatch(setCurrentComponent(undefined));
    }   
  },[]);

  //Call the getPost function
  useEffect(()=>{
    if(!feedCount || showLoader){
      if(!postsFinished && !handwork.postsFinished){
        postQuery.getPosts(setPostsFinished);
      }else{
        setShowLoader(false);
      }
    }
  },[showLoader, handwork.nextCursor]);

  //Call the fetching function
  const isFetching=(boolType) =>{
    if(boolType){
      postQuery.setFetching();
    }
  }

  return (
    <div id="entertain">
    {!feedCount && renderLoader()}
    <Feed 
      feed={handwork.posts} 
      isFetching={isFetching} 
      parentName="handwork"
      scrollPosition={handwork.scrollPosition}/>
    </div>
  )
}
export default HandWork;