import React from 'react';
import Header from './Header/Header'; 
import Footer from './Footer/Footer'; 
import './Layout.css'; 


// Este es un layout base con Header y Footer para integrar en varias páginas
const BaseLayout = ({ children }) => {

    return (
        <div className="base-layout-container">
            <Header /> 
            <main className="content">
                {children}
            </main>
            <Footer />
        </div>);}
export default BaseLayout;