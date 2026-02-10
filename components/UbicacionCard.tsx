"use client";

import React from "react";

interface UbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
  link: string;
}

interface UbicacionCardProps {
  ubicacion: UbicacionItem;
  onRemove: (id: string) => void;
  isAdmin: boolean;
}

export default function UbicacionCard({
  ubicacion,
  onRemove,
  isAdmin,
}: UbicacionCardProps) {
  const handleOpenLink = () => {
    if (ubicacion.link) {
      window.open(ubicacion.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <li className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition cursor-pointer">
      <div
        onClick={handleOpenLink}
        className="flex items-start justify-between"
      >
        <div className="flex gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 flex-shrink-0 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
              {ubicacion.nombre}
            </h5>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {ubicacion.direccion}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(ubicacion.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition p-1 flex-shrink-0"
            title="Eliminar ubicación"
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
    </li>
  );
}
