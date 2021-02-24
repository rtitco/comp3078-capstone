import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 

function AdminSideNav() {
    return (
        <div id="mySidenav" class="sidenav mt-5 py-4">
        <a href="#">User Manager</a>
        <a href="#">Company Manager</a>
        <a href="#">System Manager</a>
      </div>
    );
}

export default AdminSideNav;