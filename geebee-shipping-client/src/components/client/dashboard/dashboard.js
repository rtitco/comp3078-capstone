import './dashboard.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

import LoginNavBar from '../../shared/navbar/login-navbar';
import Container from 'react-bootstrap/Container';
import Table from '../../shared/react-table/react-table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class ClientDashboard extends Component {
    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            // currentUserRole: sessionUser.role,
            loading: true,
            mongoData: [],
        }
    }

    //gets the user data from db
    async getOrderData() {
        const orderRes = await axios.get('http://localhost:8081/orders')
        this.setState({ loading: false, mongoData: orderRes.data })
    }
    async getFleetData() {
        const fleetRes = await axios.get('http://localhost:8081/fleet')
        this.setState({ loading: false, mongoData: fleetRes.data })
    }
    componentDidMount() {
        if (this.state.currentUser.role === "Retail" || this.state.currentUser.role === "Distribution" || this.state.currentUser.role === "Driver") {
            this.getOrderData()
        }
        if (this.state.currentUser.role === "Fleet Manager") {
            this.getFleetData()
        }
    }

    render() {
        let columns = [];
        let buttonLabel = '';
        let redirectTo = '';

        //If no user, redirect to login
        if (this.state.currentUser == null) {
            return <Redirect to='/login' />
        }

        //send to Admin Dashboard
        if (this.state.currentUser.role == "Admin") {
            return <Redirect to='/admin' />
        }

        //Load Driver Dashboard
        if (this.state.currentUser.role === "Driver") {
            columns = [
                // {
                //     Header: 'Order ID',
                //     accessor: '_id',
                // },
                {
                    Header: 'Delivery Date',
                    accessor: 'delivery_date',
                },
                {
                    Header: 'Origin Address',
                    accessor: data => data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode
                },
                {
                    Header: 'Destination Address',
                    accessor: data => data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode,
                },
                {
                    Header: 'Cargo Type',
                    accessor: 'cargo_type',
                },
                {
                    Header: 'Assigned Truck - License Plate',
                    accessor: 'assigned_truck_plate',
                },
                {
                    Header: 'Assigned Driver',
                    accessor: 'assigned_truck_driverEmail',
                },
                {
                    Header: 'Status',
                    accessor: 'order_status',
                }
            ]
        }

        //Load Retail Dashboard
        if (this.state.currentUser.role === "Retail") {
            columns = [
                {
                    Header: 'Order ID',
                    accessor: '_id',
                },
                {
                    Header: 'Order Date',
                    accessor: 'order_date',
                },
                {
                    Header: 'Delivery Date',
                    accessor: 'delivery_date',
                },
                {
                    Header: 'Status',
                    accessor: 'order_status'
                }
            ]
        }

        //Load Distribution Dashboard
        if (this.state.currentUser.role === "Distribution") {
            buttonLabel = "Create Order";
            redirectTo = "/orders/add";

            columns = [
                {
                    Header: 'Order ID',
                    accessor: '_id',
                },
                {
                    Header: 'Order Date',
                    accessor: 'order_date',
                },
                {
                    Header: 'Delivery Date',
                    accessor: 'delivery_date',
                },
                {
                    Header: 'Origin Address',
                    accessor: data => data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode
                },
                {
                    Header: 'Destination Address',
                    accessor: data => data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode,
                },
                {
                    Header: 'Cargo Type',
                    accessor: 'cargo_type',
                },
                {
                    Header: 'Cargo Weight (kg)',
                    accessor: 'cargo_weight',
                },
                {
                    Header: 'Status',
                    accessor: 'order_status',
                }
            ]
        }

        //Load Dispatcher Dashboard
        if (this.state.currentUser.role === "Fleet Manager") {
            buttonLabel = "Add Truck"
            redirectTo = "/fleet/add"
            columns = [
                {
                    Header: 'Truck Class',
                    accessor: 'truck_class',
                },
                {
                    Header: 'Brand',
                    accessor: 'vehicle_brand',
                },
                {
                    Header: 'Model',
                    accessor: 'vehicle_model',
                },
                {
                    Header: 'Year',
                    accessor: 'vehicle_year',
                },
                {
                    Header: 'License Plate',
                    accessor: 'license_plate',
                },
                {
                    Header: 'Status',
                    accessor: 'vehicle_status'
                }
            ]
        }

        return (
            <div>
                <LoginNavBar />
                <Container fluid>
                    <Row className="float-right mr-5 mb-2">
                        {/* <label>{this.state.currentUser.role}</label> */}
                        <br />
                        <Link className="btn btn-primary" to={redirectTo}>
                            {buttonLabel}
                        </Link>
                    </Row>
                    <div className="mx-5">
                        {/* this is the data table */}
                        <Table columns={columns} data={this.state.mongoData} />
                    </div>
                    {/* <Row className="justify-content-md-center">
                        <Col md="6">
                        </Col>
                    </Row> */}

                </Container>
            </div>
        );
    }

}

export default ClientDashboard;