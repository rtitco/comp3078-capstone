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
      orders_processed: [],
      loading: true,
      waiting: "Awaiting Delivery",
      companyName: ''
    }
  }

  async getOrdersInProgress() {
    const inprogress = await axios.get(`http://localhost:8081/orders/status/${this.state.currentUser.company}/Incomplete`)
    this.setState({ orders_inProgress: inprogress.data })
  }

  async getOrdersCompleted() {
    const completed = await axios.get(`http://localhost:8081/orders/status/${this.state.currentUser.company}/Completed`)
    this.setState({ orders_completed: completed.data })
  }

  async getOrdersProcessed() {
    const processed = await axios.get(`http://localhost:8081/orders/status/${this.state.currentUser.company}/${this.state.waiting}`)
    this.setState({ orders_processed: processed.data })
  }

  async getCompanies() {
    let compArray = [];
    let compDict = {};

    await axios.get(`http://localhost:8081/companies`)
      .then(compData => {
        if (compData != null) {
          // Get all Companies, HOlding MONGO Data
          compArray = compData.data;

          // Loop through all companies and create dictionary of Address to Name
          compArray.forEach(company => {
            compDict[company.address] = company.company_name;
          });

          // Set it as a state, so that 
          // 1: We can use it easiler
          // 2: It forces a rerender
          this.setState({
            addressDictionary: compDict
          });
        }
      });
  }
  componentDidMount() {
    console.log(this.state.currentUser.company)
    this.getOrdersInProgress()
    this.getOrdersCompleted()
    this.getOrdersProcessed()
    this.getCompanies()
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
        Header: 'Origin',
        // CONDITION ? TRUE : FALSE
        accessor: data => ((this.state.addressDictionary && this.state.addressDictionary[data.origin_address] != null) ? this.state.addressDictionary[data.origin_address] : data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode)
      },
      {
        Header: 'Destination',
        accessor: data => ((this.state.addressDictionary && this.state.addressDictionary[data.destination_address] != null) ? this.state.addressDictionary[data.destination_address] : data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode)

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
          <Button className="float-right mr-5 mb-2 btn-top-margin">Create Order</Button>
        </Link>

        <Tabs defaultActiveKey="all-tab" id="uncontrolled-tab-example" className="py-3">
          <Tab eventKey="all-tab" title="In Progress">
            <Table columns={columns} data={this.state.orders_inProgress} formType="Order" />
          </Tab>

          <Tab eventKey="processed-tab" title="Awaiting Delivery">
            <Table columns={columns} data={this.state.orders_processed} formType="Order" />
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <Table columns={columns} data={this.state.orders_completed} formType="Order" />
          </Tab>
        </Tabs>

      </div>
    )
  }
}