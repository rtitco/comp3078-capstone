import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class RetailTable extends Component {
  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))

    this.state = {
      currentUser: sessionUser,
      data_completed: [],
      data_inProgress: [],
      loading: true,
      currentDate: new Date().toString()
    }
  }

  //get orders for current store
  async getOrderData(orderProgress, address) {
    let orderRes = []

    if (orderProgress == "Completed") {
      orderRes = await axios.get(`http://localhost:8081/orders/address/${orderProgress}/${address}`)
      this.setState({ loading: false, data_completed: orderRes.data })
    }
    else {
      orderRes = await axios.get(`http://localhost:8081/orders/address/${orderProgress}/${address}`)
      this.setState({ loading: false, data_inProgress: orderRes.data })
    }

  }

  //find address user's work address
  async getStoreAddress() {
    const userWork = await axios.get(`http://localhost:8081/companies/name/${this.state.currentUser.company}`)
    this.getOrderData("Completed", userWork.data[0].address)
    this.getOrderData("In Progress", userWork.data[0].address)
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

        <Tabs defaultActiveKey="all-tab" id="uncontrolled-tab-example">
          <Tab eventKey="all-tab" title="In Progress">
            <div className="mx-5">
              <h5>In Progress</h5>
              <Table columns={columns} data={this.state.data_inProgress} formType="Retail" tRole="Retail" />
            </div>
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <div className="mx-5">
            <h5>Completed</h5>
              <Table columns={columns} data={this.state.data_completed} formType="Retail" tRole="Retail" />
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}