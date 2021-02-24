import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'


export default class UserManager extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
      loading:true
    }
  }

  async getUsersData(){
    const res = await axios.get('http://localhost:8081/users')
    console.log(res.data)
    this.setState({loading:false, data: res.data})
  }
  componentDidMount(){
    this.getUsersData()
  }

    render() { 
         const columns = [
            {
              Header: 'First Name',
              accessor: 'firstName',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
            },
            {
              Header: 'Phone #',
              accessor: 'phoneNumber',
            },
            {
              Header: 'Company',
              accessor: 'company',
            }
          ]   
    return (
      <div>
        <h1>User Manager</h1>
        <Table columns={columns} data={this.state.data} />
      </div>
    )
  }
}