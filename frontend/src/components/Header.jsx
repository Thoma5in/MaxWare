import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className = "header">
            <div className="header-container">
            <div className = "header-logo">
                <img src="/assets/logo-tiendamax.png" alt="Logo TiendaMax" />
            <h1 className = "logo">Tienda Max</h1>
            </div>
            <nav className = "header-nav">
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                </ul>
            </nav>

        <div className="header-buttons">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
        </div>

        </header>
    )
}

export default Header;