import './dashboard.css';

import NavBarHeader from '../navbar/login-navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function DashboardPage() {
    return (
    <Container fluid className="">
            <NavBarHeader />
            <Row className="justify-content-md-center">
                <Col md="6">
                </Col>
            </Row>
        </Container>
    );
}

export default DashboardPage;