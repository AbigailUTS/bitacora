"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useIsAdmin } from "../../lib/useIsAdmin";
import { fetchReportes } from "../../lib/reportesService";
import { Reporte } from "../../lib/models/reporte";

interface EstatusReportesProps {
  onClose: () => void;
}

export default function EstatusReportesPanel({
  onClose,
}: EstatusReportesProps) {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReportes = async () => {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      const { data, error } = await fetchReportes(user.id, isAdmin);
      if (error) {
        setError(error);
      } else {
        setReportes(data || []);
      }
      setLoading(false);
    };

    if (!adminLoading) {
      loadReportes();
    }
  }, [isAdmin, adminLoading]);

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "muy urgente":
        return "bg-red-100 text-red-800";
      case "urgente":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-yellow-100 text-yellow-800";
      case "no urgente":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case "finalizado":
        return "bg-emerald-100 text-emerald-800";
      case "en progreso":
        return "bg-amber-100 text-amber-800";
      case "pendiente":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || adminLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Estado de reportes
        </h3>
        <p className="text-gray-600">
          Revisa el estado actual de {isAdmin ? "todos los" : "tus"} reportes.
        </p>
      </div>

      <div className="space-y-3">
        {reportes.length === 0 ? (
          <p className="text-gray-500">No hay reportes disponibles.</p>
        ) : (
          reportes.map((reporte) => (
            <div
              key={reporte.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{reporte.asunto}</h4>
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
              <p className="text-sm text-gray-500">
                Creado: {new Date(reporte.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
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
