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
  const [reportes, setReportes] = useState<(Reporte & { user_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('fecha');
  const [search, setSearch] = useState('');
  const [selectedReporte, setSelectedReporte] = useState<(Reporte & { user_name?: string }) | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const updateStatus = async () => {
    if (!selectedReporte) return;
    const { error } = await supabase.from('reportes').update({ estatus_ticket: newStatus }).eq('id', selectedReporte.id);
    if (error) {
      setError('Error al actualizar el estado del reporte');
    } else {
      // recargar reportes
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
      setShowModal(false);
      setSelectedReporte(null);
      setNewStatus('');
    }
  };

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
        setReportes(data || []);
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

  const sortedReportes = [...reportes].sort((a, b) => {
    if (filter === 'fecha') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (filter === 'urgencia') {
      const urgenciaOrder = { 'muy urgente': 4, 'urgente': 3, 'normal': 2, 'no urgente': 1 };
      return urgenciaOrder[b.urgencia_reporte as keyof typeof urgenciaOrder] - urgenciaOrder[a.urgencia_reporte as keyof typeof urgenciaOrder];
    }
    return 0;
  });

  const filteredReportes = isAdmin && search ? sortedReportes.filter(r => r.user_name?.toLowerCase().includes(search.toLowerCase())) : sortedReportes;

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

      {isAdmin && (
        <div>
          <input
            type="text"
            placeholder="Buscar por usuario"
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
          <p className="text-gray-500">No hay reportes disponibles.</p>
        ) : (
          filteredReportes.map((reporte) => (
            <div
              key={reporte.id}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition ${isAdmin ? 'cursor-pointer' : ''}`}
              onClick={() => {
                if (isAdmin) {
                  setSelectedReporte(reporte);
                  setShowModal(true);
                  setNewStatus(reporte.estatus_ticket);
                }
              }}
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
              {isAdmin && reporte.user_name && (
                <p className="text-sm text-gray-500">Creado por: {reporte.user_name}</p>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && selectedReporte && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h4 className="font-medium text-gray-900 mb-4">Modificar estado del reporte</h4>
            <p className="text-sm text-gray-600 mb-4">{selectedReporte.asunto}</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="finalizado">Finalizado</option>
            </select>
            <div className="flex space-x-2">
              <button onClick={updateStatus} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Actualizar</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Cerrar
      </button>
    </div>
  );
}
