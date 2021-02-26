import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LoginForm from './components/shared/login/login';
import ProfileForm from './components/shared/profile/profile';
import AdminDashboard from './components/admin/admin-dashboard/admin-dashboard';
import ClientDashboard from './components/client/dashboard/dashboard';
import CreateUserForm from './components/admin/user-manager/create-user';


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
          <Route path="/dashboard" component={ClientDashboard} />
          <Route path="/admin/users/add" component={CreateUserForm} />
        </Switch>
      </Router>
  );
}

export default App;
