import { useState } from "react";
import {motion} from 'framer-motion';

const variants = {
    over:{
        opacity:1,
        transition:{
            delay:.2,
            ease: "easeOut"
        }
    },
    exit:{
        opacity:0,
    }
    
}


const HoverContent = (props) => {
 
  const [isShow,setIsShow] = useState(false);

  return (
    <div
      onMouseOver={(e) => setIsShow(true) }

      onMouseLeave={(e) => setIsShow(false)}

      onClick={()=>setIsShow(false)}
     
      style={{ borderRadius: `${props.borderRadius}%` }}
      className="hover-container"
    >
      <div className="hover-icon">{props.children}</div>

      <motion.section 
      animate={isShow ? "over" : "exit"}
      initial="exit"
      variants={variants}

      className={`hover-content hover-left`}>
       <p>{props.content}</p>
      </motion.section>
    </div>
  );
};

export default HoverContent;
