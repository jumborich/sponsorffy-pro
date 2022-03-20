import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import renderLoader from '../../utils/Loader';
import {setCurrentComponent} from '../../redux/navBar/NavActions';
let isMounted = true; //Use this to avoid setting state on resolve of axios calls while comp is unmounted...

const Entertainment = ({ parentName, Feed, PostQuery }) =>{
  const dispatch = useDispatch();
  const {entertainment} = useSelector(state => state);
  const [postsFinished, setPostsFinished] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const parentState = entertainment;
  const feedCount=entertainment.posts.length
  const postQuery = new PostQuery(parentName,parentState,setShowLoader,dispatch);

  // Tells NavBar what component is in display
  useEffect(()=>{
    dispatch(setCurrentComponent("entertainment"))
    return()=>{
      dispatch(setCurrentComponent(undefined));
      isMounted = false;
    }   
  },[]);

  //Call the getPost function
  useEffect(()=>{
    if(!feedCount || showLoader){
      if(!postsFinished && !entertainment.postsFinished){
        postQuery.getPosts(setPostsFinished)
      }else{
        setShowLoader(false)
      }
    };
    // return ()=>console.log("isMounted: ", isMounted);
    
  },[showLoader, entertainment.nextCursor]);

  //Call the fetching function
  const isFetching=(boolType)=>{
    if(boolType){
      postQuery.setFetching()
    }
  }

  return (
    <div id="entertain">
      {!feedCount && renderLoader()}
      <Feed 
      feed={entertainment.posts} 
      isFetching={isFetching} 
      parentName="entertainment"
      scrollPosition={entertainment.scrollPosition}/>
    </div>
  )
}
export default Entertainment;