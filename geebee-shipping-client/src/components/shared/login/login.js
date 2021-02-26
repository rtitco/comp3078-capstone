import React, { Component } from 'react'
import axios from 'axios';
import './login.css';
import { Redirect } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LoginNavBar from '../../shared/navbar/login-navbar';

class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            currentUser: null,
            errorMessage: "",
            firstLogin: false
        }
        // this.changeEmail = this.changeEmail.bind(this)
        // this.changePassword = this.changePassword.bind(this)
        // this.onSubmit = this.onSubmit.bind(this)
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
        const loginUser = {
            email: this.state.email,
            password: this.state.password
        }

        console.log("Pre-Post");
        axios.post('http://localhost:8081/login', loginUser)
            .then(res => {
                console.log("Successful POST")
                console.log(res.data.user)
                if(res.data.success === true){
                    sessionStorage.setItem("currentUser", JSON.stringify(res.data.user))
                    this.setState({
                        loggedIn: true,
                        currentUser: res.data.user,
                        firstLogin: res.data.user.firstLogin
                    })
                }
                else{
                    this.setState({
                        errorMessage: res.data.message
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        console.log("Post-Post")

        this.setState({
            email: '',
            password: ''
        })
    }

    render() {
        if (this.state.loggedIn === true) {
            if(this.state.currentUser.role == "Admin"){
                if (this.state.currentUser.firstLogin === true){
                    return <Redirect to='/profile' />
                }
                else{
                    return <Redirect to='/admin' />
                }
            }
            if(this.state.currentUser.role == "Driver"){
                if (this.state.currentUser.firstLogin === true){
                    return <Redirect to='/profile' />
                }
                else{
                    return <Redirect to='/admin' />
                }
            }
            if(this.state.currentUser.role == "Dispatcher" || this.state.currentUser.role == "Distribution" || this.state.currentUser.role == "Retail"){
                if (this.state.currentUser.firstLogin === true){
                    return <Redirect to='/profile' />
                }
                else{
                    return <Redirect to='/dashboard' />
                }
            }
            // if(this.state.currentUser.role == "Distribution"){
            //     if (this.state.currentUser.firstLogin === true){
            //         return <Redirect to='/profile' />
            //     }
            //     else{
            //         return <Redirect to='/dashboard' />
            //     }
            // }
            // if(this.state.currentUser.role == "Retail"){
            //     if (this.state.currentUser.firstLogin === true){
            //         return <Redirect to='/profile' />
            //     }
            //     else{
            //         return <Redirect to='/dashboard' />
            //     }
            // }
            else{
                this.setState({errorMessage: "Please log in."})
            }
        }

        return (
            <>
            <LoginNavBar/>
            <Container>
                <Row className="justify-content-md-center">
                    <Col className="login-box p-5" lg="3" md="6" sm="8">
                        <h1 className="h3 text-center">Geebee Shipping Solutions</h1>
                        <h2 className="h5 text-center">Login</h2>
                        <hr />
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
                            <span>{this.state.errorMessage}</span>
                            <Button variant="primary" className="btn-block" type="submit">
                                Submit
                    </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            </>
        )

    }
}

export default LoginForm;