"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface RoleModalProps {
  userId: string;
  onRoleAssigned?: () => void;
}

export default function RoleModal({ userId, onRoleAssigned }: RoleModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const roles = ["Ingeniero", "Técnico", "Licenciado", "Practicante"];

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("id", userId)
        .single();

      // Si no hay error y hay datos con rol, el usuario ya tiene su información
      if (!roleError && roleData?.role) {
        return;
      }

      // Solo mostrar modal si no hay datos (error PGRST116 es "no rows found")
      if (roleError?.code === "PGRST116" || !roleData?.role) {
        setShowModal(true);
        setRoleError(null);
        return;
      }

      // Para otros errores, mostrar error y no mostrar modal
      if (roleError) {
        const message = typeof roleError === "object" && "message" in roleError ? (roleError as { message: string }).message : "Error al verificar rol";
        setRoleError(message);
      }
    };

    checkUserRole();
  }, [userId]);

  async function handleSaveRole() {
    if (!selectedRole) {
      setRoleError("Por favor selecciona un rol");
      return;
    }

    setRoleLoading(true);
    setRoleError(null);

    // Verificar que no exista rol para este usuario
    const { data: existingRole, error: checkError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 significa "no rows found", que es lo esperado
      setRoleError(checkError.message);
      setRoleLoading(false);
      return;
    }

    if (existingRole) {
      // El usuario ya tiene un rol asignado, no insertar duplicado
      setShowModal(false);
      setSelectedRole("");
      if (onRoleAssigned) onRoleAssigned();
      return;
    }

    const { error: insertError } = await supabase.from("user_roles").insert([
      {
        id: userId,
        role: selectedRole,
      },
    ]);

    setRoleLoading(false);
    if (insertError) {
      setRoleError(insertError.message);
    } else {
      setShowModal(false);
      setSelectedRole("");
      if (onRoleAssigned) onRoleAssigned();
    }
  }

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => {}} />

      <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">Completar información</h3>
        <p className="mb-4 text-sm text-black">Por favor selecciona tu rol para completar tu perfil.</p>

        <label className="text-sm text-black">Rol</label>
        <select
          aria-label="Role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 mt-2 mb-3 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          required
        >
          <option value="">Selecciona tu rol</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {roleError && <div className="mb-3 text-sm text-red-600">{roleError}</div>}

        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={handleSaveRole}
            className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60"
            type="button"
            disabled={roleLoading}
          >
            {roleLoading ? "Guardando..." : "Guardar rol"}
          </button>
        </div>
      </div>
    </div>
  );
}
