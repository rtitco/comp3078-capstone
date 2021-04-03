import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

class ViewOrderDetails extends Component {
    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            data: [],

            delivery_id: props.location.state.data._id,
            order_date: props.location.state.data.order_date,
            delivery_date: props.location.state.data.delivery_date,
            cargo_type: props.location.state.data.cargo_type,
            cargo_weight: props.location.state.data.cargo_weight,
            origin_address: props.location.state.data.origin_address,
            origin_city: props.location.state.data.origin_city,
            origin_postalCode: props.location.state.data.origin_postalCode,
            destination_address: props.location.state.data.destination_address,
            destination_city: props.location.state.data.destination_city,
            destination_postalCode: props.location.state.data.destination_postalCode,
            assigned_truck_class: props.location.state.data.assigned_truck_class,
            assigned_truck_plate: props.location.state.data.assigned_truck_plate,
            assigned_truck_driverEmail: props.location.state.data.assigned_truck_driverEmail,
            order_status: props.location.state.data.order_status,

            updateSuccess: ''
        }
    }

    changeStatusReceived = (event) => {
        this.status = "Completed"
        this.onSubmit()
    }

    changeStatusReject = (event) => {
        this.status = "Rejected"
        this.onSubmit()
    }

    onSubmit = () => {
        const orderData = {
            id: this.state.delivery_id,
            orderDate: this.state.order_date,
            deliveryDate: this.state.delivery_date,
            origin_address: this.state.origin_address,
            origin_city: this.state.origin_city,
            origin_postalCode: this.state.origin_postalCode,
            dest_address: this.state.destination_address,
            dest_city: this.state.destination_city,
            dest_postalCode: this.state.destination_postalCode,
            cargo_type: this.state.cargo_type,
            cargo_weight: this.state.cargo_weight,
            assigned_truckClass: this.state.assigned_truck_class,
            assigned_truckPlate: this.state.assigned_truck_plate,
            assigned_truckDriver: this.state.assigned_truck_driverEmail,
            order_status: this.status
        }

        axios.post(`http://localhost:8081/order-status/${this.state.id}`, orderData)
            .then(res => {
                this.setState({
                    updateSuccess: res.data.success,
                })
            }, (error) => {
                this.setState({
                    errorMessage: "Update Failed."
                })
            })
    }

    render() {

        return (
            <div>
                <Row>
                    <Col>
                        <Row>
                            <Link className="mt-3 btn btn-secondary" to='/client'>Back</Link>
                        </Row>
                        <Row>
                            <h3>Order ID: {this.state.delivery_id}</h3>
                        </Row>
                    </Col>
                </Row>

                {/* Buttons on Left, Details on Right */}
                <Row>
                    <Col md="2">
                        <button type="button" class="btn btn-success btn-block" onClick={this.changeStatusReceived}>Order Received</button>
                        <button type="button" class="btn btn-danger btn-block" onClick={this.changeStatusReject}>Reject Shipment</button>
                        <span className="text-center alert-danger">{this.state.updateSuccess}</span>
                    </Col>

                    <Col md="10">
                        <Row>
                            <Col md="2">
                                <label>Delivery Date:</label>
                            </Col>
                            <Col md="2">
                                <label>{this.state.delivery_date}</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="2">
                                <label>Cargo:</label>
                            </Col>
                            <Col md="2">
                                <label>{this.state.cargo_type}</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="2">
                                <label>Truck License Plate:</label>
                            </Col>
                            <Col md="2">
                                <label>{this.state.assigned_truck_plate}</label>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div >
        )
    }

}

export default ViewOrderDetails;