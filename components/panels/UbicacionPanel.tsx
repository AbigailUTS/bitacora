"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useIsAdmin } from "../../lib/useIsAdmin";
import UbicacionCard from "../UbicacionCard";
import UbicacionAdminPanel from "./UbicacionAdminPanel";

interface UbicacionItem {
  id: string;
  nombre: string;
  direccion: string;
  link: string;
}

interface UbicacionRow {
  id: number;
  nombre: string;
  descripcion: string;
  link: string;
}

interface UbicacionPanelProps {
  onClose: () => void;
}

export default function UbicacionPanel({ onClose }: UbicacionPanelProps) {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [ubicaciones, setUbicaciones] = useState<UbicacionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", direccion: "", link: "" });

  useEffect(() => {
    const fetchUbicaciones = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("ubicacion")
        .select("id,nombre,descripcion,link")
        .order("nombre", { ascending: true });

      if (error) {
        setError(error.message);
        setUbicaciones([]);
      } else if (data) {
        setUbicaciones(
          data.map((d: UbicacionRow) => ({
            id: String(d.id),
            nombre: d.nombre,
            direccion: d.descripcion,
            link: d.link,
          }))
        );
      }
      setLoading(false);
    };

    fetchUbicaciones();
  }, []);

  const addUbicacion = async () => {
    if (formData.nombre.trim() && formData.direccion.trim() && formData.link.trim()) {
      const { data, error } = await supabase
        .from("ubicacion")
        .insert([
          {
            nombre: formData.nombre.trim(),
            descripcion: formData.direccion.trim(),
            link: formData.link.trim(),
          },
        ])
        .select("id,nombre,descripcion,link");

      if (error) {
        setError(error.message);
      } else if (data && data.length > 0) {
        const newUbicacion = {
          id: String(data[0].id),
          nombre: data[0].nombre,
          direccion: data[0].descripcion,
          link: data[0].link,
        };
        setUbicaciones([...ubicaciones, newUbicacion]);
        setFormData({ nombre: "", direccion: "", link: "" });
        setShowForm(false);
      }
    }
  };

  const removeUbicacion = async (id: string) => {
    const { error } = await supabase
      .from("ubicacion")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      setError(error.message);
    } else {
      setUbicaciones(ubicaciones.filter((ub) => ub.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel de administración - Solo para admins */}
      {isAdmin && (
        <div className="space-y-6">
          <UbicacionAdminPanel
            ubicaciones={ubicaciones}
            setUbicaciones={setUbicaciones}
            formData={formData}
            setFormData={setFormData}
            showForm={showForm}
            setShowForm={setShowForm}
            addUbicacion={addUbicacion}
            error={error}
            setError={setError}
          />
        </div>
      )}

      {/* Lista de ubicaciones - Visible para todos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ubicaciones
        </h3>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Ubicaciones registradas ({ubicaciones.length})
        </h4>
        {loading && (
          <div className="text-sm text-gray-600 mb-3">Cargando ubicaciones…</div>
        )}
        {error && (
          <div className="text-sm text-red-600 mb-3">Error: {error}</div>
        )}
        {ubicaciones.length > 0 ? (
          <ul className="space-y-3">
            {ubicaciones.map((ubicacion) => (
              <UbicacionCard
                key={ubicacion.id}
                ubicacion={ubicacion}
                onRemove={removeUbicacion}
                isAdmin={isAdmin}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-2"
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
            <p className="text-gray-500 font-medium">No hay ubicaciones registradas</p>
          </div>
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
