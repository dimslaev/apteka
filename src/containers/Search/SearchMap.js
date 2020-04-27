import React, { useState, useRef, useEffect, useContext } from "react";
import { SearchContext } from "./SearchProvider";
import { isEmpty } from "../../utils";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

let lastSearchResults = [];

export default function SearchMap() {
  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef(null);
  const { state, setState } = useContext(SearchContext);

  useEffect(() => {
    const {
      from,
      userPosition,
      addressPosition,
      searchResults,
      activeIndex,
    } = state;

    const position = from === "user-position" ? userPosition : addressPosition;

    if (!mapRef.current || isEmpty(position) || !position) return;

    const markers = [];
    const bounds = new mapboxgl.LngLatBounds();
    const myCoords = [position.longitude, position.latitude];

    function handleMarkerClick(e) {
      const marker = e.originalEvent.target.closest(".mapboxgl-marker");
      if (!marker) return;

      const index = +marker.dataset.index;

      setState({ ...state, activeIndex: index });
    }

    if (!mapInstance) {
      setMapInstance(initMapbox(mapRef.current, position));
      return;
    }

    const markerMe = initMarker(mapInstance, myCoords, -1, activeIndex);

    markers.push(markerMe);
    bounds.extend(myCoords);

    if (searchResults.length > 0) {
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
    }

    mapInstance.on("load", () => {
      mapInstance.on("click", handleMarkerClick);
    });

    return function cleanup() {
      markers.forEach((item) => {
        if (item._element) item._element.parentNode.removeChild(item._element);
      });

      if (mapInstance) mapInstance.off("click");

      if (window.location.pathname.indexOf("search") === -1) {
        mapInstance.remove();
      }
    };
  }, [mapRef, mapInstance, state, setState]);

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
