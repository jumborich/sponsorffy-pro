import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import {motion} from 'framer-motion';

// for animation
const variants = {
    open:{
        display: "block",
        transition:{
           duration:1.2,
           ease:"easeIn"
        }
    },
    closed:{
        display:"none",  
    }
    
}

const Question = ({ header, body }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onHandleOpen = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className="FAQ-container">
      <div className="FAQ-content-header">
        <p className="FAQ-header-title">{header}</p>
        <button onClick={(e) => onHandleOpen(e)}>
          {isOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </button>
      </div>
        <motion.div 
        animate={isOpen ? "open" :"closed"}
        variants={variants}
        
        className="FAQ-content-body">
          <p>{body}</p>
        </motion.div>
    </div>
  );
};

const FAQs = () => {
  return (
    <div className="company-wrapper">
      <div className="company-navbar">
        <div className="company-navbar-contents">
          <p className="company-title"> sponsorffy</p>
          <div className="company-downloadable">
            <button>Download PDF</button>
          </div>
        </div>
      </div>
      <div className="company-container">
        <p className="company-updated">Updated on December 2, 2020</p>
        <p className="company-container-title">FAQs</p>

        <section className="company-main-intro">
          <div>
               <p>Got questions?</p>
               <p>The Frequently Asked Questions could be a starting point.</p>
          </div>
        </section>

     
        <div className="company-main">
            <p className="FAQ-main-title">Frequently asked questions</p>
          <Question
            header=" What is sponsorffy? Who uses it? and why should I use it?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
             consequatur nostrum tempore saepe quo nisi quam inventore iste.
            "
          />
           <Question
            header="How do I win a sponsorship on sponsorffy?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
             consequatur nostrum tempore saepe quo nisi quam inventore iste.
             sit amet consectetur adipisicing elit  dolor sit amet consectetur adipisicing elit.
             consequatur nostrum tempore saepe quo nisi quam inventore iste.
            "
          />
          <Question
            header=" Is there an age Limit for sponsorffy?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
             nisi quam inventore iste.
            "
          />
          <Question
            header=" Do I have to pay for my Visa if I win on sponsorffy?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
             consequatur nostrum tempore saepe quo nisi quam inventore iste.
            "
          />
        <Question
            header="What happens if my Visa application gets rejected ?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
            "
          />
            <Question
            header="How long before we travel abroad ?"
            body="
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio soluta sit 
            amet consectetur adipisicing elit.
            "
          /> 
        </div>
      </div>
    </div>
  );
};

export default FAQs;
