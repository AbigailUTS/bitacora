"use client";

import React from "react";

interface ClasificacionItem {
  id: string;
  nombre: string;
  created_at: string;
}

interface ClasificacionCardProps {
  clasificacion: ClasificacionItem;
  onEdit?: (clasificacion: ClasificacionItem) => void;
  onRemove?: (clasificacion: ClasificacionItem) => void;
  isAdmin: boolean;
}

export default function ClasificacionCard({
  clasificacion,
  onEdit,
  onRemove,
  isAdmin,
}: ClasificacionCardProps) {
  return (
    <li className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <span className="font-medium text-gray-900">{clasificacion.nombre}</span>
      </div>
      {isAdmin && (
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(clasificacion)}
              className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 transition p-1"
              title="Editar clasificación"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(clasificacion)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition p-1"
              title="Eliminar clasificación"
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
          )}
        </div>
      )}
    </li>
  );
}