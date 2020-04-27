import React, { useState, useContext } from "react";
import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import ButtonLoader from "../components/base/ButtonLoader";
import { Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Icon from "../components/base/Icon";
import { useFormFields, validateEmail } from "../utils";
import { AccountContext } from "../AccountStore";
import { useHistory } from "react-router-dom";

const defaultErrors = {
  email: false,
  emailExists: false,
  password: false,
  passwordWeak: false,
  server: false,
};

const defaultFormFields = {
  email: "",
  password: "",
};

export default function Register(props) {
  const [loading, setLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields(defaultFormFields);
  const [errors, setErrors] = useState(defaultErrors);
  const { signUp } = useContext(AccountContext);
  const history = useHistory();

  const validateForm = () => {
    const invalidEmail = !validateEmail(fields.email);
    const invalidPassword = fields.password.length < 6;

    setErrors({
      ...errors,
      email: invalidEmail,
      password: invalidPassword,
    });

    return !invalidEmail && !invalidPassword;
  };

  const handleFieldFocus = (e) => {
    setErrors(defaultErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || !validateForm()) return;

    setErrors(defaultErrors);
    setLoading(true);

    const credentials = {
      email: fields.email,
      password: fields.password,
    };

    const response = await signUp(credentials);
    console.log("register.js", response);

    setLoading(false);

    handlResponse(response);
  };

  const handlResponse = async (response) => {
    if (response.user) {
      history.push("/dashboard");
    } else if (response.code === "auth/email-already-in-use") {
      setErrors({ ...defaultErrors, emailExists: true });
    } else if (response.code === "auth/weak-password") {
      setErrors({ ...defaultErrors, passwordWeak: response.message });
    } else {
      setErrors({ ...defaultErrors, server: true });
    }
  };

  return (
    <>
      <Header />
      <main>
        <Container>
          <div className="login">
            <div className="login-content modal-content">
              <div className="login-header modal-header text-center d-block">
                <Icon type="user" />
                <h3 className="mb-0">Pharmacy Registration</h3>
              </div>
              <Form className="login-body modal-body" onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter your email"
                    autoFocus
                    value={fields.email}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                    isInvalid={errors.email}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      Email is invalid.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label className="d-flex justify-content-between">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={fields.password}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                    isInvalid={errors.password}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      Password is invalid.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {errors.emailExists && (
                  <p className="text-danger text-center font-12-regular mb-4">
                    An account with this email already exists. Please{" "}
                    <Link to="/login">sign in</Link> instead.
                  </p>
                )}

                {errors.passwordWeak && (
                  <p className="text-danger text-center font-12-regular mb-4">
                    {errors.passwordWeak}
                  </p>
                )}

                {errors.server && (
                  <p className="text-danger text-center font-12-regular mb-4">
                    There was an error connecting to our server. Please try
                    again later.
                  </p>
                )}

                <ButtonLoader
                  type="submit"
                  block
                  className="mb-4"
                  loading={loading}
                >
                  Register
                </ButtonLoader>

                <p className="text-center text-muted font-12-regular mb-0">
                  Already have an accoun't? <Link to="/login">Sign In</Link>
                </p>
              </Form>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
