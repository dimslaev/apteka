import React, { useContext, useRef } from "react";
import { Row, Col, Form, Dropdown, DropdownButton } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import ButtonLoader from "../../components/base/ButtonLoader";
import { SearchContext, getSearchResults } from "./SearchProvider";
import { types } from "../../utils/types.js";

export default function SearchBar() {
  const { state, setState } = useContext(SearchContext);
  const {
    loading,
    showBar,
    product,
    radius,
    from,
    userPosition,
    addressPosition,
  } = state;

  const formEl = useRef(null);

  const handleShowBar = () => {
    setState({ ...state, showBar: !state.showBar });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setState({ ...state, loading: true, error: false });

    const position = from === "user-position" ? userPosition : addressPosition;

    if (!position) {
      setState({
        ...state,
        modal: {
          show: true,
          title: "Error",
          content: "Sorry, there was an error retrieving your location.",
        },
      });

      return;
    }

    const coordinates = [+position.latitude, +position.longitude];
    const results = await getSearchResults(product, coordinates, radius);

    setState({
      ...state,
      error: !results.length ? "error-no-results" : false,
      searchResults: !results.length ? [] : results,
      showBar: false,
      loading: false,
    });
  }

  return (
    <Row>
      <Col xl={{ span: 10 }}>
        <Form
          className={`search-bar${!showBar ? " hidden" : ""}`}
          onSubmit={handleSubmit}
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
  const { state, setState } = useContext(SearchContext);
  const { from } = state;

  const handleFromChange = (e) => {
    const value = e.target.value;
    sessionStorage.setItem("from", e.target.value);

    setState({
      ...state,
      from: value,
      addressModal: value === "address-position" ? true : false,
    });
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
  const { state, setState } = useContext(SearchContext);
  const { radius } = state;

  const handleRadiusChange = (radius) => {
    setState({ ...state, radius });
    sessionStorage.setItem("radius", radius);
  };

  return (
    <Form.Group>
      <Form.Label>Within distance</Form.Label>

      <DropdownButton title={`${radius} km`} variant="default">
        {radiusOptions.map((item, index) => (
          <Dropdown.Item
            key={index}
            eventKey={item}
            onClick={() => handleRadiusChange(item)}
          >
            {item} km
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Form.Group>
  );
}

function FormGroupProduct() {
  const { state, setState } = useContext(SearchContext);
  const { product } = state;

  const handleProductChange = (id) => {
    setState({ ...state, product: id });
    sessionStorage.setItem("product", id);
  };

  return (
    <Form.Group>
      <Form.Label>I'm looking for</Form.Label>
      <DropdownButton
        title={types.find((p) => p.id === product).label}
        variant="default"
      >
        {types.map((item, index) => (
          <Dropdown.Item
            key={index}
            eventKey={item.id}
            onClick={() => handleProductChange(item.id)}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Form.Group>
  );
}
