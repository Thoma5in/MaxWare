import React from 'react';
import {useNavigate} from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h2> ¡Bienvenido a la TiendaMax! </h2>
            <p>
                Somos una tienda que se enfoca en ofrecerte productos alimenticios y del hogar
                <br/>de la mejor calidad al mejor precio. Explora nuestra amplia gama de productos
                y encuentra todo lo que necesitas para tu hogar.
            </p>
            <button onClick={() => navigate('/productos')}>Ver Productos</button>
        </div>
    )
}

export default Home;