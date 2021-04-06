import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import './route-styles.css'

Geocode.setApiKey("AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY")
Geocode.setLanguage("en")
Geocode.enableDebug();

const containerStyle = {
    width: '400px',
    height: '400px'
};

class ViewRouteDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            origin: {},
            destination: {},

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

        let originLat = {};
        let destLat = {};
        var originAddress = `${this.state.origin_address} ${this.state.origin_city} ${this.state.origin_postalCode}`
        var destAddress = `${this.state.destination_address} ${this.state.destination_city} ${this.state.destination_postalCode}`

        Geocode.fromAddress(originAddress).then(
            (response) => {
                originLat = response.results[0].geometry.location;
                this.setState(
                    {
                        origin: originLat
                    }
                )
            },
            (error) => {
                console.log(error)
            }
        );

        Geocode.fromAddress(destAddress).then(
            (response) => {
                destLat = response.results[0].geometry.location;
                this.setState(
                    {
                        destination: destLat
                    }
                )
            },
            (error) => {
                console.log(error)
            }
        );

        var status = ""
    }

    changeStatusOnRoute = (event) => {
        this.status = "On Route"
        this.onSubmit()
    }

    changeStatusDelay = (event) => {
        this.status = "Delay"
        this.onSubmit()
    }

    changeStatusEmergency = (event) => {
        this.status = "Emergency"
        this.onSubmit()
    }

    changeStatusArrived = (event) => {
        this.status = "Arrived"
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
        const onLoad = marker => {
            console.log('marker: ', marker)
        }

        return (
            <div>
                <Link className="btn btn-secondary" to='/client/driver'>Back</Link>
                <Row>
                    <div class="routeButtonContainer">
                        <button type="button" class="btn btn-info routeButton" value="On Route" onClick={this.changeStatusOnRoute}>On Route</button>
                        <button type="button" class="btn btn-warning routeButton" value="Delay" onClick={this.changeStatusDelay}>Delay</button>
                        <button type="button" class="btn btn-danger routeButton" value="Emergency" onClick={this.changeStatusEmergency}>Emergency</button>
                        <button type="button" class="btn btn-success routeButton" value="Arrived" onClick={this.changeStatusArrived}>Arrived</button>
                        <span className="text-center alert-danger">{this.state.updateSuccess}</span>
                    </div>
                </Row>

                <Row className="mb-4">
                    <Col md={{ span: 10, offset: 1 }}>
                        <Row className="justify-content-center">
                            <Col className="bg-light pt-4" md="4">
                                <h3 className="pb-3">Order ID: {this.state.delivery_id}</h3>
                                <h2 className="h5">Details:</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col className="bg-light" xs="6" md="2">
                                <label>Delivery Date:</label>
                            </Col>
                            <Col className="bg-light" xs="6" md="2">
                                <label>{this.state.delivery_date}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light" xs="6" md="2">
                                <label>Cargo:</label>
                            </Col>
                            <Col className="bg-light" xs="6" md="2">
                                <label>{this.state.cargo_type}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light" xs="6" md="2">
                                <label>Truck License Plate:</label>
                            </Col>
                            <Col className="bg-light pb-4" xs="6" md="2">
                                <label>{this.state.assigned_truck_plate ? this.state.assigned_truck_plate.substr(0,4) + ' ' + this.state.assigned_truck_plate.substr(4, 7) : this.state.assigned_truck_plate}</label>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="bg-light py-5">
                        <h5>Origin</h5>
                        <hr />
                        <Row className="justify-content-center">
                            <Col md="2">
                                <label>Address:</label>
                            </Col>
                            <Col md="6">
                                <label><a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${this.state.origin_address}%2C+${this.state.origin_city}%2C+${this.state.origin_postalCode}`}>{this.state.origin_address}, {this.state.origin_city}</a></label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center ">
                            <LoadScript
                                googleMapsApiKey="AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY"
                            >
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={this.state.origin}
                                    zoom={15}
                                >
                                    <Marker
                                        onLoad={onLoad}
                                        position={this.state.origin}
                                        visible={true}
                                    />
                                    <></>
                                </GoogleMap>
                            </LoadScript>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="bg-light mt-4 py-5">
                        <h5>Destination</h5>
                        <hr />
                        <Row className="justify-content-center">
                            <Col md="2">
                                <label>Address:</label>
                            </Col>
                            <Col md="6">
                                <label><a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${this.state.destination_address}%2C+${this.state.destination_city}%2C+${this.state.destination_postalCode}`}>{this.state.destination_address}, {this.state.destination_city}</a></label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <LoadScript
                                googleMapsApiKey="AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY"
                            >
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={this.state.destination}
                                    zoom={15}
                                >
                                    <Marker
                                        onLoad={onLoad}
                                        position={this.state.destination}
                                        visible={true}
                                    />
                                    <></>
                                </GoogleMap>
                            </LoadScript>
                        </Row>
                    </Col>
                </Row>

            </div >
        );
    }
}

export default ViewRouteDetails;