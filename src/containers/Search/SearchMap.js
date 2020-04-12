import React, { useState, useRef, useEffect, useContext } from "react";
import { SearchContext } from "./index";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGlzbGFlIiwiYSI6ImNrOG5hNDR4ZzA5enUzbm1lZmFtaGZkNDcifQ.pyAejMYB22UlrnXbQx7Qjw";

let lastSearchResults = [];

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

const inititateMapbox = (el, position) =>
  new mapboxgl.Map({
    container: el,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [position.longitude, position.latitude],
    zoom: 14,
    height: 400,
  });

export default function SearchMap() {
  const {
    from,
    userPosition,
    addressPosition,
    searchResults,
    activeIndex,
    setActiveIndex,
  } = useContext(SearchContext);

  const [mapInstance, setMapInstance] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const position = from === "user-position" ? userPosition : addressPosition;

    if (!mapRef.current || isEmpty(position)) return;

    const markers = [];

    if (!mapInstance) {
      setMapInstance(inititateMapbox(mapRef.current, position));
    } else {
      const bounds = new mapboxgl.LngLatBounds();

      const myGPSMarker = new mapboxgl.Marker({
        color: "#ff5f29",
      })
        .setLngLat([position.longitude, position.latitude])
        .addTo(mapInstance);

      const myGPSMarkerEl = myGPSMarker.getElement();
      myGPSMarkerEl.dataset.index = -1;
      myGPSMarkerEl.classList.add("mapboxgl-marker-me");

      markers.push(myGPSMarker);
      bounds.extend([position.longitude, position.latitude]);

      if (searchResults.length > 0) {
        searchResults.forEach(function (item, index) {
          const data = item.data();
          const coords = [
            data.coordinates.longitude,
            data.coordinates.latitude,
          ];

          const marker = new mapboxgl.Marker({
            color: index === activeIndex ? "#274462" : "#359ecd",
          })
            .setLngLat(coords)
            .addTo(mapInstance);

          const markerEl = marker.getElement();
          markerEl.dataset.index = index;

          if (index === activeIndex) markerEl.style.zIndex = 2;

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

      const handleMarkerClick = (e) => {
        const marker = e.originalEvent.target.closest(".mapboxgl-marker");
        if (!marker) return;

        const index = +marker.dataset.index;

        setActiveIndex(index);
      };

      mapInstance.on("load", function () {
        mapInstance.on("click", handleMarkerClick);
      });
    }

    return function cleanup() {
      markers.forEach((item) => {
        if (item._element) item._element.parentNode.removeChild(item._element);
      });

      if (mapInstance) mapInstance.off("click");

      if (window.location.pathname.indexOf("search") === -1) {
        mapInstance.remove();
      }
    };
  }, [
    mapRef,
    mapInstance,
    from,
    userPosition,
    addressPosition,
    searchResults,
    activeIndex,
    setActiveIndex,
  ]);

  return (
    <div className="map-container">
      <div ref={mapRef} className="map"></div>
    </div>
  );
}
