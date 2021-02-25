import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios'
import logo from './gb.png'

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

            password: '',
            updateSuccess: false,
            errorMessage: ''
        }
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

    changePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    // will grab all details user typed in and saved in 'registered' after user clicks submit
    // want to send 'registered' to the backend, use axios
    onSubmit = (event) => {
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()

        const registered = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            company: this.state.company,
            password: this.state.password,
            userID: this.state.userID
        }

        // everything stored in registered will send to backend (url) then to mongo
        axios.post('http://localhost:8081/profile', registered)
            .then(res => {
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
                        updateSuccess: true
                    })
                }
                else {
                    this.setState({
                        errorMessage: res.data.message
                    })
                }
            }, (error) => {
                this.setState({
                    errorMessage: "Update Failed. Please Fill All Fields."
                })
            })

    }

    render() {
        //After successful update, redirect to dashboard
        if (this.state.email == '') {
            return <Redirect to='/login' />
        }
        else {
            if (this.state.updateSuccess === true) {
                return <Redirect to='/admin' />
            }
            else {
                this.setState({
                    errorMessage: "Update Failed. Please Fill All Fields."
                })
            }
        }


        return (
            <div>
                <img src={logo} className="text-center" alt='logo' />
                <h1 className='text-center'>Update User Profile</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>
                            <input type='text'
                                placeholder='First Name'
                                onChange={this.changeFirstName}
                                value={this.state.firstName}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='Last Name'
                                onChange={this.changeLastName}
                                value={this.state.lastName}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='Phone Number'
                                onChange={this.changePhoneNumber}
                                value={this.state.phoneNumber}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='E-mail'
                                onChange={this.changeEmail}
                                value={this.state.email}
                                className='form-control form-group' />

                            <input type='text'
                                placeholder='Company'
                                disabled={true}
                                value={this.state.company}
                                className='form-control form-group' />

                            <input type='password'
                                placeholder='Password'
                                onChange={this.changePassword}
                                value={this.state.password}
                                className='form-control form-group' />

                            <span>{this.state.errorMessage}</span>

                            <input type='submit'
                                className='btn btn-primary btn-block'
                                value='Submit' />

                        </form>
                    </div>
                </div>
            </div>
        )

    }
}

export default ProfileForm