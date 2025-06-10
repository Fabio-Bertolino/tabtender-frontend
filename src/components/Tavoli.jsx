import { useEffect, useState } from "react";
import { Button, ListGroup, Spinner, Modal, Form, Toast, ToastContainer, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTavoliAction, postTavoloAction } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "react-bootstrap-icons";

const Tavoli = () => {
  const tavoli = useSelector((state) => state.tavoli.tavoli);
  const isLoading = useSelector((state) => state.tavoli.isLoading);
  const currentUser = useSelector((state) => state.auth.username);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [numeroTavolo, setNumeroTavolo] = useState(0);
  const [numeroPosti, setNumeroPosti] = useState(0);
  const [numeroTavoloEsistente, setNumeroTavoloEsistente] = useState(false);
  const [numeroTavoloValido, setNumeroTavoloValido] = useState(true);
  const [numeroPostiValido, setNumeroPostiValido] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNumeroTavolo(getNextAvailableNumeroTavolo());
    setNumeroPosti(1);
    setNumeroTavoloEsistente(false);
    setShow(true);
  };

  const getNextAvailableNumeroTavolo = () => {
    const numeriEsistenti = tavoli.map((t) => t.numeroTavolo).sort((a, b) => a - b);
    let numero = 1;
    for (let i = 0; i < numeriEsistenti.length; i++) {
      if (numeriEsistenti[i] !== numero) {
        return numero;
      }
      numero++;
    }
    return numero;
  };

  const checkNumeroTavoloEsistente = (numero) => {
    return tavoli.some((t) => t.numeroTavolo === parseInt(numero));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(postTavoloAction(numeroTavolo, numeroPosti));
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
            {tavoli.map((tavolo) => {
              let variant = "light";
              let secondLine = "";
              const isMyOrder = tavolo.ordine?.nomeUtente === currentUser;

              if (tavolo.disponibile) {
                variant = "light";
              } else if (tavolo.ordine?.ultimaModifica) {
                variant = isMyOrder ? "success" : "warning";
                secondLine = `${tavolo.ordine.nomeUtente}: ${tavolo.ordine.ultimaModifica}`;
              } else if (tavolo.ordine?.dataOrdine) {
                variant = isMyOrder ? "success" : "warning";
                secondLine = `${tavolo.ordine.nomeUtente}: ${tavolo.ordine.dataOrdine}`;
              }

              return (
                <Link className="nav-link" key={tavolo.id} to={`/tavoli/${tavolo.id}`}>
                  <ListGroup.Item variant={variant}>
                    <p className="p-0 m-0">
                      Tavolo {tavolo.numeroTavolo}, Posti disponibili: {tavolo.numeroPosti}
                    </p>
                    <p className="p-0 m-0">- {secondLine && secondLine}</p>
                  </ListGroup.Item>
                </Link>
              );
            })}
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
            <Form.Label>Numero del tavolo?</Form.Label>
            <Form.Control
              type="number"
              value={numeroTavolo}
              onChange={(event) => {
                const valore = parseInt(event.target.value);
                setNumeroTavolo(valore);
                setNumeroTavoloEsistente(checkNumeroTavoloEsistente(valore));
                setNumeroTavoloValido(valore > 0);
              }}
              required
            />
            {!numeroTavoloValido && (
              <Form.Text className="text-danger">
                Il numero del tavolo deve essere maggiore di zero.
                <br />
              </Form.Text>
            )}
            {numeroTavoloEsistente && (
              <Form.Text className="text-danger">
                Questo numero di tavolo è già stato utilizzato.
                <br />
              </Form.Text>
            )}
            <Form.Label>Quanti posti avrà il tavolo?</Form.Label>
            <Form.Control
              type="number"
              value={numeroPosti}
              onChange={(event) => {
                const valore = parseInt(event.target.value);
                setNumeroPosti(valore);
                setNumeroPostiValido(valore > 0);
              }}
              required
            />
            {!numeroPostiValido && (
              <Form.Text className="text-danger">
                Il numero di posti deve essere maggiore di zero.
                <br />
              </Form.Text>
            )}
            <Button
              type="submit"
              variant="success"
              size="sm"
              className="mt-3"
              disabled={numeroTavoloEsistente || !numeroTavoloValido || !numeroPostiValido}
            >
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
