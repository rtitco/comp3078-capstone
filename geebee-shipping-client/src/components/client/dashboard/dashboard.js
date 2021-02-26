import './dashboard.css';
import React, { Component } from 'react';
import axios from 'axios';

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
            mongoData: []
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
        if (this.state.currentUser.role == "Retail" || this.state.currentUser.role == "Distribution") {
            this.getOrderData()
        }
        if (this.state.currentUser.role == "Dispatcher") {
            this.getFleetData()
        }
    }

    render() {
        let columns = []
        if (this.state.currentUser.role == "Retail") {
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
        if (this.state.currentUser.role == "Distribution") {
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
        if (this.state.currentUser.role == "Dispatcher") {
            columns = [
                {
                    Header: 'Truck Class',
                    accessor: 'truck_class',
                },
                {
                    Header: 'Brand',
                    accessor: 'vehicle_make',
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
                    accessor: 'license_Plate',
                },
                {
                    Header: 'Status',
                    accessor: 'vehicle_status'
                }
            ]
        }

        return (
            <>
                <LoginNavBar />
                <Container fluid className="">
                    <label>{this.state.currentUser.role}</label>
                    <div className="mx-5">
                        {/* this is the data table */}
                        <Table columns={columns} data={this.state.mongoData} />
                    </div>
                    {/* <Row className="justify-content-md-center">
                        <Col md="6">
                        </Col>
                    </Row> */}
                </Container>
            </>
        );
    }

}

export default ClientDashboard;