import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class OrderManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeData: [],
      rejectData: [],
      emergencyData: [],
      processingData: [],
      completedData: [],
      loading: true,
      showModal: false,

      errorStatus: '',

      statusActive: 'Active',
      statusCompleted: 'Completed',
      statusEmergency: 'Emergency',
      statusRejected: 'Rejected',
      statusProcessing: 'Processing'
    }

  }

  getOrderData = async () => {
    const orderRes = await axios.get(`http://localhost:8081/orders/status/${this.state.statusActive}`)
    this.setState({ loading: false, activeData: orderRes.data })
  }

  getRejectedData = async () => {
    const rejectRes = await axios.get(`http://localhost:8081/orders/status/${this.state.statusRejected}`)
    this.setState({ rejectData: rejectRes.data })
  }

  getEmergencyData = async () => {
    const emergencyRes = await axios.get(`http://localhost:8081/orders/status/${this.state.statusEmergency}`)
    this.setState({ emergencyData: emergencyRes.data })
  }

  getProcessingData = async () => {
    const processingRes = await axios.get(`http://localhost:8081/orders/status/${this.state.statusProcessing}`)
    this.setState({ processingData: processingRes.data })
  }

  getCompletedData = async () => {
    const completedRes = await axios.get(`http://localhost:8081/orders/status/${this.state.statusCompleted}`)
    this.setState({
      loading: false,
      completedData: completedRes.data,
    })
  }

  componentDidMount() {
    this.getOrderData()
    this.getRejectedData()
    this.getEmergencyData()
    this.getProcessingData()
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

        <Tabs defaultActiveKey="processing-tab" id="uncontrolled-tab-example">

        <Tab eventKey="processing-tab" title="New Orders">
            <br />
            <div className="mx-5">
              <Table columns={columns} data={this.state.processingData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="active-tab" title="Active Orders">
            <br />
            <div className="mx-5">
              <Table columns={columns} data={this.state.activeData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <br />
            <div className="mx-5">
              <Table columns={columns} data={this.state.completedData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="rejected-tab" title="Rejected Orders">
            <br />
            <div className="mx-5">
              <Table columns={columns} data={this.state.rejectData} formType="Order" tRole="Admin" />
            </div>
          </Tab>

          <Tab eventKey="emergency-tab" title="Emergency Status">
            <br />
            <div className="mx-5">
              <Table columns={columns} data={this.state.emergencyData} formType="Order" tRole="Admin" />
            </div>
          </Tab>
        </Tabs>

      </div>
    )
  }
}
