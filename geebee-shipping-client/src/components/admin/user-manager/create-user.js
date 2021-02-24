import React, { Component } from 'react';
import axios from 'axios'
import logo from './gb.png'

class CreateUser extends Component{
    
    constructor(){
        super()
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            company: '',
            role: '',
            password: ''
        }
        this.changeEmail = this.changeEmail.bind(this)
        this.changeCompany = this.changeCompany.bind(this)
        this.changeRole = this.changeRole.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    // changes state values 
    // takes value of event and saves it to fullname, username, etc
    // used in onChange in form fields, used to check any change in field

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

    changeRole(event){
        this.setState({
            role: event.target.value
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
            role: this.state.role,
            password: this.state.password
        }
        // everything stored in registered will send to backend (url) then to mongo
        axios.post('http://localhost:8081/profile', registered)
        .then(res => {
            console.log(res)
        }, (error) => {
            console.log(error);
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

    render(){
        return (
            <div>
                <img src={logo} className="text-center" alt='logo'/>
                    <h1 className='text-center'>Register New User</h1>
                <div>
                    <div className='container form-div d-flex justify-content-center'>
                        <form onSubmit={this.onSubmit}>
                            
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

export default CreateUser;
