// src/components/FarmaciaTablaCompleta.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export function FarmaciaTablaCompleta() {
  const [farmacias, setFarmacias] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  useEffect(() => {
    axios
      .get("https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php")
      .then((res) => {
        setFarmacias(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener farmacias:", err);
      });
  }, []);

  const ordenarPorRegion = () => {
    const farmaciasOrdenadas = [...farmacias].sort((a, b) => {
      if (a.fk_region < b.fk_region) return ordenAscendente ? -1 : 1;
      if (a.fk_region > b.fk_region) return ordenAscendente ? 1 : -1;
      return 0;
    });
    setFarmacias(farmaciasOrdenadas);
    setOrdenAscendente(!ordenAscendente);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Todas las Farmacias de Turno</h1>
      <table className="table-auto w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1 cursor-pointer" onClick={ordenarPorRegion}>
              Región {ordenAscendente ? "▲" : "▼"}
            </th>
            <th className="border px-2 py-1">Comuna</th>
            <th className="border px-2 py-1">Localidad</th>
            <th className="border px-2 py-1">Dirección</th>
            <th className="border px-2 py-1">Teléfono</th>
            <th className="border px-2 py-1">Día</th>
            <th className="border px-2 py-1">Hora Apertura</th>
            <th className="border px-2 py-1">Hora Cierre</th>
            <th className="border px-2 py-1">Lat</th>
            <th className="border px-2 py-1">Lng</th>
          </tr>
        </thead>
        <tbody>
          {farmacias.map((f) => (
            <tr key={f.local_id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{f.local_id}</td>
              <td className="border px-2 py-1">{f.fecha}</td>
              <td className="border px-2 py-1">{f.local_nombre}</td>
              <td className="border px-2 py-1">{f.fk_region}</td>
              <td className="border px-2 py-1">{f.comuna_nombre}</td>
              <td className="border px-2 py-1">{f.localidad_nombre}</td>
              <td className="border px-2 py-1">{f.local_direccion}</td>
              <td className="border px-2 py-1">{f.local_telefono}</td>
              <td className="border px-2 py-1">{f.funcionamiento_dia}</td>
              <td className="border px-2 py-1">{f.funcionamiento_hora_apertura}</td>
              <td className="border px-2 py-1">{f.funcionamiento_hora_cierre}</td>
              <td className="border px-2 py-1">{f.local_lat}</td>
              <td className="border px-2 py-1">{f.local_lng}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
