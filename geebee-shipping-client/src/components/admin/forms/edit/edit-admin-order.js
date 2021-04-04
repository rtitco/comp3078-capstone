import React, { Component } from 'react';
import OrderSchedule from '../schedule-table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";
import logo from '../../../shared/profile/gb.png';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Form from 'react-bootstrap/Form';


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

      roleRequest: "Driver",

      data: [],
      driverData: [],
      truckData: [],
      // loading: true,
      singleSelections: [],

    }
  }

  //===================================GET DB DATA===================================//
  getOrderData = async () => {
    const orderRes = await axios.get(`http://localhost:8081/orders/${this.state.deliveryDate}`)
    this.setState({ data: orderRes.data })
  }

  getDrivers = async () => {
    const driverRes = await axios.get(`http://localhost:8081/users/${this.state.roleRequest}`)
    let myDrivers = [];
    let currentID = 0;

    driverRes.data.forEach(element => {
      let driver = element.email
      myDrivers.push({ id: currentID, label: driver })
      currentID++;
    });
    this.setState({ driverData: myDrivers })
  }

  getLicensePlates = async (classNum) => {
    const truckRes = await axios.get(`http://localhost:8081/fleet/${classNum}`)
    let myTrucks = [];
    let currentID = 0;

    truckRes.data.forEach(element => {
      let truck = element.license_plate
      myTrucks.push({ id: currentID, label: truck })
      currentID++;
    });
    this.setState({ truckData: myTrucks })
  }

  componentDidMount() {
    this.getOrderData()
    this.getDrivers()
  }

  //===================================SET AUTOCOMPLETE SELECTIONS===================================//

  setDriverSelections = (mySelection) => {
    if (mySelection != undefined && mySelection[0] != undefined) {
      this.setState({
        driverSelections: [mySelection],
        assigned_truckDriver: mySelection[0].label
      })
    }
  }

  setTruckSelections = (mySelection) => {
    if (mySelection != undefined && mySelection[0] != undefined) {
      this.setState({
        truckSelections: [mySelection],
        assigned_truckPlate: mySelection[0].label
      })
    }
  }

  //===================================VALIDATE INPUT FUNCTIONS===================================//


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
    this.getLicensePlates(event.target.value)
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

  //===================================onSubmit()===================================//

  onSubmit = (event) => {
    // prevents form from acting in default way, stops refreshing
    event.preventDefault()

    let classValid = false
    let plateValid = false
    let driverValid = false

    //===================================VALIDATION===================================//

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

    //===================================POST DATA===================================//
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
    else if (this.state.updateSuccess == true) {
      return <Redirect to='/admin/order-manager' />
    }

    //Schedule Table React-Table Columns
    const columns = [
      {
        Header: 'Driver',
        accessor: 'assigned_truck_driverEmail',
      },
      {
        Header: 'Assigned Truck',
        accessor: 'assigned_truck_plate',
      },
      {
        Header: 'Origin Address',
        accessor: data => data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode
      },
      {
        Header: 'Destination Address',
        accessor: data => data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode,
      }
    ]

    return (
      <div>
        <Row>
          {/* Form Left Side */}
          <Col md="6">
            <h4 className='text-center'>Schedule Delivery Order</h4>

            <Row className="justify-content-center">
              <Col md="6">
                <Form onSubmit={this.onSubmit}>

                  <Form.Group>
                    <Form.Label>Delivery Date: </Form.Label>
                    <Form.Control type='date'
                      disabled
                      value={this.state.deliveryDate}
                      className='form-control form-group' />
                  </Form.Group>

                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <Form.Label>Cargo Type: </Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.cargo_type}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group>
                        <Form.Label>Cargo Weight (kg):</Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.cargo_weight}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Origin */}
                  <h6>Origin:</h6>
                  <Form.Group>
                    <Form.Label>Address: </Form.Label>
                    <Form.Control type='text'
                      disabled
                      value={this.state.origin_address}
                      className='form-control form-group' />
                  </Form.Group>

                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <Form.Label>City: </Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.origin_city}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group>
                        <Form.Label>Postal Code: </Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.origin_postalCode}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Destination */}
                  <h6>Destination:</h6>
                  <Form.Group>
                    <Form.Label>Address: </Form.Label>
                    <Form.Control type='text'
                      disabled
                      value={this.state.dest_address}
                      className='form-control form-group' />
                  </Form.Group >

                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <Form.Label>City: </Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.dest_city}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col>

                    <Col md="6">
                      <Form.Group>
                        <Form.Label>Postal Code: </Form.Label>
                        <Form.Control type='text'
                          disabled
                          value={this.state.dest_postalCode}
                          className='form-control form-group' />
                      </Form.Group>
                    </Col >
                  </Row >

                  <Form.Group>
                    <Form.Label>Truck Class: <span className="text-center alert-danger">{this.state.errorTruckClass}</span></Form.Label>
                    <select className='form-control form-group'
                      value={this.state.assigned_truckClass}
                      name="class"
                      onChange={this.changeTruckClass}
                    >
                      <option disabled selected hidden value="">Select a truck class.</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                    </select>
                  </Form.Group >

                  <Form.Group>
                    <Form.Label>License Plate: <span className="text-center alert-danger">{this.state.errorTruckPlate}</span></Form.Label>
                    <Typeahead
                      id="basic-typeahead-single"
                      onChange={this.setTruckSelections}
                      options={this.state.truckData}
                      placeholder="PLATE###"
                      selected={this.truckSelections}
                    />
                  </Form.Group >

                  <Form.Group>
                    <Form.Label>Driver Email: <span className="text-center alert-danger">{this.state.errorTruckDriver}</span></Form.Label>
                    <Typeahead
                      id="basic-typeahead-single"
                      onChange={this.setDriverSelections}
                      options={this.state.driverData}
                      placeholder="Driver"
                      selected={this.driverSelections}
                    />
                  </Form.Group>

                  <span className="text-center alert-danger">{this.state.errorMessage}</span>

                  <input type='submit' className='btn btn-primary btn-block'
                    value='Submit' />
                  <Link className="mt-3 btn btn-warning btn-block" to='/admin/order-manager'>Back</Link>
                </Form >
              </Col >
            </Row >
          </Col >

          {/* Schedule Table Right Side */}
          < Col md="6" >
            <label><h4>Current Deliveries on: {this.state.deliveryDate}</h4></label>
            <OrderSchedule columns={columns} data={this.state.data} />
          </Col >
        </Row >

      </div >

    );
  }
}

export default EditAdminOrderForm;