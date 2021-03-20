import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import { Redirect, Link } from "react-router-dom";
import axios from 'axios'
import Button from 'react-bootstrap/Button';

export default class UserManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: [],
      loading: true,
    }
  }


  //gets the user data from db
  async getUsersData() {
    const res = await axios.get('http://localhost:8081/users')
    console.log(res.data)
    this.setState({ loading: false, userData: res.data})
  }
  componentDidMount() {
    this.getUsersData()
  }

  
  render() {
    // columns for data table
    const columns = [
      // {
      //   Header: 'ID',
      //   accessor: '_id'
      // },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role'
      },
      {
        Header: 'Company',
        accessor: 'company',
      }
    ]

    return (
      <div>
        <h1>User Manager</h1>
        <Link to="./users/add">
          <Button className="float-right mr-5 mb-2" variant="success">Add User</Button>
        </Link>
        <div className="mx-5">
          {/* this is the data table */}
          <Table columns={columns} data={this.state.userData} />
        </div>
      </div>
    )
  }
}