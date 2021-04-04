import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

//Switch to logged in header (keeping for formatting), which will have the logo at the top and the logout / profile access
import LoginNavBar from '../../shared/navbar/login-navbar';
import AdminNavBar from './admin-navbar/admin-navbar';
//Company
import CompanyManager from './company-manager';
import CreateCompany from '../forms/create/create-company';
import EditCompany from '../forms/edit/edit-company';

//user
import UserManager from './user-manager';
import CreateUserForm from '../forms/create/create-user';
//orders
import OrderManager from './order-manager';
// import CreateAdminOrder from '../forms/create/create-admin-order';
import EditAdminOrder from '../forms/edit/edit-admin-order';
import { Component } from 'react';

//delete
import DeleteAnyEntry from '../../shared/react-table/delete-entry';

class AdminDashboard extends Component {

    constructor(props) {
        super(props)
        let sessionUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
        this.state = {
            currentUser: sessionUser,
            // currentUserRole: sessionUser.role,
            loading: true,
            mongoData: [],
        }
    }

    render() {
        if (this.state.currentUser == null) {
            return <Redirect to='/login' />
        }
        if (this.state.currentUser.role != "Admin") {
            return <Redirect to='/dashboard' />
        }
        return (
            <div>
                      <AdminNavBar fname={this.state.currentUser.firstName} lname={this.state.currentUser.lastName} />
                <Container className="mt-4" fluid>
                    <Row className="">
                        <Col>
                            {/*https://reactrouter.com/web/example/nesting for example of nested router
                            These routes will always start with /dashboard/admin/ as well (the default being the table view).
                            */}
                            <Switch>
                                <Route exact path="/admin">
                                    <Redirect to="/admin/user-manager" />
                                </Route>
                                <Route exact path="/admin/user-manager" component={UserManager} />
                                <Route exact path="/admin/users/add" component={CreateUserForm} />

                                <Route exact path="/admin/company-manager" component={CompanyManager} />
                                <Route exact path="/admin/company-manager/add" component={CreateCompany} />
                                <Route exact path="/admin/company-manager/edit" component={EditCompany} />

                                <Route exact path="/admin/order-manager" component={OrderManager} />
                                {/* <Route exact path="/admin/order-manager/add" component={CreateAdminOrder} /> */}
                                <Route exact path="/admin/order-manager/edit" component={EditAdminOrder} />

                                <Route exact path="/admin/row/delete" component={DeleteAnyEntry} />
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </div>
        )

    }
}

export default AdminDashboard;