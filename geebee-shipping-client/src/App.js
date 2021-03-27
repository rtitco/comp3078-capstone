import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LoginForm from './components/shared/login/login';
import ProfileForm from './components/shared/profile/profile';
import AdminDashboard from './components/admin/dashboard/admin-dashboard';
import ClientDashboard from './components/client/dashboard/dashboard';
import CreateUserForm from './components/admin/forms/create/create-user';

import CreateTruckForm from './components/client/forms/create-truck';
import EditTruckForm from './components/client/forms/edit-truck';

import CreateOrderForm from './components/client/forms/create-order';



function App() {
  return (
      <Router>
        <Switch>
           <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={LoginForm} />
          <Route path="/profile" component={ProfileForm} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/client" component={ClientDashboard} />
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
