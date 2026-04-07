"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useIsAdmin } from "../../lib/useIsAdmin";
import { fetchReportes } from "../../lib/reportesService";
import { Reporte } from "../../lib/models/reporte";

interface HistorialReportesProps {
  onClose: () => void;
}

export default function HistorialReportesPanel({ onClose }: HistorialReportesProps) {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [reportes, setReportes] = useState<(Reporte & { user_name?: string; dependencia_nombre?: string; area_nombre?: string; clasificacion_nombre?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('fecha');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
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
        const filtrados = (data || []).filter(r => r.estatus_ticket === "finalizado");
      
        setReportes(filtrados);
      }
      setLoading(false);
    };
    if (!adminLoading) {
      load();
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

  const sortedReportes = [...reportes].sort((a, b) => {
    if (filter === 'fecha') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (filter === 'urgencia') {
      const urgenciaOrder = { 'muy urgente': 4, 'urgente': 3, 'normal': 2, 'no urgente': 1 };
      return urgenciaOrder[b.urgencia_reporte as keyof typeof urgenciaOrder] - urgenciaOrder[a.urgencia_reporte as keyof typeof urgenciaOrder];
    }
    return 0;
  });

  let filteredReportes = sortedReportes;
  if (isAdmin && search) {
    const term = search.toLowerCase();
    filteredReportes = filteredReportes.filter(
      (r) =>
        String(r.id).includes(term) ||
        r.user_name?.toLowerCase().includes(term) ||
        r.clasificacion_nombre?.toLowerCase().includes(term),
    );
  }

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
          Historial de reportes finalizados
        </h3>
        <p className="text-gray-600">
          Consulta los reportes finalizados {isAdmin ? "de todos los usuarios" : "recientes"}.
        </p>
      </div>

      {isAdmin && (
        <div>
          <input
            type="text"
            placeholder="Buscar por id, usuario o clasificación"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
          />
        </div>
      )}

      <div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="urgencia">Ordenar por urgencia (mayor a menor)</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredReportes.length === 0 ? (
          <p className="text-gray-500">No hay reportes finalizados disponibles.</p>
        ) : (
          filteredReportes.map((reporte) => (
            <div
              key={reporte.id}
              className={`relative border border-gray-200 rounded-lg p-4 pt-8 hover:shadow-md transition`}
            >
              <span className="absolute top-3 right-3 text-xs font-semibold text-gray-500">
                ID #{reporte.id}
              </span>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{reporte.clasificacion_nombre}</h4>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getUrgenciaColor(
                    reporte.urgencia_reporte
                  )}`}
                >
                  {reporte.urgencia_reporte}
                </span>
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
