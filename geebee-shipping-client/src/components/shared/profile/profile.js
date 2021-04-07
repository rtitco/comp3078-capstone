import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import logo from './gb.png'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import ClientNavBar from '../navbar/login-navbar';
import AdminNavBar from '../../admin/dashboard/admin-navbar/admin-navbar'

class ProfileForm extends Component {
    constructor(props) {
        super(props)
        let currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

        this.state = {
            firstName: (currentUser ? currentUser.firstName : ''),
            lastName: (currentUser ? currentUser.lastName : ''),
            phoneNumber: (currentUser ? currentUser.phoneNumber : ''),
            email: (currentUser ? currentUser.email : ''),
            company: (currentUser ? currentUser.company : ''),
            role: (currentUser ? currentUser.role : ''),
            userID: (currentUser ? currentUser._id : ''),

            currentPassword: '',
            updateSuccess: false,

            errorMessage: '',
            errorFirstName: '',
            errorLastName: '',
            errorPhone: '',
            errorEmail: '',
            errorNewPassword: '',
            errorNewPassword2: '',

            newPassword: '',
            newPassword2: ''
        }
    }

    validateStringInput = (regexStr, strInput) => {
        if (strInput == '') {
            return false;
        }
        else if (strInput.match(regexStr) == null) {
            return false;
        }
        return true;
    }

    changeFirstName = (event) => {
        this.setState({
            firstName: event.target.value
        })
    }

    changeLastName = (event) => {
        this.setState({
            lastName: event.target.value
        })
    }

    changePhoneNumber = (event) => {
        this.setState({
            phoneNumber: event.target.value
        })
    }

    changeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    changeCurrentPassword = (event) => {
        this.setState({
            currentPassword: event.target.value
        })
    }

    // will grab all details user typed in and saved in 'registered' after user clicks submit
    // want to send 'registered' to the backend, use axios
    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()

        let firstNameValid = false;
        let lastNameValid = false;
        let phoneValid = false;
        let emailValid = false;
        let newPasswordValid = false;
        let currentPasswordValid = false;
        let pwChanged = false;

        // Validation
        //First Name
        if (this.validateStringInput(/^[a-zA-Z]{2,}([ \-]{0,1}[a-zA-Z]{2,})*$/,
            this.state.firstName) == false) {
            this.setState({
                errorFirstName: "Invalid Name."
            })
        } else {
            firstNameValid = true;
            this.setState({
                errorEmail: ''
            })
        }

        //Last Name
        if (this.validateStringInput(/^[a-zA-Z]{2,}([ \-]{0,1}[a-zA-Z]{2,})*$/,
            this.state.lastName) == false) {
            this.setState({
                errorLastName: "Invalid Name."
            })
        } else {
            lastNameValid = true;
            this.setState({
                errorEmail: ''
            })
        }

        //Phone Number
        if (this.validateStringInput(/^[\d]{10}$/,
            this.state.phoneNumber) == false) {
            this.setState({
                errorPhone: "Invalid Phone Number."
            })
        } else {
            phoneValid = true;
            this.setState({
                errorPhone: ''
            })
        }

        //Email
        if (this.validateStringInput(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            this.state.email) == false) {
            this.setState({
                errorEmail: "Invalid Phone Number."
            })
        } else {
            emailValid = true;
            this.setState({
                errorEmail: ''
            })
        }

        //New Password + Confirm
        //Check if empty
        if (this.state.newPassword == '' && this.state.newPassword2 == '') {
            pwChanged = false
        }
        else {
            //check if new pw follows regex
            if (this.state.newPassword.match(/^[a-zA-Z\d!?<>@#$%^&*()\-_=+]{8,15}$/) == null) {
                pwChanged = true
                this.setState({ errorNewPassword: "Invalid Password" })
            }
            else {
                //check if follows regex and newpw=newpw2
                if (this.state.newPassword.match(/^[a-zA-Z\d!?<>@#$%^&*()\-_=+]{8,15}$/) != null &&
                    this.state.newPassword == this.state.newPassword2) {
                    pwChanged = true
                    newPasswordValid = true
                }
                else {
                    pwChanged = true
                    this.setState({ errorNewPassword2: "Passwords must match" })
                }
            }
        }

        //Current Password
        if (this.state.currentPassword == '') {
            this.setState({
                errorCurrPassword: "Current Password must be entered."
            })
        } else {
            // Send to get checked?
            currentPasswordValid = true;
            this.setState({
                errorCurrPassword: ''
            })
        }

        if ((firstNameValid && lastNameValid && phoneValid && emailValid) && ((pwChanged && newPasswordValid) || (pwChanged == false)) && this.state.currentPassword != '') {

            let registered = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                company: this.state.company,
                currentPassword: this.state.currentPassword,
                userID: this.state.userID,
                newPassword: this.state.newPassword
            }

            //data sent through POST
            // everything stored in registered will send to backend (url) then to mongo
            axios.post('http://localhost:8081/profile', registered)
                .then(res => {
                    //set new data to sessionStorage
                    console.log(res);

                    if (res.data.updateSuccess === true) {
                        let user = {
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            phoneNumber: this.state.phoneNumber,
                            email: this.state.email,
                            company: this.state.company,
                            role: this.state.role,
                            firstLogin: false,
                            _id: this.state.userID
                        }
                        sessionStorage.setItem("currentUser", JSON.stringify(user))
                        this.setState({
                            updateSuccess: true,
                            errorMessage: res.data.message
                        })
                    }
                    else {
                        this.setState({
                            updateSuccess: false,
                            errorMessage: res.data.message
                        })
                    }
                },
                    (error) => {
                        this.setState({
                            errorMessage: "Update Failed. Please Fill All Fields."
                        })
                    })
            this.setState({
                currentPassword: ''
            })
        }
        else {
            this.setState({
                errorMessage: "Failed to Update Profile"
            })
        }
    }

    render() {
        let myNav;
        //After successful update, redirect to dashboard
        if (this.state.role == '') {
            return <Redirect to='/login' />
        }
        else if (this.state.updateSuccess == true) {
            return <Redirect to='/dashboard' />
        }

        if (this.state.role == "Admin") {
            myNav = <AdminNavBar />
        }
        else {
            myNav = <ClientNavBar />
        }

        return (
            <div>
                {myNav}
                <p  className="text-center">
                    <img src={logo}  width="400" alt='logo' />
                </p>
                <h1 className='text-center h2'>Update User Profile</h1>
                <Row className="justify-content-center">
                    <Col md="6">
                        <div>
                            <div className='form-div mt-2'>
                                <form onSubmit={this.onSubmit}>

                                    <label>First Name: <span className="text-center alert-danger">{this.state.errorFirstName}</span></label>
                                    <input type='text'
                                        placeholder='First Name'
                                        onChange={this.changeFirstName}
                                        value={this.state.firstName}
                                        className='form-control form-group' />

                                    <label>Last Name: <span className="text-center alert-danger">{this.state.errorLastName}</span></label>
                                    <input type='text'
                                        placeholder='Last Name'
                                        onChange={this.changeLastName}
                                        value={this.state.lastName}
                                        className='form-control form-group' />

                                    <label>Phone Number: <span className="text-center alert-danger">{this.state.errorPhone}</span></label>
                                    <input type='text'
                                        placeholder='Phone Number'
                                        onChange={this.changePhoneNumber}
                                        value={this.state.phoneNumber}
                                        className='form-control form-group' />

                                    <label>Email: <span className="text-center alert-danger">{this.state.errorEmail}</span></label>
                                    <input type='text'
                                        placeholder='E-mail'
                                        onChange={this.changeEmail}
                                        value={this.state.email}
                                        className='form-control form-group' />

                                    <label>Company: </label>
                                    <input type='text'
                                        placeholder='Company'
                                        disabled={true}
                                        value={this.state.company}
                                        className='form-control form-group' />

                                    <Row>
                                        <Col md="6">
                                            <label>Change Password: <span className="text-center alert-danger">{this.state.errorNewPassword}</span></label>
                                            <input type='password'
                                                value={this.state.newPassword}
                                                className='form-control form-group' />
                                        </Col>
                                        <Col md="6">
                                            <label>Confirm Password: <span className="text-center alert-danger">{this.state.errorNewPassword2}</span></label>
                                            <input type='password'
                                                value={this.state.newPassword2}
                                                className='form-control form-group' />
                                        </Col>
                                    </Row>

                                    <label>Enter Current Password: <span className="text-center alert-danger">{this.state.errorCurrPassword}</span></label>
                                    <input type='password'
                                        placeholder='Password'
                                        onChange={this.changeCurrentPassword}
                                        value={this.state.currentPassword}
                                        className='form-control form-group' />

                                    <span className="text-center alert-danger">{this.state.errorMessage}</span>

                                    <input type='submit' className='btn btn-primary btn-block'
                                        value='Submit' />
                                    <Link className="mt-3 btn btn-warning btn-block" to='/dashboard'>Back</Link>

                                </form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ProfileForm