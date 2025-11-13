import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';


const tiendaIcon = new L.Icon({
    iconUrl: '/assets/logo-tiendamax.png',
    iconSize: [40, 40],
})


const MapaTienda = () => {
    const tiendaCoords = [3.565771, -76.570714]; //Dapa, Yumbo

    return (
        <div style = {{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer 
            center={tiendaCoords} 
            zoom={15} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            >
                {/* Capa del mapa (de OpenStreetMap) */}
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marcador de la tienda */}
                <Marker position={tiendaCoords} icon={tiendaIcon}>
                    <Popup>
                        
                            <b>Tienda Max</b> <br/>
                            Dapa, Yumbo - Valle del Cauca
                            
                        
                    </Popup>
                </Marker>

            </MapContainer>
        </div>
    )

}

export default MapaTienda;