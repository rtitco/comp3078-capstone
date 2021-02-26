import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class CreateCompany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sendSuccess: false,
      company_id: '',
      company_name: '',
      //address line 1
      address: '',
      city: '',
      province: '',
      postal_code: '',
      company_phone: ''
    }
    this.updateCompanyName = this.updateCompanyName.bind(this)
    this.updateAddress = this.updateAddress.bind(this)
    this.updateCity = this.updateCity.bind(this)
    this.updateProvince = this.updateProvince.bind(this)
    this.updatePostalCode = this.updatePostalCode.bind(this)
    this.updatePhone = this.updatePhone.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  updateCompanyName(event) {
    this.setState({
      company_name: event.target.value
    })
  }

  updateAddress(event) {
    this.setState({
      address: event.target.value,
    })
  }

  updateCity(event) {
    this.setState({
      city: event.target.value,
    })
  }

  updateProvince(event) {
    this.setState({
      province: event.target.value,
    })
  }

  updatePostalCode(event) {
    this.setState({
      postal_code: event.target.value,
    })
  }

  updatePhone(event) {
    this.setState({
      company_phone: event.target.value
    })
  }

  onSubmit(event) {
    event.preventDefault()
    const newCompany = {
      company_name: this.state.company_name,
      address: this.state.address,
      city: this.state.city,
      province: this.state.province,
      postal_code: this.state.postal_code,
      company_phone: this.state.company_phone
    }

    axios.post('http://localhost:8081/admin/company-manager/add', newCompany)
      .then(res => {
        if (res.data.success === true) {
          //redirect to another page
          this.setState({
            sendSuccess: true
          })
        }
      }, (error) => {
        console.log(error);
      })


    this.setState({
      company_id: '',
      company_name: '',
      //address line 1
      address: '',
      city: '',
      province: '',
      postal_code: '',
      company_phone: ''
    })
  }

  render() {
    if (this.state.sendSuccess === true) {
      return <Redirect to='/admin/company-manager' />
    }
    return (
      <>

        <Row className="justify-content-md-center mt-5">
          <Col lg="6" >
            <h1>Add Company</h1>
            <hr />
            <Form onSubmit={this.onSubmit}>
              <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name"
                  onChange={this.updateCompanyName}
                  value={this.state.company_name}
                />
              </Form.Group>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123 Example Street"
                  onChange={this.updateAddress}
                  value={this.state.address}
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Toronto"
                  onChange={this.updateCity}
                  value={this.state.city}
                />
              </Form.Group>
              <Form.Group controlId="province">
                <Form.Label>Province</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ontario"
                  onChange={this.updateProvince}
                  value={this.state.province}
                />
              </Form.Group>
              <Form.Group controlId="postalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="E2E 2E2"
                  onChange={this.updatePostalCode}
                  value={this.state.postal_code}
                />
              </Form.Group>
              <Form.Group controlId="postalCode">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123-123-1234"
                  onChange={this.updatePhone}
                  value={this.state.company_phone}
                />
              </Form.Group>
              <span>{this.state.errorMessage}</span>
              <div className="float-right">
                <Button variant="primary" type="submit">
                  Submit
                    </Button>
                <Button variant="secondary" className="ml-2" onClick={this.handleModalClose}>
                  Close
                  </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </>
    )
  }
}