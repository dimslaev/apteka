import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/app/Header";
import Footer from "../../components/app/Footer";
import { Accordion, Card, Container, Row, Col } from "react-bootstrap";
import Modal from "../../components/base/Modal";
import Profile from "./Profile";
import Products from "./Products";
import { AccountContext, geocollectionProviders } from "../../AccountStore";

const components = [
  {
    id: "provider",
    title: "Store Details",
    c: props => <Profile {...props} />,
    roles: ["PERMITTED"],
  },
  {
    id: "products",
    title: "Available Products",
    c: props => <Products {...props} />,
    roles: ["PERMITTED"],
  },
];

export default function Dashboard() {
  const { user } = useContext(AccountContext);
  const [provider, setProvider] = useState(
    JSON.parse(localStorage.getItem("provider")),
  );
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState(false);
  const [modalContent, setModalContent] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProvider = async () => {
      const providerResponse = await geocollectionProviders.doc(user.uid).get();
      if (providerResponse.exists) {
        setProvider(providerResponse.data());
        localStorage.setItem(
          "provider",
          JSON.stringify(providerResponse.data()),
        );
      } else {
        console.log("No such document!");
      }
    };
    fetchProvider();
  }, [user]);

  const modalProps = { setModalShow, setModalTitle, setModalContent };

  return (
    <>
      <Header />
      <main>
        <Container>
          <Accordion className="settings">
            {provider &&
              components.map((item, index) => (
                <Card id={item.id} className="accordion-item" key={index}>
                  <Card.Header className="accordion-item-header">
                    <Row className="align-items-center">
                      <Col>
                        <h3 className="mb-0">{item.title}</h3>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {item.c({
                      ...modalProps,
                      id: item.id,
                      provider,
                      user,
                    })}
                  </Card.Body>
                </Card>
              ))}
          </Accordion>
        </Container>
      </main>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={modalTitle}
        size="md"
      >
        {modalContent}
      </Modal>
      <Footer />
    </>
  );
}
