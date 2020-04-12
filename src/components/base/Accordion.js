import React from "react";
import { Accordion as AccordionBS, Card, Row } from "react-bootstrap";

export function Accordion({ children, activeKey, ...props }) {
  return (
    <AccordionBS activeKey={activeKey} {...props}>
      {children}
    </AccordionBS>
  );
}

export function AccordionItem({ children, ...props }) {
  return (
    <Card className="accordion-item" {...props}>
      {children}
    </Card>
  );
}

export function AccordionItemHeader({
  children,
  eventKey = 0,
  activeKey = 0,
  setActiveKey = () => {},
  ...props
}) {
  return (
    <Card.Header className="accordion-item-header" {...props}>
      <Row className="align-items-center">
        {children}
        {/* <Col className="accordion-item-toggle">
          <Icon
            as="button"
            type={activeKey === eventKey ? 'minus' : 'plus'}
            color="#359ecd"
            onClick={() =>
              activeKey === eventKey
                ? setActiveKey(null)
                : setActiveKey(eventKey)
            }
          />
        </Col> */}
      </Row>
    </Card.Header>
  );
}

export function AccordionItemBody({ children, eventKey = 0, ...props }) {
  return (
    <AccordionBS.Collapse eventKey={eventKey}>
      <Card.Body className="accordion-item-body" {...props}>
        {children}
      </Card.Body>
    </AccordionBS.Collapse>
  );
}
