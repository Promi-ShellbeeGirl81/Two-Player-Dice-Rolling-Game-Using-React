import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../modalSlice';
import './Modal.css';

const Modal = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.modal.message);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 1300); 

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="modal-button" onClick={() => dispatch(clearMessage())}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
