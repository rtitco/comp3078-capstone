import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserManager from '../user-manager/user-manager';
import AdminSideNav from '../admin-side-nav/admin-side-nav';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Switch to logged in header (keeping for formatting), which will have the logo at the top and the logout / profile access
import NavBarHeader from '../../shared/navbar/navbar';
import CompanyManager from '../company-manager/company-manager';

function AdminDashboard() {
    return (
        <>
            <NavBarHeader />
            <Container class="mt-4" fluid>
                <Row>
                    <Col sm="4" md="4" lg="3" xl="2">
                        {/*This will be the side navigation the routes links here must start with /dashboard/admin/ */}
                        <AdminSideNav />
                    </Col>
                    <Col sm="8" md="8" lg="9" xl="10">
                        {/*https://reactrouter.com/web/example/nesting for example of nested router
                        These routes will always start with /dashboard/admin/ as well (the default being the table view).
                        */}
                        <Switch>
                            <Route path="/dashboard/admin/" component={UserManager} />
                            <Route path="/admin/company-manager" component={CompanyManager} />
                        </Switch>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AdminDashboard;