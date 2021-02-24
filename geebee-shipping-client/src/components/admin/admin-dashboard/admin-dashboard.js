import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";

//Switch to logged in header (keeping for formatting), which will have the logo at the top and the logout / profile access
import LoginNavBar from '../../shared/navbar/login-navbar';
import CompanyManager from '../company-manager/company-manager';
import UserManager from '../user-manager/user-manager';
import AdminSideNav from '../admin-side-nav/admin-side-nav';

function AdminDashboard() {
    return (<>
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
                            <Route path="/admin/user-manager" component={UserManager} />
                            <Route path="/admin/company-manager" component={CompanyManager} />
                        </Switch>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AdminDashboard;