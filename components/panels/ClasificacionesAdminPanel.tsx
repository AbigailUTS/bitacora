"use client";

import React from "react";

interface ClasificacionesAdminPanelProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  addClasificacion: () => Promise<void>;
  updateClasificacion: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  editingId: string | null;
  cancelEdit: () => void;
}

export default function ClasificacionesAdminPanel({
  inputValue,
  setInputValue,
  addClasificacion,
  updateClasificacion,
  handleKeyPress,
  editingId,
  cancelEdit,
}: ClasificacionesAdminPanelProps) {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gestionar Clasificaciones
        </h3>
        <p className="text-gray-600">
          Agrega, edita o elimina las clasificaciones de reportes disponibles en el sistema.
        </p>
      </div>

      {/* Input para agregar/editar clasificación */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {editingId ? "Editar clasificación" : "Agregar nueva clasificación"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ej: Técnico, Administrativo, Operativo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {editingId ? (
            <>
              <button
                onClick={updateClasificacion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Actualizar
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={addClasificacion}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </>
  );
}