import { Redirect } from "react-router-dom";
import React, { Component } from 'react';
import axios from 'axios'

class DeleteAnyEntry extends Component {

    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            rowData: props.location.state.data,
            deleteType:props.location.state.deleteType,
            processComplete: false,
            pathEnding:""
        }

    }

    componentDidMount(){
        if(this.state.deleteType === "Company"){
            axios.post('http://localhost:8081/admin/company-manager/delete', this.state.rowData)
                .then(res => {
                    this.setState({
                        processComplete:true,
                        pathEnding:"company-manager"
                    })
                }, (error) => {
                   alert("Delete failed");
                })
        }else if(this.state.deleteType === "User"){
            axios.post('http://localhost:8081/admin/user-manager/delete', this.state.rowData)
                .then(res => {
                    this.setState({
                        processComplete:true,
                        pathEnding:"user-manager"
                    })
                }, (error) => {
                   alert("Delete failed");
                })
        }
    }
    render() {
        if (this.state.processComplete) {
            return <Redirect to={'/admin/' + this.state.pathEnding} />
        } 

        return (
            <div>
            </div>
        );
    }
}

export default DeleteAnyEntry;
