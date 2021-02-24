import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 

function AdminSideNav() {
    return (
<<<<<<< HEAD
        <div id="mySidenav" class="sidenav py-4">
=======
        <div id="mySidenav" className="sidenav mt-5 py-4">
>>>>>>> 8ec34bb83351c88fe384c2c262895078d4a2fd5a
        <a href="#">User Manager</a>
        <a href="./admin/company-manager">Company Manager</a>
        <a href="#">System Manager</a>
      </div>
    );
}

export default AdminSideNav;