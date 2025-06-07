import { useEffect, useRef, useState } from "react";
import { Button, Col, Collapse, Container, Image, Row, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import {
  ChevronCompactDown,
  ChevronCompactUp,
  PencilSquare,
  Plus,
  Search,
  Sliders,
  ThreeDots,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { addProdottoToOrdine, getRepartiAction, getRepartoByIdAction } from "../redux/actions";

const BarraOrdinazione = () => {
  const reparti = useSelector((state) => state.reparti.reparti);
  const repartoSelezionato = useSelector((state) => state.reparti.repartoSelezionato);
  const isLoading = useSelector((state) => state.reparti.isLoading);

  const dispatch = useDispatch();

  const collapseRef = useRef(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getRepartiAction());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collapseRef.current && !collapseRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <Container className="fixed-bottom">
      <Row>
        <Col md={2} className="d-none d-md-block"></Col>
        <Col ref={collapseRef} className="bg-white border border-secondary-subtle rounded-top shadow p-0">
          <div className="d-flex align-items-center py-2  justify-content-between bg-nav" id="msg-head">
            <div className="d-flex align-items-center ms-2">
              <p className="fw-semibold mb-0 ms-2">Ordinazioni</p>
            </div>
            <div className="d-flex align-items-center me-2">
              <Button variant="sm">
                <ThreeDots className="fs-6" />
              </Button>
              <Button variant="sm">
                <PencilSquare className="fs-6" />
              </Button>

              {open === true ? (
                <Button
                  variant="sm"
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  <ChevronCompactDown className="fs-6" />
                </Button>
              ) : (
                <Button
                  variant="sm"
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  <ChevronCompactUp className="fs-6" />
                </Button>
              )}
            </div>
          </div>

          <Collapse in={open} className="">
            <div id="example-collapse-text" className="text-center border-top border-secondary-subtle">
              <div className="mx-2">
                {/* <Form className="d-flex mt-2">
              <InputGroup size="sm" className="mb-3 px-1">
                <Button variant="light btn-sm" id="button-addon1">
                  <Search />
                </Button>
                <Form.Control
                  className="bg-light border-0"
                  aria-label="Example text with button addon"
                  aria-describedby="basic-addon1"
                  placeholder="Cerca prodotti"
                />
                <Button variant="light btn-sm" id="button-addon1">
                  <Sliders />
                </Button>
              </InputGroup>
            </Form> */}
                <Row>
                  <Col xs={5} className="pt-2 pb-3 border-secondary-subtle border-end scrollable-collapse">
                    <div>
                      <h6>Reparto</h6>
                      <ListGroup>
                        {/* {isLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />} */}
                        {reparti.map((reparto) =>
                          repartoSelezionato && reparto.id === repartoSelezionato.id ? (
                            <ListGroup.Item
                              key={reparto.id}
                              variant="success"
                              className="p-1 mb-2 rounded text-center border border-secondary-subtle"
                              onClick={() => dispatch(getRepartoByIdAction(reparto.id))}
                            >
                              {reparto.nome}
                            </ListGroup.Item>
                          ) : (
                            <ListGroup.Item
                              key={reparto.id}
                              className="p-1 mb-2 rounded text-center border border-secondary-subtle"
                              onClick={() => dispatch(getRepartoByIdAction(reparto.id))}
                            >
                              {reparto.nome}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </div>
                  </Col>
                  <Col className="pt-2 pb-3 scrollable-collapse">
                    <h6>Prodotti</h6>
                    <ListGroup>
                      {isLoading ? (
                        // <Spinner animation="border" variant="primary" className="d-block mx-auto" />
                        <></>
                      ) : repartoSelezionato ? (
                        repartoSelezionato.prodotti.map((prodotto) => (
                          <ListGroup.Item
                            key={prodotto.id}
                            className="btn btn-white"
                            onClick={() => dispatch(addProdottoToOrdine(prodotto))}
                          >
                            {prodotto.nome}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p>Seleziona un reparto!</p>
                      )}
                    </ListGroup>
                  </Col>
                </Row>
              </div>
            </div>
          </Collapse>
        </Col>
        <Col md={2} className="d-none d-md-block"></Col>
      </Row>
    </Container>
  );
};

export default BarraOrdinazione;
