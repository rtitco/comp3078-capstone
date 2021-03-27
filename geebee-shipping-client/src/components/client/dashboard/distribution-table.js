import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';

export default class DistributionTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true
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
            Header: 'Cargo Weight (kg)',
            accessor: 'cargo_weight',
        },
        {
            Header: 'Status',
            accessor: 'order_status',
        }
    ]
    return (
      <div>
        <h1>Order Manager</h1>
        <Link to="./orders/add">
        <Button className="float-right mr-5 mb-2" variant="success">Create Order</Button>
        </Link>
        <div className="mx-5">
        <Table columns={columns} data={this.state.data} />
        </div>
      </div>
    )
  }
}