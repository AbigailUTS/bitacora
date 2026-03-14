"use client";


import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useIsAdmin } from "../lib/useIsAdmin";

interface InformacionUsuarioModalProps {
  userId: string;
  onInfoAssigned?: () => void;
}

export default function InformacionUsuarioModal({ userId, onInfoAssigned }: InformacionUsuarioModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roles = ["Ingeniero", "Técnico", "Licenciado", "Practicante"];
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    const checkUserInfo = async () => {
      // Checar si ya existe registro por id, nombre+apellidos, o email
      const { data: userData, error: userError } = await supabase
        .from("user_roles")
        .select("id, nombre, apellidos, email")
        .or(`id.eq.${userId},and(nombre.eq.${nombre},apellidos.eq.${apellidos}),email.eq.${email}`)
        .maybeSingle();

      if (!userError && userData) {
        // Si falta nombre, apellidos o email, mostrar modal para completar
        if (!userData.nombre || !userData.apellidos || !userData.email) {
          setShowModal(true);
          setError(null);
          return;
        }
        // Ya existe registro completo, no mostrar modal
        return;
      }

      // Si no existe, mostrar modal
      setShowModal(true);
      setError(null);
    };
    checkUserInfo();
  }, [userId, nombre, apellidos, email]);

  useEffect(() => {
    // Obtener email del usuario actual si no es admin
    const fetchUser = async () => {
      if (!isAdmin) {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user?.email) setEmail(data.user.email);
      }
    };
    fetchUser();
  }, [isAdmin]);

  async function handleSaveInfo() {
    if (!selectedRole || !nombre.trim() || !apellidos.trim()) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    // Checar duplicados por id, nombre+apellidos, o email
    const { data: existing, error: checkError } = await supabase
      .from("user_roles")
      .select("id")
      .or(`id.eq.${userId},and(nombre.eq.${nombre},apellidos.eq.${apellidos}),email.eq.${email}`)
      .maybeSingle();
console.log("Check existing:", { existing, checkError });
    if (checkError && checkError.code !== "PGRST116") {
      setError(checkError.message);
      setLoading(false);
      return;
    }


    if (existing) {
      // Actualizar el registro existente con la nueva información
      // Si el email es nulo o vacío, asignar automáticamente el email del usuario actual
      let finalEmail = email;
      if (!finalEmail) {
        const { data } = await supabase.auth.getUser();
        finalEmail = data?.user?.email || "";
      }
      if (!finalEmail) {
        setError("No se pudo obtener el email del usuario actual.");
        setLoading(false);
        return;
      }
      // Usar siempre el id del usuario autenticado para actualizar
      const { error: updateError } = await supabase
        .from("user_roles")
        .update({
          role: selectedRole,
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          email: finalEmail,
        })
        .eq("id", userId);
      setLoading(false);
      if (updateError) {
        setError(updateError.message);
      } else {
        setShowModal(false);
        setSelectedRole("");
        setNombre("");
        setApellidos("");
        setEmail("");
        if (onInfoAssigned) onInfoAssigned();
      }
      return;
    }

    // Si el email es nulo o vacío, asignar automáticamente el email del usuario actual
    let finalEmail = email;
    if (!finalEmail) {
      const { data } = await supabase.auth.getUser();
      finalEmail = data?.user?.email || "";
    }

    if (!finalEmail) {
      setError("No se pudo obtener el email del usuario actual.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("user_roles").insert([
      {
        id: userId,
        role: selectedRole,
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: finalEmail,
      },
    ]);

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
    } else {
      setShowModal(false);
      setSelectedRole("");
      setNombre("");
      setApellidos("");
      setEmail("");
      if (onInfoAssigned) onInfoAssigned();
    }
  }

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => {}} />

      <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-semibold">Completar información de usuario</h3>
        <p className="mb-4 text-sm text-black">Por favor completa tu información para continuar.</p>

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

        <label className="text-sm text-black">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 mt-2 mb-3 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          required
        />

        <label className="text-sm text-black">Apellidos</label>
        <input
          type="text"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 mt-2 mb-3 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          required
        />

        <label className="text-sm text-black">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 mt-2 mb-3 focus:border-green-500 focus:ring-2 focus:ring-green-100"
          required={!isAdmin}
          disabled={!isAdmin}
        />

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={handleSaveInfo}
            className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 disabled:opacity-60"
            type="button"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar información"}
          </button>
        </div>
      </div>
    </div>
  );
}
