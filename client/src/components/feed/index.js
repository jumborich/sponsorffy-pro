import Feed from './feed';
import Entertainment from '../entertainment/entertainment';
import HandWork from "../handwork/handwork";
import Sports from "../sports/sports";
import Academia from "../academia/academia"
import PostQuery from "../../redux/utils/postQuery";

const ParentCategory = (props) =>{
  switch(props.parentName){
    case "entertainment":
      return <Entertainment {...props}/>;

    case "handwork":
      return <HandWork {...props}/>

    case "sports":
      return <Sports {...props}/>

    default:
      return <Academia/>
  }
};

const FeedIndex = ({ parentName }) =>{
  return (
    <ParentCategory
    parentName={parentName} 
    PostQuery={PostQuery} 
    Feed={Feed}
    />
  )
}
export default FeedIndex;