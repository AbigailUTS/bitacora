"use client";

import React, { useEffect, useState } from "react";
import { fetchDependencias, DependenciasItem } from "../../lib/dependenciasService";
import { supabase } from "../../lib/supabaseClient";
import { fetchUserRole, createReporte } from "../../lib/reportesService";
import { ReporteInsert } from "../../lib/models/reporte";

interface GenerarReporteProps {
  onClose?: () => void;
}

export default function GenerarReportePanel({ onClose }: GenerarReporteProps) {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dependencias, setDependencias] = useState<DependenciasItem[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuarioEmail, setUsuarioEmail] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [dependenciaId, setDependenciaId] = useState<string | undefined>(undefined);
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [evidencias, setEvidencias] = useState("");
  const [urgenciaReporte, setUrgenciaReporte] = useState<ReporteInsert['urgencia_reporte']>('normal');

  useEffect(() => {
    async function loadDeps() {
      setLoadingDeps(true);
      const { data, error } = await fetchDependencias();
      if (!error) setDependencias(data);
      setLoadingDeps(false);
    }
    loadDeps();

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
  }, []);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!usuarioId) return alert('No se detectó usuario.');
    if (!asunto.trim()) return alert('Asunto requerido.');
    if (!descripcion.trim()) return alert('Descripción requerida.');

    const payload: ReporteInsert = {
      usuario_id: usuarioId,
      asunto: asunto.trim(),
      descripcion: descripcion.trim(),
      evidencias: evidencias?.trim() || undefined,
      dependencia_id: dependenciaId,
      urgencia_reporte: urgenciaReporte,
      estatus_ticket: 'pendiente',
    };

    setSaving(true);
    const { data, error } = await createReporte(payload);
    setSaving(false);
    if (error) {
      alert('Error al crear reporte: ' + error);
      return;
    }

    setShowModal(false);
    // limpiar formulario
    setAsunto('');
    setDescripcion('');
    setEvidencias('');
    setDependenciaId(undefined);
    setUrgenciaReporte('normal');

    if (onClose) onClose();
    alert('Reporte creado correctamente.');
  }

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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">Nuevo reporte</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha</label>
                  <input value={new Date().toLocaleString()} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Usuario</label>
                  <input value={usuarioEmail ?? '—'} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Rol</label>
                <input value={rol ?? '—'} disabled className="w-full px-3 py-2 border rounded bg-gray-100" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Dependencia</label>
                <select value={dependenciaId || ''} onChange={(ev) => setDependenciaId(ev.target.value || undefined)} className="w-full px-3 py-2 border rounded">
                  <option value="">Seleccionar...</option>
                  {loadingDeps ? (
                    <option>cargando...</option>
                  ) : (
                    dependencias.map((d) => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))
                  )}
                </select>
              </div>

             <div>
                <label className="block text-sm text-gray-700 mb-1">Asunto</label>
                <textarea value={asunto} onChange={(e) => setAsunto(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={6} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Evidencias (URL)</label>
                <input value={evidencias} onChange={(e) => setEvidencias(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Urgencia</label>
                <select value={urgenciaReporte} onChange={(e) => setUrgenciaReporte(e.target.value as ReporteInsert['urgencia_reporte'])} className="w-full px-3 py-2 border rounded">
                  <option value="no urgente">no urgente</option>
                  <option value="normal">normal</option>
                  <option value="urgente">urgente</option>
                  <option value="muy urgente">muy urgente</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancelar</button>
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded">{saving ? 'Guardando...' : 'Aceptar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
