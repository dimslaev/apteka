import React, { useState, useRef, useEffect, useContext } from "react";
import { SearchContext } from "./SearchProvider";
import { isEmpty } from "../../utils";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

let lastSearchResults = [];
let markers = [];

export default function SearchMap() {
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef(null);
  const { state, setState } = useContext(SearchContext);
  const {
    from,
    userPosition,
    addressPosition,
    activeIndex,
    searchResults,
  } = state;
  const position = from === "user-position" ? userPosition : addressPosition;

  const handleMarkerClick = (e) => {
    const markerEl = e.originalEvent.target.closest(".mapboxgl-marker");
    if (!markerEl) return;
    setState({ activeIndex: +markerEl.dataset.index });
  };

  // Init map instance
  useEffect(() => {
    if (!mapRef.current || isEmpty(position) || !position) return;

    if (!mapInstance) {
      setMapInstance(initMapbox(mapRef.current, position));
      return;
    }

    return function cleanup() {
      if (window.location.pathname.indexOf("search") === -1) {
        mapInstance.remove();
      }
    };
  }, [mapRef, mapInstance, position]);

  // Attach marker click handler
  useEffect(() => {
    if (!mapInstance || !searchResults.length) return;

    mapInstance.on("click", handleMarkerClick);

    return function cleanup() {
      mapInstance.off("click", handleMarkerClick);
    };
  }, [mapInstance, searchResults, handleMarkerClick]);

  // Create me marker
  useEffect(() => {
    if (!mapInstance) return;

    const myCoords = [position.longitude, position.latitude];
    const markerMe = initMarker(mapInstance, myCoords, -1);

    return function cleanup() {
      markerMe.remove();
    };
  }, [mapInstance, searchResults, position]);

  // Create search results marker
  useEffect(() => {
    if (!mapInstance || !searchResults.length) return;

    const bounds = new mapboxgl.LngLatBounds();

    searchResults.forEach(function (item, index) {
      const coords = [
        item.data().coordinates.longitude,
        item.data().coordinates.latitude,
      ];
      const marker = initMarker(mapInstance, coords, index, activeIndex);
      markers.push(marker);
      bounds.extend(coords);
    });

    if (searchResults !== lastSearchResults) {
      mapInstance.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        easing(t) {
          return t * (2 - t);
        },
      });
      lastSearchResults = searchResults;
    }

    return function cleanup() {
      markers.forEach((item) => {
        item.remove();
      });
      markers = [];
    };
  }, [mapInstance, searchResults]);

  // On active index change
  useEffect(() => {
    if (!mapInstance || !markers.length) return;

    markers.forEach((item) => {
      item.remove();
    });

    searchResults.forEach(function (item, index) {
      const coords = [
        item.data().coordinates.longitude,
        item.data().coordinates.latitude,
      ];
      const marker = initMarker(mapInstance, coords, index, activeIndex);

      if (index === activeIndex) {
        mapInstance.flyTo({ center: coords });
      }

      markers.push(marker);
    });
  }, [mapInstance, activeIndex]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map"></div>
    </div>
  );
}

function initMapbox(el, position) {
  return new mapboxgl.Map({
    container: el,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [position.longitude, position.latitude],
    zoom: 14,
    height: 400,
  });
}

function initMarker(mapInstance, coords, index, activeIndex) {
  const marker = new mapboxgl.Marker({
    color:
      index === -1 ? "#ff5f29" : index === activeIndex ? "#274462" : "#359ecd",
  })
    .setLngLat(coords)
    .addTo(mapInstance);

  const markerEl = marker.getElement();
  markerEl.dataset.index = index;

  if (index === activeIndex) markerEl.style.zIndex = 2;
  if (index === -1) markerEl.classList.add("mapboxgl-marker-me");

  return marker;
}
