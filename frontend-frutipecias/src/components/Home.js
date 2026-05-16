import React from "react";
import { Carousel, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="my-home-wrapper">
            <Container fluid className="my-home-content d-flex flex-column align-items-center justify-content-center">
                
                <h1 className="my-home-welcome text-center mb-4">Bienvenido</h1>

                <Carousel className="my-home-slider shadow-lg" interval={5000} pause="hover">
                    
                    <Carousel.Item className="my-slider-item">
                        <div className="my-slider-image-container">
                            <img className="d-block w-100 my-slider-img" src="/especias-slider.jpg" alt="Especias" />
                            <div className="my-slider-overlay"></div>
                        </div>
                        <Carousel.Caption className="my-slider-caption">
                            <h2 className="my-slider-title">Especias</h2>
                            <Button as={Link} to="/productos/especias" className="my-btn px-4 py-2 mt-3">Descubrir</Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item className="my-slider-item">
                        <div className="my-slider-image-container">
                            <img className="d-block w-100 my-slider-img" src="/frutos-secos-slider.jpg" alt="Frutos Secos" />
                            <div className="my-slider-overlay"></div>
                        </div>
                        <Carousel.Caption className="my-slider-caption">
                            <h2 className="my-slider-title">Frutos Secos</h2>
                            <Button as={Link} to="/productos/frutos secos" className="my-btn px-4 py-2 mt-3">Descubrir</Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item className="my-slider-item">
                        <div className="my-slider-image-container">
                            <img className="d-block w-100 my-slider-img" src="/frutas-slider.jpg" alt="Frutas Deshidratadas" />
                            <div className="my-slider-overlay"></div>
                        </div>
                        <Carousel.Caption className="my-slider-caption">
                            <h2 className="my-slider-title">Frutas Deshidratadas</h2>
                            <Button as={Link} to="/productos/frutas deshidratadas" className="my-btn px-4 py-2 mt-3">Descubrir</Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item className="my-slider-item">
                        <div className="my-slider-image-container">
                            <img className="d-block w-100 my-slider-img" src="/todos-slider.jpg" alt="Todos los productos" />
                            <div className="my-slider-overlay"></div>
                        </div>
                        <Carousel.Caption className="my-slider-caption">
                            <h2 className="my-slider-title">Todos los productos</h2>
                            <Button as={Link} to="/productos" className="my-btn px-4 py-2 mt-3">Descubrir</Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                </Carousel>
            </Container>
        </div>
    );
}

export default Home;