import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AccountStore from "./AccountStore";
import PrivateRoute from "./components/app/PrivateRoute";
import UnprotectedRoute from "./components/app/UnprotectedRoute";
import Home from "./containers/Home";
import Dashboard from "./containers/Dashboard";
import Search from "./containers/Search";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Register from "./containers/Register";
// import ForgotPassword from "./containers/ForgotPassword";
import "./styles/app.scss";

const App = () => {
  // useEffect(() => {
  //   // ReactGA.initialize("UA-145344961-1", {
  //   //   debug: true,
  //   //   gaOptions: { siteSpeedSampleRate: 100 }
  //   // });
  // }, []);

  return (
    <div className="app">
      <AccountStore>
        <BrowserRouter>
          <Route
            render={({ location }) => (
              <Switch location={location}>
                <Route exact path="/" component={Home} />
                <Route exact path="/search" component={Search} />
                <UnprotectedRoute exact path="/register" component={Register} />
                <UnprotectedRoute exact path="/login" component={Login} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route component={() => <NotFound />} />
              </Switch>
            )}
          />
        </BrowserRouter>
      </AccountStore>
    </div>
  );
};

export default App;
