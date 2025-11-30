import React from 'react';
import {Link} from 'react-router-dom';
import MapaTienda from '../../components/MapaTienda';
import './Home.css';
import BaseLayout from '../../components/layout';
import CategoriaSlider from '../../components/Slider/CategoriaSlider';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const irACategorias = (categoriaId, verTodas = false) => {
        if (verTodas) {
            navigate('/productos');
            return
        }
        navigate(`/productos?categoria=${categoriaId}`)
    }

    

    const tiendaCoords = {lat: 3.565771, lng: -76.570714}; //Dapa, Yumbo

    return (
        
        <BaseLayout>
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
                <CategoriaSlider onSelectCategory={irACategorias} />
             </section>


             {/* Sección de Ubicación */}
             <section className ="ubicacion">
                <h2> ¿Dónde nos encontramos? </h2>
                <div className = "map-container">
                    <MapaTienda />
                </div>
                <button 
                onClick={() => window.open(`https://www.google.com/maps?q=${tiendaCoords.lat},${tiendaCoords.lng}`
                    , '_blank')} 
                className="btn-ubicacion">¡Encuéntranos!</button>
             </section>
             </div>
        </div>
        </BaseLayout>

    
    )
}

export default Home;