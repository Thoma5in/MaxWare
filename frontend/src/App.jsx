import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages//Home/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ListaProductos from './pages/ListaProductos/ListaProductos';

function App() {
  return (

    <Router>
      <div className="app-container">
      <Header />
      <main className="main-content">
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ListaProductos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        
      </Routes>
      </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
