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
            street: '',
            city: '',
            postalCode: '',

            errorMessage: '',
            errorDate: '',
            errorAddress: '',
            errorCity: '',
            errorPostalCode: ''
        }

        console.log(this.state.currentUser);
    }

    changeDeliveryDate = (event) => {
        this.setState({
            deliveryDate: event.target.value
        })
    }

    changeStreet = (event) => {
        this.setState({
            street: event.target.value
        })
    }

    changeCity = (event) => {
        this.setState({
            city: event.target.value
        })
    }

    changePostalCode = (event) => {
        this.setState({
            postalCode: event.target.value
        })
    }

    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()

        const orderData = {
            deliveryDate: this.state.deliveryDate,
            street: this.state.street,
            city: this.state.city,
            postalCode: this.state.postalCode
        }
        axios.post('http://localhost:8081/orders/add', orderData)
            .then(res => {
                this.setState({
                    errorMessage: res.data.message,
                    errorDate: res.data.messageDate,
                    errorAddress: res.data.messageAddress,
                    errorCity: res.data.messageCity,
                    errorPostalCode: res.data.messagePostalCode
                })
            }, (error) => {
                this.setState({
                    errorMessage: "Update Failed. Please Fill All Fields."
                    // errorMessage: "Entry Failed."
                })
            })

    }

    render() {
        if (this.state.currentUser.role != "Distribution") {
            return <Redirect to='/dashboard' />
        }

        if (this.state.updateSuccess === true) {
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

                                <label>Address: <span className="text-center alert-danger">{this.state.errorAddress}</span></label>
                                <input type='text'
                                    placeholder='123 Example Street'
                                    onChange={this.changeStreet}
                                    value={this.state.street}
                                    className='form-control form-group' />

                                <label>City: <span className="text-center alert-danger">{this.state.errorCity}</span></label>
                                <input type='text'
                                    placeholder='Toronto'
                                    onChange={this.changeCity}
                                    value={this.state.city}
                                    className='form-control form-group' />

                                <label>Postal Code: <span className="text-center alert-danger">{this.state.errorPostalCode}</span></label>
                                <input type='text'
                                    placeholder='A1A 1A1'
                                    onChange={this.changePostalCode}
                                    value={this.state.postalCode}
                                    className='form-control form-group' />

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
