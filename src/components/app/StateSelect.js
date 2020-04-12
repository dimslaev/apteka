import React from 'react'
import { Form } from 'react-bootstrap'
import { states } from '../../utils'

export default function StateSelect(props) {
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
      {Object.entries(states).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </Form.Control>
  )
}
