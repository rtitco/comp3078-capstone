import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import logo from '../../../shared/profile/gb.png'


class EditAdminOrderForm extends Component {

  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.state = {
      currentUser: sessionUser,
      id: props.location.state.data._id,
      orderDate: props.location.state.data.order_date,
      deliveryDate: props.location.state.data.delivery_date,
      origin_address: props.location.state.data.origin_address,
      origin_city: props.location.state.data.origin_city,
      origin_postalCode: props.location.state.data.origin_postalCode,
      dest_address: props.location.state.data.destination_address,
      dest_city: props.location.state.data.destination_city,
      dest_postalCode: props.location.state.data.destination_postalCode,
      cargo_type: props.location.state.data.cargo_type,
      cargo_weight: props.location.state.data.cargo_weight,
      assigned_truckClass: props.location.state.data.assigned_truck_class,
      assigned_truckPlate: props.location.state.data.assigned_truck_plate,
      assigned_truckDriver: props.location.state.data.assigned_truck_driverEmail,

      updateSuccess: false,
      errorMessage: '',
      errorDate: '',
      errorOriginAddress: '',
      errorOriginCity: '',
      errorOriginPostalCode: '',
      errorDestAddress: '',
      errorDestCity: '',
      errorDestPostalCode: '',

    }
  }

  validateStringInput = (regexStr, strInput) => {
    if (strInput < 1) {
      return false;
    }
    else if (strInput.match(regexStr) == null) {
      return false;
    }
    return true;
  }

  changeTruckClass = (event) => {
    this.setState({
      assigned_truckClass: event.target.value
    })

  }

  changeTruckPlate = (event) => {
    this.setState({
      assigned_truckPlate: event.target.value
    })
  }

  changeTruckDriver = (event) => {
    this.setState({
      assigned_truckDriver: event.target.value
    })
  }

  onSubmit = (event) => {
    // prevents form from acting in default way, stops refreshing
    event.preventDefault()

    let classValid = false
    let plateValid = false
    let driverValid = false

    //Validation
    //Check Truck Class
    if (this.state.assigned_truckClass.length < 1) {
      this.setState({
        errorTruckClass: "Please Select a Truck Class."
      })
    } else {
      classValid = true
      this.setState({
        errorTruckClass: ''
      })
    }

    //Check Truck License Plate
    if (this.validateStringInput(/^[A-Za-z]{3,5}[ ]{0,1}[\d]{3,5}$/,
      this.state.assigned_truckPlate) == false) {
      this.setState({
        errorEmail: "Invalid Email Address."
      })
    } else {
      plateValid = true
      this.setState({
        errorEmail: ''
      })
    }

    //Check Driver Email
    if (this.validateStringInput(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
      this.state.assigned_truckDriver) == false) {
      this.setState({
        errorTruckDriver: "Invalid Email Address."
      })
    } else {
      driverValid = true
      this.setState({
        errorTruckDriver: ''
      })
    }

    //POST DATA - put id for edit/delete
    if (classValid && plateValid && driverValid) {
      const orderData = {
        id: this.state.id,
        orderDate: this.state.orderDate,
        deliveryDate: this.state.deliveryDate,
        origin_address: this.state.origin_address,
        origin_city: this.state.origin_city,
        origin_postalCode: this.state.origin_postalCode,
        dest_address: this.state.dest_address,
        dest_city: this.state.dest_city,
        dest_postalCode: this.state.dest_postalCode,
        cargo_type: this.state.cargo_type,
        cargo_weight: this.state.cargo_weight,
        assigned_truckClass: this.state.assigned_truckClass,
        assigned_truckPlate: this.state.assigned_truckPlate,
        assigned_truckDriver: this.state.assigned_truckDriver
      }
      axios.post('http://localhost:8081/order-manager/edit', orderData)
        .then(res => {
          this.setState({
            updateSuccess: res.data.success,
            errorTruckClass: res.data.messageTruckClass,
            errorTruckPlate: res.data.messageTruckPlate,
            errorTruckDriver: res.data.messageTruckDriver
          })
        }, (error) => {
          this.setState({
            errorMessage: "Update Failed."
          })
        })
    }
    else {
      this.setState({
        errorMessage: "Update Failed."
      })
    }
  }

  render() {
    if (this.state.currentUser == null) {
      return <Redirect to='/login' />
    }
    else if (this.state.currentUser.role != "Admin") {
      return <Redirect to='/client' />
    }
    else if (this.state.updateSuccess === true) {
      return <Redirect to='/admin/order-manager' />
    }

    return (
      <div>
        <p className="text-center">
          <img src={logo} alt='logo' />
        </p>
        <h1 className='text-center'>Schedule Delivery Order</h1>

        <div>
          <Row className="justify-content-center">
            <Col md="6">
              <form onSubmit={this.onSubmit}>

                <label>Delivery Date: </label>
                <input type='date'
                  disabled
                  value={this.state.deliveryDate}
                  className='form-control form-group' />

                {/* Origin */}
                <label>Origin Address: </label>
                <input type='text'
                  disabled
                  value={this.state.origin_address}
                  className='form-control form-group' />

                <Row>
                  <Col md="6">
                    <label>Origin City: </label>
                    <input type='text'
                      disabled
                      value={this.state.origin_city}
                      className='form-control form-group' />
                  </Col>
                  <Col md="6">
                    <label>Origin Postal Code: </label>
                    <input type='text'
                      disabled
                      value={this.state.origin_postalCode}
                      className='form-control form-group' />
                  </Col>
                </Row>

                {/* Destination */}
                <label>Destination Address: </label>
                <input type='text'
                  disabled
                  value={this.state.dest_address}
                  className='form-control form-group' />

                <Row>
                  <Col md="6">
                    <label>Destination City: </label>
                    <input type='text'
                      disabled
                      value={this.state.dest_city}
                      className='form-control form-group' />
                  </Col>
                  <Col md="6">
                    <label>Destination Postal Code: </label>
                    <input type='text'
                      disabled
                      value={this.state.dest_postalCode}
                      className='form-control form-group' />
                  </Col>
                </Row>

                <Row>
                  <Col md="6">
                    <label>Cargo Type: </label>
                    <input type='text'
                      disabled
                      value={this.state.cargo_type}
                      className='form-control form-group' />
                  </Col>
                  <Col md="3">
                    <label>Cargo Weight (in kg): </label>
                    <input type='text'
                      disabled
                      value={this.state.cargo_weight}
                      className='form-control form-group' />
                  </Col>

                </Row>

                <label>Truck Class: <span className="text-center alert-danger">{this.state.errorTruckClass}</span></label>
                <select className='form-control form-group' value={this.state.assigned_truckClass} name="class" onChange={this.changeTruckClass}>
                  <option disabled hidden value="">Select a truck class.</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>

                <label>License Plate: <span className="text-center alert-danger">{this.state.errorTruckPlate}</span></label>
                <input type='text'
                  placeholder='PLATE###'
                  onChange={this.changeTruckPlate}
                  value={this.state.assigned_truckPlate}
                  className='form-control form-group' />

                <label>Driver Email: <span className="text-center alert-danger">{this.state.errorTruckDriver}</span></label>
                <input type='email'
                  placeholder='john.doe@email.com'
                  onChange={this.changeTruckDriver}
                  value={this.state.assigned_truckDriver}
                  className='form-control form-group' />

                <span className="text-center alert-danger">{this.state.errorMessage}</span>

                <input type='submit' className='btn btn-primary btn-block'
                  value='Submit' />
                <Link className="mt-3 btn btn-warning btn-block" to='/admin/order-manager'>Back</Link>
              </form>
            </Col>
          </Row>
        </div>
      </div>

    );
  }
}

export default EditAdminOrderForm;