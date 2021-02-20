
import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
import logo from './gb.png'

class RegisterForm extends Component{
    
    constructor(){
        super()
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: Number,
            email: '',
            company: '',
            password: ''
        }
        this.changeFirstName = this.changeFirstName.bind(this)
        this.changeLastName = this.changeLastName.bind(this)
        this.changePhoneNumber = this.changePhoneNumber.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
        this.changeCompany = this.changeCompany.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    // changes state values 
    // takes value of event and saves it to fullname, username, etc
    // used in onChange in form fields, used to check any change in field
    changeFirstName(event){
        this.setState({
            firstName: event.target.value
        })
    }

    changeLastName(event){
        this.setState({
            lastName: event.target.value
        })
    }

    changePhoneNumber(event){
        this.setState({
            phoneNumber: event.target.value
        })
    }

    changeEmail(event){
        this.setState({
            email: event.target.value
        })
    }

    changeCompany(event){
        this.setState({
            company: event.target.value
        })
    }

    changePassword(event){
        this.setState({
            password: event.target.value
        })
    }
    
    checkboxHandler(){
        
    }
    // will grab all details user typed in and saved in 'registered' after user clicks submit
    // want to send 'registered' to the backend, use axios
    onSubmit(event){
        // prevents form from acting in default way, stops refreshing
        event.preventDefault()
        const registered = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            company: this.state.company,
            password: this.state.password
        }
        // everything stored in registered will send to backend (url) then to mongo
        axios.post('http://localhost:3000/register', registered)
        .then(res => console.log(res.data))

        // here you redirect to profile page or home page
        // window.location = '/'
        this.setState({
            firstName: '',
            lastName: '',
            phoneNumber: Number,
            email: '',
            company: '',
            password: ''
        })

    }

    render(){
        return (
            <div>
                <img src={logo} alt='logo'/>
                    <h1 className='text-center'>Register New User</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>
                            <input type='text'
                            placeholder='First Name'
                            onChange={this.changeFirstName}
                            value={this.state.firstName}
                            className='form-control form-group'/>

                            <input type='text'
                            placeholder='Last Name'
                            onChange={this.changeLastName}
                            value={this.state.lastName}
                            className='form-control form-group'/>

                            <input type='number'
                            placeholder='Phone Number'
                            onChange={this.changePhoneNumber}
                            value={this.state.phoneNumber}
                            className='form-control form-group'/>

                            <input type='text'
                            placeholder='E-mail'
                            onChange={this.changeEmail}
                            value={this.state.email}
                            className='form-control form-group'/>

                            <input type='text'
                            placeholder='Company'
                            onChange={this.changeCompany}
                            value={this.state.company}
                            className='form-control form-group'/>

                            <input type='password'
                            placeholder='Password'
                            onChange={this.changePassword}
                            value={this.state.password}
                            className='form-control form-group'/>

                            <input type='submit' className='btn btn-primary btn-block'
                            value='Submit'/>

                            <div className='text-center'>
                            <input type='checkbox' id='agree' 
                            onChange={this.checkboxHandler}/>
                            <label className='p-1'type='text'> I accept the terms & conditions </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        
        );
    }
}

export default RegisterForm;