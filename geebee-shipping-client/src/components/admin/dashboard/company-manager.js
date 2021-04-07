import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'

import Button from 'react-bootstrap/Button';

export default class CompanyManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      showModal: false,
    }
  }

  async getCompaniesData() {
    const res = await axios.get('http://localhost:8081/companies')
    this.setState({ loading: false, data: res.data })
  }
  componentDidMount() {
    this.getCompaniesData()
  }

  render() {
    const columns = [
      {
        Header: 'Company',
        accessor: 'company_name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'City',
        accessor: 'city',
      },
      {
        Header: 'Province',
        accessor: 'province',
      },
      {
        Header: 'Postal Code',
        accessor: 'postal_code',
      },
      {
        Header: 'Phone',
        accessor: data => data.company_phone.substr(0, 3) + "-" + data.company_phone.substr(3, 3) + "-" + data.company_phone.substr(6, 4),
      }
    ]
    return (
      <div className="mt-4 table-container">
        <Button href="/admin/company-manager/add" className="float-right mr-5 btn-top-margin" variant="primary" >Add Company</Button>{''}
          <Table  columns={columns} data={this.state.data} formType="Company" tRole="Admin" />
      </div>
    )
  }
}