import { useState } from "react";
// import {useDispatch} from 'react-redux';
import BackDrop from "./backdrop";
import { AiOutlineClose } from "react-icons/ai";

const ConfirmationModal = (props) => {
  // const dispatch = useDispatch();
  const [confirmationCode, setConfirmationCode] = useState("");

  return (
    <BackDrop isModal={props.isModal} handleModal={props.handleModal}>
      <div className="confirmationModal-container">
        <div className="confirmationModal-closeBtn">
          <button
            onClick={(e) => {
              e.preventDefault();
              props.handleModal(false)
            }}
          >
            <AiOutlineClose size={20} />

          </button>
        </div>

        <div className="confirmationModal-contents">
          <h4>Account Confirmation</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            reiciendis non eius iusto modi error odit et, ipsum sapiente,
            voluptate saepe tempora commodi veniam unde corporis cum
            perspiciatis mollitia quos nam quod odio.
          </p>
          <input
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            type="text"
            name=""
            id="confirmation"
          />
          <div className="confirmation-actions">
            <button
              onClick={(e) => {
                e.preventDefault();
                props.handleModal(false)
              }}
              className="confirmation-cancel"
            >
              <p>Cancel</p>
            </button>
            <button className="confirmation-sub">
              <p>Confirm</p>
            </button>
          </div>
        </div>
      </div>
    </BackDrop>
  );
};

export default ConfirmationModal;
