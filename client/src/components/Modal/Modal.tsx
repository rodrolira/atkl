import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) =>
  onClose
    ? ReactDOM.createPortal(
        <div
          className="modal"
          onClick={(e) => e.target instanceof HTMLElement && e.target.classList.contains('modal') && onClose()}
        >
          <div className="modal-content">
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
            {children}
          </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement,
      )
    : null;

export default Modal;
