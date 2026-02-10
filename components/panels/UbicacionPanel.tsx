"use client";

import React, { useState } from "react";

interface UbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
}

interface UbicacionPanelProps {
  onClose: () => void;
}

export default function UbicacionPanel({ onClose }: UbicacionPanelProps) {
  const [ubicaciones, setUbicaciones] = useState<UbicacionItem[]>([
    { id: "1", nombre: "Sede Principal", direccion: "Calle Principal 123" },
    { id: "2", nombre: "Oficina Secundaria", direccion: "Avenida Central 456" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", direccion: "" });

  const addUbicacion = () => {
    if (formData.nombre.trim() && formData.direccion.trim()) {
      const newUbicacion: UbicacionItem = {
        id: Date.now().toString(),
        nombre: formData.nombre.trim(),
        direccion: formData.direccion.trim(),
      };
      setUbicaciones([...ubicaciones, newUbicacion]);
      setFormData({ nombre: "", direccion: "" });
      setShowForm(false);
    }
  };

  const removeUbicacion = (id: string) => {
    setUbicaciones(ubicaciones.filter((ub) => ub.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gestionar Ubicaciones
        </h3>
        <p className="text-gray-600">
          Registra y administra las ubicaciones geográficas de tu organización.
        </p>
      </div>

      {/* Botón para agregar ubicación */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Agregar ubicación
      </button>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 space-y-3">
          <input
            type="text"
            placeholder="Nombre de la ubicación"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={addUbicacion}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({ nombre: "", direccion: "" });
              }}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de ubicaciones */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Ubicaciones registradas ({ubicaciones.length})
        </h4>
        {ubicaciones.length > 0 ? (
          <ul className="space-y-3">
            {ubicaciones.map((ubicacion) => (
              <li
                key={ubicacion.id}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 flex-shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900">
                        {ubicacion.nombre}
                      </h5>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {ubicacion.direccion}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeUbicacion(ubicacion.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition p-1 flex-shrink-0"
                    title="Eliminar ubicación"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No hay ubicaciones registradas</p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Cerrar
      </button>
    </div>
  );
}
