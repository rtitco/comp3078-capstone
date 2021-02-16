import './login.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function LoginForm() {
    return (
        <Container className="">
            <Row className="justify-content-md-center">
                <Col className="login-boxp-5" md="6">
                <h1 className="h3">Geebee Shipping Solutions</h1>
                <h2 className="h4">Login</h2>
                <hr/>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" className="btn-block" type="submit">
                        Submit
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;