import React, { useEffect, useState, useRef } from 'react';
import api from "../../services/api";
import "./CategoriaSlider.css";

const CategoriaSlider = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await api.get('/categorias');
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategorias();
    }, []);

    const getCategoryImage = (cat) => {
        if (cat.icon_url) return cat.icon_url;

        const fileName = cat.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ /g, "-") + ".png";

        return `/assets/categorias/${fileName}`;
    };


    const scrollBy = (direction = 'right') => {
        const el = sliderRef.current;
        if (!el) return;

        const amount = Math.round(el.clientWidth * 0.6);

        // límite izquierdo y derecho
        const maxScroll = el.scrollWidth - el.clientWidth;
        const current = el.scrollLeft;

        let target =
            direction === "right"
                ? current + amount
                : current - amount;

        // No dejar pasar el límite
        if (target < 0) target = 0;
        if (target > maxScroll) target = maxScroll;

        el.scrollTo({ left: target, behavior: "smooth" });
    };

    return (
        <section className="categorias-section">
            <h2 className="categorias-title">Categorías</h2>

            {/* Flecha izquierda (siempre activa) */}
            <button
                className="slider-arrow left"
                onClick={() => scrollBy('left')}
                aria-label="Scroll left"
            >
                ‹
            </button>

            {/* Contenedor de scroll */}
            <div className="categorias-slider" ref={sliderRef}>

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="slider-card"
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <div className="categoria-circle">
                            <img
                                src={getCategoryImage(category)}
                                alt={category.name}
                                onError={(e) => {
                                    e.target.src = "/assets/categorias/default.png";
                                }}
                            />
                        </div>
                        <p className="categoria-name">{category.name}</p>
                    </div>
                ))}
                <div className="slider-spacer"></div>
            </div>

            {/* Flecha derecha (siempre activa) */}
            <button
                className="slider-arrow right"
                onClick={() => scrollBy('right')}
                aria-label="Scroll right"
            >
                ›
            </button>

            <button
                className="ver-todas-btn"
                onClick={() => onSelectCategory(null, true)}
            >
                Ver todas las categorías →
            </button>
        </section>
    );
};

export default CategoriaSlider;
