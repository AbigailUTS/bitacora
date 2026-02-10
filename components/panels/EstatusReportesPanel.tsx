"use client";

import React from "react";

interface EstatusReportesProps {
  onClose: () => void;
}

export default function EstatusReportesPanel({
  onClose,
}: EstatusReportesProps) {
  const reportes = [
    { id: 1, titulo: "Reporte Enero", estado: "Completado", fecha: "2026-01-15" },
    { id: 2, titulo: "Reporte Febrero", estado: "En progreso", fecha: "2026-01-19" },
    { id: 3, titulo: "Reporte Marzo", estado: "Pendiente", fecha: "2026-02-01" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Estado de reportes
        </h3>
        <p className="text-gray-600">
          Revisa el estado actual de todos tus reportes.
        </p>
      </div>

      <div className="space-y-3">
        {reportes.map((reporte) => (
          <div
            key={reporte.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900">{reporte.titulo}</h4>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  reporte.estado === "Completado"
                    ? "bg-emerald-100 text-emerald-800"
                    : reporte.estado === "En progreso"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {reporte.estado}
              </span>
            </div>
            <p className="text-sm text-gray-500">{reporte.fecha}</p>
          </div>
        ))}
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
