import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'
import logo from '../../shared/profile/gb.png'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CreateUserForm extends Component {

    constructor() {
        super()
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

        this.state = {
            currentUser: sessionUser,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            company: '',
            role: '',
            password: '',

            creationSuccess: false,
            errorMessage: '',
            errorEmail: '',
            errorCompany: '',
            errorPw: '',
            errorRole: '',
        }
    }

    // changes state values 
    // takes value of event and saves it to fullname, username, etc
    // used in onChange in form fields, used to check any change in field

    validateStringInput = (regexStr, strInput) => {
        if (strInput < 1) {
            return false;
        }
        else if (strInput.match(regexStr) == null) {
            return false;
        }
        return true;
    }

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

        let emailValid = false;
        let companyValid = false;
        let roleValid = false;
        let passwordValid = false;

        //Validation

        //Check Email
        if (this.validateStringInput(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            this.state.email) == false) {
            this.setState({
                errorEmail: "Invalid Email Address."
            })

        } else {
            emailValid = true;
            this.setState({
                errorEmail: ''
            })
        }

        //Check Company
        if (this.validateStringInput(/^[A-Za-z]{1,}([ \-]{0,1}([A-Za-z\-]{1,}))*[.]{0,1}$/,
            this.state.company) == false) {
            this.setState({
                errorCompany: "Invalid Company Name."
            })
        } else {
            companyValid = true
            this.setState({
                errorCompany: ''
            })
        }

        //Check Role
        if (this.state.role.length < 1) {
            this.setState({
                errorRole: "Please select a User Role."
            })
        } else {
            roleValid = true
            this.setState({
                errorRole: ''
            })
        }

        //Check Password
        if (this.validateStringInput(/^[a-zA-Z\d!?<>@#$%^&*()\-_=+]{8,15}$/,
            this.state.password) == false) {
            this.setState({
                errorPw: "Passwords must be at least 8 characters in length one(1) letter, one(1) number, and one(1) special character"
            })
        } else {
            passwordValid = true;
            this.setState({
                errorPw: ''
            })
        }

        if (emailValid && companyValid && roleValid && passwordValid) {
            // if (this.state.formValid) {
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
                .then(
                    res => {
                        this.setState({
                            creationSuccess: res.data.success,
                            errorMessage: res.data.message,
                            errorEmail: res.data.messageEmail,
                            errorCompany: res.data.messageCompany,
                            errorPw: res.data.messagePw,
                            errorRole: res.data.messageRole
                        })
                        if (this.state.creationSuccess) {
                            this.setState({
                                email: '',
                                company: '',
                                role: '',
                                password: ''
                            })
                        } else {
                            this.setState({
                                password: ''
                            })
                        }
                    }, (error) => {
                        this.setState({
                            errorMessage: "Failed to create User."
                        })
                    })
        }
        else {
            this.setState({
                errorMessage: "Failed to create User."
            })
        }
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
                <p className="text-center mt-5">
                    <img src={logo} alt='logo' />
                </p>
                <h1 className='text-center h2'>Register New User</h1>
                <Row className="justify-content-center">
                    <Col md="6">
                        <div>
                            <div className='form-div mt-2'>
                                <form onSubmit={this.onSubmit}>

                                    <span className="text-center alert-danger">{this.state.errorEmail}</span>
                                    <input type='text'
                                        placeholder='E-mail'
                                        onChange={this.changeEmail}
                                        value={this.state.email}
                                        className='form-control form-group' />

                                    <span className="text-center alert-danger">{this.state.errorCompany}</span>
                                    <input type='text'
                                        placeholder='Company'
                                        onChange={this.changeCompany}
                                        value={this.state.company}
                                        className='form-control form-group' />

                                    <span className="text-center alert-danger">{this.state.errorRole}</span>
                                    <select className='form-control form-group' value={this.state.role} name="roles" onChange={this.changeRole}>
                                        <option disabled selected hidden value="">Select a Role</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Distribution">Distribution</option>
                                        <option value="Driver">Driver</option>
                                        <option value="Dispatcher">Dispatcher</option>
                                        <option value="Admin">Admin</option>
                                    </select>

                                    <span className="text-center alert-danger">{this.state.errorPw}</span>
                                    <input type='password'
                                        placeholder='Password'
                                        onChange={this.changePassword}
                                        value={this.state.password}
                                        className='form-control form-group' />

                                    <span className="text-center alert-danger">{this.state.errorMessage}</span>

                                    <input type='submit' className='btn btn-primary btn-block'
                                        value='Submit' />
                                    <Link className="mt-3 btn btn-warning btn-block" to='/admin/user-manager'>Back</Link>

                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

        );
    }
}

export default CreateUserForm;
