import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext'; 
import BaseLayout from '../../components/layout';
// import api from "../../services/api";
import './ContactUs.css'

const ContactUs = () => {

    // const { addToCart } = useCart(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Datos del formulario:', formData);
    setIsSubmitted(true);
    
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      comments: ''
    });

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  // Datos de contacto
  const contactInfo = {
    general: '(361) 594-3852',
    giftShop: '(361) 594-4294',
    tours: '(361) 594-3852',
    tourHours: '9:00 AM - 5:00 PM, Lunes a Sábado',
    whatsapp: '+13615943852',
    email: 'info@acuario.com'
  };

  return (
    <BaseLayout>
        <div className="contact-us">
      <div className="contact-container">
        <div className="contact-header">
          <h1>CONTÁCTANOS</h1>
        </div>

        <div className="contact-content">
          {/* Sección de Teléfonos */}
          <div className="contact-section">
            <h2>LLÁMANOS</h2>
            
            <div className="phone-numbers">
              <div className="phone-item">
                <strong>INFORMACIÓN GENERAL</strong>
                <span className="phone-number">{contactInfo.general}</span>
              </div>
              
              <div className="phone-item">
                <strong>TIENDA DE REGALOS</strong>
                <span className="phone-number">{contactInfo.giftShop}</span>
              </div>
              
              <div className="phone-item">
                <strong>RECORRIDOS</strong>
                <span className="phone-number">{contactInfo.tours}</span>
              </div>
            </div>

            <div className="tour-hours">
              <p>Ver Horarios de Recorridos</p>
              <span className="hours">{contactInfo.tourHours}</span>
            </div>

            <div className="divider"></div>
          </div>

          {/* Sección del Formulario */}
          <div className="contact-section">
            <h2>HAZNOS UNA PREGUNTA</h2>
            
            {isSubmitted && (
              <div className="success-message">
                ¡Gracias! Tu mensaje ha sido enviado exitosamente.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">NOMBRE</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu Nombre"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">DIRECCIÓN DE EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu.email@ejemplo.com"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="comments">COMENTARIOS</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                ENVIAR
              </button>
            </form>
          </div>

          {/* Sección de Contacto Alternativo */}
          <div className="contact-section alternative-contact">
            <h2>OTRAS FORMAS DE CONTACTARNOS</h2>
            
            <div className="contact-options">
              <div className="contact-option">
                <div className="contact-icon whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <h3>WhatsApp</h3>
                <p>Chatea directamente con nosotros</p>
                <a 
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link whatsapp-link"
                >
                  <i className="fab fa-whatsapp"></i>
                  Escribir por WhatsApp
                </a>
              </div>

              <div className="contact-option">
                <div className="contact-icon email">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>Envíanos un correo directamente</p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="contact-link email-link"
                >
                  <i className="fas fa-envelope"></i>
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout>
  );
}
export default ContactUs