import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import LoginForm from './components/shared/login/login';
import ProfileForm from './components/shared/profile/profile';
import DashboardPage from './components/shared/dashboard/dashboard';
import AdminDashboard from './components/admin/admin-dashboard/admin-dashboard';


function App() {
  return (
      <Router>
        <Switch>
           <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={LoginForm} />
          <Route path="/profile" component={ProfileForm} />
          <Route path="/dashboard/admin" component={AdminDashboard} />
        </Switch>
      </Router>
  );
}

export default App;
