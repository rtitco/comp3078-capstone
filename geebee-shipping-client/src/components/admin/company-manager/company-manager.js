import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class CompanyManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      showModal: false,
    }
  }

 
  async getUsersData() {
    const res = await axios.get('http://localhost:8081/users')
    console.log(res.data)
    this.setState({ loading: false, data: res.data })
  }
  componentDidMount() {
    this.getUsersData()
  }

  render() {
    const columns = [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Phone #',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Company',
        accessor: 'company',
      }
    ]
    return (
      <div>
        <h1>Company Manager</h1>
        <Button href="/admin/company-manager/create" className="float-right mr-5 mb-2" variant="success">Add Company</Button>{''}
        <div className="mx-5">
          <Table columns={columns} data={this.state.data} />
        </div>
      </div>
    )
  }
}