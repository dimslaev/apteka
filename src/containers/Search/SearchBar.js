import React, { useContext, useRef } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Icon from "../../components/base/Icon";

import ButtonLoader from "../../components/base/ButtonLoader";
import { SearchContext } from "./index";
import { types } from "../../utils/types.js";
const radiusOptions = [0.5, 1, 3, 5, 10, 1000];

export default function SearchBar() {
  const {
    loading,
    setAddressModal,
    submitSearch,
    showBar,
    setShowBar,
    product,
    setProduct,
    radius,
    setRadius,
    from,
    setFrom,
  } = useContext(SearchContext);

  const formEl = useRef(null);

  const handleProductChange = (e) => {
    setProduct(e.target.value);
    sessionStorage.setItem("product", e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(e.target.value);
    sessionStorage.setItem("radius", e.target.value);
  };

  const handleFromChange = (e) => {
    setFrom(e.target.value);
    sessionStorage.setItem("from", e.target.value);

    if (e.target.value === "address-position") {
      setAddressModal(true);
    }
  };

  const handleShowBar = () => {
    setShowBar(!showBar);
  };

  // useEffect(() => {
  //   let lastScroll = 0;
  //   const root = document.getElementById("root");
  //   const handleScroll = (e) => {
  //     const scrollTop = e.target.scrollTop;
  //     const direction = scrollTop > lastScroll ? "down" : "up";
  //     const oppositeDirection = direction === "down" ? "up" : "down";
  //     const className = "scrolling-" + direction;
  //     const oppositeClassname = "scrolling-" + oppositeDirection;

  //     if (scrollTop < 10) {
  //       root.classList.remove("scrolling-down");
  //     } else {
  //       if (!root.classList.contains(className)) {
  //         root.classList.remove(oppositeClassname);
  //         root.classList.add(className);
  //       }
  //     }

  //     lastScroll = scrollTop;
  //   };
  //   root.addEventListener("scroll", handleScroll);

  //   return function cleanup() {
  //     root.removeEventListener("scroll", handleScroll);
  //     root.classList.remove("scrolling-down");
  //     root.classList.remove("scrolling-up");
  //   };
  // }, []);

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
              </Col>
              <Col xs={6} md={3}>
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
              </Col>
              <Col xs={12} md={3}>
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
              </Col>
              <Col xs={12} md={3}>
                <ButtonLoader
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  block
                >
                  {/* {from === "address-position" && addressPosition
              ? `Search near ${address.no} ${address.street}, ${address.city}`
              : from === "user-position" && userPosition
              ? `Search near GPS [${userPosition.latitude}, ${userPosition.longitude}]`
              : `Search`} */}
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
