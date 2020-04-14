import React from "react";
import { Col, Card } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import { types } from "../../utils/types";
import { isEmpty, clsx } from "../../utils";

const defaultCounts = [];

types.forEach((item, index) => {
  defaultCounts.push({
    ...types[index],
    qty: 0,
  });
});

export default function Facets({ counts, className = "" }) {
  return (
    <div className={clsx(["facets", className])}>
      {defaultCounts.map((item, index) => (
        <Col key={item.id}>
          <Card className="facets-item active" key={item.id}>
            <div className="facets-item-count">
              <span>{!isEmpty(counts) ? counts[index].qty : item.qty}</span>
            </div>
            <div className="facets-item-icon">
              <Icon type={item.id} />
            </div>
          </Card>
        </Col>
      ))}
    </div>
  );
}
