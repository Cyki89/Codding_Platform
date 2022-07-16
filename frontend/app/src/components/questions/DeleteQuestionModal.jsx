import { forwardRef, useImperativeHandle, useState } from "react";
import Modal from "react-bootstrap/Modal";

const DeleteQuestionModal = ({ onSubmit }, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleSubmit = () => {
    onSubmit();
    setShow(false);
  };

  useImperativeHandle(ref, () => ({
    openModal: () => setShow(true),
  }));

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="modal-content">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fg-red">Delete Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Are you sure to delete question?</div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn-secondary btn-delete" onClick={handleSubmit}>
          Yes
        </button>
        <button onClick={handleClose} className="btn-secondary">
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default forwardRef(DeleteQuestionModal);
