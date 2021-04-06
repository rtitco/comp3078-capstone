import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../client/views/route-styles.css'

Geocode.setApiKey("AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY")
Geocode.setLanguage("en")
Geocode.enableDebug();

const containerStyle = {
    width: '400px',
    height: '400px'
};

class AdminViewOrderDetails extends Component {
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

            driver: '',

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


    getDriverInfo = async (email) => {
        let driverInfo = []
        await axios.get(`http://localhost:8081/users/info/${email}`)
            .then(driverRes => {
                driverInfo = driverRes.data
            })
        this.setState({ driver: driverInfo })
    }

    componentDidMount() {
        this.getDriverInfo(this.state.assigned_truck_driverEmail)
    }

    render() {
        const onLoad = marker => {
            console.log('marker: ', marker)
        }

        return (
            <div>
                <Link className="btn btn-secondary" to='/admin/order-manager'>Back</Link>
                <Row className="justify-content-center">
                    <h3 className="pb-3">Order ID: {this.state.delivery_id}</h3>
                </Row>
                
                <Row className="adminDetails">
                    <Col className="detailsContainer">
                        <Row className="justify-content-center">
                            <Col className="bg-light pt-4">
                                <h2 className="h5">Route Details:</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Delivery Date:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.delivery_date}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Cargo:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.cargo_type}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Truck License Plate:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.assigned_truck_plate}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Origin:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.origin_address}, {this.state.origin_city}, {this.state.origin_postalCode}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light pb-4">
                                <label>Destination:</label>
                            </Col>
                            <Col className="bg-light pb-4">
                                <label>{this.state.destination_address}, {this.state.destination_city}, {this.state.destination_postalCode}</label>
                            </Col>
                        </Row>
                    </Col>



                    <Col className="detailsContainer">
                        <Row className="justify-content-center">
                            <Col className="bg-light pt-4">
                                <h2 className="h5">Driver Details:</h2>
                                <hr />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Company:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.driver.company}</label>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col className="bg-light">
                                <label>Name:</label>
                            </Col>
                            <Col className="bg-light">
                                <label>{this.state.driver.firstName} {this.state.driver.lastName}</label>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col className="bg-light pb-4">
                                <label>Phone Number:</label>
                            </Col>
                            <Col className="bg-light pb-4">
                                <label>{this.state.driver.phoneNumber}</label>
                            </Col>
                        </Row>

                    </Col>
                </Row>

                <Row className="adminDetails">

                    <Col className="detailsContainer">
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
                            {/* <LoadScript
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
                            </LoadScript> */}
                        </Row>
                    </Col>

                    <Col className="detailsContainer">
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
                            {/* <LoadScript
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
                            </LoadScript> */}
                        </Row>
                    </Col>
                </Row>

            </div >
        );
    }
}
export default AdminViewOrderDetails;