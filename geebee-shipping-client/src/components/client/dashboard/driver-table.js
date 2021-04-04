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
        Header: 'Delivery Date',
        accessor: 'delivery_date',
      },
      {
        Header: 'Destination Address',
        accessor: data => data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode,
      },
      {
        Header: 'Order Status',
        accessor: 'order_status'
      },

    ]
    return (
      <div>
        <div>
          <label>Last Updated: {new Date().toString()}</label>
        </div>
        <div >
          <Table columns={columns} data={this.state.mongoData} formType="Driver" tRole="Driver" />
        </div>
      </div>
    )
  }
}