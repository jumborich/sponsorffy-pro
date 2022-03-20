const BackDrop = ({ children, isModal, handleModal, overflow}) =>{

  const closeBackdrop = (e) => {
    if (e.target === e.currentTarget){
      handleModal();
    }
  };

  return isModal ? (
    <div className={`backdrop backdrop-profile ${overflow}`} onClick={closeBackdrop}>
      {children}
    </div>
    
  ) : null;
};

export default BackDrop;