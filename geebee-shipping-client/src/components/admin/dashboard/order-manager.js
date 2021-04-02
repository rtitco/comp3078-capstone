import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';

export default class OrderManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true,
      showModal: false,
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
        Header: 'Address',
        accessor: 'destination_address',
      },
      {
        Header: 'City',
        accessor: 'destination_city',
      },
      {
        Header: 'Postal Code',
        accessor: 'destination_postalCode',
      },
      {
        Header: 'Status',
        accessor: 'order_status',
      }
    ]
    return (
      <div>
        <h1>Order Manager</h1>
        <Link to="./order-manager/add">
        <Button className="float-right mr-5 mb-2" variant="success">Add Order(Wrong Link)</Button>
        </Link>
        <div className="mx-5">
          <Table columns={columns} data={this.state.data} formType="Order" tRole="Admin"/>
        </div>
      </div>
    )
  }
}