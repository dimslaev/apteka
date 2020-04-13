import React, { useContext, useEffect, useState } from "react";
import { Col, Card } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import { SearchContext } from "./SearchProvider";
import { types } from "../../utils/types";

const defaultCounts = [];

types.forEach((item, index) => {
  defaultCounts.push({
    ...types[index],
    qty: 0,
  });
});

export default function Facets() {
  const { searchResults } = useContext(SearchContext);

  const [counts, setCounts] = useState(defaultCounts);

  useEffect(() => {
    if (!searchResults.length) {
      setCounts(defaultCounts);
      return;
    }

    const firstSearchResultProducts = searchResults[0].data().products;
    const arr = JSON.parse(JSON.stringify(firstSearchResultProducts));

    searchResults.forEach((item, index) => {
      if (index !== 0) {
        const products = item.data().products;
        products.forEach((p) => {
          arr.forEach((c) => {
            if (c.id === p.id) c.qty += p.qty;
          });
        });
      }
    });
    setCounts(arr);
  }, [searchResults]);

  return (
    <div className="facets">
      {counts.map((item) => (
        <Col key={item.id}>
          <Card className="facets-item active" key={item.id}>
            <div className="facets-item-count">
              <span className="font-14-bold text-secondary">{item.qty}</span>
            </div>
            <div className="facets-item-icon">
              <Icon type={item.id} />
            </div>
            <div className="facets-item-label text-center">
              <p className="font-12-semibold text-secondary mb-0">
                {item.label}
              </p>
            </div>
          </Card>
        </Col>
      ))}
    </div>
  );
}
