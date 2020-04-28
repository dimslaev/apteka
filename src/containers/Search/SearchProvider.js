import React, { useState, useEffect } from "react";
import Modal from "../../components/base/Modal";
import axios from "axios";
import firebase from "firebase/app";
import { geocollectionProviders } from "../../AccountStore";

export const SearchContext = React.createContext(null);

// sessionStorage.setItem("from", "address-position");
// sessionStorage.setItem(
//   "address",
//   JSON.stringify({
//     no: "10",
//     street: "Timok",
//     city: "Plovdiv",
//   }),
// );
// sessionStorage.setItem(
//   "address-position",
//   JSON.stringify({
//     latitude: "42.15530",
//     longitude: "24.73505",
//     city: "Plovdiv",
//   }),
// );

const defaultState = {
  searchResults: [],
  userPosition: JSON.parse(sessionStorage.getItem("user-position")),
  addressPosition: JSON.parse(sessionStorage.getItem("address-position")),
  address: JSON.parse(sessionStorage.getItem("address")) || {
    no: "",
    street: "",
    city: "",
  },
  showBar: true,
  product: sessionStorage.getItem("product") || "mask",
  radius: JSON.parse(sessionStorage.getItem("radius")) || 1,
  from: sessionStorage.getItem("from") || "user-position",
  loading: false,
  facets: {
    mask: true,
    gloves: true,
    sanitizer: true,
    vitaminC: true,
    vitaminD: true,
    vitaminZn: true,
  },
  error: false,
  modal: {
    show: false,
    title: "",
    content: "",
  },
  activeIndex: 2,
};

export default function SearchProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const { userPosition, addressPosition } = state;

  useEffect(() => {
    if (userPosition && addressPosition) return;

    getLatLng().then(function (response) {
      if (response.status === 200) {
        sessionStorage.setItem("user-position", JSON.stringify(response.data));
        if (!sessionStorage.getItem("address-position"))
          sessionStorage.setItem(
            "address-position",
            JSON.stringify(response.data),
          );
        setState({
          ...state,
          userPosition: response.data,
          addressPosition: addressPosition ? addressPosition : response.data,
        });
      }
    });
  }, []);

  return (
    <SearchContext.Provider value={{ state, setState }}>
      {children}
      <Modal
        show={state.modal.show}
        title={state.modal.title}
        onHide={() =>
          setState({ ...state, modal: { show: false, title: "", content: "" } })
        }
      >
        {state.modal.content}
      </Modal>
    </SearchContext.Provider>
  );
}

export async function getSearchResults(searchTerm, coordinates, radius) {
  const geosnapshot = await geocollectionProviders
    .near({
      center: new firebase.firestore.GeoPoint(coordinates[0], coordinates[1]),
      radius: +radius,
    })
    .get();

  if (!geosnapshot.docs.length) return [];

  return filterSortResults(searchTerm, geosnapshot.docs);
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

async function getLatLng() {
  const url = process.env.REACT_APP_IP_URL;
  return await axios.get(url);
}
