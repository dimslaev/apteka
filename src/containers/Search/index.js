import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Header from "../../components/app/Header";
import Footer from "../../components/app/Footer";
import Modal from "../../components/base/Modal";
import SearchResults from "./SearchResults";
import SearchBar from "./SearchBar";
// import SearchFacets from "./SearchFacets";
import SearchMap from "./SearchMap";
import SearchAddress from "./SearchAddress";
import { Container } from "react-bootstrap";
import { useEffect } from "react";
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

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);

  // user position
  const [userPosition, setUserPosition] = useState(
    JSON.parse(sessionStorage.getItem("user-position")),
  );

  // address
  const [address, setAddress] = useState(
    JSON.parse(sessionStorage.getItem("address")) || defaultAddress,
  );
  const [addressPosition, setAddressPosition] = useState(
    JSON.parse(sessionStorage.getItem("address-position")),
  );
  const [addressModal, setAddressModal] = useState(false);

  // search bar
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

  const handleModalClose = () => {
    setModal(defaultModal);
  };

  const submitSearch = async (e) => {
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

    const coords =
      from === "user-position"
        ? [userPosition.latitude, userPosition.longitude]
        : [addressPosition.latitude, addressPosition.longitude];

    const setNoResults = () => {
      setError("error-no-results");
      setSearchResults([]);
      setLoading(false);
    };

    const geosnapshot = await geocollectionProviders
      .near({
        center: new firebase.firestore.GeoPoint(+coords[0], +coords[1]),
        radius: +radius,
      })
      .get();

    setShowBar(false);

    const docs = geosnapshot.docs;
    if (!docs.length) {
      setNoResults();
      return false;
    }

    const results = docs.filter((item) => {
      const products = item.data().products;
      const match = products.find((p) => p.id === product);
      return match.qty > 0;
    });

    if (results.length === 0) {
      setNoResults();
      return false;
    } else {
      const sortedResults = results.sort((a, b) => a.distance - b.distance);
      setSearchResults(sortedResults);
      setLoading(false);
      return sortedResults;
    }
  };

  useEffect(() => {
    if (userPosition) return;

    async function getLatLng() {
      const url = process.env.REACT_APP_IP_URL;
      const response = await axios.get(url);

      console.log(response.data);

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
    }

    getLatLng();
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
      <Header />
      <main className="search">
        <Container fluid>
          <SearchBar />
          <SearchAddress />
        </Container>

        <div className="search-content">
          {/* <SearchFacets /> */}
          <Row noGutters>
            <Col lg={{ span: 6 }} className="search-content-map">
              <SearchMap />
            </Col>
            <Col lg={{ span: 6 }} className="search-content-sidebar">
              <SearchResults />
            </Col>
          </Row>
        </div>
      </main>
      <Modal show={modal.show} title={modal.title} onHide={handleModalClose}>
        {modal.content}
      </Modal>
      <Footer userPosition={userPosition} />
    </SearchContext.Provider>
  );
}
