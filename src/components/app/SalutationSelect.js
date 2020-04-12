import React from "react";
import { Form } from "react-bootstrap";

const options = ["Mr", "Ms", "Mrs"];

export default function SalutationSelect(props) {
  return (
    <Form.Control
      as="select"
      className="custom-select"
      value={props.value}
      onChange={props.onChange}
      onFocus={props.onFocus}
      isInvalid={props.isInvalid}
    >
      <option>Select</option>
      {options.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </Form.Control>
  );
}
