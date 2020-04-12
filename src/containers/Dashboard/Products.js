import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import ButtonLoader from "../../components/base/ButtonLoader";
import Icon from "../../components/base/Icon";
import { geocollectionProviders } from "../../AccountStore";
import { types } from "../../utils/types";

const defaultProducts = [];

types.forEach((item, index) => {
  defaultProducts.push({
    ...types[index],
    qty: 0,
    price: 0,
    pricePer: "piece",
  });
});

function mapProducts(provider) {
  const products = [];
  if (!provider.products.length) return defaultProducts;
  defaultProducts.forEach(item => {
    const product = provider.products.find(p => p.id === item.id);
    if (product) products.push(product);
    else products.push(item);
  });
  return products;
}

export default function Products(props) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState(mapProducts(props.provider));

  function handleFieldChange(event) {
    const id = event.target.id.split("_")[0];
    const type = event.target.id.split("_")[1];
    const value = event.target.value;
    const productsClone = [...products];

    productsClone.forEach(item => {
      if (item.id === id) item[type] = value;
    });

    setProducts(productsClone);
  }

  function handleFieldFocus(event) {
    if (event.target.value === "0")
      handleFieldChange({ target: { id: event.target.id, value: "" } });
  }

  function handleFieldBlur(event) {
    if (event.target.value === "")
      handleFieldChange({ target: { id: event.target.id, value: "0" } });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      loading ||
      products === defaultProducts ||
      (props.provider.products && products === props.provider.products)
    )
      return;

    setLoading(true);

    const productsClone = [];

    products.forEach(p => {
      productsClone.push({ ...p, qty: +p.qty });
    });

    geocollectionProviders
      .doc(props.user.uid)
      .update({ products: productsClone })
      .then(() => {
        const doc = { ...props.provider, products };
        localStorage.setItem("provider", JSON.stringify(doc));
        setLoading(false);
        props.setModalTitle("Products updated");
        props.setModalContent("Your available products have been updated.");
        props.setModalShow(true);
      });
  }

  return (
    <section id={props.id + "-section"} className="settings-section pt-3 pb-4">
      <Form onSubmit={handleSubmit}>
        {products.map((item, index) => (
          <Row key={item.id}>
            <Col md={12}>
              <Icon type={item.id} />
              <b>{item.label}</b>
            </Col>
            <Col md={4}>
              <Form.Group controlId={`${item.id}_qty`}>
                <Form.Label>Quantity</Form.Label>

                <Form.Control
                  type="number"
                  name={item.id}
                  value={item.qty}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId={`${item.id}_price`}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={item.price}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId={`${item.id}_pricePer`}>
                <Form.Label>Per</Form.Label>
                <Form.Control
                  as="select"
                  value={item.pricePer}
                  onChange={handleFieldChange}
                >
                  <option value="piece">Piece</option>
                  <option value="pair">Pair</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        ))}

        <div className="text-md-right">
          <ButtonLoader type="submit" loading={loading} disabled={loading}>
            Save Products
          </ButtonLoader>
        </div>
      </Form>
    </section>
  );
}
