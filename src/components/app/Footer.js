import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Container>
      <div className="footer py-3 px-sm-3">
        <p className=" footer-text  font-14-light text-white text-center">
          <span className="font-12-light"> © 2020 </span>
          <Link to="https://www.dimslaev.com">
            <span className="font-14-light">Apteka.net </span>
          </Link>
        </p>
      </div>
    </Container>
  );
}
