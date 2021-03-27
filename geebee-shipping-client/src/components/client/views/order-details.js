import { Redirect, Link } from "react-router-dom";
import React, { Component } from 'react';

class ViewOrderDetails extends Component {
    constructor() {
        super()
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            
        }
    }

}

export default ViewOrderDetails;