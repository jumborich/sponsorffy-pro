import { useState } from "react";
// import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import ConfirmationModal from "./../Modal/confirmation_modal";

const PasswordChange = (props) => {
  // let { user } = useSelector((state) => state.user);

  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [newPassword, setNewPassword] = useState("");

  const showPasswordModal=()=>{
    if(!isPasswordModal)return;

    return<ConfirmationModal isModal={isPasswordModal} handleModal={setIsPasswordModal} />
  }
  return (
    <div className="ps-wrapper">
      <div className="ps-container">
        <h4>Password Change</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta nam
          vero commodi! Nt deleniti recusandae repellat facilis quo ut nemo
          repsequi ipsam est. Eos dicta magni fuga omnis? Repellendus reiciendis
          maiores quidem itaque.
        </p>
        <div className="ps-actions">
          <div className="ps-input">
            <input
              defaultValue="Repellendus reiciendis"
              readOnly={isReadOnly}
             
              type="password"
              name="ps_change"
              id="ps_change"
            />
            <button
            onClick={e=>{
                e.preventDefault();
                setIsPasswordModal(true);
            }}
            >
              <FiEdit2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="ps-changes-btn">
            <button>
              <p>Save Changes</p>
            </button>
          </div>
      </div>
            {showPasswordModal()}
    </div>
  );
};

export default PasswordChange;
