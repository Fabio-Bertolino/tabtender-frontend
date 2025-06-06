import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearOrdineCorrente,
  deleteOrdineAction,
  deleteTavoloAction,
  getTavoloByIdAction,
  putTavoloAction,
  submitOrdineAction,
  updateQuantitaProdotto,
} from "../redux/actions";
import {
  Spinner,
  Button,
  Container,
  Modal,
  Row,
  Col,
  ToastContainer,
  Toast,
  ListGroup,
  Form,
  Overlay,
} from "react-bootstrap";
import { ArrowLeft, GearFill, PencilSquare, Plus, Trash2, Trash2Fill } from "react-bootstrap-icons";
import BarraOrdinazione from "./BarraOrdinazione";

const OrdinazioneTavolo = () => {
  const tavoloSelezionato = useSelector((state) => state.tavoli.tavoloSelezionato);
  const isLoading = useSelector((state) => state.tavoli.isLoading);
  const ordineCorrente = useSelector((state) => state.ordini.ordineCorrente);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const params = useParams();
  console.log(params.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteOrdineModal, setShowDeleteOrdineModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const target = useRef(null);

  const [numeroPosti, setNumeroPosti] = useState(0);

  // const [ordineId, setOrdineId] = useState(0);

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseDeleteOrdineModal = () => setShowDeleteOrdineModal(false);
  const handleShowDeleteOrdineModal = () => setShowDeleteOrdineModal(true);

  const totaleOrdine =
    ordineCorrente?.prodotti?.reduce((tot, prod) => {
      return tot + prod.prodotto.prezzo * prod.quantita;
    }, 0) || 0;

  const handleDelete = async () => {
    const result = await dispatch(deleteTavoloAction(params.id));
    if (result.success) {
      setToastMessage("Tavolo cancellato con successo!");
    } else {
      setToastMessage("Errore nella cancellazione del tavolo.");
    }
    handleCloseDeleteModal();
    setShowToast(true);
    handleClose();
    setTimeout(() => {
      navigate("/");
    }, 700);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(putTavoloAction(params.id, numeroPosti));
    if (result.success) {
      setToastMessage("Tavolo modificato con successo!");
    } else {
      setToastMessage("Errore nella modifica del tavolo.");
    }
    setShowToast(true);
    handleCloseDeleteModal();
  };

  const handleDeleteOrdine = async () => {
    if (tavoloSelezionato.ordine !== null) {
      const result = await dispatch(deleteOrdineAction(tavoloSelezionato.ordine.id));
      if (result.success) {
        setToastMessage("Ordine cancellato con successo!");
        setShowToast(true);
        handleCloseDeleteOrdineModal();
        setTimeout(() => {
          navigate("/");
        }, 700);
      } else {
        handleCloseDeleteOrdineModal();
        setToastMessage("Errore nella cancellazione dell'ordine.");
        setShowToast(true);
      }
    } else {
      handleCloseDeleteOrdineModal();
      setToastMessage("Operazione annullata! L'ordine non esiste.");
      setShowToast(true);
    }
  };

  const handleSendOrder = async () => {
    const result = await dispatch(submitOrdineAction());
    console.log("result", result);
    if (result.success) {
      setToastMessage("Ordine salvato con successo!");
    } else {
      setToastMessage("Errore nel salvataggio dell' ordine.");
    }
    setShowToast(true);
    setTimeout(() => {
      navigate("/");
    }, 700);
  };

  // const closeToast = () => {
  //   setShowToast(false);
  //   navigate("/");
  // };

  useEffect(() => {
    dispatch(getTavoloByIdAction(params.id));
  }, [params.id]);

  return (
    <>
      <Container>
        <Row>
          <Col md={2} className="d-none d-md-block"></Col>
          <Col>
            <div className="d-flex justify-content-between py-2">
              <div>
                <Link to={"/"} className="btn btm-sm border border-secondary pt-0 pb-0 ps-1 pe-1 rounded-circle">
                  <ArrowLeft className="pb-1" />
                </Link>
              </div>
              <Button variant="" className="btn-sm bg-nav" onClick={handleSendOrder}>
                Invia Ordine
              </Button>
            </div>
            <h1>TabTender Ordinazioni</h1>
            {isLoading ? (
              // <Spinner animation="border" variant="primary" className="d-block mx-auto" />
              <></>
            ) : tavoloSelezionato ? (
              <>
                <div className="d-flex justify-content-between align-items-start">
                  <p>Dettagli tavolo: {tavoloSelezionato.id}</p>

                  <Button variant="" size="sm" className="" ref={target} onClick={() => setShowOverlay(!showOverlay)}>
                    <GearFill />
                  </Button>
                  <Overlay target={target.current} show={showOverlay} placement="left">
                    {({
                      placement: _placement,
                      arrowProps: _arrowProps,
                      show: _show,
                      popper: _popper,
                      hasDoneInitialMeasure: _hasDoneInitialMeasure,
                      ...props
                    }) => (
                      <div
                        {...props}
                        style={{
                          position: "absolute",
                          backgroundColor: "rgba(255, 100, 100, 0)",
                          padding: "2px 2px",
                          color: "white",
                          borderRadius: 3,
                          ...props.style,
                        }}
                      >
                        <div>
                          <Button variant="danger" size="sm" className="rounded-circle" onClick={handleShowDeleteModal}>
                            <Trash2Fill className="pb-1" />
                          </Button>

                          <Button
                            variant="dark"
                            size="sm"
                            className="rounded-circle ms-2"
                            onClick={handleShowEditModal}
                          >
                            <PencilSquare className="pb-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Overlay>
                </div>
                <p>Posti disponibili: {tavoloSelezionato.numeroPosti}</p>
                {ordineCorrente?.prodotti?.length > 0 ? (
                  <ListGroup className="my-2">
                    {ordineCorrente.prodotti.map((prodotto) => (
                      <ListGroup.Item key={prodotto.tavoloId} className="d-flex justify-content-between">
                        <div>
                          <Button
                            onClick={() =>
                              dispatch(updateQuantitaProdotto(prodotto.prodotto.id, prodotto.quantita - 1))
                            }
                            variant=""
                            size="sm"
                            className="rounded-circle border border-secondary px-2 py-0 me-2"
                          >
                            -
                          </Button>
                          {prodotto.prodotto.nome} x {prodotto.quantita}
                          <Button
                            onClick={() =>
                              dispatch(updateQuantitaProdotto(prodotto.prodotto.id, prodotto.quantita + 1))
                            }
                            variant=""
                            size="sm"
                            className="rounded-circle border border-secondary px-1 py-0 ms-2"
                          >
                            <Plus className="pb-1" />
                          </Button>
                        </div>
                        {(prodotto.prodotto.prezzo * prodotto.quantita).toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        €
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>Premi sui prodotti per ordinare! &#128071;</p>
                )}
              </>
            ) : (
              <p>Nessun dato disponibile</p>
            )}

            <h5>
              Totale:{" "}
              {totaleOrdine.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              €
            </h5>

            <div className="d-flex justify-content-between py-2">
              <Button variant="danger" size="sm" onClick={() => dispatch(clearOrdineCorrente())}>
                Svuota ordine
              </Button>

              <Button
                variant="danger"
                size="sm"
                className="rounded-circle"
                onClick={() => handleShowDeleteOrdineModal()}
              >
                <Trash2Fill className="pb-1" />
              </Button>
            </div>
          </Col>
          <Col md={2} className="d-none d-md-block"></Col>
        </Row>

        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sei sicuro di voler eliminare il tavolo?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Button variant="outline-danger" size="sm" className="me-3" onClick={handleDelete}>
              Sì, sparecchia!
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteModal}>
              No, ci ho ripensato...
            </Button>
          </Modal.Body>
        </Modal>

        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Tavolo</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={(event) => handleSubmit(event)}>
              <Form.Label>Modifica posti disponibili</Form.Label>
              <Form.Control
                type="number"
                value={numeroPosti}
                onChange={(event) => setNumeroPosti(event.target.value)}
                required
              />
              <Button type="submit" variant="success" size="sm" className="mt-3">
                Salva tavolo
              </Button>
              <Button variant="secondary" size="sm" className="mt-3 ms-3" onClick={handleCloseEditModal}>
                Chiudi
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteOrdineModal} onHide={handleCloseDeleteOrdineModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sei sicuro di voler eliminare l'ordine?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Button variant="danger" size="sm" className="me-3" onClick={handleDeleteOrdine}>
              Elimina
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCloseDeleteOrdineModal}>
              Annulla
            </Button>
          </Modal.Body>
        </Modal>

        <ToastContainer position="top-end" className="p-3">
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Notifica</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
      {/* <Row>
        <Col md={4} className="d-none d-md-block"></Col>
        <Col> */}
      <BarraOrdinazione />
      {/* </Col>
        <Col md={4} className="d-none d-md-block"></Col>
      </Row> */}
    </>
  );
};

export default OrdinazioneTavolo;
