import { useState } from "react";
import { motion } from "framer-motion";

const variants = {
  over: {
    scale: 1.06,
    boxShadow: "0px 3px 3px #e6e6e6",
    transition: {
      ease: "easeInOut",
    },
  },
  out: {
    scale: 1.0,
    // boxShadow: "",
  },
};

const PricingPackage = ({ amount, description, name }) => {
  const [isBuying, setIsBuying] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const buyToken = (e) => {
    e.preventDefault(e);
    setIsBuying(true);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      variants={variants}
      animate={isHover ? "over" : "out"}
      className="pricing-package-container"
    >
      <div className="pricing-package-contents">
      <div className="pricing-package-content-top">


        <h5>
        $ {amount} <span>/ coin</span>
        </h5>
        <h4>{name}</h4>
        <small>{description}</small>

        </div>
        <div className="pricing-package-actions">
          {isBuying ? (
            <div className="pricing-process">
              <p>Processing...</p>
            </div>
          ) : (
            <button onClick={(e) => buyToken(e)}>
              <p>Buy now</p>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPackage;
