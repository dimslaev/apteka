import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
// import Logo from "../../images/logo.svg";

export default function Footer({ userPosition = false }) {
  return (
    <Container>
      <div className="footer py-3 px-sm-3">
        <p className=" footer-text  font-14-light text-white text-center">
          {userPosition ? (
            <>
              Your detected location is:{" "}
              <a
                href={`http://maps.google.com/maps?q=${userPosition.latitude},${userPosition.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {userPosition.city}, {userPosition.country} [{" "}
                {userPosition.latitude}, {userPosition.longitude} ]
              </a>
            </>
          ) : (
            <>
              <span className="font-12-light"> © 2020 </span>
              <Link to="https://www.dimslaev.com">
                <span className="font-14-light">Apteka.net </span>
              </Link>
            </>
          )}
        </p>
      </div>
    </Container>
  );
}
