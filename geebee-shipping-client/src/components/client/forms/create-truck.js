import { Redirect } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

class CreateTruckForm extends Component {

    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

        this.state = {
            currentUser: sessionUser,
            brand: '',
            model: '',
            year: '',
            truckClass: '',
            licensePlate: '',
            status: '',

            updateSuccess: false,
            errorMessage: ''
        }
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
        const registered = {
            brand: this.state.brand,
            model: this.state.model,
            year: this.state.year,
            truckClass: this.state.truckClass,
            licensePlate: this.state.licensePlate,
            status: this.state.status
        }
        // everything stored in registered will send to backend (url) then to mongo
        axios.post('http://localhost:8081/fleet/add', registered)
            .then(res => {
                this.setState({
                    errorMessage: res.data.message
                })
            }, (error) => {
                this.setState({
                    errorMessage: "Update Failed. Please Fill All Fields."
                })
            })

        // here you redirect to profile page or home page
        // window.location = '/'
        this.setState({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            company: '',
            role: '',
            password: ''
        })
    }

    render() {
        // if (this.state.currentUser.role != "Dispatcher" ) {
        //     return <Redirect to='/login' /> 
        // }
        console.log(this.state.currentUser.role)
        // else {
        //     if (this.state.updateSuccess === true) {
        //         return <Redirect to='/admin' />
        //     }
        //     else {
        // this.setState({
        //     errorMessage: "Update Failed. Please Fill All Fields."
        // })
        //     }
        // }
        return (
            <div>
                <img src={logo} className="text-center" alt='logo' />
                <h1 className='text-center'>Add New Truck to Fleet</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>

                            <input type='text'
                                placeholder='Brand'
                                onChange={this.changeBrand}
                                value={this.state.brand}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='Company'
                                onChange={this.changeModel}
                                value={this.state.model}
                                className='form-control form-group' />

                            <label>Year</label>
                            <input type='Number'
                                placeholder='2020'
                                onChange={this.changeYear}
                                value={this.state.year}
                                className='form-control form-group' />

                            <label>Truck Class:</label>
                            <select value={this.state.truckClass} name="roles" onChange={this.changeTruckClassa}>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>

                            </select>

                            <input type='text'
                                placeholder='PLATE###'
                                onChange={this.changeLicensePlate}
                                value={this.state.licensePlate}
                                className='form-control form-group' />

                            <label>Status:</label>
                            <select value={this.state.status} name="roles" onChange={this.changeStatus}>
                                <option value="In Service">In Service</option>
                                <option value="Out of Service">Out of Service</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>

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

export default CreateTruckForm;
