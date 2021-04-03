import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'

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

      statusCompleted: 'Completed'
    }

    // this.statusEmergency = 'Emergency';
    // this.statusRejected = 'Rejected';

  }

  getOrderData = async () => {
    const orderRes = await axios.get('http://localhost:8081/orders')
    this.setState({ loading: false, orderData: orderRes.data })
  }

  // getRejectedData = async () => {
  //   const rejectRes = await axios.get(`http://localhost:8081/admin/order-manager/${this.statusRejected}`)
  //   this.setState({ rejectData: rejectRes.data })
  // }

  // getEmergencyData = async () => {
  //   const emergencyRes = await axios.get(`http://localhost:8081/admin/order-manager/${this.statusEmergency}`)
  //   this.setState({ emergencyData: emergencyRes.data })
  // }

  getCompletedData = async () => {
    console.log("Getting data from db")
    const completedRes = await axios.get(`http://localhost:8081/orders/search/${this.state.statusCompleted}`)
    console.log(completedRes.data)
    this.setState({
      loading: false,
      completedData: completedRes.data,
    })
  }

  componentDidMount() {
    this.getOrderData()
    // this.getRejectedData()
    // this.getEmergencyData()
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

        {/* Order Table Tabs */}
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#allOrders" type="button" role="tab" aria-controls="allOrders" aria-selected="true">
              All Orders
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completedOrders" type="button" role="tab" aria-controls="completedOrders" aria-selected="false">
              Completed Orders
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link" id="rejected-tab" data-bs-toggle="tab" data-bs-target="#rejectedOrders" type="button" role="tab" aria-controls="rejectedOrders" aria-selected="false">
              Emergency Status
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button class="nav-link" id="emergency-tab" data-bs-toggle="tab" data-bs-target="#emergencyOrders" type="button" role="tab" aria-controls="emergencyOrders" aria-selected="false">
              Emergency Status
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="allOrders" role="tabpanel" aria-labelledby="all-tab">
            <div className="mx-5">
              <h5>All Orders</h5>
              <Table columns={columns} data={this.state.orderData} formType="Order" tRole="Admin" />
            </div>

            <div className="mx-5">
              <h5>Completed Orders</h5>
              <Table columns={columns} data={this.state.completedData} formType="Order" tRole="Admin" />
            </div>

            <div className="mx-5">
              <h5>Rejected Orders</h5>
              <Table columns={columns} data={this.state.rejectData} formType="Order" tRole="Admin" />
            </div>

            <div className="mx-5">
              <h5>Emergency Status</h5>
              <Table columns={columns} data={this.state.emergencyData} formType="Order" tRole="Admin" />
            </div>
          </div>


          <div class="tab-pane fade" id="completedOrders" role="tabpanel" aria-labelledby="completed-tab">

          </div>


          <div class="tab-pane fade" id="rejectedOrders" role="tabpanel" aria-labelledby="rejected-tab">

          </div>


          <div class="tab-pane fade" id="emergencyOrders" role="tabpanel" aria-labelledby="emergency-tab">

          </div>

        </div>

      </div>
    )
  }
}
