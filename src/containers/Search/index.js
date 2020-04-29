import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/app/Header";
import Footer from "../../components/app/Footer";
import SearchResults from "./SearchResults";
import SearchFacets from "./SearchFacets";
import SearchBar from "./SearchBar";
import SearchMap from "./SearchMap";
import SearchAddress from "./SearchAddress";
import SearchProvider from "./SearchProvider";

export default function Search() {
  return (
    <SearchProvider>
      <Header />
      <main className="search">
        <Container fluid>
          <SearchBar />
          <SearchAddress />
        </Container>

        <div className="search-content">
          <Row noGutters>
            <Col lg={{ span: 6 }} className="search-content-map">
              <SearchMap />
            </Col>
            <Col lg={{ span: 6 }} className="search-content-sidebar">
              <SearchFacets />
              <SearchResults />
            </Col>
          </Row>
        </div>
      </main>
      <Footer />
    </SearchProvider>
  );
}
