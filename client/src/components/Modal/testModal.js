import BackDrop from "./backdrop";
import { AiOutlineClose } from "react-icons/ai";

const TestModal = ({_useModal, header, subHeader, choice=[], choiceParams=[], callback }) =>{

  const {isTestModal, closeModal} = _useModal();
  
  return (
    <BackDrop isModal={isTestModal} handleModal={closeModal}>
      <div className="confirmationModal-container">
        <div className="confirmationModal-closeBtn">
          <button onClick={closeModal}>
            <AiOutlineClose size={20}/>
          </button>
        </div>
        <div className="confirmationModal-contents">
          <h3>{ header }</h3>
          <p> { subHeader }</p>
          <div className="confirmation-actions">
            <button className="confirmation-sub" 
            onClick={()=>callback(choiceParams[0], closeModal)}>
              <p>{ choice[0] }</p>
            </button>
            <button className="confirmation-sub" 
            onClick={()=>callback(choiceParams[1], closeModal)}>
              <p>{ choice[1] }</p>
            </button>
          </div>
        </div>
      </div>
    </BackDrop>
  );
};
export default TestModal;