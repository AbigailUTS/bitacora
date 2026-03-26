"use client";

import React, { useEffect, useState } from "react";
import { useIsAdmin } from "../../lib/useIsAdmin";
import {
  fetchClasificaciones,
  addClasificacion,
  updateClasificacion,
  removeClasificacion,
  type ClasificacionItem,
} from "../../lib/clasificacionesService";
import ClasificacionCard from "../ClasificacionCard";
import ClasificacionesAdminPanel from "./ClasificacionesAdminPanel";
import ConfirmationModal from "../ConfirmationModal";

interface ClasificacionesPanelProps {
  onClose: () => void;
}

export default function ClasificacionesPanel({ onClose }: ClasificacionesPanelProps) {
  const { isAdmin } = useIsAdmin();
  const [clasificaciones, setClasificaciones] = useState<ClasificacionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clasificacionToDelete, setClasificacionToDelete] = useState<ClasificacionItem | null>(null);

  useEffect(() => {
    const loadClasificaciones = async () => {
      setLoading(true);
      const { data, error: fetchError } = await fetchClasificaciones();
      if (fetchError) {
        setError(fetchError);
      } else {
        setClasificaciones(data);
      }
      setLoading(false);
    };

    loadClasificaciones();
  }, []);

  const handleAddClasificacion = async () => {
    const { data, error: addError } = await addClasificacion(inputValue);

    if (addError) {
      setError(addError);
    } else if (data) {
      setClasificaciones([...clasificaciones, data]);
      setInputValue("");
    }
  };

  const handleUpdateClasificacion = async () => {
    if (!editingId) return;

    const { data, error: updateError } = await updateClasificacion(editingId, inputValue);

    if (updateError) {
      setError(updateError);
    } else if (data) {
      setClasificaciones(clasificaciones.map((clas) =>
        clas.id === editingId ? data : clas
      ));
      setInputValue("");
      setEditingId(null);
    }
  };

  const handleEditClasificacion = (clasificacion: ClasificacionItem) => {
    setEditingId(clasificacion.id);
    setInputValue(clasificacion.nombre);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputValue("");
  };

  const handleRemoveClasificacion = (clasificacion: ClasificacionItem) => {
    setClasificacionToDelete(clasificacion);
    setDeleteModalOpen(true);
  };

  const confirmRemoveClasificacion = async () => {
    if (!clasificacionToDelete) return;

    const { success, error: removeError } = await removeClasificacion(clasificacionToDelete.id);

    if (removeError) {
      setError(removeError);
    } else if (success) {
      setClasificaciones(clasificaciones.filter((clas) => clas.id !== clasificacionToDelete.id));
    }

    setDeleteModalOpen(false);
    setClasificacionToDelete(null);
  };

  const cancelRemoveClasificacion = () => {
    setDeleteModalOpen(false);
    setClasificacionToDelete(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editingId) {
        handleUpdateClasificacion();
      } else {
        handleAddClasificacion();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelRemoveClasificacion}
        onConfirm={confirmRemoveClasificacion}
        title="Eliminar Clasificación"
        message={`¿Estás seguro de que quieres eliminar la clasificación "${clasificacionToDelete?.nombre}"? Esta acción no se puede deshacer.`}
      />

      {/* Panel de administración - Solo para admins */}
      {isAdmin && (
        <div className="space-y-6">
          <ClasificacionesAdminPanel
            inputValue={inputValue}
            setInputValue={setInputValue}
            addClasificacion={handleAddClasificacion}
            updateClasificacion={handleUpdateClasificacion}
            handleKeyPress={handleKeyPress}
            editingId={editingId}
            cancelEdit={handleCancelEdit}
          />
        </div>
      )}

      {/* Lista de clasificaciones - Visible para todos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Clasificaciones
        </h3>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Clasificaciones registradas ({clasificaciones.length})
        </h4>
        {loading && (
          <div className="text-sm text-gray-600 mb-3">Cargando clasificaciones…</div>
        )}
        {error && (
          <div className="text-sm text-red-600 mb-3">Error: {error}</div>
        )}
        {clasificaciones.length > 0 ? (
          <ul className="space-y-2">
            {clasificaciones.map((clasificacion) => (
              <ClasificacionCard
                key={clasificacion.id}
                clasificacion={clasificacion}
                onEdit={isAdmin ? handleEditClasificacion : undefined}
                onRemove={isAdmin ? handleRemoveClasificacion : undefined}
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No hay clasificaciones registradas</p>
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