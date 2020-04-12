import React, { useContext, useRef } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import { SearchContext } from "./index";
import { useEffect } from "react";

function smoothScrollTo(elToScroll, elToScrollTo, offset) {
  const y1 = elToScroll.scrollTop;
  const y2 = offset ? elToScrollTo.offsetTop + offset : elToScrollTo.offsetTop;
  const distance = Math.abs(y2 - y1);
  const direction = y2 > y1 ? "down" : "up";
  const t1 = performance.now();
  const t2 = 400;
  const easingFn = (t) => t * (2 - t);

  const tick = () => {
    const elapsed = performance.now() - t1;
    const progress = Math.min(elapsed / t2, 1);
    const temp = easingFn(progress) * distance;
    const y = direction === "down" ? y1 + temp : y1 - temp;

    if (progress < 1) {
      elToScroll.scrollTop = y;
      requestAnimationFrame(tick);
    } else {
      elToScroll.scrollTop = y2;
    }
  };

  if (distance === 0) {
    return;
  }

  requestAnimationFrame(tick);
}

export default function SearchResults() {
  const { searchResults, error, activeIndex } = useContext(SearchContext);

  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const activeResult = scrollArea.childNodes[activeIndex];

    if (!activeResult) return;
    const offset =
      window.innerWidth < 992 ? 0 : -(activeResult.offsetHeight + 12);
    smoothScrollTo(scrollArea, activeResult, offset);
  }, [scrollAreaRef, activeIndex]);

  return (
    <div className="results">
      <div className="results-inner" ref={scrollAreaRef}>
        {searchResults.length > 0 &&
          searchResults.map((item, index) => (
            <ResultItem key={item.id} item={item} index={index} />
          ))}
        {error === "error-no-results" && (
          <p
            className="text-center text-white mb-0"
            style={{ width: "100%" }}
          >{`Sorry, there were no results found near you.`}</p>
        )}
      </div>
    </div>
  );
}

function ResultItem({ item, index }) {
  const { activeIndex, setActiveIndex } = useContext(SearchContext);
  const { distance } = item;
  const { profile, products } = item.data();
  const { store, address, city } = profile;

  const getQtyLabel = (qty) => {
    if (qty === 0 || qty > 1) return " units";
    else return " unit";
    // if (pricePerLabel === "piece") return "pieces";
    // else if (pricePerLabel === "box") return "boxes";
    // else if (pricePerLabel === "pair") return "pairs";
    // else return pricePerLabel;
  };

  const getDistanceLabel = (value) => {
    if (value < 1) return Math.round(value * 1000) + " m";
    else return value.toFixed(1) + " km";
  };

  return (
    <Card
      className={`result${activeIndex === index ? " active" : ""}`}
      onClick={() => setActiveIndex(index)}
    >
      <Card.Body>
        <Row>
          <Col className="result-title h4">{store}</Col>
          <Col className="result-distance h4">{getDistanceLabel(distance)}</Col>
        </Row>
        <div className="result-address">
          <Icon type="location" />
          {address}, {city}
        </div>

        <div className="result-products">
          <Row>
            {products.map((item, index) => (
              <Col key={index}>
                <div className="result-products-item">
                  <Icon type={item.id} />
                  <div className="text">
                    <span>{item.qty}</span>
                    <span className="d-none d-sm-inline">
                      {getQtyLabel(item.qty)}
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}
