import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ListaProductos from './pages/ListaProductos';

function App() {
  return (

    <Router>
      <div className="app-container">
      <Header />
      <main className="main-content">
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ListaProductos />} />
        
      </Routes>
      </main>
      <Footer />
      </div>
    </Router>
  );
}

export default App;
