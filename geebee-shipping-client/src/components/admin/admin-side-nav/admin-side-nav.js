import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
 

function AdminSideNav() {
    return (
        <div id="mySidenav" className="sidenav mt-5 py-4">
        <Link to="/admin/user-manager">User Manager</Link>
        {/* <a className="ml-4" href="./users/add">Add User</a> */}
        <Link to="../admin/company-manager">Company Manager</Link>
        {/* <a className="ml-4" href="./company-manager">Add Company</a> */}
        <Link to="#">System Manager</Link>
      </div>
    );
}

export default AdminSideNav;