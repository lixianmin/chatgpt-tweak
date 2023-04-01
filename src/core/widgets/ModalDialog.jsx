"use strict";

import { Button, Modal } from "solid-bootstrap";
import { createSignal } from "solid-js";

/********************************************************************
 created:    2023-04-01
 author:     lixianmin

 Copyright (C) - All Rights Reserved
 *********************************************************************/

// export default function ModalDialog(title, body) {
//   const [show, setShow] = createSignal(false);
//   const handleOpen = () => setShow(true);
//   const handleClose = () => setShow(false);
//
//   return <>
//     <Button variant="primary" onClick={handleOpen}>Launch demo modal</Button>
//
//     <Modal show={show()} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>{title}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {body}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   </>;
// }