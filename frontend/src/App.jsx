import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages//Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AboutUs from './pages/AboutUs/AboutUs';
import ListaProductos from './pages/ListaProductos/ListaProductos';
import { CartProvider } from './contexts/CartContext';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <CartProvider>
      <Router>
      
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about-us" element={<AboutUs />} />
        
      </Routes>
      
    </Router>
    </CartProvider>
  );
}

export default App;
