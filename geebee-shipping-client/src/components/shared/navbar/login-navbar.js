import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import '../../shared/navbar.css';
const LoginNavBar = (props) => {

  function logout(){
    sessionStorage.clear();
  }

  return (
    <Navbar className="navbar-bb mb-2" variant="dark" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand className="text-white">BusyBee Shipping Solutions</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {/* <LinkContainer to="/login"> */}
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/login" onClick={logout}>Logout</Nav.Link>
          {/* </LinkContainer> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default LoginNavBar;
