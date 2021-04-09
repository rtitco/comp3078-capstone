import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class EditTruckForm extends Component {

    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            brand: props.location.state.data.vehicle_brand,
            model: props.location.state.data.vehicle_model,
            year: props.location.state.data.vehicle_year,
            truckClass: props.location.state.data.truck_class,
            licensePlate: props.location.state.data.license_plate,
            status: props.location.state.data.vehicle_status,

            updateSuccess: false,
            errorBrand: '',
            errorModel: '',
            errorYear: '',
            errorClass: '',
            errorLicensePlate: '',
            errorStatus: '',
            errorMessage: '',
        }
    }

    validateStringInput = (regexStr, strInput) => {
        if (strInput.length < 1) {
            return false;
        }
        else if (strInput.match(regexStr) == null) {
            return false;
        }
        return true;
    }

    changeBrand = (event) => {
        this.setState({
            brand: event.target.value
        })
    }

    changeModel = (event) => {
        this.setState({
            model: event.target.value
        })
    }

    changeYear = (event) => {
        this.setState({
            year: event.target.value
        })
    }
    //due to React bug
    setYear = (year)=>{
        this.setState({
            year: year.toString()
        })
    }

    changeTruckClass = (event) => {
        this.setState({
            truckClass: event.target.value
        })
    }

    changeLicensePlate = (event) => {
        this.setState({
            licensePlate: event.target.value
        })
    }

    changeStatus = (event) => {
        this.setState({
            status: event.target.value
        })
    }

    

    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()
        let brandValid = false
        let modelValid = false
        let yearValid = false
        let classValid = false
        let plateValid = false
        let statusValid = false

        const rgx_brand = /^[a-zA-Z]{3,}$/
        const rgx_model = /^[a-zA-Z\d]{3,}$/
        const rgx_year = /^[\d]{4}$/
        const rgx_license = /^[A-Za-z]{3,5}[ ]{0,1}[\d]{3,5}$/
        //Check Brand
        if (this.validateStringInput(rgx_brand, this.state.brand) == false) {
            this.setState({ errorBrand: "Invalid Brand Name." })
        } else {
            brandValid = true
            this.setState({
                errorBrand: ''
            })
        }

        //Check Model
        if (this.validateStringInput(rgx_model, this.state.model) == false) {
            this.setState({ errorModel: "Invalid Model Name." })
        } else {
            modelValid = true
            this.setState({ errorModel: '' })
        }

        //Check Year
        if (this.validateStringInput(
            rgx_year, this.state.year.toString()) == false || this.state.year <= "1990" || this.state.year > "2022") {
            this.setState({ errorYear: "Invalid Year." })
        } else {
            yearValid = true
            this.setState({ errorYear: '' })
        }

        //Check Class
        if (this.state.brand.length < 1) {
            this.setState({ errorClass: "Please select a truck Class." })
        } else {
            classValid = true
            this.setState({ errorClass: '' })
        }

        //Check License Plate
        if (this.validateStringInput(rgx_license, this.state.licensePlate) == false) {
            this.setState({ errorLicensePlate: "Invalid License Plate." })
        } else {
            plateValid = true
            this.setState({ errorLicensePlate: '' })
        }

        //Check Status
        if (this.state.status.length < 1) {
            this.setState({ errorStatus: "Please select a status." })
        } else {
            statusValid = true
            this.setState({ errorStatus: '' })
        }


        if (brandValid && modelValid && yearValid && classValid && plateValid && statusValid) {
            const truckData = {
                brand: this.state.brand,
                model: this.state.model,
                year: this.state.year,
                truckClass: this.state.truckClass,
                licensePlate: this.state.licensePlate,
                status: this.state.status
            }
            // everything stored in registered will send to backend (url) then to mongo
            axios.post('http://localhost:8081/fleet/edit', truckData)
                .then(res => {
                    this.setState({
                        updateSuccess: res.data.success,
                        errorMessage: res.data.message,
                        errorBrand: res.data.messageBrand,
                        errorModel: res.data.messageModel,
                        errorYear: res.data.messageYear,
                        errorClass: res.data.messageClass,
                        errorLicensePlate: res.data.messageLicensePlate,
                        errorStatus: res.data.messageStatus,
                    })
                }, (error) => {
                    this.setState({
                        errorMessage: "Update Failed. Please Fill All Fields."
                    })
                })

            // here you redirect to profile page or home page
            // window.location = '/'
            this.setState({
                brand: '',
                model: '',
                year: '',
                truckClass: '',
                licensePlate: '',
                status: ''
            })
        }
        else {
            this.setState({
                errorMessage: "Update Failed. Please Fill All Fields."
            })
        }
    }

    render() {
        if (this.state.currentUser.role != "Fleet Manager" || this.state.currentUser == null) {
            return <Redirect to='/client' />
        }
        else if (this.state.updateSuccess == true) {
            return <Redirect to='/client/fleet' />
        }

        return (
            <div className="mb-5">
                 <p  className="text-center">
                    <img src={logo}  width="400" alt='logo' />
                </p>
                <h1 className='h3 text-center'>Edit Truck</h1>
                <div>
                    <Row className="justify-content-center ">
                        <Col md="6">
                            <form onSubmit={this.onSubmit}>
                                <label>Brand: <span className="text-center alert-danger">{this.state.errorBrand}</span></label>
                                <input type='text'
                                    placeholder='Brand'
                                    onChange={this.changeBrand}
                                    value={this.state.brand}
                                    className='form-control form-group' />

                                <label>Model: <span className="text-center alert-danger">{this.state.errorModel}</span></label>
                                <input type='text'
                                    placeholder='Model'
                                    onChange={this.changeModel}
                                    value={this.state.model}
                                    className='form-control form-group' />

                                <label>Year: <span className="text-center alert-danger">{this.state.errorYear}</span></label>
                                <input type='text'
                                    onChange={this.changeYear}
                                    value={this.state.year}
                                    className='form-control form-group' />

                                <label>Truck Class: <span className="text-center alert-danger">{this.state.errorClass}</span></label>
                                <select className='form-control form-group' value={this.state.truckClass} name="class" onChange={this.changeTruckClass}>
                                    <option disabled selected hidden value="">Select a truck class.</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>

                                </select>
                                <label>License Plate: <span className="text-center alert-danger">{this.state.errorLicensePlate}</span></label>
                                <input type='text'
                                    placeholder='PLATE###'
                                    onChange={this.changeLicensePlate}
                                    value={this.state.licensePlate}
                                    className='form-control form-group' />

                                <label>Status: <span className="text-center alert-danger">{this.state.errorStatus}</span></label>
                                <select className='form-control form-group' value={this.state.status} name="roles" onChange={this.changeStatus}>
                                    <option disabled selected hidden value="">Select a status.</option>
                                    <option value="In Service">In Service</option>
                                    <option value="Out of Service">Out of Service</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>

                                <span>{this.state.errorMessage}</span>

                                <input type='submit' className='btn btn-primary btn-block'
                                    value='Submit' />
                                <Link className="mt-2  mb-5 btn btn-warning btn-block" to='/client/fleet'>Go back</Link>
                            </form>
                        </Col>
                    </Row>
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }
}

export default EditTruckForm;
