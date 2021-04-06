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
            originCompany: sessionUser.company,
            destinationCompany: '',
            cargo_type: '',
            cargo_weight: '',
            assigned_truckClass: '',
            assigned_truckPlate: '',
            assigned_truckDriver: '',

            updateSuccess: false,
            errorMessage: '',
            errorDate: '',
            errorOriginAddress: '',
            errorDestAddress: '',

            singleSelections: [],
            companyNames: [],
        }
    }

    componentDidMount() {
        this.getCompanyAddresses()
        this.getEmployeeCompany()
    }

    getCompanyAddresses = async () => {
        const companyRes = await axios.get(`http://localhost:8081/companies`)
        let myCompanies = []
        let currentID = 0;

        companyRes.data.forEach(element => {
            let company = element.company_name
            myCompanies.push({ id: currentID, label: company })
            currentID++;
        });
        this.setState({ companyNames: myCompanies })
    }

    getEmployeeCompany = async () => {
        await axios.get(`http://localhost:8081/companies/name/${this.state.currentUser.company}`)
            .then(
                employer => {
                    this.setState({ originCompany: employer.data[0].company_name })
                }
            )
    }

    //==============================Set Autocomplete Selections==========================================
    //Companies
    setOriginSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                originSelections: [mySelection],
                originCompany: mySelection[0].label
            })
        }
    }

    setDestinationSelections = (mySelection) => {
        if (mySelection != undefined && mySelection[0] != undefined) {
            this.setState({
                destinationSelections: [mySelection],
                destinationCompany: mySelection[0].label
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
        event.preventDefault()

        let dateValid = false
        let originCompValid = false
        let destinationCompValid = false
        let typeValid = false
        let weightValid = false

        //====================================VALIDATION==========================================//
        const rgx_companyName = /^[A-Za-z\-\d]{1,}([ \-]{0,1}([A-Za-z\-\d]{1,})){0,}[.]{0,1}$/

        //Check Delivery Date
        if (this.state.deliveryDate.length < 1) {
            this.setState({ errorDate: "Please select a delivery date." })
        } else {
            dateValid = true
            this.setState({ errorEmail: '' })
        }

        if (this.state.originCompany == this.state.destinationCompany) {
            this.setState({
                errorOriginAddress: "Companies cannot be the same",
                errorDestAddress: "Companies cannot be the same"
            })
        }

        //Check Origin Company
        if (this.validateStringInput(rgx_companyName, this.state.originCompany) == false) {
            this.setState({ errorOriginAddress: "Invalid Company Name." })
        } else {
            originCompValid = true
            this.setState({ errorOriginAddress: '' })
        }

        //Check Destination Company
        if (this.validateStringInput(rgx_companyName, this.state.destinationCompany) == false) {
            this.setState({ errorDestAddress: "Invalid Company Name." })
        } else {
            destinationCompValid = true
            this.setState({ errorDestAddress: '' })
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

        // if (dateValid && origAddValid && origCityValid && origPostValid && destAddValid && destCityValid && destPostValid && typeValid && weightValid) {
        if (dateValid && originCompValid && destinationCompValid && typeValid && weightValid) {
            const orderData = {
                deliveryDate: this.state.deliveryDate,
                origin_company: this.state.originCompany,
                destination_company: this.state.destinationCompany,
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
                        errorDestAddress: res.data.messageDestAddress,
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


                                <label>Origin Company: <span className="text-center alert-danger">{this.state.errorOriginAddress}</span></label>
                                <Typeahead
                                    id="basic-typeahead-single"
                                    onChange={this.setOriginSelections}
                                    options={this.state.companyNames}
                                    placeholder={this.state.originCompany}
                                    defaultInputValue={this.state.originCompany}
                                    selected={this.originSelections}
                                />
                                <br />

                                <label>Destination Company: <span className="text-center alert-danger">{this.state.errorDestAddress}</span></label>
                                <Typeahead
                                    id="basic-typeahead-single"
                                    onChange={this.setDestinationSelections}
                                    options={this.state.companyNames}
                                    placeholder="Select a Company"
                                    selected={this.destinationSelections}
                                />
                                <br />

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
