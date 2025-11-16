import { useState } from "react"
import Header from "../components/Header/Header"
import ListaProductos from "./ListaProductos/ListaProductos"
import ShoppingCart from "../components/ShoppingCart"
import Footer from "../components/Footer/Footer"
import "./ProductsPage.css"

function ProductsPage() {
    // Estado para controlar la visibilidad del carrito
    const [isCartVisible, setIsCartVisible] = useState(false);

    const toggleCart = () => {
        setIsCartVisible(prev => !prev);
    };
    return (
        <div className="page-layout">
            <Header toggleCart={toggleCart} />
            <ShoppingCart isVisible={isCartVisible} onClose={toggleCart} />
            <main className={isCartVisible ? 'content-shifted' : 'content-full'}>
                <ListaProductos />
            </main>
            <Footer/>
        </div>
    )
}
export default ProductsPage