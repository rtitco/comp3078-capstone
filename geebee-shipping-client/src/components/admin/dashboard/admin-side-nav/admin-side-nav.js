import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../../../shared/profile/gb.png';
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import React from 'react'

function AdminSideNav() {
  return (
    <Navbar bg="light" expand="lg">

      <LinkContainer to="/">
        <Navbar.Brand>Geebee Shipping Solutions</Navbar.Brand>
      </LinkContainer>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/profile">Profile</Nav.Link>
          <Nav.Link href="/login" onClick={logout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>

    </Navbar>

    // <div>
    //   <p className="text-center">
    //     <img className="img-fluid" src={logo} alt='logo' />
    //   </p>

    //   < div id="mySidenav" className="sidenav mt-5 py-4" >
    //     <Link to="/admin/user-manager">User Manager</Link>
    //     <Link to="/admin/company-manager">Company Manager</Link>
    //     <Link to="/admin/order-manager">Schedule Orders</Link>
    //   </div >
    // </div>
  );
}

export default AdminSideNav;