import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class DriverTable extends Component {
  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

    this.state = {
      currentUser: sessionUser,
      mongoData: [],
      loading: true,
      testEmail: sessionUser.email,
      currentDate: new Date().toString(),
    }
  }

  getOrderData = async () => {
    const orderRes = await axios.get(`http://localhost:8081/driver/orders/${this.state.currentUser.email}`)
    this.setState({ mongoData: orderRes.data })
  }

  componentDidMount() {
    this.getOrderData()
  }

  render() {
    const columns = [
      {
        Header: 'Order ID',
        accessor: '_id'
      },
      {
        Header: 'Delivery Date',
        accessor: 'delivery_date',
      },
      {
        Header: 'Origin Address',
        accessor: data => data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode
      },
      {
        Header: 'Destination Address',
        accessor: data => data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode,
      },
      {
        Header: 'Cargo Type',
        accessor: 'cargo_type',
      },
      {
        Header: 'Assigned Truck - License Plate',
        accessor: 'assigned_truck_plate',
      },
      {
        Header: 'Status',
        accessor: 'order_status',
      }
    ]
    return (
      <div>
        <h1>Welcome, {this.state.currentUser.firstName} {this.state.currentUser.lastName}</h1>
        <div>
          <label>Last Updated: {this.state.currentDate}</label>
        </div>
        <div className="mx-5">
          <Table columns={columns} data={this.state.mongoData} formType="Driver" tRole="Driver" />
        </div>
      </div>
    )
  }
}