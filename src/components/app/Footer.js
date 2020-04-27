import React from "react";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <Container>
      <div className="footer py-3 px-sm-3">
        <p className=" footer-text  font-14-light text-white text-center">
          <span className="font-12-light"> © 2020 </span>
          <span className="font-14-light">
            Apteka |{" "}
            <a
              href="https://www.dimslaev.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dimslaev
            </a>
          </span>
        </p>
      </div>
    </Container>
  );
}
