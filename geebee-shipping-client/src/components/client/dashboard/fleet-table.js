import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';

export default class FleetTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: true
    }
  }

  async getFleetData() {
    const fleetRes = await axios.get('http://localhost:8081/fleet')
    this.setState({ loading: false, data: fleetRes.data })
}

  componentDidMount() {
    this.getFleetData()
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
        <h1>Fleet</h1>
        <Link to="./fleet/add">
        <Button className="float-right mr-5 mb-2" variant="success">Add Truck</Button>
        </Link>
        <div className="mx-5">
        <Table columns={columns} data={this.state.data} />
        </div>
      </div>
    )
  }
}