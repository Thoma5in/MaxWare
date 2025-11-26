import React, { use, useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";
// Importar el contexto del carrito
import { useCart } from "../../contexts/CartContext";

// Acepta 'toggleCart' como prop
const Header = ({ toggleCart }) => {
  const [User, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  // Obtener la información del carrito
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await signOut(); // Cierra sesión en Supabase
    navigate("/"); // Redirige al inicio
  };

  // Obtener el rol del usuario desde Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile) setRole(profile.role);

      }
    }
    getSession();
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="header-logo">
          <img src="/assets/logo-tiendamax.png" alt="Logo TiendaMax" />
          <h1 className="logo">Tienda Max</h1>
        </div>

        {/* HAMBURGER BUTTON (Mobile only) */}
        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* NAV */}
        <nav className={`header-nav ${isMobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link></li>
            <li><Link to="/productos" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link></li>
            <li><Link to="/contactanos" onClick={() => setIsMobileMenuOpen(false)}>Contactanos</Link></li>
          </ul>
        </nav>

        {/* AUTH BUTTONS & CART BUTTON */}
        <div className={`header-buttons ${isMobileMenuOpen ? "active" : ""}`}>

          {/* BOTÓN DEL CARRITO */}
          {toggleCart && (
            <button
              className="cart-icon-button"
              onClick={() => {
                toggleCart();
                setIsMobileMenuOpen(false);
              }}
            >
              <span role="img" aria-label="Carrito de compras">🛒</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>)}

          {/* Botones de Autenticación Existentes */}
          {user ? (
            <>
              <div className="profile-menu-container">
                <button
                  className="profile-icon-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Menú de usuario"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      Hola, {user.user_metadata?.username || user.email.split("@")[0] || "Usuario"}
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Perfil
                    </Link>

                    {role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Panel Admin
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="dropdown-item logout-btn"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                className="btn-login"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => { navigate("/register"); setIsMobileMenuOpen(false); }}
                className="btn-register"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div >
    </header >
  );
};

export default Header;
