import React from "react";
import { Modal as ModalBS, Button } from "react-bootstrap";

export default function Modal({
  children,
  title = "",
  className = "",
  size = "lg",
  show = false,
  submitAction = false,
  onHide = () => {},
  onShow = () => {},
  onExited = () => {},
  onSubmit = () => {},
}) {
  return (
    <ModalBS
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={className}
      show={show}
      onHide={onHide}
      onShow={onShow}
      onExited={onExited}
      centered
    >
      <ModalBS.Header closeButton>
        <ModalBS.Title as="h2" id="contained-modal-title-vcenter">
          {title}
        </ModalBS.Title>
      </ModalBS.Header>
      <ModalBS.Body>{children}</ModalBS.Body>

      {submitAction ? (
        <ModalBS.Footer>
          <Button variant="default" onClick={onHide}>
            Close
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </ModalBS.Footer>
      ) : (
        <ModalBS.Footer>
          <Button onClick={onHide}>Close</Button>
        </ModalBS.Footer>
      )}
    </ModalBS>
  );
}
