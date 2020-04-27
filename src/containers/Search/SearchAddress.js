import React, { useState, useRef, useContext } from "react";
import { Col, Form, Modal, Button } from "react-bootstrap";
import ButtonLoader from "../../components/base/ButtonLoader";
import { SearchContext, getSearchResults } from "./SearchProvider";
import axios from "axios";
import { isEmpty } from "../../utils";

const defaultErrors = {
  no: false,
  street: false,
  city: false,
  wrongAddress: false,
};

export default function SearchAddress(props) {
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState(defaultErrors);

  const { state, setState } = useContext(SearchContext);
  const { address, addressPosition, addressModal, product, radius } = state;

  const firstInput = useRef(null);

  const handleFieldChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setState({ ...state, address: { ...address, [id]: value } });
  };

  const handleFieldFocus = () => {
    setFormErrors(defaultErrors);
  };

  const handleAddressModalShow = () => {
    const firstInput = document.getElementById("no");
    firstInput.focus();
  };

  const handleAddressModalClose = () => {
    console.log("here");
    if (isEmpty(addressPosition)) {
      setState({ ...state, from: "user-position" });
      sessionStorage.setItem("from", "user-position");
    }
    setState({ ...state, addressModal: false });
  };

  const validateForm = () => {
    const cloneErrors = { ...formErrors };

    if (!address.no.length) cloneErrors.no = true;
    else cloneErrors.no = false;

    if (address.street.length < 2) cloneErrors.street = true;
    else cloneErrors.street = false;

    if (address.city.length < 2) cloneErrors.city = true;
    else cloneErrors.city = false;

    setFormErrors(cloneErrors);

    return !cloneErrors.no && !cloneErrors.street && !cloneErrors.city;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);

    const auth = process.env.REACT_APP_GEOCODE_KEY;
    const url = process.env.REACT_APP_GEOCODE_URL;

    const params = {
      auth,
      locate: `${address.no} ${address.street}, ${address.city}`,
      json: "1",
    };

    const response = await axios.get(url, { params });

    if (response.status === 200) {
      if (
        response.data.standard.confidence >= 0.9 ||
        response.data.remaining_credits === 0
      ) {
        const position = {
          latitude: response.data.latt,
          longitude: response.data.longt,
          city: response.data.standard.city,
        };

        sessionStorage.setItem("address-position", JSON.stringify(position));
        sessionStorage.setItem("address", JSON.stringify(address));
        handleAddressModalSubmit(position);
      } else {
        setFormErrors({ ...formErrors, wrongAddress: true });
        setFormLoading(false);
      }
    } else {
      setFormErrors({ ...formErrors, wrongAddress: true });
      setFormLoading(false);
    }
  };

  const handleAddressModalSubmit = async (position) => {
    const coordinates = [+position.latitude, +position.longitude];
    const results = await getSearchResults(product, coordinates, radius);

    setState({
      ...state,
      addressPosition: position,
      addressModal: false,
      error: !results.length ? "error-no-results" : false,
      searchResults: !results.length ? [] : results,
      showBar: false,
      loading: false,
    });
  };

  return (
    <div>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={addressModal}
        onShow={handleAddressModalShow}
        onHide={handleAddressModalClose}
        centered
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h2" id="contained-modal-title-vcenter">
              Enter address
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Row>
              <Col sm={2}>
                <Form.Group>
                  <Form.Label>No</Form.Label>
                  <Form.Control
                    autoFocus
                    size="lg"
                    id="no"
                    ref={firstInput}
                    value={address.no}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                    isInvalid={formErrors.no}
                    placeholder="No"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    size="lg"
                    id="street"
                    value={address.street}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                    isInvalid={formErrors.street}
                    placeholder="Street"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    size="lg"
                    id="city"
                    value={address.city}
                    onChange={handleFieldChange}
                    onFocus={handleFieldFocus}
                    isInvalid={formErrors.city}
                    placeholder="City"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Form.Row>

            {formErrors.wrongAddress && (
              <p className="text-danger text-center font-12-regular mb-4">
                Sorry, we couldn't find this address. Please try again.
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="default" onClick={handleAddressModalClose}>
              Close
            </Button>
            <ButtonLoader
              type="submit"
              loading={formLoading}
              disabled={formLoading}
            >
              Submit
            </ButtonLoader>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
