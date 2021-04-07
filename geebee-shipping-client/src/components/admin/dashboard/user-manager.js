import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class UserManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      retailData: [],
      fleetData: [],
      driverData: [],
      distributionData: [],
      adminData: [],
      loading: true,
    }
  }


  //gets the user data from db
  async getUsersData(role) {
    let res = []
    if (role == "Admin") {
      res = await axios.get(`http://localhost:8081/users/${role}`)
      this.setState({ loading: false, adminData: res.data })
    }
    else if (role == "Retail") {
      res = await axios.get(`http://localhost:8081/users/${role}`)
      this.setState({ loading: false, retailData: res.data })
    }
    else if (role == "Driver") {
      res = await axios.get(`http://localhost:8081/users/${role}`)
      this.setState({ loading: false, driverData: res.data })
    }
    else if (role == "Fleet Manager") {
      res = await axios.get(`http://localhost:8081/users/${role}`)
      this.setState({ loading: false, fleetData: res.data })
    }
    else if (role == "Distribution") {
      res = await axios.get(`http://localhost:8081/users/${role}`)
      this.setState({ loading: false, distributionData: res.data })
    }

  }
  componentDidMount() {
    this.getUsersData("Admin")
    this.getUsersData("Retail")
    this.getUsersData("Driver")
    this.getUsersData("Fleet Manager")
    this.getUsersData("Distribution")
  }

  render() {
    // columns for data table
    const columns = [
      // {
      //   Header: 'ID',
      //   accessor: '_id'
      // },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role'
      },
      {
        Header: 'Company',
        accessor: 'company',
      }
    ]

    return (
      <div>
        <Link to="./users/add">
          <Button className="float-right mr-5 mb-2 btn-top-margin" variant="primary">Add User</Button>
        </Link>

        <Tabs defaultActiveKey="admin-tab" id="uncontrolled-tab-example" className="mt-3">
          <Tab eventKey="admin-tab" title="Admin" variant="dark">
              <Table columns={columns} data={this.state.adminData} formType="User" tRole="admin" />
          </Tab>

          <Tab eventKey="retail-tab" title="Retail">
              <Table columns={columns} data={this.state.retailData} formType="User" tRole="admin" />
          </Tab>

          <Tab eventKey="driver-tab" title="Driver">
              <Table columns={columns} data={this.state.driverData} formType="User" tRole="admin" />
          </Tab>

          <Tab eventKey="fleet-tab" title="Fleet Manager">
              <Table columns={columns} data={this.state.fleetData} formType="User" tRole="admin" />
          </Tab>

          <Tab eventKey="distribution-tab" title="Distribution">
              <Table columns={columns} data={this.state.distributionData} formType="User" tRole="admin" />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
