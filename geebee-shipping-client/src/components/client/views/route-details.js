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

// const center = {
//     lat: -3.745,
//     lng: -38.523
// };

class ViewRouteDetails extends Component {
    constructor(props) {
        super(props);
        // props.originAddress
        // Pass through props from table (best way to do it, to save time and API calls)
        // Else call mongo (bad way)
        let myData = {
            data: [],
            _id: "60552a390c7b511468d5a6e6",
            order_date: "2021-03-19",
            delivery_date: "2021-04-10",
            origin_address: "209 SIXTH ST",
            origin_city: "ETOBICOKE",
            origin_postalCode: "M8V 3A8",
            destination_address: "1806 DANFORTH AVE",
            destination_city: "TORONTO",
            destination_postalCode: "M4C 1H8",
            cargo_type: "PRODUCE",
            cargo_weight: 169.9,
            order_status: "Processing",
            assigned_truck_class: "",
            assigned_truck_plate: "",
            assigned_truck_driverId: "",
            __v: 0
        }

        let originLat = {};
        let destLat = {};
        var originAddress = `${myData.origin_address} ${myData.origin_city} ${myData.origin_postalCode}`
        var destAddress = `${myData.destination_address} ${myData.destination_city} ${myData.destination_postalCode}`
        // var originAddress = "209 Sixth St Etobicoke Ontario Canada M8V3A8"

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

        this.state = {
            origin: {},
            destination: {},
            orderData: myData
        }
    }

    render() {
        const onLoad = marker => {
            console.log('marker: ', marker)
        }

        // const position = {
        // lat: 43.6041402,
        // lng: -79.5053002
        // }

        return (
            <div>
                <div>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Delivery Date:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.orderData.delivery_date}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Cargo:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.orderData.cargo_type}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Truck License Plate:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.orderData.assigned_truck_plate}</label>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <label>Origin Address:</label>
                        </Col>
                        <Col md="4">
                            <label>{this.state.orderData.origin_address}, {this.state.orderData.origin_city}</label>
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
                            <label>{this.state.orderData.destination_address}, {this.state.orderData.destination_city}</label>
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