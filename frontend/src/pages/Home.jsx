import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        
        <div className="home">
            <div className="home-container">
             {/* Sección de Bienvenida */}
             <section className = "hero">
                <div className="hero-content"> 
                    <h1>¡Bienvenido a TiendaMax!</h1>
                    <p>Somos una tienda que se enfoca en ofrecer los mejores productos alimenticios y para el hogar,
                    <br/>con precios accesibles para toda la comunidad rural.</p>
                <Link to="/productos" className= "btn-hero">Ver Productos</Link>
                </div>
             </section>


            {/* Sección de Qué te ofrecemos */}
             <section className = "ofrecemos">
                <h2>¿Qué te ofrecemos?</h2>
                <div className = "ofrecemos-container">
                    <div className = "ofrecemos-item">
                        <img src="/assets/ahorro.png" alt="Ahorro" />
                        <h3>Ahorro</h3>
                    </div>
                    <div className="ofrecemos-item">
                        <img src="/assets/calidad.png" alt="Calidad" />
                        <h3>Calidad</h3>
                    </div>
                    <div className="ofrecemos-item">
                        <img src="/assets/entrega.png" alt="Entregas" />
                        <h3>Entregas</h3>
                    </div>
                </div>
             </section>


             {/* Sección de Categorías */}
             <section className ="categorias">
                <h2>Categorías</h2>
                <div className="categorias-container">
                    <div className="categoria-card">
                        <h3>Categoría 1</h3>
                        <img src="/assets/categoria1.png" alt="Categoría 1" />

                    </div>
                    <div className="categoria-card">
                        <h3>Categoría 2</h3>
                        <img src="/assets/categoria2.png" alt="Categoría 2" />

                    </div>
                    <div className="categoria-card">
                        <h3>Categoría 1</h3>
                        <img src="/assets/categoria1.png" alt="Categoría 3" />

                    </div>
                    <div className="categoria-card">
                        <h3>Categoría 2</h3>
                        <img src="/assets/categoria2.png" alt="Categoría 4" />

                    </div>
                </div>
             </section>


             {/* Sección de Ubicación */}
             <section className ="ubicacion">
                <h2> ¿Dónde nos encontramos? </h2>
                <div className = "map-container">
                    <iframe
                        title="Mapa TiendaMax"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.922255473011!2d-74.081749!3d4.609710!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a16e1a28a3%3A0xabc!2sColombia!5e0!3m2!1ses!2sco!4v1670000000000"
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
                <button className="btn-ubicacion">¡Encuéntranos!</button>
             </section>
             </div>
        </div>
    
    )
}

export default Home;