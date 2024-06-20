import "./Modal.css";

export const Modal = ({
    isOpen,
    toggleOpen,
    children
  }) =>
    (
      <div className={`overplay ${ isOpen ? "open" : ""}`
              }
                onClick={toggleOpen}
                  >
              <div className="modal">
                {children}
            </div>
        </div>
);

export default Modal;