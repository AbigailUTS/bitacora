"use client";

import React from "react";

interface UbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
  link: string;
}

interface UbicacionAdminPanelProps {
  ubicaciones: UbicacionItem[];
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionItem[]>>;
  formData: { nombre: string; direccion: string; link: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ nombre: string; direccion: string; link: string }>
  >;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  addUbicacion: () => Promise<void>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function UbicacionAdminPanel({
  ubicaciones,
  setUbicaciones,
  formData,
  setFormData,
  showForm,
  setShowForm,
  addUbicacion,
  error,
  setError,
}: UbicacionAdminPanelProps) {
  return (
    <>
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
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="url"
            placeholder="Link (URL)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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
                setFormData({ nombre: "", direccion: "", link: "" });
              }}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
