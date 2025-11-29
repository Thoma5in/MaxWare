import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages//Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AboutUs from './pages/AboutUs/AboutUs';
import AdminRoute from './routes/AdminRoute';
import PanelAdmin from './pages/PanelAdmin/PanelAdmin';
import { CartProvider } from './contexts/CartContext';
import ProductsPage from './pages/ProductsPage';
import ContactUs from './pages/ContactUs/ContactUs';
import SuccessPage from './pages/Pay/SuccessPage';
import FailurePage from './pages/Pay/FailurePage';
import Profile from './pages/Profile/Profile';
import Pending from './pages/Pay/Pending';

function App() {
  return (
    <Router>
      <CartProvider>        
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactanos" element={<ContactUs />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/pending" element={<Pending />} />

          <Route path="/profile" element={<Profile />} />
          {/* Protección de admins*/}
          <Route path="/admin" element={
            <AdminRoute>
              <PanelAdmin />
            </AdminRoute>
          } />

          <Route path="/register" element={<Register />} />
          <Route path="/about-us" element={<AboutUs />} />
        
      </Routes>
    </CartProvider>
    </Router>
  );
}

export default App;
