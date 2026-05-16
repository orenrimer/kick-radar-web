import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Card from '../Card/Card';
import CustomButton from '../CustomButton/CustomButton';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';


const ModalOverlay = props => {
    const content = (
        <React.Fragment>
            <Card className="modal" style={props.style}>
                <header className="modal__header">
                    <div className='modal__header-info'>
                        {props.warning && <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "18px", color: "#FA7470" }}></i>}
                        <h6>{props.header}</h6>
                    </div>
                </header>
                <div className="modal__content">
                    {props.children}
                </div>
                <footer className="modal__footer">
                    {props.footer}
                </footer>
                <div className='model-close'>
                    <CustomButton size="small" onClick={props.handleClose}>
                        <i className="fa-solid fa-x" ></i>
                    </CustomButton>
                </div>
            </Card>
        </React.Fragment>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
    return (
        props.show && <React.Fragment>
            <Backdrop />
            <ModalOverlay {...props} />
        </React.Fragment>
    )
};

export default Modal;
