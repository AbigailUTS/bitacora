"use client";

import React from "react";

interface DependenciaItem {
  id: string;
  nombre: string;
}

interface DependenciaCardProps {
  dependencia: DependenciaItem;
  onRemove: (id: string) => void;
  isAdmin: boolean;
}

export default function DependenciaCard({
  dependencia,
  onRemove,
  isAdmin,
}: DependenciaCardProps) {
  return (
    <li className="group flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition">
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
      {isAdmin && (
        <button
          onClick={() => onRemove(dependencia.id)}
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
      )}
    </li>
  );
}
