import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

export default class FleetTable extends Component {
  constructor(props) {
    super(props)
    let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
    this.state = {
      currentUser: sessionUser,
      data_inService: [],
      data_maintenance: [],
      data_outOfService: [],
      loading: true
    }
  }

  async getFleetData(status) {
    let fleetRes = []

    if (status == "In Service") {
      fleetRes = await axios.get(`http://localhost:8081/fleet/${status}`)
      this.setState({ loading: false, data_inService: fleetRes.data })
    }
    else if (status == "Maintenance") {
      fleetRes = await axios.get(`http://localhost:8081/fleet/${status}`)
      this.setState({ loading: false, data_maintenance: fleetRes.data })
    }
    else if (status == "Out of Service") {
      fleetRes = await axios.get(`http://localhost:8081/fleet/${status}`)
      this.setState({ loading: false, data_outOfService: fleetRes.data })
    }
  }

  componentDidMount() {
    this.getFleetData("In Service")
    this.getFleetData("Maintenance")
    this.getFleetData("Out of Service")
  }

  render() {
    const columns = [
      {
        Header: 'Truck Class',
        accessor: 'truck_class',
      },
      {
        Header: 'Brand',
        accessor: 'vehicle_brand',
      },
      {
        Header: 'Model',
        accessor: 'vehicle_model',
      },
      {
        Header: 'Year',
        accessor: 'vehicle_year',
      },
      {
        Header: 'License Plate',
        accessor: 'license_plate',
      },
      {
        Header: 'Status',
        accessor: 'vehicle_status'
      }
    ]
    return (
      <div>
        <div>
        <label>Last Updated: {new Date().toString()}</label>
        </div>
        <Link to="./fleet/add">
          <Button className="float-right mr-5 mb-2" variant="success">Add Truck</Button>
        </Link>

        <Tabs defaultActiveKey="in-tab" id="uncontrolled-tab-example">
          <Tab eventKey="in-tab" title="In Service">
            <div className="mx-5">
              <h5>In Service</h5>
              <Table columns={columns} data={this.state.data_inService} formType="Fleet Manager" tRole="Fleet Manager" />
            </div>
          </Tab>

          <Tab eventKey="maintenance-tab" title="Maintenance">
            <div className="mx-5">
              <h5>Maintenance</h5>
              <Table columns={columns} data={this.state.data_maintenance}  formType="Fleet Manager" tRole="Fleet Manager" />
            </div>
          </Tab>

          <Tab eventKey="out-tab" title="Unavailable">
            <div className="mx-5">
              <h5>Unavailable</h5>
              <Table columns={columns} data={this.state.data_outOfService}  formType="Fleet Manager" tRole="Fleet Manager" />
            </div>
          </Tab>
        </Tabs>
      </div>
    )
  }
}