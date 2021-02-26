import { Redirect } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'

class CreateUserForm extends Component {

    constructor() {
        super()
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            company: '',
            role: '',
            password: '',

            updateSuccess: false,
            errorMessage: ''
        }
    }
    // changes state values 
    // takes value of event and saves it to fullname, username, etc
    // used in onChange in form fields, used to check any change in field

    changeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    changeCompany = (event) => {
        this.setState({
            company: event.target.value
        })
    }

    changeRole = (event) => {
        this.setState({
            role: event.target.value
        })
    }

    changePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()
        const registered = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            company: this.state.company,
            role: this.state.role,
            password: this.state.password
        }
        // everything stored in registered will send to backend (url) then to mongo
        axios.post('http://localhost:8081/admin/users/add', registered)
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
        // if (this.state.email == '') {
        //     return <Redirect to='/login' />
        // }
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
                <h1 className='text-center'>Register New User</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>
                        
                            <input type='text'
                                placeholder='E-mail'
                                onChange={this.changeEmail}
                                value={this.state.email}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='Company'
                                onChange={this.changeCompany}
                                value={this.state.company}
                                className='form-control form-group' />

                            <label>Select a Role:</label>
                            <select value={this.state.role} name="roles" onChange={this.changeRole}>
                                <option value="">---</option>
                                <option value="Retail">Retail</option>
                                <option value="Distribution">Distribution</option>
                                <option value="Driver">Driver</option>
                                <option value="Dispatcher">Dispatcher</option>
                                <option value="Admin">Admin</option>
                            </select>

                            <input type='password'
                                placeholder='Password'
                                onChange={this.changePassword}
                                value={this.state.password}
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

export default CreateUserForm;
