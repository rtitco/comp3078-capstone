import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

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

            singleSelections: [],
            companyAddresses: [],

            companyOrigPostalCode: [],
            companyOrigCity: [],
            companyDestPostalCode: [],
            companyDestCity: []
        }
        let myAdd = ''
    }

    componentDidMount() {
        this.getCompanyAddresses()
    }

    getCompanyAddresses = async () => {
        const companyRes = await axios.get(`http://localhost:8081/companies`)
        let myAddresses = []
        let currentID = 0;

        companyRes.data.forEach(element => {
            let address = element.address
            myAddresses.push({ id: currentID, label: address })
            currentID++;
        });
        this.setState({ companyAddresses: myAddresses })
    }

    getCompanyCityPostal = async (location, inputAddress) => {
        const companyRes = await axios.get(`http://localhost:8081/companies/address/${inputAddress}`)
        let myCity = [];
        let myPostalCodes = [];
        let cityID = 0;
        let postalID = 0;

        companyRes.data.forEach(element => {
            let city = element.city
            let postal = element.postal_code
            myCity.push({ id: cityID, label: city })
            myPostalCodes.push({ id: postalID, label: postal })
            cityID++;
            postalID++;
        })

        if (location == "origin") {
            this.setState({ companyOrigCity: myCity, companyOrigPostalCode: myPostalCodes })
        }
        else {
            this.setState({ companyDestCity: myCity, companyDestPostalCode: myPostalCodes })
        }
    }

    //==============================Set Autocomplete Selections==========================================
    //Addresses
    setOrigAddSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.changeOriginAddress(mySelection[0].label)
            this.setState({
                originAddSelections: [mySelection],
                origin_address: mySelection[0].label
            })
        }
    }

    setDestAddSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.changeDestAddress(mySelection[0].label)
            this.setState({
                destAddSelections: [mySelection],
                dest_address: mySelection[0].label
            })
        }
    }

    //Cities
    setOrigCitySelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                originCitySelections: [mySelection],
                origin_city: mySelection[0].label
            })
        }
    }

    setDestCitySelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                destCitySelections: [mySelection],
                dest_city: mySelection[0].label
            })
        }
    }

    //Postal Codes
    setOrigPostSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                originPostSelections: [mySelection],
                origin_postalCode: mySelection[0].label
            })
        }
    }

    setDestPostSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                destPostSelections: [mySelection],
                dest_postalCode: mySelection[0].label
            })
        }
    }

    //==============================Validation Function==========================================

    validateStringInput = (regexStr, strInput) => {
        if (strInput < 1) {
            return false;
        }
        else if (strInput.match(regexStr) == null) {
            return false;
        }
        return true;
    }

    handleOriginChange = (event, mySelection) => {
        this.changeOriginAddress(event)
        this.setOrigAddSelections(mySelection)
    }

    //==============================Event Handler Functions==========================================
    changeDeliveryDate = (event) => {
        this.setState({
            deliveryDate: event.target.value
        })
    }

    changeOriginAddress = (mySelection) => {
        this.getCompanyCityPostal("origin", mySelection)
        this.setState({
            origin_address: mySelection
        })
    }

    // Dest
    changeDestAddress = (mySelection) => {
        this.getCompanyCityPostal("destination", mySelection)
        this.setState({
            dest_address: mySelection
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

    //==============================onSubmit() Function==========================================

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

        //====================================VALIDATION==========================================//
        const rgx_address = /^([\d]{1,5}[a-mA-M]{0,1}){1}[ ]{1}([A-Za-z]{2,}[ ]{0,1}){1,}[.]{0,1}$/
        const rgx_city = /^[A-Za-z]{1,}([ \-]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/
        const rgx_postalCode = /^([a-zA-z]{1}[\d]{1}[a-zA-z]{1}){1}[ ]{0,1}([\d]{1}[a-zA-z]{1}[\d]{1}){1}$/

        //Check Delivery Date
        if (this.state.deliveryDate.length < 1) {
            this.setState({ errorDate: "Please select a delivery date." })
        } else {
            dateValid = true
            this.setState({ errorEmail: '' })
        }

        //Check Origin Address
        if (this.validateStringInput(rgx_address, this.state.origin_address) == false) {
            this.setState({ errorOriginAddress: "Invalid Address." })
        } else {
            origAddValid = true
            this.setState({ errorOriginAddress: '' })
        }

        //Check Origin City
        if (this.validateStringInput(rgx_city, this.state.origin_city) == false) {
            this.setState({ errorOriginCity: "Invalid City." })
        } else {
            origCityValid = true
            this.setState({ errorOriginCity: '' })
        }

        //Check Origin Postal Code
        if (this.validateStringInput(rgx_postalCode, this.state.origin_postalCode) == false) {
            this.setState({ errorOriginPostalCode: "Invalid Postal Code." })
        } else {
            origPostValid = true
            this.setState({ errorOriginPostalCode: '' })
        }

        //Check Destination Address
        if (this.validateStringInput(rgx_address, this.state.dest_address) == false) {
            this.setState({ errorDestAddress: "Invalid Address." })
        } else {
            destAddValid = true
            this.setState({ errorDestAddress: '' })
        }

        //Check Destination City
        if (this.validateStringInput(rgx_city, this.state.dest_city) == false) {
            this.setState({ errorDestCity: "Invalid City." })
        } else {
            destCityValid = true
            this.setState({ errorDestCity: '' })
        }

        //Check Destination Postal Code
        if (this.validateStringInput(rgx_postalCode, this.state.dest_postalCode) == false) {
            this.setState({ errorDestPostalCode: "Invalid Postal Code." })
        } else {
            destPostValid = true
            this.setState({ errorDestPostalCode: '' })
        }

        //Check Cargo Type
        if (this.state.cargo_type.length < 1) {
            this.setState({ errorCargoType: "Invalid Email Address." })
        } else {
            typeValid = true
            this.setState({ errorCargoType: '' })
        }

        //Check Cargo Weight
        if (this.state.cargo_weight.length < 1 || this.state.cargo_weight < 10 || this.state.cargo_weight > 15000) {
            this.setState({ errorCargoWeight: "Invalid Email Address." })
        } else {
            weightValid = true
            this.setState({ errorCargoWeight: '' })
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
                    this.setState({ errorMessage: "Update Failed." })
                })
        }
        else {
            this.setState({ errorMessage: "Update Failed." })
        }
    }

    render() {
        if (this.state.currentUser.role != "Distribution" || this.state.currentUser == null) {
            return <Redirect to='/client' />
        }
        else if (this.state.updateSuccess == true) {
            return <Redirect to='/client' />
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
                                <Typeahead
                                    id="basic-typeahead-single"
                                    onChange={this.setOrigAddSelections}
                                    options={this.state.companyAddresses}
                                    placeholder="Input an Address"
                                    selected={this.originAddSelections}
                                />

                                <Row>
                                    <Col md="6">
                                        <label>Origin City: <span className="text-center alert-danger">{this.state.errorOriginCity}</span></label>
                                        <Typeahead
                                            id="basic-typeahead-single"
                                            onChange={this.setOrigCitySelections}
                                            options={this.state.companyOrigCity}
                                            placeholder="City"
                                            selected={this.originCitySelections}
                                        />
                                    </Col>

                                    <Col md="6">
                                        <label>Origin Postal Code: <span className="text-center alert-danger">{this.state.errorOriginPostalCode}</span></label>
                                        <Typeahead
                                            id="basic-typeahead-single"
                                            onChange={this.setOrigPostSelections}
                                            options={this.state.companyOrigPostalCode}
                                            placeholder="Postal Code"
                                            selected={this.originPostSelections}
                                        />
                                    </Col>
                                </Row>

                                {/* Destination */}
                                <label>Destination Address: <span className="text-center alert-danger">{this.state.errorDestAddress}</span></label>
                                <Typeahead
                                    id="basic-typeahead-single"
                                    onChange={this.setDestAddSelections}
                                    options={this.state.companyAddresses}
                                    placeholder="Input an Address"
                                    selected={this.destAddSelections}
                                />

                                <Row>
                                    <Col md="6">
                                        <label>Destination City: <span className="text-center alert-danger">{this.state.errorDestCity}</span></label>
                                        <Typeahead
                                            id="basic-typeahead-single"
                                            onChange={this.setDestCitySelections}
                                            options={this.state.companyDestCity}
                                            placeholder="City"
                                            selected={this.destCitySelections}
                                        />
                                    </Col>
                                    <Col md="6">
                                        <label>Destination Postal Code: <span className="text-center alert-danger">{this.state.errorDestPostalCode}</span></label>
                                        <Typeahead
                                            id="basic-typeahead-single"
                                            onChange={this.setDestPostSelections}
                                            options={this.state.companyDestPostalCode}
                                            placeholder="City"
                                            selected={this.destPostSelections}
                                        />
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
                                <Link className="mt-3 btn btn-warning btn-block" to='/client'>Go back</Link>
                            </form>
                        </Col>
                    </Row>
                </div>
            </div>

        );
    }
}

export default CreateOrderForm;
