import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
        // Pass through props from table (best way to do it, to save time and API calls)
        this.state = {
            data: [],
            origin: {},
            destination: {},

            delivery_date: props.location.state.data.delivery_date,
            cargo_type: props.location.state.data.cargo_type,
            cargo_weight: props.location.state.data.cargo_weight,
            origin_address: props.location.state.data.origin_address,
            origin_city: props.location.state.data.origin_city,
            origin_postalCode: props.location.state.data.origin_postalCode,
            destination_address: props.location.state.data.destination_address,
            destination_city: props.location.state.data.destination_city,
            destination_postalCode: props.location.state.data.destination_postalCode,
            assigned_truck_plate: props.location.state.data.assigned_truck_plate
        }

        let originLat = {};
        let destLat = {};
        var originAddress = `${this.state.origin_address} ${this.state.origin_city} ${this.state.origin_postalCode}`
        var destAddress = `${this.state.destination_address} ${this.state.destination_city} ${this.state.destination_postalCode}`

        Geocode.fromAddress(originAddress).then(
            (response) => {
                originLat = response.results[0].geometry.location;
                console.log(originLat)
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
                console.log(destLat)
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
    }

    render() {
        const onLoad = marker => {
            console.log('marker: ', marker)
        }
        
        return (
            <div>
                <div>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Delivery Date:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.delivery_date}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Cargo:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.cargo_type}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Truck License Plate:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.assigned_truck_plate}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Origin Address:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.origin_address}, {this.state.origin_city}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <LoadScript
                            googleMapsApiKey="AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY"
                        >
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={this.state.origin}
                                zoom={10}
                            >
                                { /* Child components, such as markers, info windows, etc. */}
                                <Marker
                                    // onLoad={onLoad}
                                    position={this.state.origin}
                                    visible={true}
                                />
                                <></>
                            </GoogleMap>
                        </LoadScript>
                    </Row>
                </div>

                <div>
                    <br></br>
                </div>
                <div>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Destination Address:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.destination_address}, {this.state.destination_city}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <LoadScript
                            googleMapsApiKey="AIzaSyB63fYe9MyaTJZbGVDSEYD2-wPXk37Q4jY"
                        >
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={this.state.destination}
                                zoom={10}
                            >
                                { /* Child components, such as markers, info windows, etc. */}
                                <Marker
                                    // onLoad={onLoad}
                                    position={this.state.destination}
                                    visible={true}
                                />
                                <></>
                            </GoogleMap>
                        </LoadScript>
                    </Row>
                </div>

            </div>

        )
    }
}

export default ViewRouteDetails;