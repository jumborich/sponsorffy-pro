import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import renderLoader from '../../utils/Loader';
import {setCurrentComponent} from '../../redux/navBar/NavActions';

const Sports = ({ parentName, Feed, PostQuery }) =>{
  const dispatch = useDispatch();
  const {sports} = useSelector(state => state);
  const [postsFinished, setPostsFinished] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const parentState = sports;
  const feedCount=sports.posts.length
  const postQuery = new PostQuery(parentName,parentState,setShowLoader,dispatch);

  // Tells NavBar what component is in display
  useEffect(()=>{
    dispatch(setCurrentComponent("sports"))
    return()=>{
      dispatch(setCurrentComponent(undefined));
    }   
  },[]);

  //Call the getPost function
  useEffect(()=>{
    if(!feedCount || showLoader){
      if(!postsFinished && !sports.postsFinished){
        postQuery.getPosts(setPostsFinished);
      }else{
        setShowLoader(false);
      }
    }
  },[showLoader, sports.nextCursor]);

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
    feed={sports.posts} 
    isFetching={isFetching} 
    parentName="sports"
    scrollPosition={sports.scrollPosition}/>
    </div>
  )
}
export default Sports;