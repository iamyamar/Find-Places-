import React from "react";
import { ReactDOM } from "react-dom";
import "./Modal.css";
import Backdrop from "./Backdrop";
import CSSTransition from "react-transition";

const ModalOverlay = (props) => {
  const content = (
    <div className={`model ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault
        }
      >
        <div className={`modal__content ${(props, content)}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.oCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        className="modal"
      ></CSSTransition>
    </>
  );
};

export default Modal;
