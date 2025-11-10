import React from 'react';
import './Register.css';

function Register() {
    return (
        <div className = "register-page">
            <div className="register-container">
                <div className="register-icon">
                    <img src="/assets/logo-user.png" alt="Icono de usuario" />
                </div>

                <h2 className="register-title"> Regístrate </h2>

                <form className="register-form">
                    <label htmlFor="username" > Nombre de usuario </label>
                    <input
                    type = "text"
                    id = "username"
                    placeholder="Ingresa tu usuario..."/>

                    <label htmlFor="password" > Contraseña </label>
                    <input
                    type = "password"
                    id = "password"
                    placeholder="Ingresa tu contraseña con simbolos y caracteres..."/>

                    <label htmlFor="confirmPassword" > Confirmar Contraseña </label>
                    <input
                    type = "password"
                    id = "confirmPassword"
                    placeholder="Confirma tu contraseña..."/>

                    <div className = "terms-section">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms"> Acepto los términos y condiciones </label>
                    </div>
                    
                    <button type = "submit" className="register-button"> Acceder </button>
                </form>

                <div className="register-links">
                    <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
                </div>
            </div>
        </div>
    )
}

export default Register;