import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Redirect } from "react-router-dom";

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
      errorPhone: ''
    }
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
          this.setState({
            sendSuccess: true,
            errorMessage: res.data.message
          })
        }
        else {
          this.setState({
            errorMessage: res.data.message,
            errorCompany: res.data.messageCompany,
            errorAddress: res.data.messageAddress,
            errorCity: res.data.messageCity,
            errorProvince: res.data.messageProvince,
            errorPostalCode: res.data.messagePostalCode,
            errorPhone: res.data.messagePhone
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
      <div>

        <Row className="justify-content-md-center mt-5">
          <Col lg="6" >
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
                {/* <Form.Control
                  type="text"
                  placeholder="Ontario"
                  onChange={this.updateProvince}
                  value={this.state.province}
                /> */}
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
              <div className="float-right">
                <Button variant="primary" type="submit">
                  Submit
                    </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CreateCompanyForm;