import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class DistributionTable extends Component {
  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.state = {
      currentUser: sessionUser,
      orders_inProgress: [],
      orders_completed: [],
      loading: true
    }
  }

  async getOrdersInProgress() {
    const inprogress = await axios.get('http://localhost:8081/orders/active')
    console.log("In Progress Orders: ")
    console.log(inprogress.data)
    this.setState({ loading: false, orders_inProgress: inprogress.data })
  }

  async getOrdersCompleted() {
    const completed = await axios.get('http://localhost:8081/orders/completed')
    this.setState({ loading: false, orders_completed: completed.data })
  }

  componentDidMount() {
    this.getOrdersInProgress()
    this.getOrdersCompleted()
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
        <Link to="./orders/add">
          <Button className="float-right mr-5 mb-2" variant="success">Create Order</Button>
        </Link>

        <Tabs defaultActiveKey="all-tab" id="uncontrolled-tab-example">
          <Tab eventKey="all-tab" title="In Progress">
            <div className="mx-5">
              <h5>In Progress</h5>
              <Table columns={columns} data={this.state.orders_inProgress} formType="Order" />
            </div>
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <div className="mx-5">
            <h5>Completed</h5>
              <Table columns={columns} data={this.state.orders_completed} formType="Order" />
            </div>
          </Tab>
        </Tabs>

      </div>
    )
  }
}