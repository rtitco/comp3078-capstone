import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

//Switch to logged in header (keeping for formatting), which will have the logo at the top and the logout / profile access
import LoginNavBar from '../../shared/navbar/login-navbar';
import AdminSideNav from '../admin-side-nav/admin-side-nav';
//Company
import CompanyManager from '../company-manager/company-manager';
import CreateCompany from '../company-manager/create-company';
import EditCompany from '../../admin/company-manager/edit-company';

//user
import UserManager from '../user-manager/user-manager';
import CreateUser from '../user-manager/create-user';
//orders
import OrderManager from '../order-manager/order-manager';
import CreateAdminOrder from '../order-manager/create-admin-order';
import { Component } from 'react';

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
                <LoginNavBar />
                <Container className="mt-4" fluid>
                    <Row className="">
                        <Col sm="4" md="4" lg="3" xl="2">
                            {/*This will be the side navigation the routes links here must start with /dashboard/admin/ */}
                            <AdminSideNav />
                        </Col>
                        <Col sm="8" md="8" lg="9" xl="10">
                            {/*https://reactrouter.com/web/example/nesting for example of nested router
                            These routes will always start with /dashboard/admin/ as well (the default being the table view).
                            */}
                            <Switch>
                                <Route exact path="/admin">
                                    <Redirect to="/admin/user-manager" />
                                </Route>
                                <Route exact path="/admin/user-manager" component={UserManager} />
                                <Route exact path="/admin/users/add" component={CreateUser} />

                                <Route exact path="/admin/company-manager" component={CompanyManager} />
                                <Route exact path="/admin/company-manager/add" component={CreateCompany} />
                                <Route exact path="/admin/company-manager/edit" component={EditCompany} />

                                <Route exact path="/admin/order-manager" component={OrderManager} />
                                <Route exact path="/admin/order-manager/add" component={CreateAdminOrder} />
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </div>
        )

    }
}

export default AdminDashboard;