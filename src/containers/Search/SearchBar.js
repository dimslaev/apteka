import React, { useContext, useRef } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import ButtonLoader from "../../components/base/ButtonLoader";
import { SearchContext } from "./SearchProvider";
import { types } from "../../utils/types.js";

export default function SearchBar() {
  const { loading, submitSearch, showBar, setShowBar } = useContext(
    SearchContext,
  );

  const formEl = useRef(null);

  const handleShowBar = () => {
    setShowBar(!showBar);
  };

  return (
    <Row>
      <Col lg={{ span: 12 }}>
        <Form
          className={`search-bar${!showBar ? " hidden" : ""}`}
          onSubmit={submitSearch}
          ref={formEl}
        >
          <div className="search-bar-toggle" onClick={handleShowBar}>
            <span className="h5">Search bar</span>
            <Icon type="chevron" as="button" color="#359ecd" />
          </div>
          <div className="search-bar-fields">
            <Row>
              <Col xs={6} md={3}>
                <FormGroupProduct />
              </Col>
              <Col xs={6} md={3}>
                <FormGroupDistance />
              </Col>
              <Col xs={12} md={3}>
                <FormGroupRadios />
              </Col>
              <Col xs={12} md={3}>
                <ButtonLoader
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  block
                >
                  Search
                </ButtonLoader>
              </Col>
            </Row>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

function FormGroupRadios() {
  const { from, setFrom, setAddressModal } = useContext(SearchContext);

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    sessionStorage.setItem("from", e.target.value);

    if (e.target.value === "address-position") {
      setAddressModal(true);
    }
  };

  return (
    <Form.Group className="form-radios">
      <Form.Row>
        <Col xs={3} md={12}>
          <Form.Label>From</Form.Label>
        </Col>
        <Col xs={4} md={6}>
          <Form.Check
            id="user-position"
            type="radio"
            label="My GPS"
            name="position"
            value="user-position"
            onChange={handleFromChange}
            checked={from === "user-position"}
          />
        </Col>
        <Col xs={4} md={6}>
          <Form.Check
            id="address-position"
            type="radio"
            label="Address"
            name="position"
            value="address-position"
            onChange={handleFromChange}
            checked={from === "address-position"}
          />
        </Col>
      </Form.Row>
    </Form.Group>
  );
}

function FormGroupDistance() {
  const radiusOptions = [0.5, 1, 3, 5, 10, 1000];

  const { radius, setRadius } = useContext(SearchContext);

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
    sessionStorage.setItem("radius", e.target.value);
  };

  return (
    <Form.Group>
      <Form.Label>Within distance</Form.Label>

      <Form.Control
        as="select"
        className="custom-select"
        value={radius}
        onChange={handleRadiusChange}
      >
        {radiusOptions.map((item, index) => (
          <option key={index} value={item}>
            {item} km
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

function FormGroupProduct() {
  const { product, setProduct } = useContext(SearchContext);

  const handleProductChange = (e) => {
    setProduct(e.target.value);
    sessionStorage.setItem("product", e.target.value);
  };

  return (
    <Form.Group>
      <Form.Label>I'm looking for</Form.Label>
      <Form.Control
        as="select"
        className="custom-select"
        value={product}
        onChange={handleProductChange}
      >
        {types.map((item, index) => (
          <option key={index} value={item.id}>
            {item.label}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}
