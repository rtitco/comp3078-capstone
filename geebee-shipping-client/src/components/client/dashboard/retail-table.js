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

  async getOrderData() {
    const orderRes = await axios.get('http://localhost:8081/orders')
    this.setState({ loading: false, data: orderRes.data })
  }

  componentDidMount() {
    this.getOrderData()
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