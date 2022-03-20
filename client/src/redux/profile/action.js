import{SET_IS_MODAL}from "./ActionType";

import {fetchUserSuccess} from "../../redux/user/UserAction";
import _useAxios from "../../utils/_useAxios";

/**
 * The ProfileActions constructor function exposes action creators && getHandlers as methods
 * 
 * for updating the redux state of a user's profile'
 */
class ProfileActions{
  constructor(dispatch){
    this.dispatch = dispatch;
  }

  // Fetch user Posts/Tests
  fetchProfileFeed(feed,TYPE){
    this.dispatch({
      type:`FETCH_USER_${TYPE}`,
      payload:feed
    })
  }

  // Post/Test Next Cursor
  setNextCursor(nextCursor,TYPE){
    this.dispatch({
      type:`SET_USER_${TYPE}_CURSOR`,
      payload:nextCursor
    })
  }

  // Set post/test finished
  setIsModal(isModal,modalItem){
    this.dispatch({
      type:SET_IS_MODAL,
      payload:{
        isModal,
        modalItem
      }
    })
  }

  // Gets user's profile from db
  getMe(){
    _useAxios("GET",{},"users/me").then(res=>{
      this.dispatch(
        fetchUserSuccess(res.data.user)
      )
    }).catch(err=>console.log(err))
  }

  // Gets a post from db while user is in LargeView
  // getPost(postId, postsArray){
  //   _useAxios("GET",{},`posts/${postId}`).then(res=>{
  //     const post = res.data.data

  //     // Get the index of the post in redux
  //     let postIndex;
  //     for(let i=0; i<postsArray.length; i++){
  //       if(postsArray[i]._id === postId){
  //         postIndex = i;
  //         break;
  //       }
  //     }

  //     // Replace the new post with its old position in redux  
  //     postsArray.splice(postIndex,1, post)

  //     // update modalItem to emulate real-time
  //     this.setIsModal(true,post);

  //     // update redux posts in user's profile
  //     this.fetchProfileFeed(postsArray,"POST");

  //   }).catch(err=>console.log(err))
  // }
  
  // Gets all of this user's posts/tests from db
  getAllData(body,tabType,currentData,setDataFinished){ 
    // Capitalizing tabType for redux
    const tabTypeUpper = tabType.toUpperCase();

    // loading indicator
    this.dispatch({
      type:`IS_FETCHING_${tabTypeUpper}`,
      payload:true
    })

    let endPoint ="";

    // for post tab
    if(tabType==="post") endPoint = "posts";

    // for test tab
    if(tabType==="test") endPoint = "tests/getAllTests";

    _useAxios("GET",body,endPoint).then(response=>{
      let cursor;
      const data = response.data[tabType+"s"]; //e.g response.data.posts
      const dataCount=data.length;
      cursor = dataCount && data[dataCount - 1]._id;

      if(data.length){
        // Update tabType content
        this.fetchProfileFeed([...currentData,...data],tabTypeUpper)
        
        // Update user tabType nextcursor
        this.setNextCursor(cursor,tabTypeUpper);
      }
      else{
        // loading indicator
        this.dispatch({
          type:`IS_FETCHING_${tabTypeUpper}`,
          payload:false
        })

        // Set post/test finished
        setDataFinished((prevState) =>({...prevState,[tabType]:true}));
      }

    }).catch(err=>console.log(err));
  }
}
export default ProfileActions;