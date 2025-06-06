import { useEffect, useState } from "react";
import { Button, ListGroup, Spinner, Modal, Form, Toast, ToastContainer, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTavoliAction, postTavoloAction } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "react-bootstrap-icons";

const Tavoli = () => {
  const tavoli = useSelector((state) => state.tavoli.tavoli);
  const isLoading = useSelector((state) => state.tavoli.isLoading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [numeroPosti, setNumeroPosti] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(postTavoloAction(numeroPosti));
    if (result.success) {
      setToastMessage("Tavolo creato con successo!");
    } else {
      setToastMessage("Errore nella creazione del tavolo.");
    }
    setShowToast(true);
    handleClose();
  };

  useEffect(() => {
    dispatch(getTavoliAction());
  }, []);

  return (
    <>
      <Row>
        <Col md={2} className="d-none d-md-block"></Col>
        <Col>
          <ListGroup>
            {isLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
            {tavoli.map((tavolo) => (
              <Link className="nav-link" key={tavolo.id} to={"/tavoli/" + tavolo.id}>
                {tavolo.disponibile ? (
                  <ListGroup.Item>
                    Tavolo {tavolo.id}, Posti disponibili: {tavolo.numeroPosti}
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item variant="success">
                    Tavolo {tavolo.id}, Posti disponibili: {tavolo.numeroPosti}
                  </ListGroup.Item>
                )}
              </Link>
            ))}
            <ListGroup.Item>
              <Button variant="" className="rounded-circle border border-secondary px-1 py-0" onClick={handleShow}>
                <Plus className="pb-1" />
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={2} className="d-none d-md-block"></Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi un posto a tavola!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={(event) => handleSubmit(event)}>
            <Form.Label>Quanti posti avrà il tavolo?</Form.Label>
            <Form.Control
              type="number"
              value={numeroPosti}
              onChange={(event) => setNumeroPosti(event.target.value)}
              required
            />
            <Button type="submit" variant="success" size="sm" className="mt-3">
              Salva tavolo
            </Button>
            <Button variant="secondary" size="sm" className="mt-3 ms-3" onClick={handleClose}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-start" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notifica</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Tavoli;
