"use client";

import React from "react";

interface GraficasPanelProps {
  onClose: () => void;
}

export default function GraficasPanel({ onClose }: GraficasPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gráficas y métricas
        </h3>
        <p className="text-gray-600">
          Visualización de datos y estadísticas principales.
        </p>
      </div>

      {/* Placeholder para gráficas */}
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-8 h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
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
                strokeWidth={2}
                d="M3 3v18h18M9 17V9m6 8V5M15 17v-6"
              />
            </svg>
            <p className="text-gray-500">Gráfica de tendencias</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-8 h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
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
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-gray-500">Gráfica comparativa</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-indigo-600">1,234</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Incremento</p>
          <p className="text-2xl font-bold text-emerald-600">+12%</p>
        </div>
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
