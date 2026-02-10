import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkIsAdmin = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener usuario autenticado
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          setError(authError.message);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Verificar si el usuario está en la tabla admin
        const { data, error: queryError } = await supabase
          .from("admin")
          .select("id")
          .eq("id", user.id)
          .single();

        if (queryError && queryError.code !== "PGRST116") {
          // PGRST116 significa que no hay registros (es normal para no-admins)
          setError(queryError.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkIsAdmin();
  }, []);

  return { isAdmin, loading, error };
}
