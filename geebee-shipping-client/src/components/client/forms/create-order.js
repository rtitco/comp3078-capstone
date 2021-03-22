import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CreateOrderForm extends Component {

    constructor() {
        super()
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            deliveryDate: '',
            origin_address: '',
            origin_city: '',
            origin_postalCode: '',
            dest_address: '',
            dest_city: '',
            dest_postalCode: '',
            cargo_type: '',
            cargo_weight: '',
            assigned_truckClass: '',
            assigned_truckPlate: '',
            assigned_truckDriver: '',

            updateSuccess: false,
            errorMessage: '',
            errorDate: '',
            errorOriginAddress: '',
            errorOriginCity: '',
            errorOriginPostalCode: '',
            errorDestAddress: '',
            errorDestCity: '',
            errorDestPostalCode: '',
        }
    }

    validateStringInput = (regexStr, strInput) => {
        if (strInput < 1) {
            return false;
        }
        else if (strInput.match(regexStr) == null) {
            return false;
        }
        return true;
    }

    changeDeliveryDate = (event) => {
        this.setState({
            deliveryDate: event.target.value
        })
    }
    // Origin
    changeOriginAddress = (event) => {
        this.setState({
            origin_address: event.target.value
        })
    }

    changeOriginCity = (event) => {
        this.setState({
            origin_city: event.target.value
        })
    }

    changeOriginPostalCode = (event) => {
        this.setState({
            origin_postalCode: event.target.value
        })
    }
    // Dest

    changeDestAddress = (event) => {
        this.setState({
            dest_address: event.target.value
        })
    }

    changeDestCity = (event) => {
        this.setState({
            dest_city: event.target.value
        })
    }

    changeDestPostalCode = (event) => {
        this.setState({
            dest_postalCode: event.target.value
        })
    }

    changeCargoType = (event) => {
        this.setState({
            cargo_type: event.target.value
        })
    }

    changeCargoWeight = (event) => {
        this.setState({
            cargo_weight: event.target.value
        })
    }

    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()

        let dateValid = false
        let origAddValid = false
        let origCityValid = false
        let origPostValid = false
        let destAddValid = false
        let destCityValid = false
        let destPostValid = false
        let typeValid = false
        let weightValid = false

        //Validation
        //Check Delivery Date
        if (this.state.deliveryDate.length < 1) {
            this.setState({
                errorDate: "Please select a delivery date."
            })
        } else {
            dateValid = true
            this.setState({
                errorEmail: ''
            })
        }

        //Check Origin Address
        if (this.validateStringInput(/^([\d]{1,5}[a-mA-M]{0,1}){1}[ ]{0,1}([A-Za-z]{1}[a-z]{1,}[ ]{0,1}){1,}$/,
            this.state.origin_address) == false) {
            this.setState({
                errorOriginAddress: "Invalid Address."
            })
        } else {
            origAddValid = true
            this.setState({
                errorOriginAddress: ''
            })
        }

        //Check Origin City
        if (this.validateStringInput(/^([A-Za-z]{1}[a-z]{1,}){1}([ ]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/,
            this.state.origin_city) == false) {
            this.setState({
                errorOriginCity: "Invalid City."
            })
        } else {
            origCityValid = true
            this.setState({
                errorOriginCity: ''
            })
        }

        //Check Origin Postal Code
    if (this.validateStringInput(/^([a-zA-z]{1}[\d]{1}[a-zA-z]{1}){1}[ ]{0,1}([\d]{1}[a-zA-z]{1}[\d]{1}){1}$/,
            this.state.origin_postalCode) == false) {
            this.setState({
                errorOriginPostalCode: "Invalid Postal Code."
            })
        } else {
            origPostValid = true
            this.setState({
                errorOriginPostalCode: ''
            })
        }
        //Check Destination Address
        if (this.validateStringInput(/^([\d]{1,5}[a-mA-M]{0,1}){1}[ ]{0,1}([A-Za-z]{1}[a-z]{1,}[ ]{0,1}){1,}$/,
            this.state.dest_address) == false) {
            this.setState({
                errorDestAddress: "Invalid Address."
            })
        } else {
            destAddValid = true
            this.setState({
                errorDestAddress: ''
            })
        }

        //Check Destination City
        if (this.validateStringInput(/^([A-Za-z]{1}[a-z]{1,}){1}([ ]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/,
            this.state.dest_city) == false) {
            this.setState({
                errorDestCity: "Invalid City."
            })
        } else {
            destCityValid = true
            this.setState({
                errorDestCity: ''
            })
        }

        //Check Destination Postal Code
        if (this.validateStringInput(/^([a-zA-z]{1}[\d]{1}[a-zA-z]{1}){1}[ ]{0,1}([\d]{1}[a-zA-z]{1}[\d]{1}){1}$/,
            this.state.dest_postalCode) == false) {
            this.setState({
                errorDestPostalCode: "Invalid Postal Code."
            })
        } else {
            destPostValid = true
            this.setState({
                errorDestPostalCode: ''
            })
        }

        //Check Cargo Type
        if (this.state.cargo_type.length < 1) {
            this.setState({
                errorCargoType: "Invalid Email Address."
            })
        } else {
            typeValid = true
            this.setState({
                errorCargoType: ''
            })
        }

        //Check Cargo Weight
        if (this.state.cargo_weight.length < 1 || this.state.cargo_weight < 10 || this.state.cargo_weight > 15000) {
            this.setState({
                errorCargoWeight: "Invalid Email Address."
            })
        } else {
            weightValid = true
            this.setState({
                errorCargoWeight: ''
            })
        }

        if (dateValid && origAddValid && origCityValid && origPostValid && destAddValid && destCityValid && destPostValid && typeValid && weightValid) {
            const orderData = {
                deliveryDate: this.state.deliveryDate,
                origin_address: this.state.origin_address,
                origin_city: this.state.origin_city,
                origin_postalCode: this.state.origin_postalCode,
                dest_address: this.state.dest_address,
                dest_city: this.state.dest_city,
                dest_postalCode: this.state.dest_postalCode,
                cargo_type: this.state.cargo_type,
                cargo_weight: this.state.cargo_weight,
                assigned_truckClass: this.state.assigned_truckClass,
                assigned_truckPlate: this.state.assigned_truckPlate,
                assigned_truckDriver: this.state.assigned_truckDriver
            }
            axios.post('http://localhost:8081/orders/add', orderData)
                .then(res => {
                    this.setState({
                        updateSuccess: res.data.success,
                        errorMessage: res.data.message,
                        errorDate: res.data.messageDate,
                        errorOriginAddress: res.data.messageOriginAddress,
                        errorOriginCity: res.data.messageOriginCity,
                        errorOriginPostalCode: res.data.messageOriginPostalCode,
                        errorDestAddress: res.data.messageDestAddress,
                        errorDestCity: res.data.messageDestCity,
                        errorDestPostalCode: res.data.messageDestPostalCode,
                        errorCargoType: res.data.messageCargoType,
                        errorCargoWeight: res.data.messageCargoWeight
                    })
                }, (error) => {
                    this.setState({
                        errorMessage: "Update Failed."
                        // errorMessage: "Entry Failed."
                    })
                })
        }
        else {
            this.setState({
                errorMessage: "Update Failed."
                // errorMessage: "Entry Failed."
            })
        }
    }


    render() {
        if (this.state.currentUser.role != "Distribution" || this.state.currentUser == null) {
            return <Redirect to='/dashboard' />
        }
        else if (this.state.updateSuccess == true) {
            return <Redirect to='/dashboard' />
        }

        return (
            <div>
                <p className="text-center">
                    <img src={logo} alt='logo' />
                </p>
                <h1 className='text-center'>Create New Delivery Order</h1>

                <div>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <form onSubmit={this.onSubmit}>

                                <label>Delivery Date: <span className="text-center alert-danger">{this.state.errorDate}</span></label>
                                <input type='date'
                                    onChange={this.changeDeliveryDate}
                                    value={this.state.deliveryDate}
                                    className='form-control form-group' />

                                {/* Origin */}
                                <label>Origin Address: <span className="text-center alert-danger">{this.state.errorOriginAddress}</span></label>
                                <input type='text'
                                    placeholder='123 Example Street'
                                    onChange={this.changeOriginAddress}
                                    value={this.state.origin_address}
                                    className='form-control form-group' />

                                <Row>
                                    <Col md="6">
                                        <label>Origin City: <span className="text-center alert-danger">{this.state.errorOriginCity}</span></label>
                                        <input type='text'
                                            placeholder='City Name'
                                            onChange={this.changeOriginCity}
                                            value={this.state.origin_city}
                                            className='form-control form-group' />
                                    </Col>
                                    <Col md="6">
                                        <label>Origin Postal Code: <span className="text-center alert-danger">{this.state.errorOriginPostalCode}</span></label>
                                        <input type='text'
                                            placeholder='A1A 1A1'
                                            onChange={this.changeOriginPostalCode}
                                            value={this.state.origin_postalCode}
                                            className='form-control form-group' />
                                    </Col>
                                </Row>

                                {/* Destination */}
                                <label>Destination Address: <span className="text-center alert-danger">{this.state.errorDestAddress}</span></label>
                                <input type='text'
                                    placeholder='123 Example Street'
                                    onChange={this.changeDestAddress}
                                    value={this.state.dest_address}
                                    className='form-control form-group' />

                                <Row>
                                    <Col md="6">
                                        <label>Destination City: <span className="text-center alert-danger">{this.state.errorDestCity}</span></label>
                                        <input type='text'
                                            placeholder='City Name'
                                            onChange={this.changeDestCity}
                                            value={this.state.dest_city}
                                            className='form-control form-group' />
                                    </Col>
                                    <Col md="6">
                                        <label>Destination Postal Code: <span className="text-center alert-danger">{this.state.errorDestPostalCode}</span></label>
                                        <input type='text'
                                            placeholder='A1A 1A1'
                                            onChange={this.changeDestPostalCode}
                                            value={this.state.dest_postalCode}
                                            className='form-control form-group' />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="6">
                                        <label>Cargo Type: <span className="text-center alert-danger">{this.state.errorCargoType}</span></label>
                                        <select className='form-control form-group' value={this.state.CargoType} name="cargoType" onChange={this.changeCargoType}>
                                            <option disabled selected hidden value="">Select an Option</option>
                                            <option value="Produce">Produce</option>
                                            <option value="Dairy">Dairy</option>
                                            <option value="Frozen Goods">Frozen Goods</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Miscellaneous">Miscellaneous</option>
                                        </select>
                                    </Col>
                                    <Col md="3">
                                        <label>Cargo Weight (in kg): <span className="text-center alert-danger">{this.state.errorCargoWeight}</span></label>
                                        <input type='text'
                                            placeholder='0.0'
                                            onChange={this.changeCargoWeight}
                                            value={this.state.cargo_weight}
                                            className='form-control form-group' />
                                    </Col>

                                </Row>

                                <span className="text-center alert-danger">{this.state.errorMessage}</span>

                                <input type='submit' className='btn btn-primary btn-block'
                                    value='Submit' />
                                <Link className="mt-3 btn btn-warning btn-block" to='/dashboard'>Go back</Link>
                            </form>
                        </Col>
                    </Row>
                </div>
            </div>

        );
    }
}

export default CreateOrderForm;
