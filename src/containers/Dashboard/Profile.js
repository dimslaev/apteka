import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ButtonLoader from "../../components/base/ButtonLoader";
import firebase from "firebase/app";
import { geocollectionProviders } from "../../AccountStore";
import axios from "axios";

let defaultFields = {
  store: "",
  address: "",
  city: "",
  phone: "",
  website: "",
};

const defaultErrors = {
  store: false,
  address: false,
  city: false,
  country: false,
};

function getFieldLabel(id) {
  switch (id) {
    case "store":
      return "store name";
    default:
      return id;
  }
}

function mapFields(provider) {
  const fields = {};
  if (!Object.keys(provider.profile).length) return defaultFields;
  Object.keys(defaultFields).forEach(
    (key, value) => (fields[key] = provider.profile[key]),
  );
  return fields;
}

async function getLatLng(address, city) {
  const auth = "482633349523022941650x5143";
  const url = "https://geocode.xyz";

  const params = {
    auth,
    locate: `${address}, ${city}`,
    json: "1",
  };

  const response = await axios.get(url, { params });

  return response.data;
}

export default function Profile(props) {
  const [fields, setFields] = useState(mapFields(props.provider));
  const [errors, setErrors] = useState(defaultErrors);
  const [loading, setLoading] = useState(false);

  function handleFieldChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    const fieldsClone = { ...fields };
    fieldsClone[id] = value;
    setFields(fieldsClone);
  }

  function handleFieldFocus() {
    setErrors(defaultErrors);
  }

  function validateForm() {
    const cloneErrors = { ...errors };
    let isValid = true;
    Object.entries(fields).forEach(([key, value]) => {
      if (value.length === 0) {
        cloneErrors[key] = true;
        isValid = false;
      }
    });
    setErrors(cloneErrors);

    return isValid;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading || !validateForm() || fields === props.provider.profile) return;

    setErrors(defaultErrors);
    setLoading(true);

    if (
      fields.address !== props.provider.profile.address ||
      fields.city !== props.provider.profile.city
    ) {
      const coordinatesResponse = await getLatLng(fields.address, fields.city);
      console.log(coordinatesResponse);

      if (!coordinatesResponse.latt) {
        setLoading(false);
        props.setModalTitle("Error");
        props.setModalContent("Please check your address and city.");
        props.setModalShow(true);
        return false;
      }

      const coordinates = new firebase.firestore.GeoPoint(
        +coordinatesResponse.latt,
        +coordinatesResponse.longt,
      );

      await geocollectionProviders
        .doc(props.user.uid)
        .update({ profile: fields, coordinates });

      const doc = { ...props.provider, profile: fields, coordinates };
      localStorage.setItem("provider", JSON.stringify(doc));
    } else {
      await geocollectionProviders
        .doc(props.user.uid)
        .update({ profile: fields });
      const doc = { ...props.provider, profile: fields };
      localStorage.setItem("provider", JSON.stringify(doc));
    }

    setLoading(false);
    props.setModalTitle("Details updated");
    props.setModalContent("Your store details have been saved.");
    props.setModalShow(true);
  }

  return (
    <section id={props.id + "-section"} className="settings-section pt-3 pb-4">
      <Form onSubmit={handleSubmit}>
        <Row>
          {Object.entries(fields).map(([key, value], index) => (
            <Col md={6} key={index}>
              <Form.Group controlId={key}>
                <Form.Label>{getFieldLabel(key)}</Form.Label>
                <Form.Control
                  placeholder={`Enter ${getFieldLabel(key)}`}
                  value={value}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  isInvalid={errors[key]}
                />
                {errors[key] && (
                  <Form.Control.Feedback type="invalid">
                    Invalid {getFieldLabel(key)}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          ))}
        </Row>

        <div className="text-md-right">
          <ButtonLoader type="submit" loading={loading} disabled={loading}>
            Save Details
          </ButtonLoader>
        </div>
      </Form>
    </section>
  );
}
