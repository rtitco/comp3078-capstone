import React, { Component } from 'react'
import axios from 'axios';
import './login.css';
import { Redirect } from "react-router-dom";

import logo from '../profile/gb.png'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LoginNavBar from '../../shared/navbar/login-navbar';

class LoginForm extends Component {
    constructor() {
        super()
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            email: '',
            password: '',
            loggedIn: false,
            errorMessage: "",
            firstLogin: false,
        }
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

    onSubmit = (event) => {
        event.preventDefault()

        let formValid = false
        // let passwordValid = false


        if (this.state.email.length < 1 || this.state.password.length < 1) {
            this.setState({
                errorMessage: "Fields cannot be empty."
            })
        }
        else {
            formValid = true
            this.setState({
                errorMessage: ''
            })
        }

        if (formValid) {
            const loginUser = {
                email: this.state.email,
                password: this.state.password
            }

            axios.post('http://localhost:8081/login', loginUser)
                .then(res => {
                    if (res.data.success === true) {
                        sessionStorage.setItem("currentUser", JSON.stringify(res.data.user))
                        this.setState({
                            loggedIn: true,
                            currentUser: res.data.user,
                            firstLogin: res.data.user.firstLogin
                        })
                    }
                    else {
                        this.setState({
                            errorMessage: res.data.message
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    render() {
        if (this.state.currentUser != null) {
            if (this.state.currentUser.role == "Admin") {
                return <Redirect to='/admin' />
            }
            else {
                return <Redirect to='/client' />
            }
        }

        if (this.state.loggedIn === true) {
            if (this.state.currentUser.role == "Admin") {
                if (this.state.currentUser.firstLogin === true) {
                    return <Redirect to='/profile' />
                }
                else {
                    return <Redirect to='/admin' />
                }
            }
            if (this.state.currentUser.role == "Fleet Manager" || this.state.currentUser.role == "Distribution" || this.state.currentUser.role == "Retail" || this.state.currentUser.role == "Driver") {
                if (this.state.currentUser.firstLogin === true) {
                    return <Redirect to='/profile' />
                }
                else {
                    return <Redirect to='/client' />
                }
            }
            else {
                this.setState({ errorMessage: "Please log in." })
            }
        }

        return (
            <div className="login-bg">
                <LoginNavBar />
                <Container className="login-bg">
                    <Row className="justify-content-md-center">
                        <Col className="login-box p-5" lg="3" md="6" sm="8">
                            <p className="text-center">
                                <img src={logo} alt='logo' />
                            </p>
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={this.changeEmail}
                                        value={this.state.email}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        onChange={this.changePassword}
                                        value={this.state.password}
                                    />
                                </Form.Group>
                                <span className="text-center alert-danger">{this.state.errorMessage}</span>
                                <Button variant="primary" className="btn-block" type="submit">
                                    Log In
                    </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        )

    }
}

export default LoginForm;