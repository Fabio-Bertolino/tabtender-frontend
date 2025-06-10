import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Collapse,
  Container,
  Form,
  ListGroup,
  Modal,
  Overlay,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProdottoAction,
  deleteRepartoAction,
  getRepartiAction,
  getRepartoByIdAction,
  postProdottoAction,
  postRepartoAction,
  putProdottoAction,
  putRepartoAction,
} from "../redux/actions";
import { ChevronCompactDown, ChevronCompactUp, GearFill, PencilSquare, Plus, Trash2Fill } from "react-bootstrap-icons";

const AreaAmministratore = () => {
  const reparti = useSelector((state) => state.reparti.reparti);
  const isLoading = useSelector((state) => state.reparti.isLoading);

  const [openRepartoId, setOpenRepartoId] = useState(null);

  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [prodottoId, setProdottoId] = useState(0);
  const [showDeleteRepartoModal, setShowDeleteRepartoModal] = useState(false);
  const [repartoId, setRepartoId] = useState(0);
  const [showPostRepartoModal, setShowPostRepartoModal] = useState(false);
  const [nomeReparto, setNomeReparto] = useState("");
  const [showPutRepartoModal, setShowPutRepartoModal] = useState(false);
  const [showPostProdottoModal, setShowPostProdottoModal] = useState(false);
  const [showPutProdottoModal, setShowPutProdottoModal] = useState(false);
  const [nomeProdotto, setNomeProdotto] = useState("");
  const [prezzoProdotto, setPrezzoProdotto] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [overlayRepartoId, setOverlayRepartoId] = useState(null);
  const refs = useRef({});
  const toggleOverlay = (id) => {
    setOverlayRepartoId((prevId) => (prevId === id ? null : id));
  };

  const handleCloseDeleteProductModal = () => setShowDeleteProductModal(false);
  const handleShowDeleteProductModal = (id) => {
    setShowDeleteProductModal(true);
    setProdottoId(id);
  };
  const handleCloseDeleteRepartoModal = () => setShowDeleteRepartoModal(false);
  const handleShowDeleteRepartoModal = (id) => {
    setShowDeleteRepartoModal(true);
    setRepartoId(id);
  };
  const handleClosePostRepartoModal = () => setShowPostRepartoModal(false);
  const handleShowPostRepartoModal = () => setShowPostRepartoModal(true);
  const handleClosePutRepartoModal = () => setShowPutRepartoModal(false);
  const handleShowPutRepartoModal = (id) => {
    const reparto = reparti.find((r) => r.id === id);
    if (reparto) {
      setNomeReparto(reparto.nome);
      setRepartoId(id);
      setShowPutRepartoModal(true);
    }
  };
  const handleClosePostProdottoModal = () => setShowPostProdottoModal(false);
  const handleShowPostProdottoModal = (id) => {
    setShowPostProdottoModal(true);
    setRepartoId(id);
  };
  const handleClosePutProdottoModal = () => setShowPutProdottoModal(false);
  const handleShowPutProdottoModal = (idProdotto, idReparto) => {
    const reparto = reparti.find((r) => r.id === idReparto);
    if (reparto) {
      const prodotto = reparto.prodotti.find((p) => p.id === idProdotto);
      if (prodotto) {
        setNomeProdotto(prodotto.nome);
        setProdottoId(idProdotto);
        setRepartoId(idReparto);
        setShowPutProdottoModal(true);
      }
    }
  };

  const toggleReparto = (id) => {
    setOpenRepartoId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteProduct = async (id) => {
    const result = await dispatch(deleteProdottoAction(id));
    if (result.success) {
      setToastMessage("Prodotto cancellato con successo!");
    } else {
      setToastMessage("Errore nella cancellazione del prodotto.");
    }
    handleCloseDeleteProductModal();
    setShowToast(true);
  };

  const handleDeleteReparto = async (id) => {
    const result = await dispatch(deleteRepartoAction(id));
    if (result.success) {
      setToastMessage("Reparto cancellato con successo!");
    } else {
      setToastMessage("Errore nella cancellazione del reparto.");
    }
    handleCloseDeleteRepartoModal();
    setShowToast(true);
  };

  const handleSubmitPostReparto = async (event) => {
    event.preventDefault();
    const result = await dispatch(postRepartoAction(nomeReparto));
    if (result.success) {
      setToastMessage("Reparto creato con successo!");
    } else {
      setToastMessage("Errore nella creazione del reparto.");
    }
    setShowToast(true);
    handleClosePostRepartoModal();
    setNomeReparto("");
  };

  const handleSubmitPutReparto = async (event) => {
    event.preventDefault();
    const result = await dispatch(putRepartoAction(repartoId, nomeReparto));
    if (result.success) {
      setToastMessage("Reparto modificato con successo!");
    } else {
      setToastMessage("Errore nella modifica del reparto.");
    }
    setShowToast(true);
    handleClosePutRepartoModal();
    setNomeReparto("");
  };

  const handleSubmitPostProdotto = async (event) => {
    event.preventDefault();
    const result = await dispatch(postProdottoAction(nomeProdotto, prezzoProdotto, repartoId));
    if (result.success) {
      setToastMessage("Prodotto creato con successo!");
      dispatch(getRepartoByIdAction(repartoId));
    } else {
      setToastMessage("Errore nella creazione del prodotto.");
    }
    setShowToast(true);
    handleClosePostProdottoModal();
    setNomeProdotto("");
    setPrezzoProdotto(0);
  };

  const handleSubmitPutProdotto = async (event) => {
    event.preventDefault();
    const result = await dispatch(putProdottoAction(prodottoId, nomeProdotto, prezzoProdotto, repartoId));
    if (result.success) {
      setToastMessage("Prodotto modificato con successo!");
      dispatch(getRepartoByIdAction(repartoId));
    } else {
      setToastMessage("Errore nella modifica del prodotto.");
    }
    setShowToast(true);
    handleClosePutProdottoModal();
    setNomeProdotto("");
    setPrezzoProdotto(0);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRepartiAction());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRepartoId !== null &&
        refs.current[overlayRepartoId] &&
        !refs.current[overlayRepartoId].contains(event.target)
      ) {
        setOverlayRepartoId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlayRepartoId]);

  return (
    <Container>
      <Row>
        <Col md={2}></Col>
        <Col>
          <h2 className="display-6 py-3">Area Amministratore</h2>
          <h4>Modifica Menù</h4>
          {isLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
          {reparti.map((reparto) => (
            <>
              <h5
                key={reparto.id}
                onClick={() => toggleReparto(reparto.id)}
                aria-controls={`collapse-${reparto.id}`}
                aria-expanded={openRepartoId === reparto.id}
                style={{ cursor: "pointer" }}
                className="d-flex justify-content-between align-items-center border-bottom border-secondary-subtle"
              >
                {reparto.nome}
                {openRepartoId === reparto.id ? (
                  <Button variant="sm">
                    <ChevronCompactUp className="fs-6" />
                  </Button>
                ) : (
                  <Button variant="sm">
                    <ChevronCompactDown className="fs-6" />
                  </Button>
                )}
              </h5>
              <Collapse in={openRepartoId === reparto.id}>
                <div id={"collapse-" + reparto.id}>
                  <Button
                    variant=""
                    size="sm"
                    className=""
                    ref={(el) => (refs.current[reparto.id] = el)}
                    onClick={() => toggleOverlay(reparto.id)}
                  >
                    <GearFill />
                  </Button>

                  <Overlay target={refs.current[reparto.id]} show={overlayRepartoId === reparto.id} placement="right">
                    <div
                      style={{
                        position: "absolute",
                        backgroundColor: "rgba(255, 100, 100, 0)",
                        borderRadius: 3,
                        padding: "4px",
                        zIndex: 9999,
                      }}
                    >
                      <Button
                        variant="dark"
                        size="sm"
                        className="me-1"
                        onClick={() => handleShowPutRepartoModal(reparto.id)}
                      >
                        <PencilSquare />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleShowDeleteRepartoModal(reparto.id)}>
                        <Trash2Fill />
                      </Button>
                    </div>
                  </Overlay>
                  <ListGroup className="py-2">
                    {reparto.prodotti.map((prodotto) => (
                      <ListGroup.Item className="d-flex justify-content-between align-items-center" key={prodotto.id}>
                        {prodotto.nome}:{" "}
                        {prodotto.prezzo.toLocaleString("it-IT", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                        €
                        <div>
                          <Button
                            variant="dark"
                            size="sm"
                            className="me-1"
                            onClick={() => handleShowPutProdottoModal(prodotto.id, reparto.id)}
                          >
                            <PencilSquare />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleShowDeleteProductModal(prodotto.id)}>
                            <Trash2Fill />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <Button
                        variant=""
                        className="rounded-circle border border-secondary px-1 py-0"
                        onClick={() => handleShowPostProdottoModal(reparto.id)}
                      >
                        <Plus className="pb-1" />
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Collapse>
            </>
          ))}
          <Button
            variant=""
            className="rounded-circle border border-secondary px-1 py-0"
            onClick={handleShowPostRepartoModal}
          >
            <Plus className="pb-1" />
          </Button>

          <Modal show={showDeleteProductModal} onHide={handleCloseDeleteProductModal}>
            <Modal.Header closeButton>
              <Modal.Title>Sei sicuro di voler eliminare il prodotto?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Alert variant="warning">
                <Alert.Heading className="text-center">Attenzione</Alert.Heading>
                <div className="d-flex align-items-center">
                  <p>⚠️</p>
                  <p className="px-1 text-center">
                    I prodotti ancora presenti nelle ordinazioni non potranno essere cancellati! Procedere?
                  </p>
                  <p>⚠️</p>
                </div>
              </Alert>
              <Button variant="danger" className="me-3" onClick={() => handleDeleteProduct(prodottoId)}>
                Elimina
              </Button>
              <Button variant="secondary" onClick={handleCloseDeleteProductModal}>
                Annulla
              </Button>
            </Modal.Body>
          </Modal>

          <Modal show={showDeleteRepartoModal} onHide={handleCloseDeleteRepartoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Sei sicuro di voler eliminare il reparto?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Alert variant="warning">
                <Alert.Heading className="text-center">Attenzione</Alert.Heading>
                <div className="d-flex align-items-center">
                  <p>⚠️</p>
                  <p className="px-1 text-center">
                    I reparti con prodotti ancora presenti nelle ordinazioni non potranno essere cancellati! Procedere?
                  </p>
                  <p>⚠️</p>
                </div>
              </Alert>
              <Button variant="danger" className="me-3" onClick={() => handleDeleteReparto(repartoId)}>
                Elimina
              </Button>
              <Button variant="secondary" onClick={handleCloseDeleteRepartoModal}>
                Annulla
              </Button>
            </Modal.Body>
          </Modal>

          <Modal show={showPostRepartoModal} onHide={handleClosePostRepartoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Aggiungi un reparto</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={(event) => handleSubmitPostReparto(event)}>
                <Form.Label>Nome del reparto:</Form.Label>
                <Form.Control
                  type="text"
                  value={nomeReparto}
                  onChange={(event) => setNomeReparto(event.target.value)}
                  required
                />
                <Button type="submit" variant="success" className="mt-3">
                  Salva reparto
                </Button>
                <Button variant="secondary" className="mt-3 ms-3" onClick={handleClosePostRepartoModal}>
                  Annulla
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showPutRepartoModal} onHide={handleClosePutRepartoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Modifica reparto</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={(event) => handleSubmitPutReparto(event)}>
                <Form.Label>Nome del reparto:</Form.Label>
                <Form.Control
                  type="text"
                  value={nomeReparto}
                  onChange={(event) => setNomeReparto(event.target.value, repartoId)}
                  required
                />
                <Button type="submit" variant="success" className="mt-3">
                  Salva reparto
                </Button>
                <Button variant="secondary" className="mt-3 ms-3" onClick={handleClosePutRepartoModal}>
                  Annulla
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showPostProdottoModal} onHide={handleClosePostProdottoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Aggiungi un prodotto</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={(event) => handleSubmitPostProdotto(event)}>
                <Form.Label>Nome del prodotto:</Form.Label>
                <Form.Control
                  type="text"
                  value={nomeProdotto}
                  onChange={(event) => setNomeProdotto(event.target.value)}
                  required
                />
                <Form.Label>Prezzo del prodotto:</Form.Label>
                <Form.Control
                  type="number"
                  value={prezzoProdotto}
                  onChange={(event) => setPrezzoProdotto(event.target.value)}
                  required
                />
                <Button type="submit" variant="success" className="mt-3">
                  Salva Prodotto
                </Button>
                <Button variant="secondary" className="mt-3 ms-3" onClick={handleClosePostProdottoModal}>
                  Annulla
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showPutProdottoModal} onHide={handleClosePutProdottoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Aggiungi un prodotto</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={(event) => handleSubmitPutProdotto(event)}>
                <Form.Label>Nome del prodotto:</Form.Label>
                <Form.Control
                  type="text"
                  value={nomeProdotto}
                  onChange={(event) => setNomeProdotto(event.target.value)}
                  required
                />
                <Form.Label>Prezzo del prodotto:</Form.Label>
                <Form.Control
                  type="number"
                  value={prezzoProdotto}
                  onChange={(event) => setPrezzoProdotto(event.target.value)}
                  required
                />
                <Button type="submit" variant="success" className="mt-3">
                  Salva Prodotto
                </Button>
                <Button variant="secondary" className="mt-3 ms-3" onClick={handleClosePutProdottoModal}>
                  Annulla
                </Button>
              </Form>
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
        </Col>
        <Col md={2}></Col>
      </Row>
    </Container>
  );
};

export default AreaAmministratore;
