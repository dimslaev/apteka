import React, { useContext } from "react";
import { Container, Row, Dropdown, Nav } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Logo from "../../images/logo.svg";
import Icon from "../base/Icon";
import { AccountContext } from "../../AccountStore";

export default function Header({ inverted = false }) {
  const { user, signOut } = useContext(AccountContext);
  const history = useHistory();

  function isNavItemActive(pathname) {
    return window.location.pathname === pathname;
  }

  function handleSignOut() {
    signOut();
    history.push("/");
  }

  return (
    <div
      className={`header pt-2 pb-2 pt-sm-3 pb-sm-3 ${
        inverted ? " bg-secondary" : ""
      }`}
    >
      <Container fluid>
        <Row noGutters className="align-items-center justify-content-between">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Apteka" />
            </Link>
          </div>

          <Nav>
            {user ? (
              <Dropdown as={Nav.Item} alignRight>
                <Dropdown.Toggle
                  as={Nav.Link}
                  active={isNavItemActive("/dashboard")}
                >
                  <Icon type="user" color="#CCCDCE" />
                  <span className="text">Account</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => history.push("/dashboard")}>
                    <span className="text font-14-regular">Dashboard</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleSignOut}>
                    <span className="font-14-regular">Log out</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Item>
                  <Nav.Link
                    onClick={() => history.push("/search")}
                    active={isNavItemActive("/search")}
                  >
                    <Icon type="search" color="#CCCDCE" />
                    <span className="text">Search</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    onClick={() => history.push("/login")}
                    active={isNavItemActive("/login")}
                  >
                    <Icon type="user" color="#CCCDCE" />
                    <span className="text">Pharmacy Login</span>
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Row>
      </Container>
    </div>
  );
}
