import React from 'react';
import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer">
           <div className="footer-content">
               <div className="footer-brand">
                <img src="/assets/logo-tiendamax.png" alt="Logo TiendaMax" />
                <div className="brand-text">
                  <h2>Tienda Max</h2>
                  <p>Dirección Dapa Km 12</p>
                  <p>Yumbo - Valle del Cauca</p>
                  <div className="social-icons">
                    <a href="https://www.facebook.com"><img src="/assets/icon-facebook.png" alt="Facebook" /></a>
                    <a href="https://www.instagram.com"><img src="/assets/icon-instagram.png" alt="Instagram" /></a>
                    <a href="https://www.whatsapp.com"><img src="/assets/icon-whatsapp.png" alt="WhatsApp" /></a>
                </div>
                </div>
               </div>
               <div className="footer-legal">
                <h3>Información legal</h3>
                <p>Terminos y Condiciones</p>
                <p>Políticas de privacidad</p>
                <p>Autorización de tratamiento de datos</p>
                <a href="/about-us"><strong>¿Quiénes Somos?</strong></a>
               </div>
               <div className="footer-social">
                <h3>Mapa del Sitio</h3>
               </div>
           </div>
        </footer>
    )
}

export default Footer;