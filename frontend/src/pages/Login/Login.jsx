import React from 'react';
import './Login.css';

function Login() {
    return (
        <div className = "login-page">
            <div className="login-container">
                <div className="login-icon">
                    <img src="/assets/logo-user.png" alt="Icono de usuario" />
                </div>

                <h2 className="login-title"> Bienvenido de nuevo</h2>

                <form className="login-form">
                    <label htmlFor="username" > Nombre de usuario </label>
                    <input
                    type = "text"
                    id = "username"
                    placeholder="Ingresa tu usuario..."/>

                    <label htmlFor="password" > Contraseña </label>
                    <input
                    type = "password"
                    id = "password"
                    placeholder="Ingresa tu contraseña..."/>

                    <div className = "remember-section">
                        <input type="checkbox" id="rememberMe" />
                        <label htmlFor="remember"> Recuérdame </label>
                    </div>
                    
                    <button type = "submit" className="login-button"> Acceder </button>
                </form>

                <div className="login-links">
                    <a href="#">¿Olvidaste tu contraseña?</a>
                    <a href="/register" >¿No tienes una cuenta? Regístrate</a>
                </div>
            </div>
        </div>
    )
}

export default Login;