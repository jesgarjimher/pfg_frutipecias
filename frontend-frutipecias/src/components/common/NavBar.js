import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

function NavBar({user, setUser}) {

    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/")
    }
  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src="/logo-frutipecias.png" className="d-inline-block align-top me-2" alt="Logo Frutipecias" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about-us">Sobre nosotros</Nav.Link>
            {user ? (
                <>
                    <Nav.Link as={Link} to="/tabla-admin">Tabla admin</Nav.Link>
                    <Nav.Link as={Link} to="/alta-producto">Nuevo producto</Nav.Link>
                    <button onClick={logOut} className="btn btn-logout">Logout</button>
                </>)
                : (<></>)
            }
            <NavDropdown title="Productos" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/productos/Frutos%20Secos">Frutos secos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/productos/Fruta%20Deshidratada">Frutas deshidratadas</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/productos/especias">Especias</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item  as={Link} to="/productos">Todos</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;