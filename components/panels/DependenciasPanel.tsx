"use client";

import React, { useState } from "react";

interface DependenciasItem {
  id: string;
  nombre: string;
}

interface DependenciasPanelProps {
  onClose: () => void;
}

export default function DependenciasPanel({ onClose }: DependenciasPanelProps) {
  const [dependencias, setDependencias] = useState<DependenciasItem[]>([
    { id: "1", nombre: "Sede Central" },
    { id: "2", nombre: "Sucursal Norte" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const addDependencia = () => {
    if (inputValue.trim()) {
      const newDependencia: DependenciasItem = {
        id: Date.now().toString(),
        nombre: inputValue.trim(),
      };
      setDependencias([...dependencias, newDependencia]);
      setInputValue("");
    }
  };

  const removeDependencia = (id: string) => {
    setDependencias(dependencias.filter((dep) => dep.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addDependencia();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gestionar Dependencias
        </h3>
        <p className="text-gray-600">
          Agrega, edita o elimina las sucursales y dependencias de tu organización.
        </p>
      </div>

      {/* Input para agregar nueva dependencia */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agregar nueva dependencia
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: Sucursal Sur, Oficina Regional..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addDependencia}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de dependencias */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Dependencias registradas ({dependencias.length})
        </h4>
        {dependencias.length > 0 ? (
          <ul className="space-y-2">
            {dependencias.map((dependencia) => (
              <li
                key={dependencia.id}
                className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1M9 7a1 1 0 011-1h2a1 1 0 011 1m0 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">{dependencia.nombre}</span>
                </div>
                <button
                  onClick={() => removeDependencia(dependencia.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition p-1"
                  title="Eliminar dependencia"
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
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1M9 7a1 1 0 011-1h2a1 1 0 011 1m0 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No hay dependencias registradas</p>
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
