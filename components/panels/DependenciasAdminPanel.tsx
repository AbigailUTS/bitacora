"use client";

import React from "react";

interface DependenciasItem {
  id: string;
  nombre: string;
}

interface DependenciasAdminPanelProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  addDependencia: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function DependenciasAdminPanel({
  inputValue,
  setInputValue,
  addDependencia,
  handleKeyPress,
}: DependenciasAdminPanelProps) {
  return (
    <>
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
    </>
  );
}
