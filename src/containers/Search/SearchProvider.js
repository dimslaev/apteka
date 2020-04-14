import React, { useState, useEffect } from "react";
import Modal from "../../components/base/Modal";
import axios from "axios";
import firebase from "firebase/app";
import { geocollectionProviders } from "../../AccountStore";

export const SearchContext = React.createContext(null);

const defaultModal = {
  show: false,
  title: "",
  content: "",
};

const defaultAddress = {
  no: "",
  street: "",
  city: "",
};

sessionStorage.setItem("from", "address-position");
sessionStorage.setItem(
  "address",
  JSON.stringify({
    no: "10",
    street: "Timok",
    city: "Plovdiv",
  }),
);
sessionStorage.setItem(
  "address-position",
  JSON.stringify({
    latitude: "42.15530",
    longitude: "24.73505",
    city: "Plovdiv",
  }),
);

export default function SearchProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);

  const [userPosition, setUserPosition] = useState(
    JSON.parse(sessionStorage.getItem("user-position")),
  );

  const [address, setAddress] = useState(
    JSON.parse(sessionStorage.getItem("address")) || defaultAddress,
  );

  const [addressPosition, setAddressPosition] = useState(
    JSON.parse(sessionStorage.getItem("address-position")),
  );

  const [addressModal, setAddressModal] = useState(false);

  const [showBar, setShowBar] = useState(true);

  const [product, setProduct] = useState(
    sessionStorage.getItem("product") || "mask",
  );

  const [radius, setRadius] = useState(
    JSON.parse(sessionStorage.getItem("radius")) || 1,
  );

  const [from, setFrom] = useState(
    sessionStorage.getItem("from") || "user-position",
  );

  const [loading, setLoading] = useState(false);

  const [filterFacets, setFilterFacets] = useState({
    mask: true,
    gloves: true,
    sanitizer: true,
    vitaminC: true,
    vitaminD: true,
    vitaminZn: true,
  });

  const [error, setError] = useState(false);

  const [modal, setModal] = useState(defaultModal);

  const [activeIndex, setActiveIndex] = useState(-1);

  async function submitSearch(e) {
    if (e) e.preventDefault();
    if (loading) return;

    if (
      (from === "user-position" && !userPosition) ||
      (from === "address-position" && !addressPosition)
    ) {
      setModal({
        show: true,
        title: "Error",
        content: "Sorry, there was an error detecting your location.",
      });

      return;
    }

    setError(false);
    setLoading(true);

    const coordinates =
      from === "user-position"
        ? [+userPosition.latitude, +userPosition.longitude]
        : [+addressPosition.latitude, +addressPosition.longitude];

    const results = await getSearchResults(product, coordinates, radius);

    if (!results.length) {
      setError("error-no-results");
      setSearchResults([]);
    } else {
      setSearchResults(results);
    }

    setShowBar(false);
    setLoading(false);

    return results;
  }

  useEffect(() => {
    if (userPosition) return;

    getLatLng().then(function (response) {
      if (response.status === 200) {
        sessionStorage.setItem("user-position", JSON.stringify(response.data));
        if (!sessionStorage.getItem("address-position"))
          sessionStorage.setItem(
            "address-position",
            JSON.stringify(response.data),
          );

        setUserPosition(response.data);
        if (!addressPosition) setAddressPosition(response.data);
      } else {
        setModal({
          show: true,
          title: "Error",
          content: "Sorry, there was an error retrieving your location.",
        });
      }
    });
  }, [userPosition, addressPosition]);

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        submitSearch,
        showBar,
        setShowBar,
        userPosition,
        setUserPosition,
        addressPosition,
        setAddressPosition,
        product,
        setProduct,
        radius,
        setRadius,
        from,
        setFrom,
        loading,
        setLoading,
        filterFacets,
        setFilterFacets,
        error,
        setError,
        addressModal,
        setAddressModal,
        address,
        setAddress,
        activeIndex,
        setActiveIndex,
      }}
    >
      {children}
      <Modal
        show={modal.show}
        title={modal.title}
        onHide={() => setModal(defaultModal)}
      >
        {modal.content}
      </Modal>
    </SearchContext.Provider>
  );
}

function filterSortResults(searchTerm, searchResults) {
  // Return only results for searched product
  const results = searchResults.filter((item) => {
    const products = item.data().products;
    const match = products.find((p) => p.id === searchTerm);
    return match.qty > 0;
  });

  return results.sort((a, b) => a.distance - b.distance);
}

async function getSearchResults(searchTerm, coordinates, radius) {
  console.log(coordinates);
  const geosnapshot = await geocollectionProviders
    .near({
      center: new firebase.firestore.GeoPoint(coordinates[0], coordinates[1]),
      radius: +radius,
    })
    .get();

  if (!geosnapshot.docs.length) return [];

  console.log(geosnapshot.docs);

  return filterSortResults(searchTerm, geosnapshot.docs);
}

async function getLatLng() {
  const url = process.env.REACT_APP_IP_URL;
  return await axios.get(url);
}
