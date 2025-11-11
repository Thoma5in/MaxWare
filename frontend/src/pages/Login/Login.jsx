import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    // Si el login fue exitoso, data contiene la sesión y el usuario
    const user = data.user;
    setMessage("Inicio de sesión exitoso");

    // Espera un momento y redirige
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-icon">
          <img src="/assets/logo-user.png" alt="Icono de usuario" />
        </div>

        <h2 className="login-title">Bienvenido de nuevo</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="text"
            id="email"
            placeholder="Ingresa tu correo..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Acceder
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <div className="login-links">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="/register">¿No tienes una cuenta? Regístrate</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
