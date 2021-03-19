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
        if (this.state.currentUser.role === "Retail" || this.state.currentUser.role === "Distribution") {
            this.getOrderData()
        }
        if (this.state.currentUser.role === "Dispatcher") {
            this.getFleetData()
        }
    }

    // buttonLink(){
    //     if(this.state.currentUser.role=="Distribution"){
    //         return <Redirect to='/orders/add' />
    //     }
    //     if(this.state.currentUser.role=="Dispatcher"){
    //         return <Redirect to='/fleet/add' />
    //     }
    // }

    render() {
        let columns = [];
        let buttonLabel = '';
        let redirectTo = '';

        if (this.state.currentUser == null){
            return <Redirect to='/login' />
        }

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
                    Header: 'Address',
                    accessor: 'destination_street',
                },
                {
                    Header: 'City',
                    accessor: 'destination_city',
                },
                {
                    Header: 'Postal Code',
                    accessor: 'destination_postalCode',
                },
                {
                    Header: 'Status',
                    accessor: 'order_status',
                }
            ]
        }
        if (this.state.currentUser.role === "Dispatcher") {
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
                    <Row className="">
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