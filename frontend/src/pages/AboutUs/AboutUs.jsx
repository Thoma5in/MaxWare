import React from 'react';
import "./AboutUs.css";

const AboutUs = () => {
    return (
        <div className="about-container">
            <section className="about-header">
                <h2> Sobre Nosotros </h2>
                <p>
                    Nuestra tienda nació con el propósito de brindar acceso a productos de calidad a precios justos,
                    especialmente para las familias de la comunidad rural de Dapa. Creemos que todos merecen una
                    experiencia de compra sencilla, confiable y cercana.
                </p>
            </section>


            <div className='about-cards'>
                <div className="card">
                    <img src="/assets/mision.png" alt="Misión" className="icon" />
                    <h3> Misión </h3>
                    <p>
                        Brindar productos de calidad a precios accesibles para las familias de la comunidad rural de Dapa, ofreciendo una experiencia de compra fácil, rápida y confiable.
                        Buscamos fortalecer el comercio local mediante el uso de herramientas digitales que acerquen los productos esenciales del hogar a todos los clientes, 
                        promoviendo cercanía, confianza y desarrollo comunitario.
                    </p>
                    
                </div>

                <div className="card">
                    <img src="/assets/vision.png" alt="Visión" className="icon" />
                    <h3> Visión </h3>
                    <p>
                        Ser reconocidos como la tienda digital líder en la región rural de Dapa, destacándonos por nuestra atención personalizada, compromiso social y capacidad de adaptación 
                        a las necesidades de la comunidad. A futuro, buscamos expandir nuestros servicios a nuevas zonas rurales, impulsando la transformación digital del comercio tradicional 
                        y fortaleciendo las conexiones entre productores y consumidores locales.
                    </p>
                </div>

                <div className="card">
                    <img src="/assets/valores.png" alt="Valores" className="icon" />
                    <h3> Valores </h3>
                    <p>
                        Nos guiamos por el compromiso con nuestra comunidad, la honestidad en cada transacción y la calidad en todos nuestros productos. Promovemos la solidaridad y el respeto entre
                        clientes y proveedores, fomentando relaciones basadas en la confianza. Creemos en la innovación como motor de crecimiento, impulsando el uso de herramientas digitales para fortalecer 
                        el comercio local y mejorar la vida de las familias rurales.
                    </p>
                </div>
            </div>
            </div>
    )
}


export default AboutUs;