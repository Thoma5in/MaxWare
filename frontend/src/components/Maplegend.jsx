import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export default function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");

      div.innerHTML = `
        <h4 style="margin: 0 0 6px 0;">Área de Cobertura</h4>
        <div style="display:flex; align-items:center; gap:6px;">
          <i style="
            background: rgba(0, 0, 255, 0.3);
            border: 2px solid blue;
            width: 18px;
            height: 18px;
            display: inline-block;
          "></i>
          <span>Radio de entrega a domicilio</span>
        </div>
      `;

      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map]);

  return null;
}
