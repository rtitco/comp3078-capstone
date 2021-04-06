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

  async getCompanies() {
    let compArray = [];
    let compDict = {};

    await axios.get(`http://localhost:8081/companies`)
      .then(compData => {
        if (compData != null) {
          compArray = compData.data;

          compArray.forEach(company => {
            compDict[company.address] = company.company_name;
          });

          this.setState({
            addressDictionary: compDict
          });
        }
      });
  }

  componentDidMount() {
    this.getOrderData()
    this.getRejectedData()
    this.getEmergencyData()
    this.getProcessingData()
    this.getCompletedData()
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
        accessor: data => ((this.state.addressDictionary && this.state.addressDictionary[data.origin_address] != null) ? this.state.addressDictionary[data.origin_address] : data.origin_address + ', ' + data.origin_city + ', ' + data.origin_postalCode)
      },
      {
        Header: 'Destination',
        accessor: data => ((this.state.addressDictionary && this.state.addressDictionary[data.destination_address] != null) ? this.state.addressDictionary[data.destination_address] : data.destination_address + ', ' + data.destination_city + ', ' + data.destination_postalCode)
      },
      {
        Header: 'Status',
        accessor: 'order_status',
      }
    ]
    return (
      <div>
        <Tabs defaultActiveKey="processing-tab" id="uncontrolled-tab-example" className="mt-3">

        <Tab eventKey="processing-tab" title="New Orders">
            <br />
              <Table columns={columns} data={this.state.processingData} formType="Order" tRole="Admin" />
          </Tab>

          <Tab eventKey="active-tab" title="Active Orders">
            <br />
              <Table columns={columns} data={this.state.activeData} formType="Order" tRole="Admin" />
          </Tab>

          <Tab eventKey="completed-tab" title="Completed Orders">
            <br />
              <Table columns={columns} data={this.state.completedData} formType="Order" tRole="Admin" />
          </Tab>

          <Tab eventKey="rejected-tab" title="Rejected Orders">
            <br />
              <Table columns={columns} data={this.state.rejectData} formType="Order" tRole="Admin" />
          </Tab>

          <Tab eventKey="emergency-tab" title="Emergency Status">
            <br />
              <Table columns={columns} data={this.state.emergencyData} formType="Order" tRole="Admin" />
          </Tab>
        </Tabs>

      </div>
    )
  }
}
