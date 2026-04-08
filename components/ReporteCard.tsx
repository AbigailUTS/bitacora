"use client";

import React from "react";
import { Reporte } from "../lib/models/reporte";

interface ReporteCardProps {
  reporte: Reporte & {
    user_name?: string;
    dependencia_nombre?: string;
    area_nombre?: string;
    clasificacion_nombre?: string;
  };
  isAdmin: boolean;
  onSelect?: () => void;
  getUrgenciaColor: (urgencia: string) => string;
  getEstatusColor: (estatus: string) => string;
}

export default function ReporteCard({
  reporte,
  isAdmin,
  onSelect,
  getUrgenciaColor,
  getEstatusColor,
}: ReporteCardProps) {
  return (
    <div
      className={`relative border border-gray-200 rounded-lg p-4 pt-8 hover:shadow-md transition ${
        isAdmin && onSelect ? "cursor-pointer" : ""
      }`}
      onClick={() => {
        if (isAdmin && onSelect) {
          onSelect();
        }
      }}
    >
      <span className="absolute top-3 right-3 text-xs font-semibold text-gray-500">
        ID #{reporte.id}
      </span>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">
          {reporte.clasificacion_nombre}
        </h4>
        <div className="flex space-x-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${getUrgenciaColor(
              reporte.urgencia_reporte
            )}`}
          >
            {reporte.urgencia_reporte}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${getEstatusColor(
              reporte.estatus_ticket
            )}`}
          >
            {reporte.estatus_ticket}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{reporte.descripcion}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p>Creado: {new Date(reporte.created_at).toLocaleDateString()}</p>
        <p>Dependencia: {reporte.dependencia_nombre}</p>
        <p>Área: {reporte.area_nombre}</p>
        <p>Clasificación: {reporte.clasificacion_nombre}</p>
        {isAdmin && reporte.user_name && (
          <p>Creado por: {reporte.user_name}</p>
        )}
      </div>
    </div>
  );
}
