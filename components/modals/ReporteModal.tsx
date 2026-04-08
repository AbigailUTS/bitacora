"use client";

import React, { useEffect, useState } from "react";
import {
  fetchDependencias,
  DependenciasItem,
} from "../../lib/dependenciasService";
import { supabase } from "../../lib/supabaseClient";
import { fetchUserRole, createReporte, updateReporte, fetchAreasByDependenciaForReportes, type AreaOption } from "../../lib/reportesService";
import { fetchClasificaciones, type ClasificacionItem } from "../../lib/clasificacionesService";
import { ReporteInsert, Reporte } from "../../lib/models/reporte";

interface ReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporte?: Reporte | null; // si existe, es editar
  isAdmin?: boolean;
  onSuccess?: () => void;
}

export default function ReporteModal({ isOpen, onClose, reporte, isAdmin = false, onSuccess }: ReporteModalProps) {
  const [saving, setSaving] = useState(false);
  const [dependencias, setDependencias] = useState<DependenciasItem[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);
  const [areas, setAreas] = useState<AreaOption[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionItem[]>([]);
  const [loadingClasificaciones, setLoadingClasificaciones] = useState(false);
  const [notification, setNotification] = useState<{
    type: "error" | "success" | "warning";
    message: string;
  } | null>(null);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuarioEmail, setUsuarioEmail] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [dependenciaId, setDependenciaId] = useState<string | undefined>(undefined);
  const [areaId, setAreaId] = useState<string | undefined>(undefined);
  const [clasificacionId, setClasificacionId] = useState<string | undefined>(undefined);
  const [descripcion, setDescripcion] = useState("");
  const [evidencias, setEvidencias] = useState("");
  const [urgenciaReporte, setUrgenciaReporte] = useState<ReporteInsert["urgencia_reporte"]>("normal");
  const [estatusTicket, setEstatusTicket] = useState("pendiente");
  const [solucion, setSolucion] = useState("");

  const isEditing = !!reporte;
  const isReadOnly = isEditing && isAdmin; // admin solo puede editar estatus y solucion

  // Actualizar estados cuando el reporte cambie
  useEffect(() => {
    if (reporte) {
      // eslint-disable-next-line
      setDependenciaId(reporte.dependencia_id.toString());
      setAreaId(reporte.area_id?.toString());
      setClasificacionId(reporte.clasificacion_id?.toString());
      setDescripcion(reporte.descripcion || "");
      setEvidencias(reporte.evidencias || "");
      setUrgenciaReporte(reporte.urgencia_reporte || "normal");
      setEstatusTicket(reporte.estatus_ticket || "pendiente");
      setSolucion(reporte.solucion || "");
    } else {
      // Reset para nuevo reporte
      setDependenciaId(undefined);
      setAreaId(undefined);
      setClasificacionId(undefined);
      setDescripcion("");
      setEvidencias("");
      setUrgenciaReporte("normal");
      setEstatusTicket("pendiente");
      setSolucion("");
    }
  }, [reporte]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadDeps() {
      setLoadingDeps(true);
      const { data, error } = await fetchDependencias();
      if (!error) setDependencias(data);
      setLoadingDeps(false);
    }
    loadDeps();

    async function loadClasificaciones() {
      setLoadingClasificaciones(true);
      const { data, error } = await fetchClasificaciones();
      if (!error) setClasificaciones(data);
      setLoadingClasificaciones(false);
    }
    loadClasificaciones();

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUsuarioId(data.user.id);
        setUsuarioEmail(data.user.email ?? null);
        const r = await fetchUserRole(data.user.id);
        if (!r.error) setRol(r.role);
      }
    }
    loadUser();
  }, [isOpen]);

  // Cargar áreas cuando cambia la dependencia
  useEffect(() => {
    if (dependenciaId) {
      (async () => {
        setLoadingAreas(true);
        const { data, error } = await fetchAreasByDependenciaForReportes(dependenciaId);
        if (!error) {
          setAreas(data);
        }
        setLoadingAreas(false);
      })();
    } else {
      // eslint-disable-next-line
      setAreas([]);
      setAreaId(undefined);
    }
  }, [dependenciaId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!usuarioId && !isEditing) {
      setNotification({ type: "error", message: "No se detectó usuario." });
      return;
    }
    if (!descripcion.trim()) {
      setNotification({ type: "error", message: "Descripción requerida." });
      return;
    }
    if (dependenciaId === undefined) {
      setNotification({ type: "error", message: "Dependencia requerida." });
      return;
    }
    if (areaId === undefined && !isReadOnly) {
      setNotification({ type: "error", message: "Área requerida." });
      return;
    }
    if (clasificacionId === undefined && !isReadOnly) {
      setNotification({ type: "error", message: "Clasificación requerida." });
      return;
    }

    const dependenciaIdNum = parseInt(dependenciaId);
    if (isNaN(dependenciaIdNum)) {
      setNotification({ type: "error", message: "Dependencia inválida." });
      return;
    }

    const areaIdNum = areaId && areaId !== 'general' ? parseInt(areaId) : null;
    const clasificacionIdNum = clasificacionId ? parseInt(clasificacionId) : null;
    const selectedClasificacion = clasificaciones.find((c) => c.id === String(clasificacionIdNum));
    const asuntoValue = selectedClasificacion?.nombre || reporte?.asunto || "";

    if (isEditing) {
      // Actualizar
      const payload: Partial<Reporte> = {
        descripcion: descripcion.trim(),
        evidencias: evidencias?.trim() || undefined,
        urgencia_reporte: urgenciaReporte,
        estatus_ticket: estatusTicket,
        solucion: solucion?.trim() || null,
        updated_at: new Date().toISOString(),
      };
      if (!isReadOnly) {
        payload.dependencia_id = dependenciaIdNum;
        payload.area_id = areaIdNum;
        payload.clasificacion_id = clasificacionIdNum;
        payload.asunto = asuntoValue;
      }

      setSaving(true);
      const { error } = await updateReporte(reporte.id, payload);
      setSaving(false);
      if (error) {
        setNotification({
          type: "error",
          message: "Error al actualizar reporte: " + error,
        });
        return;
      }
      setNotification({
        type: "success",
        message: "Reporte actualizado correctamente.",
      });
    } else {
      // Crear
      const payload: ReporteInsert = {
        usuario_id: usuarioId!,
        asunto: asuntoValue,
        descripcion: descripcion.trim(),
        evidencias: evidencias?.trim() || undefined,
        dependencia_id: dependenciaIdNum,
        area_id: areaIdNum,
        clasificacion_id: clasificacionIdNum,
        urgencia_reporte: urgenciaReporte,
        estatus_ticket: "pendiente",
      };

      setSaving(true);
      const { error } = await createReporte(payload);
      setSaving(false);
      if (error) {
        setNotification({
          type: "error",
          message: "Error al crear reporte: " + error,
        });
        return;
      }
      setNotification({
        type: "success",
        message: "Reporte creado correctamente.",
      });
    }

    onClose();
    if (onSuccess) onSuccess();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {notification && (
        <div
          className={`absolute top-8 right-8 max-w-sm rounded-lg shadow-lg flex items-start gap-3 p-4 animate-in slide-in-from-top-2 ${
            notification.type === "error"
              ? "bg-red-50 border border-red-200"
              : notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <div
            className={`shrink-0 h-5 w-5 rounded-full mt-0.5 ${
              notification.type === "error"
                ? "bg-red-500"
                : notification.type === "success"
                  ? "bg-green-500"
                  : "bg-yellow-500"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              notification.type === "error"
                ? "text-red-800"
                : notification.type === "success"
                  ? "text-green-800"
                  : "text-yellow-800"
            }`}
          >
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className={`shrink-0 h-5 w-5 flex items-center justify-center rounded hover:bg-white/50 transition ${
              notification.type === "error"
                ? "text-red-600"
                : notification.type === "success"
                  ? "text-green-600"
                  : "text-yellow-600"
            }`}
          >
            ×
          </button>
        </div>
      )}

      <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg p-6 max-h-screen overflow-y-auto">
        {isEditing && reporte && (
          <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500">
            ID #{reporte.id}
          </span>
        )}
        <h4 className="text-lg font-semibold mb-3">{isEditing ? "Editar reporte" : "Nuevo reporte"}</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Fecha
              </label>
              <input
                value={isEditing ? new Date(reporte.created_at).toLocaleString() : new Date().toLocaleString()}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Usuario
              </label>
              <input
                value={usuarioEmail ?? "—"}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Rol</label>
            <input
              value={rol ?? "—"}
              disabled
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Dependencia
            </label>
            <select
              value={dependenciaId || ""}
              onChange={(ev) =>
                setDependenciaId(ev.target.value || undefined)
              }
              disabled={isReadOnly}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            >
              <option value="">Seleccionar...</option>
              {loadingDeps ? (
                <option>cargando...</option>
              ) : (
                dependencias.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Área
            </label>
            <select
              value={areaId || ""}
              onChange={(ev) => setAreaId(ev.target.value || undefined)}
              disabled={isReadOnly || !dependenciaId || loadingAreas}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            >
              <option value="">Seleccionar...</option>
              {loadingAreas ? (
                <option>cargando...</option>
              ) : (
                areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Clasificación
            </label>
            <select
              value={clasificacionId || ""}
              onChange={(ev) => setClasificacionId(ev.target.value || undefined)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            >
              <option value="">Seleccionar...</option>
              {loadingClasificaciones ? (
                <option>cargando...</option>
              ) : (
                clasificaciones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isReadOnly}
              rows={6}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            />
          </div>

          {/* <div>
            <label className="block text-sm text-gray-700 mb-1">
              Evidencias (URL)
            </label>
            <input
              value={evidencias}
              onChange={(e) => setEvidencias(e.target.value)}
              disabled={isReadOnly}
              placeholder="https://..."
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            />
          </div> */}

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Urgencia
            </label>
            <select
              value={urgenciaReporte}
              onChange={(e) =>
                setUrgenciaReporte(
                  e.target.value as ReporteInsert["urgencia_reporte"],
                )
              }
              disabled={isReadOnly}
              className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
            >
              <option value="no urgente">no urgente</option>
              <option value="normal">normal</option>
              <option value="urgente">urgente</option>
              <option value="muy urgente">muy urgente</option>
            </select>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Estatus
              </label>
              <select
                value={estatusTicket}
                onChange={(e) => setEstatusTicket(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="pendiente">pendiente</option>
                <option value="en progreso">en progreso</option>
                <option value="finalizado">finalizado</option>
              </select>
            </div>
          )}

          {isEditing && isAdmin && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Solución
              </label>
              <textarea
                value={solucion}
                onChange={(e) => setSolucion(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Guardando..." : isEditing ? "Actualizar" : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}