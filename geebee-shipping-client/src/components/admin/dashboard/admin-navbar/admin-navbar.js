import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../../../shared/profile/navbar.png';
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'
import '../../../shared/navbar.css';


const AdminNavBar = (props) => {

  function logout() {
    sessionStorage.clear();
  }

  return (
    <Navbar className="navbar-bb" variant="dark" expand="lg">

      <LinkContainer to="/">
      <Navbar.Brand className="text-white">    
      <img
        src={logo}
        height="70"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      /></Navbar.Brand>
      </LinkContainer>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/admin/user-manager">Users</Nav.Link>
          <Nav.Link href="/admin/company-manager">Companies</Nav.Link>
          <Nav.Link href="/admin/order-manager">Orders</Nav.Link>
          <Nav.Link href="/profile">Profile</Nav.Link>
          <Nav.Link href="/login" onClick={logout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>

    </Navbar>
  );
}

export default AdminNavBar;