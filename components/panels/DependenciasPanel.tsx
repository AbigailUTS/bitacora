"use client";

import React, { useEffect, useState } from "react";
import { useIsAdmin } from "../../lib/useIsAdmin";
import {
  fetchDependencias,
  addDependencia,
  removeDependencia,
  type DependenciasItem,
} from "../../lib/dependenciasService";
import DependenciaCard from "../DependenciaCard";
import DependenciasAdminPanel from "./DependenciasAdminPanel";

interface DependenciasPanelProps {
  onClose: () => void;
}

export default function DependenciasPanel({ onClose }: DependenciasPanelProps) {
  const { isAdmin } = useIsAdmin();
  const [dependencias, setDependencias] = useState<DependenciasItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const loadDependencias = async () => {
      setLoading(true);
      const { data, error: fetchError } = await fetchDependencias();
      if (fetchError) {
        setError(fetchError);
      } else {
        setDependencias(data);
      }
      setLoading(false);
    };

    loadDependencias();
  }, []);

  const handleAddDependencia = async () => {
    const { data, error: addError } = await addDependencia(inputValue);

    if (addError) {
      setError(addError);
    } else if (data) {
      setDependencias([...dependencias, data]);
      setInputValue("");
    }
  };

  const handleRemoveDependencia = async (id: string) => {
    const { success, error: removeError } = await removeDependencia(id);

    if (removeError) {
      setError(removeError);
    } else if (success) {
      setDependencias(dependencias.filter((dep) => dep.id !== id));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddDependencia();
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel de administración - Solo para admins */}
      {isAdmin && (
        <div className="space-y-6">
          <DependenciasAdminPanel
            inputValue={inputValue}
            setInputValue={setInputValue}
            addDependencia={handleAddDependencia}
            handleKeyPress={handleKeyPress}
          />
        </div>
      )}

      {/* Lista de dependencias - Visible para todos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dependencias
        </h3>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Dependencias registradas ({dependencias.length})
        </h4>
        {loading && (
          <div className="text-sm text-gray-600 mb-3">Cargando dependencias…</div>
        )}
        {error && (
          <div className="text-sm text-red-600 mb-3">Error: {error}</div>
        )}
        {dependencias.length > 0 ? (
          <ul className="space-y-2">
            {dependencias.map((dependencia) => (
              <DependenciaCard
                key={dependencia.id}
                dependencia={dependencia}
                onRemove={handleRemoveDependencia}
                isAdmin={isAdmin}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1M9 7a1 1 0 011-1h2a1 1 0 011 1m0 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No hay dependencias registradas</p>
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
