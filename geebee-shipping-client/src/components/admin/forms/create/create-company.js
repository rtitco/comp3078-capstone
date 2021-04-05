import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Redirect, Link } from "react-router-dom";

class CreateCompanyForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      sendSuccess: false,
      company_id: '',
      company_name: '',
      address: '',
      city: '',
      province: '',
      postal_code: '',
      company_phone: '',

      errorMessage: '',
      errorCompany: '',
      errorAddress: '',
      errorCity: '',
      errorProvince: '',
      errorPostalCode: '',
      errorPhone: '',
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

  updateCompanyName = (event) => {
    this.setState({
      company_name: event.target.value
    })
  }

  updateAddress = (event) => {
    this.setState({
      address: event.target.value,
    })
  }

  updateCity = (event) => {
    this.setState({
      city: event.target.value,
    })
  }

  updateProvince = (event) => {
    this.setState({
      province: event.target.value,
    })
  }

  updatePostalCode = (event) => {
    this.setState({
      postal_code: event.target.value,
    })
  }

  updatePhone = (event) => {
    this.setState({
      company_phone: event.target.value
    })
  }

  onSubmit = (event) => {
    event.preventDefault()

    let nameValid = false
    let addressValid = false
    let cityValid = false
    let provinceValid = false
    let postalCodeValid = false
    let phoneValid = false


    //====================================================Validation===============================================================//
    const rgx_name = /^[A-Za-z\-\d]{1,}([ \-]{0,1}([A-Za-z\-\d]{1,})){0,}[.]{0,1}$/
    const rgx_address = /^([\d]{1,5}[a-mA-M]{0,1}){1}[ ]{1}([A-Za-z]{2,}[ ]{0,1}){1,}[.]{0,1}$/
    const rgx_city = /^[A-Za-z]{1,}([ \-]{0,1}([A-Za-z]{1}[a-z]{1,}))*$/
    const rgx_postalCode = /^([a-zA-z]{1}[\d]{1}[a-zA-z]{1}){1}[ ]{0,1}([\d]{1}[a-zA-z]{1}[\d]{1}){1}$/
    const rgx_phone = /^[\d]{10}$/

    //Company Name
    if (this.validateStringInput(rgx_name, this.state.company_name) == false) {
      this.setState({ errorCompany: "Invalid Company Name." })
    } else {
      nameValid = true
      this.setState({ errorCompany: '' })
    }

    // Company Address
    if (this.validateStringInput(rgx_address, this.state.address) == false) {
      this.setState({ errorAddress: "Invalid Address." })
    } else {
      addressValid = true
      this.setState({ errorAddress: '' })
    }

    // Company City
    if (this.validateStringInput(rgx_city, this.state.city) == false) {
      this.setState({ errorCity: "Invalid City." })
    } else {
      cityValid = true
      this.setState({ errorCity: '' })
    }

    // Company Province
    if (this.state.province.length < 1) {
      this.setState({ errorProvince: "Please select a Province or Territory." })
    } else {
      provinceValid = true
      this.setState({ errorProvince: '' })
    }

    // Company Postal Code
    if (this.validateStringInput(rgx_postalCode,
      this.state.postal_code) == false) {
      this.setState({ errorPostalCode: "Invalid Postal Code." })
    } else {
      postalCodeValid = true
      this.setState({ errorPostalCode: '' })
    }

    // Company Phone
    if (this.validateStringInput(rgx_phone, this.state.company_phone) == false) {
      this.setState({ errorPhone: "Invalid Phone Number." })
    } else {
      phoneValid = true
      this.setState({ errorPhone: '' })
    }

    //If validation passes, send to POST
    if (nameValid && addressValid && cityValid && provinceValid && postalCodeValid && phoneValid) {
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
          this.setState({
            sendSuccess: res.data.success,
            errorMessage: res.data.message,
            errorCompany: res.data.messageCompany,
            errorAddress: res.data.messageAddress,
            errorCity: res.data.messageCity,
            errorProvince: res.data.messageProvince,
            errorPostalCode: res.data.messagePostalCode,
            errorPhone: res.data.messagePhone
          })
          if (this.state.sendSuccess) {
            this.setState({
              company_id: '',
              company_name: '',
              address: '',
              city: '',
              province: '',
              postal_code: '',
              company_phone: ''
            })
          }
        }, (error) => {
          this.setState({ errorMessage: "Failed to Add Company." })
        })
    }
  }

  render() {
    if (this.state.sendSuccess === true) {
      return <Redirect to='/admin/company-manager' />
    }
    return (
      <div>

        <Row className="justify-content-md-center mt-5">
          <Col lg="6" className="bg-light p-5" >
            <h1>Add Company</h1>
            <hr />
            <Form onSubmit={this.onSubmit}>

              <Form.Group controlId="companyName">
                <Form.Label>Company Name <span className="text-center alert-danger">{this.state.errorCompany}</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Company Name"
                  onChange={this.updateCompanyName}
                  value={this.state.company_name}
                />
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address <span className="text-center alert-danger">{this.state.errorAddress}</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123 Example Street"
                  onChange={this.updateAddress}
                  value={this.state.address}
                />
              </Form.Group>

              <Form.Group controlId="city">
                <Form.Label>City <span className="text-center alert-danger">{this.state.errorCity}</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Toronto"
                  onChange={this.updateCity}
                  value={this.state.city}
                />
              </Form.Group>

              <Form.Group controlId="province">
                <Form.Label>Province<span className="text-center alert-danger">{this.state.errorProvince}</span></Form.Label>
                <select className='form-control form-group' value={this.state.province} onChange={this.updateProvince}>
                  <option disabled selected hidden value="">Select a Province.</option>
                  <option value="Alberta">Alberta</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Manitoba">Manitoba</option>
                  <option value="New Brunswick">New Brunswick</option>
                  <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                  <option value="Northwest Territories">Northwest Territories</option>
                  <option value="Nova Scotia">Nova Scotia</option>
                  <option value="Ontario">Ontario</option>
                  <option value="Prince Edward Island">Prince Edward Island</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Saskatchewan">Saskatchewan</option>
                  <option value="Yukon">Yukon</option>

                </select>
              </Form.Group>

              <Form.Group controlId="postalCode">
                <Form.Label>Postal Code <span className="text-center alert-danger">{this.state.errorPostalCode}</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="E2E 2E2"
                  onChange={this.updatePostalCode}
                  value={this.state.postal_code}
                />
              </Form.Group>

              <Form.Group controlId="postalCode">
                <Form.Label>Phone <span className="text-center alert-danger">{this.state.errorPhone}</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123-123-1234"
                  onChange={this.updatePhone}
                  value={this.state.company_phone}
                />
              </Form.Group>

              <span className="text-center alert-danger">{this.state.errorMessage}</span>
              <Button variant="primary" type="submit" className="btn btn-primary btn-block">
                Submit
              </Button>
              <Link className="mt-3 btn btn-secondary btn-block" to='/admin/company-manager'>Back</Link>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CreateCompanyForm;