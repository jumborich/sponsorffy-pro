
import {FETCH_POSTS, NEXT_CURSOR,POSTS_FINISHED,SAVE_POST_IDS,SHOW_ALERT,SAVE_SCROLL_POSITION} from "./postActionTypes";

export const fetchPosts = (posts,categoryName) =>({
    type: `${FETCH_POSTS}_${categoryName.toUpperCase()}`,
    payload:posts
});

export const nextCursor = (cursor,categoryName) =>({
    type:`${NEXT_CURSOR}_${categoryName.toUpperCase()}`,
    payload:cursor
});

export const isPostsFinished = (boolType,categoryName) =>({
    type:`${POSTS_FINISHED}_${categoryName.toUpperCase()}`,
    payload:boolType
})

export const savePostIds = (postIdsArray,categoryName) =>({
    type:`${SAVE_POST_IDS}_${categoryName.toUpperCase()}`,
    payload:postIdsArray
})

export const showAlert = (alertOBJ,categoryName) =>({
    type:`${SHOW_ALERT}_${categoryName.toUpperCase()}`,
    payload:alertOBJ
})

export const saveScroll = (scrollPosition,categoryName) =>({
    type:`${SAVE_SCROLL_POSITION}_${categoryName.toUpperCase()}`,
    payload: scrollPosition
})
