import {useSelector} from "react-redux";
import Reading from './reading/Reading';
import Writing from './writing/Writing';
import Listening from './listening/Listening';
import Speaking from './speaking/Speaking';

const RenderTestType = () => {
  const{ currentType } = useSelector(state => state.test);

  const renderType = ()=>{
    
    switch(currentType){
      case "reading":
        return <Reading/>

      case "writing":
        return <Writing />

      case "listening":
        return <Listening />

      case "speaking":
        return <Speaking />

      default:return null;
    }
  }
  return (renderType());
}
 
export default RenderTestType;