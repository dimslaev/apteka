import React, { useContext, useRef, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Icon from "../../components/base/Icon";
import Facets from "../../components/app/Facets";
import { SearchContext } from "./SearchProvider";
import { smoothScrollTo } from "../../utils";

export default function SearchResults() {
  const { state } = useContext(SearchContext);
  const { searchResults, error, activeIndex } = state;
  const scrollAreaRef = useRef(null);

  console.log(searchResults);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const activeResult = scrollArea.childNodes[activeIndex];

    if (!activeResult) return;
    // const offset =
    //   window.innerWidth < 992 ? 0 : -(activeResult.offsetHeight + 12);
    smoothScrollTo(scrollArea, activeResult, 0);
  }, [scrollAreaRef, activeIndex]);

  return (
    <div className="results">
      <div className="results-inner" ref={scrollAreaRef}>
        {searchResults.length > 0 ? (
          searchResults.map((item, index) => (
            <ResultItem key={item.id} item={item} index={index} />
          ))
        ) : error === "error-no-results" ? (
          <p className="text-center text-white mb-0">{`Sorry, there were no results found near you.`}</p>
        ) : (
          <p className="text-center text-white mb-0 mt-3 mt-lg-0">{`Results will appear here.`}</p>
        )}
      </div>
    </div>
  );
}

function ResultItem({ item, index }) {
  const { state, setState } = useContext(SearchContext);
  const { activeIndex } = state;
  const { distance } = item;
  const { profile, products } = item.data();
  const { store, address, city } = profile;

  // const getQtyLabel = (qty) => {
  //   if (qty === 0 || qty > 1) return " units";
  //   else return " unit";
  //   // if (pricePerLabel === "piece") return "pieces";
  //   // else if (pricePerLabel === "box") return "boxes";
  //   // else if (pricePerLabel === "pair") return "pairs";
  //   // else return pricePerLabel;
  // };

  const getDistanceLabel = (value) => {
    if (value < 1) return Math.round(value * 1000) + " m";
    else return value.toFixed(1) + " km";
  };

  return (
    <Card
      className={`result${activeIndex === index ? " active" : ""}`}
      onClick={() => setState({ ...state, activeIndex: index })}
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
          <Facets counts={products} className="result-facets" />
        </div>
      </Card.Body>
    </Card>
  );
}
