import React, { useState } from "react";
import "./Register.css";
import { supabase } from "../../services/supabaseClient";
import BaseLayout from "../../components/layout";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      //  Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        return;
      }

      const user = data.user;

      //  Crear su perfil en la tabla "profiles"
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id, // mismo id que usa Supabase Auth
          username: username,
          created_at: new Date(),
        },
      ]);

      if (profileError) {
        setMessage(`Error al crear perfil: ${profileError.message}`);
        return;
      }

      //  Confirmación visual
      setMessage("Registro exitoso. Revisa tu correo para confirmar tu cuenta.");
    } catch (err) {
      console.error("Error interno:", err);
      setMessage("Error interno del cliente.");
    }
  };

  return (
    <BaseLayout>
    <div className="register-page">
      <div className="register-container">
        <div className="register-icon">
          <img src="/assets/logo-user.png" alt="Icono de usuario" />
        </div>

        <h2 className="register-title">Regístrate</h2>

        <form className="register-form" onSubmit={handleRegister}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="text"
            id="email"
            placeholder="Ingresa tu correo electrónico..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Ingresa tu usuario..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirma tu contraseña..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="terms-section">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              Acepto los términos y condiciones
            </label>
          </div>

          <button type="submit" className="register-button">
            Acceder
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <div className="register-links">
          <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </div>
    </div>
    </BaseLayout>
  );
}

export default Register;
