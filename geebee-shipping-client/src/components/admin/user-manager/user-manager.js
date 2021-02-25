import React, { Component } from 'react'
import Table from '../../shared/react-table/react-table'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default class UserManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: [],
      loading: true,
      showModal: false
  }
}

  handleModalShow = () =>{
    this.setState({ showModal: true})
  } 
  handleModalClose = () =>{
    this.setState({ showModal: false})
  } 

  async getUsersData() {
    const res = await axios.get('http://localhost:8081/users')
    console.log(res.data)
    this.setState({ loading: false, userData: res.data })
  }
  componentDidMount() {
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
      <>
        <h1>User Manager</h1>
        <Button onClick={this.handleModalShow} className="float-right mr-5 mb-2" variant="success">Add User</Button>{''}
        <div className="mx-5">
          <Table columns={columns} data={this.state.userData} />
        </div>


        <Modal
        show={this.state.showModal}
        onHide={this.handleModalClose}
        backdrop="static"
        className="mt-5"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleModalClose}>
            Close
          </Button>
          <Button variant="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
      </>

    )
  }
}