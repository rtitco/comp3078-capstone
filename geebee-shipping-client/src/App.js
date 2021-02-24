import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginForm from './components/shared/login/login';
import RegisterForm from './components/shared/register/register';
import DashboardPage from './components/shared/dashboard/dashboard';
import AdminDashboard from './components/admin/admin-dashboard/admin-dashboard';


function App() {
  return (
      <Router>
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/admin" component={AdminDashboard} />
        </Switch>
      </Router>
  );
}

export default App;
