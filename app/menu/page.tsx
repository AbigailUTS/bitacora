"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import DashboardLayout from "../../components/DashboardLayout";
import RoleModal from "../../components/RoleModal";

export default function MenuPage() {
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      const user = data.user;
      setUserId(user.id);
      setEmail(user.email ?? undefined);
      const meta = (user.user_metadata as Record<string, string>) ?? {};
      const displayName = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : undefined);
      setName(displayName ?? undefined);
      setIsLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 mx-auto"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {userId && <RoleModal userId={userId} />}
      <DashboardLayout
        userEmail={email}
        userName={name}
        onLogout={handleLogout}
      >
        {/* Contenido por defecto cuando no hay panel activo */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Selecciona una opción
            </h2>
            <p className="text-gray-600">
              Pasa el mouse sobre los botones del menú para ver una vista previa o haz clic para abrir
            </p>
          </div>

          <div className="text-center text-gray-500 py-12">
            Selecciona una opción del menú para ver el contenido
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
