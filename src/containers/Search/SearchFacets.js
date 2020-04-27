import React, { useContext, useEffect, useState } from "react";
import Facets from "../../components/app/Facets";
import { SearchContext } from "./SearchProvider";

export default function SearchFacets() {
  const [counts, setCounts] = useState({});
  const { state } = useContext(SearchContext);
  const { searchResults } = state;

  useEffect(() => {
    if (!searchResults.length) return;

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

  return <Facets counts={counts} className="results-facets d-none d-xl-flex" />;
}
