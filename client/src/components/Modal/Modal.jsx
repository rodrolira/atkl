// Modal/Modal.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ onClose, children }) =>
  onClose
    ? ReactDOM.createPortal(
        <div
          className="modal"
          onClick={(e) => e.target.classList.contains('modal') && onClose()}
        >
          <div className="modal-content">
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
            {children}
          </div>
        </div>,
        document.getElementById('modal-root'),
      )
    : null;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
