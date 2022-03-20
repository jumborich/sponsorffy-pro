import {useSelector} from 'react-redux';
// import {useSelector} from 'react-redux/es/hooks/useSelector';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import PricingPackage from "./pricing_package";
import { AVATAR } from "../../utils/imageParams";

const Pricing = () => {
  const navigate = useNavigate();
  const{user} = useSelector(state => state.user)

  return (
    <div className="pricing-wrapper">
      <div className="pricing-container">
        <div className="pricing-container-top">
          <div className="pricing-arrow-back">
            <button onClick={() => navigate(-1)}>
              <BiArrowBack />
            </button>
          </div>
          <div className="pricing-logo">
            <p>Sponsorffy</p>
          </div>
          <div className="pricing-user">
            <AVATAR
            src={user.photo}
            alt={`Avatar of ${user.username}`}
            />
          </div>
        </div>
        <div className="pricing-lists">
          <div className="pricing-lists-top">
            <h5>Pricing plans</h5>
            <small>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero
              perferendis in tempora quae dolorum repellat itaque ex dolorem ad
              voluptates?
            </small>
          </div>
          <div className="pricing-lists-contents">
            <PricingPackage
              amount={4.99}
              name="Timi Bundle"
              description="See in Naira"
            />
            <PricingPackage
              amount={6.99}
              name="Mo Bundle"
              description="Lorem ipsum dolor sit amet, consectetur"
            />
            <PricingPackage
              amount={99.99}
              name="Jumbo Bundle"
              description="Lorem ipsum dolor sit amet, consectetur"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;