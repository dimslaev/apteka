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
  password: false,
  wrongPassword: false,
  wrongEmail: false,
};

const defaultFormFields = {
  email: "",
  password: "",
};

export default function Login(props) {
  const [loading, setLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields(defaultFormFields);
  const [errors, setErrors] = useState(defaultErrors);
  const { signIn } = useContext(AccountContext);
  const history = useHistory();

  function validateForm() {
    const invalidEmail = !validateEmail(fields.email);
    const invalidPassword = fields.password.length === 0;

    setErrors({
      ...errors,
      email: invalidEmail,
      password: invalidPassword,
    });

    return !invalidEmail && !invalidPassword;
  }

  function handleFieldFocus(e) {
    setErrors(defaultErrors);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading || !validateForm()) return;

    setErrors(defaultErrors);
    setLoading(true);

    const credentials = {
      email: fields.email,
      password: fields.password,
    };

    const response = await signIn(credentials);

    setLoading(false);

    handleSubmitResponse(response);
  }

  async function handleSubmitResponse(response) {
    if (response.user) {
      history.push("/dashboard");
    }
    if (response.code === "auth/user-not-found") {
      setErrors({ ...errors, wrongEmail: true });
    }
    if (response.code === "auth/wrong-password") {
      setErrors({ ...errors, wrongPassword: true });
    }
  }

  return (
    <>
      <Header />
      <main>
        <Container>
          <div className="login">
            <div className="login-content modal-content">
              <div className="login-header modal-header text-center d-block">
                <Icon type="user" />
                <h3 className="mb-0">Pharmacy Login</h3>
              </div>
              <Form className="login-body modal-body" onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter email"
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
                    {/* <Link className="form-label-help" to="/forgot-password">
                      <span className="font-12-regular text-primary">
                        Forgot password?
                      </span>
                    </Link> */}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={fields.password}
                    onChange={handleFieldChange}
                    isInvalid={errors.password}
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      Password is invalid.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {errors.wrongPassword && (
                  <p className="text-danger text-center font-12-regular mb-4">
                    Password doesn't match user account.
                  </p>
                )}

                {errors.wrongEmail && (
                  <p className="text-danger text-center font-12-regular mb-4">
                    We don't have an account with this email address.
                  </p>
                )}

                <ButtonLoader
                  type="submit"
                  block
                  className="mb-4"
                  loading={loading}
                >
                  Log In
                </ButtonLoader>

                <p className="text-center text-muted font-12-regular mb-0">
                  Don't have an account? <Link to="/register">Sign Up</Link>
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
