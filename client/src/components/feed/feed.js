import {useEffect, useRef, memo} from "react";
import {useDispatch} from 'react-redux';
import FeedItem from "./FeedItem";
import Toast from "./toast";
import {AiOutlineUpload } from "react-icons/ai";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {saveScroll} from "../../redux/utils/postActions";

const Feed = memo(({feed,isFetching,parentName,scrollPosition}) =>{
  const dispatch = useDispatch();
  // Avoids any duplicate feeditems
  const inFeed =[];
  feed = feed.filter((feedItem) =>{
    if(!inFeed.includes(feedItem._id)){
      inFeed.push(feedItem._id);
      return feedItem;
    }
  })
  
  // Set users current scroll position
  let scrollRef = useRef(0);
  const onScroll =({scrollOffset})=>{
    scrollRef.current = scrollOffset;
  };

  useEffect(() =>{
    return()=>{
      dispatch(saveScroll(scrollRef.current,parentName.toUpperCase()));
    }
  },[parentName])

  
  // Render each item as a row
  function RenderFeedItem({index,style}){
    const item = feed[index]
    return (
      <div style={style}>
      <FeedItem 
        item={item}  
        parentName={parentName}
        isFetching={isFetching} 
      />
      </div>
    )
  };

  // Assign Height to each FeedItem:[Look into making this responsive]
  const getFeedItemHeight = () => 470;

  // Get the total number of items
  const feedLength = feed.length;

  return (
    <div style={{width:"100%",height:"100%"}}>
      <Toast parentName={parentName} alertType={"upload"} timeOut={5500}/>
      <AutoSizer>
        {({height,width}) =>(
          <div className="feed-container">
          <div className="feed-contents">
            <List
            width={width}
            height={height}
            overscanCount={10}
            onScroll={onScroll}
            itemCount={feedLength}
            itemSize={getFeedItemHeight}
            initialScrollOffset={scrollPosition}
            // itemData={feed}
            // {...cellMeasurerProps}  
            // estimatedItemSize={440}
            // ref={restoreScrollPosition} 
            // onItemsRendered={onItemsRendered} 
            >
            {RenderFeedItem}
            </List>
          </div>
          <label  className="feed-float-btn" htmlFor="doc_uploads">
            <span><AiOutlineUpload size={28} color={"#ffffff"}/></span>
          </label>
          </div>
        )}
      </AutoSizer>
    </div>
  );
}
,
  (prevProps, nextProps) => {
    if(prevProps.parentName === nextProps.parentName && prevProps.feed.length !== nextProps.feed.length){
      return false;
    }
    return true;
  }
);

export default Feed; 