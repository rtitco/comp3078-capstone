import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';

export default class RetailTable extends Component {
  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

    this.state = {
      currentUser: sessionUser,
      data: [],
      loading: true,
      currentDate: new Date().toString()
    }
  }

  async getOrderData(address) {
    console.log("Searching Destination Address:")
    console.log(address)
    const orderRes = await axios.get(`http://localhost:8081/orders/address/${address}`)
    this.setState({ loading: false, data: orderRes.data })
  }

  async getStoreAddress() {
    console.log(this.state.currentUser.company)
    const userWork = await axios.get(`http://localhost:8081/companies/name/${this.state.currentUser.company}`)
    console.log(userWork.data[0].address)
    this.getOrderData(userWork.data[0].address)
  }

  componentDidMount() {
    this.getStoreAddress()
  }

  render() {
    const columns = [
      {
        Header: 'Order ID',
        accessor: '_id',
      },
      {
        Header: 'Order Date',
        accessor: 'order_date',
      },
      {
        Header: 'Delivery Date',
        accessor: 'delivery_date',
      },
      {
        Header: 'Status',
        accessor: 'order_status'
      }
    ]
    return (
      <div>
        <label>Last Refreshed: {this.state.currentDate}</label>
        <h1>Welcome, {this.state.currentUser.firstName} {this.state.currentUser.lastName}</h1>

        <div className="mx-5">
          <Table columns={columns} data={this.state.data} formType="Retail" tRole="Retail" />
        </div>
      </div>
    )
  }
}