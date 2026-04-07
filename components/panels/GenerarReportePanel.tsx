"use client";

import React, { useState } from "react";
import ReporteModal from "../modals/ReporteModal";

interface GenerarReporteProps {
  onClose?: () => void;
}

export default function GenerarReportePanel({ onClose }: GenerarReporteProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bienvenido</h3>
        <p className="text-gray-600">aqui puedes generar tu reporte</p>
      </div>

      <div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Generar reporte
        </button>
      </div>

      <ReporteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          if (onClose) onClose();
        }}
      />
    </div>
  );
}
