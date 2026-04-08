"use client";

import React, { useState, useEffect } from "react";
import {
  fetchAreasByDependencia,
  addArea,
  updateArea,
  deleteArea,
  AreaItem,
} from "@/lib/areasService";

interface AreasAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependenciaId: string;
  dependenciaNombre: string;
}

export default function AreasAdminModal({
  isOpen,
  onClose,
  dependenciaId,
  dependenciaNombre,
}: AreasAdminModalProps) {
  const [areas, setAreas] = useState<AreaItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 

  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchAreasByDependencia(dependenciaId);

    if (error) {
      setError(error);
    } else {
      setAreas(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      (async () => {
        await loadAreas();
      })();
    }
  }, [isOpen, dependenciaId]);

  const handleAddArea = async () => {
    if (!inputValue.trim()) {
      setError("El nombre del área no puede estar vacío");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await addArea(inputValue, dependenciaId);

    if (error) {
      setError(error);
    } else if (data) {
      setAreas([...areas, data]);
      setInputValue("");
    }
    setLoading(false);
  };

  const handleUpdateArea = async (areaId: string) => {
    if (!editingValue.trim()) {
      setError("El nombre del área no puede estar vacío");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await updateArea(areaId, editingValue);

    if (error) {
      setError(error);
    } else if (data) {
      setAreas(areas.map((a) => (a.id === areaId ? data : a)));
      setEditingId(null);
      setEditingValue("");
    }
    setLoading(false);
  };

  const handleDeleteArea = async (areaId: string) => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta área? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await deleteArea(areaId);

    if (error) {
      setError(error);
    } else {
      setAreas(areas.filter((a) => a.id !== areaId));
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddArea();
    }
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    areaId: string
  ) => {
    if (e.key === "Enter") {
      handleUpdateArea(areaId);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingValue("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 md:p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gestionar Áreas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Dependencia: <span className="font-semibold">{dependenciaNombre}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 md:p-6">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Add new area */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Agregar nueva área
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Área de Ventas, Área de Finanzas..."
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handleAddArea}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? "..." : "Agregar"}
              </button>
            </div>
          </div>

          {/* Areas list */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Áreas existentes ({areas.length})
            </h3>

            {areas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay áreas creadas para esta dependencia</p>
              </div>
            ) : (
              <div className="space-y-2">
                {areas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    {editingId === area.id ? (
                      <>
                        <input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => handleEditKeyPress(e, area.id)}
                          autoFocus
                          disabled={loading}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <button
                          onClick={() => handleUpdateArea(area.id)}
                          disabled={loading}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:bg-green-400"
                        >
                          {loading ? "..." : "Guardar"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingValue("");
                          }}
                          disabled={loading}
                          className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition text-sm disabled:bg-gray-300"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-900">{area.nombre}</span>
                        <button
                          onClick={() => {
                            setEditingId(area.id);
                            setEditingValue(area.nombre);
                          }}
                          disabled={loading}
                          className="bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition text-sm disabled:bg-amber-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area.id)}
                          disabled={loading}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm disabled:bg-red-400"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 md:p-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
