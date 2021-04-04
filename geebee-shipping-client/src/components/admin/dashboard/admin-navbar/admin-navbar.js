import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../../../shared/profile/gb.png';
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'

const AdminNavBar = (props) => {

  function logout() {
    sessionStorage.clear();
  }

  return (
    <Navbar bg="light" expand="lg">

      <LinkContainer to="/">
        <Navbar.Brand>Geebee Shipping Solutions - {props.fname} {props.lname}</Navbar.Brand>
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