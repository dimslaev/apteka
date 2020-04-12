import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../../components/app/Header";
import Footer from "../../components/app/Footer";
import Icon from "../../components/base/Icon";
import { types } from "../../utils/types";

export default function Home() {
  return (
    <div className="home">
      <Header />

      <main>
        <Container>
          <h1 className="hero-title text-white text-center font-40-light">
            Find anti-viral products near you
          </h1>
          <Row>
            <Col xs={12} lg={{ span: 8, offset: 2 }}>
              <Row className="facets mb-4 mb-md-5">
                {types.map((item) => (
                  <Col key={item.id}>
                    <Card className="facets-item active" key={item.id}>
                      <div className="facets-item-icon">
                        <Icon type={item.id} />
                      </div>
                      <div className="facets-item-label text-center">
                        <p className="font-12-semibold text-secondary mb-0">
                          {item.label}
                        </p>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="plans">
                <Col md={6}>
                  <Card className="plan first">
                    <Card.Header className="plan-header text-center">
                      <Icon
                        type="user"
                        color="#359ECD"
                        className="plan-icon mb-3"
                      />
                      <p className="plan-title font-16-semibold mb-0">
                        I'm searching for anti-viral products
                      </p>
                    </Card.Header>
                    <Card.Body className="plan-body">
                      <ul className="plan-list">
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>
                            Search for masks, sanitizers, gloves, and vitamins.
                          </p>
                        </li>
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>Find pharmacies closest to your home.</p>
                        </li>
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>Know quantity and price in advance.</p>
                        </li>
                      </ul>
                    </Card.Body>

                    <Card.Footer className="plan-footer">
                      <Button block href="/search">
                        Go to Search page
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="plan last">
                    <Card.Header className="plan-header text-center">
                      <Icon
                        type="store"
                        color="#359ECD"
                        className="plan-icon mb-3"
                      />
                      <p className="plan-title font-16-semibold mb-0">
                        I'm selling anti-viral products
                      </p>
                    </Card.Header>
                    <Card.Body className="plan-body">
                      <ul className="plan-list">
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>Get discovered by customers searching online.</p>
                        </li>
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>
                            Update stock quantities and prices using your
                            dashboard.
                          </p>
                        </li>
                        <li className="plan-list-item active">
                          <Icon type="check" color="#359ECD" />
                          <p>
                            Decrease number of random customers when you don't
                            have supply.
                          </p>
                        </li>
                      </ul>
                    </Card.Body>

                    <Card.Footer className="plan-footer">
                      <Button block href="/register">
                        Register as a Pharmacy
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
