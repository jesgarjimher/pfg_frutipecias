import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

function AboutUs() {
    return (
        <Container className="my-about-container my-5 py-5 px-4 px-md-5">
            <Row className="align-items-center">
                <Col lg={6} className="pe-lg-5">
                    <h1 className="my-about-title display-4 fw-bold mb-4">Sobre nosotros</h1>
                    
                    <p className="my-about-intro text-muted mb-4">
                        Frutipecias nace con un objetivo simple: servir de enciclopedia de frutos secos, 
                        frutas deshidratadas y especias. Estos tres grupos de alimentos son unas de 
                        las piedras angulares de cualquier cultura gastronómica. 
                    </p>

                    <p className="my-about-text text-muted mb-4">
                        Desde las especias, las cuales transforman cualquier alimento base en cientos 
                        de combinaciones, a las frutas deshidratadas, que llenan de sabor nuestros postres y 
                        sin olvidarnos de los frutos secos, que son los snacks más antiguos que se conocen.
                    </p>

                    <p className="my-about-handwritten fs-4 my-4">
                        "Frutipecias no es una tienda. No vendemos nada.<br/> Regalamos conocimiento culinario."
                    </p>

                    <Button as={Link} to="/productos" size="lg" className="my-about-btn border-0 px-4 py-2 mt-3">Descubrir productos</Button>
                </Col>

                <Col lg={6} className="mt-5 mt-lg-0">
                    <div className="text-center">
                        <img src="/about-us.png" alt="Diferentes productos expuestos" className="my-about-img img-fluid"/>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default AboutUs;