import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AccountContext } from "../../AccountStore";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(AccountContext);

  return (
    <Route
      {...rest}
      render={props =>
        user === "" ? (
          <div>loading</div>
        ) : user !== null ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
