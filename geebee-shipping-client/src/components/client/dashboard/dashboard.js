import './dashboard.css';
import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginNavBar from '../../shared/navbar/login-navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DriverTable from './driver-table'
import DistributionTable from './distribution-table'
import FleetTable from './fleet-table'
import RetailTable from './retail-table'

import CreateTruckForm from '../forms/create-truck';
import EditTruckForm from '../forms/edit-truck';
import CreateOrderForm from '../forms/create-order';

import ViewRouteDetails from '../views/route-details';
import ViewOrderDetails from '../views/order-details';

import DeleteAnyEntry from '../../shared/react-table/delete-entry';

class ClientDashboard extends Component {
    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            readyToRedirect: false,
        }

    }

    render() {

        //If no user, redirect to login
        if (this.state.currentUser == null) {
            return <Redirect to='/login' />
        }

        //send to Admin Dashboard
        if (this.state.currentUser.role === "Admin") {
            return <Redirect to='/admin' />
        }
        function redirectTo(role) {
            if (role === "Driver") {
                return <Redirect to='/client/driver' />
            }
            //Load Retail Dashboard
            else if (role === "Retail") {
                return <Redirect to='/client/retail' />
            }
            //Load Distribution Dashboard
            else if (role === "Distribution") {
                return <Redirect to='/client/orders' />
            }
            //Load Dispatcher Dashboard
            else if (role === "Fleet Manager") {
                return <Redirect to='/client/fleet' />
            }
        }
        return (
            <div>
                <LoginNavBar />
                <Container fluid>
                    <Switch>
                        <Route exact path="/client">
                            {redirectTo(this.state.currentUser.role)}
                        </Route>
                        <Route exact path="/client/retail" component={RetailTable} />
                        <Route exact path="/client/driver" component={DriverTable} />

                        <Route exact path="/client/fleet" component={FleetTable} />
                        <Route exact path="/client/fleet/add" component={CreateTruckForm} />
                        <Route exact path="/client/fleet/edit" component={EditTruckForm} />

                        <Route exact path="/client/orders" component={DistributionTable} />
                        <Route exact path="/client/orders/add" component={CreateOrderForm} />

                        <Route exact path="/client/driver/route-details" component={ViewRouteDetails} />
                        <Route exact path="/client/retail/order-details" component={ViewOrderDetails} />

                        <Route exact path="/client/row/delete" component={DeleteAnyEntry} />
                    </Switch>
                </Container>
            </div>
        );
    }

}

export default ClientDashboard;