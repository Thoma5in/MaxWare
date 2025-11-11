import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();   // Cierra sesión en Supabase
    navigate("/");     // Redirige al inicio
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="header-logo">
          <img src="/assets/logo-tiendamax.png" alt="Logo TiendaMax" />
          <h1 className="logo">Tienda Max</h1>
        </div>

        {/* NAV */}
        <nav className="header-nav">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
          </ul>
        </nav>

        {/* AUTH BUTTONS */}
        <div className="header-buttons">
          {user ? (
            <>
              <span className="welcome-text">
                Bienvenido,{" "}
                {user.user_metadata?.username ||
                  user.email.split("@")[0] ||
                  "Usuario"}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="btn-login"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-register"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
