import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class OrderManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderData: [],
      rejectData: [],
      emergencyData: [],
      completedData: [],
      loading: true,
      showModal: false,

      errorStatus: '',

      statusCompleted: 'Completed',
      statusEmergency: 'Emergency',
      statusRejected: 'Rejected'
    }
  }

  getOrderData = async () => {
    const orderRes = await axios.get('http://localhost:8081/orders')
    this.setState({ loading: false, orderData: orderRes.data })
  }

  getRejectedData = async () => {
    const rejectRes = await axios.get(`http://localhost:8081/admin/order-manager/${this.statusRejected}`)
    this.setState({ rejectData: rejectRes.data })
  }

  getEmergencyData = async () => {
    const emergencyRes = await axios.get(`http://localhost:8081/admin/order-manager/${this.statusEmergency}`)
    this.setState({ emergencyData: emergencyRes.data })
  }

  getCompletedData = async () => {
    const completedRes = await axios.get(`http://localhost:8081/orders/search/${this.state.statusCompleted}`)
    this.setState({
      loading: false,
      completedData: completedRes.data,
    })
  }

  componentDidMount() {
    this.getOrderData()
    this.getRejectedData()
    this.getEmergencyData()
    this.getCompletedData()
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
        <br></br>
        <h1>Order Manager</h1>
        <br></br>

        <Tabs defaultActiveKey="all-tab" id="uncontrolled-tab-example">
          <Tab eventKey="all-tab" title="All Orders">
            <div className="mx-5">
              <h5>All Orders</h5>
              <Table columns={columns} data={this.state.orderData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <div className="mx-5">
              <h5>Completed Orders</h5>
              <Table columns={columns} data={this.state.completedData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="rejected-tab" title="Rejected Orders">
            <div className="mx-5">
              <h5>Rejected Orders</h5>
              <Table columns={columns} data={this.state.rejectData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="emergency-tab" title="Emergency Status">
            <div className="mx-5">
              <h5>Emergency Status</h5>
              <Table columns={columns} data={this.state.emergencyData} formType="Order" tRole="Admin" />
            </div>
          </Tab>
        </Tabs>

      </div>
    )
  }
}
