import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../components/app/Header";
import Footer from "../components/app/Footer";
import { useHistory } from "react-router-dom";

export default function NotFound() {
  const history = useHistory();

  return (
    <>
      <Header />
      <main>
        <Container>
          <Row>
            <Col lg={{ span: 10, offset: 1 }} xl={{ span: 8, offset: 2 }}>
              <div className="text-center pt-5">
                <h1 className="text-white font-40-light">Not Found</h1>
                <p className="text-white font-19-light mb-5">
                  Sorry, we couldn't find this page. Please try to find the
                  information you are looking for on our homepage.
                </p>

                <Button onClick={() => history.push("/")}>
                  Dimslaev Homepage
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </>
  );
}
