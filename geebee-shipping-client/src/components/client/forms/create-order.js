import { Redirect } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

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

            updateSuccess: false,
            errorMessage: ''
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
        if (this.state.deliveryDate == '' || this.state.street == '' || this.state.city == '' || this.state.postalCode == '') {
            this.setState({
                updateSuccess: false
            })
        }
        else {
            const registered = {
                deliveryDate: this.state.deliveryDate,
                street: this.state.street,
                city: this.state.city,
                postalCode: this.state.postalCode
            }
            axios.post('http://localhost:8081/orders/add', registered)
                .then(res => {
                    this.setState({
                        errorMessage: res.data.message,
                        updateSuccess: true,
                    })
                }, (error) => {
                    this.setState({
                        errorMessage: "Update Failed. Please Fill All Fields."
                        // errorMessage: "Entry Failed."
                    })
                })
        }


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
                <img src={logo} className="text-center" alt='logo' />
                <h1 className='text-center'>Create New Delivery Order</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>

                            <label>Delivery Date</label>
                            <input type='date'
                                onChange={this.changeDeliveryDate}
                                value={this.state.deliveryDate}
                                className='form-control form-group' />

                            <label>Address</label>
                            <input type='text'
                                placeholder='123 Example Street'
                                onChange={this.changeStreet}
                                value={this.state.street}
                                className='form-control form-group' />

                            <label>City</label>
                            <input type='text'
                                placeholder='Toronto'
                                onChange={this.changeCity}
                                value={this.state.city}
                                className='form-control form-group' />

                            <label>Postal Code</label>
                            <input type='text'
                                placeholder='A1A 1A1'
                                onChange={this.changePostalCode}
                                value={this.state.postalCode}
                                className='form-control form-group' />

                            <span>{this.state.errorMessage}</span>

                            <input type='submit' className='btn btn-primary btn-block'
                                value='Submit' />
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}

export default CreateOrderForm;
