"use client";

import React from "react";

interface GenerarReporteProps {
  onClose: () => void;
}

export default function GenerarReportePanel({ onClose }: GenerarReporteProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Crear nuevo reporte
        </h3>
        <p className="text-gray-600">
          Completa el siguiente formulario para generar un nuevo reporte.
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del reporte
          </label>
          <input
            type="text"
            placeholder="Ej: Reporte de ventas enero"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            placeholder="Describe el contenido del reporte..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de reporte
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option>Seleccionar...</option>
            <option>Ventas</option>
            <option>Inventario</option>
            <option>Clientes</option>
            <option>Otros</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Crear reporte
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
