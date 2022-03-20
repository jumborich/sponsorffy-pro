import _useAxios from "../../utils/_useAxios";
import {fetchPosts,nextCursor,isPostsFinished,saveScroll} from "./postActions";

/**
 * The PostQuery constructor func exposes methods 
 * 
 * for updating the posts of the feed categories
 * 
 * i.e Entertainment, Sports and HandWork
 * 
 */

class PostQuery{
  constructor(parentName,parentState,setShowLoader,dispatch){
    this.parentName = parentName;
    this.parentState = parentState;
    this.setShowLoader = setShowLoader;
    this.dispatch = dispatch;
  }

  // Need the capital form of parent for Redux
  capParentName(){
    return this.parentName.toUpperCase();
  }

  // Get all posts
  getPosts(setPostsFinished){
    this.setShowLoader(true);

    let params={
      nextCursor:this.parentState.nextCursor || null,
      // category:this.parentName
      // countryFrom:user.countryFrom,
      // countryTo:user.countryTo,
    };
    _useAxios("GET",params,"posts").then(response=>{
      if(response.data.posts.length){
        // indicates there is still posts available in the database
        setPostsFinished(false)
        this.dispatch(isPostsFinished(false,this.capParentName()));

        //Add new posts to old posts already in state
        let newPostsArr = [...this.parentState.posts, ...response.data.posts];
        this.dispatch(fetchPosts(newPostsArr,this.capParentName()))      
      }else{
        // Stop any further posts fetching as there is no more in the database
        this.dispatch(isPostsFinished(true,this.capParentName()));
        setPostsFinished(true);
        
        // Stop displaying fetching indicating spinner
        this.setShowLoader(false);
      };

    }).catch(err =>console.log(err));
  }

  // Update next cursor when fetching posts
  setFetching(){
    if(!this.parentState.postsFinished){
      this.dispatch(saveScroll(0,this.capParentName()));
  
      // 2) Get Next cursor(_id) for next pagination
      const cursor = this.parentState.posts[this.parentState.posts.length - 1]._id;
      this.dispatch(nextCursor(cursor,this.capParentName()));
      
      // 3) set spinner to indicate fetching
      this.setShowLoader(true);
    }else{
      this.setShowLoader(false);
    }
  }
}
export default PostQuery;