import { Image } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { LOGOUT } from "../redux/actions";

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    navigate("/auth");
  };
  return (
    <Navbar expand="lg" className="bg-nav" sticky="top">
      <Container>
        <Image
          src="src/assets/img/TabLogo.png"
          alt="TabTender Logo"
          width="40"
          height="40"
          className="rounded-circle me-3"
        />
        <Navbar.Brand href="#home">
          Tab<span className="text-secondary">Tender</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink className="nav-link" to={"/"}>
              Tavoli
            </NavLink>
            <NavLink className="nav-link" to={"/area-amministratore"}>
              Area Amministratore
            </NavLink>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
