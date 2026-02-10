import { supabase } from "./supabaseClient";

export interface DependenciasItem {
  id: string;
  nombre: string;
}

interface DependenciaRow {
  id: number;
  nombre: string;
}

export async function fetchDependencias(): Promise<{
  data: DependenciasItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("dependencias")
    .select("id,nombre")
    .order("nombre", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  const dependencias: DependenciasItem[] = (data || []).map((d: DependenciaRow) => ({
    id: String(d.id),
    nombre: d.nombre,
  }));

  return { data: dependencias, error: null };
}

export async function addDependencia(nombre: string): Promise<{
  data: DependenciasItem | null;
  error: string | null;
}> {
  if (!nombre.trim()) {
    return { data: null, error: "El nombre no puede estar vacío" };
  }

  const { data, error } = await supabase
    .from("dependencias")
    .insert([{ nombre: nombre.trim() }])
    .select("id,nombre");

  if (error) {
    return { data: null, error: error.message };
  }

  if (data && data.length > 0) {
    return {
      data: {
        id: String(data[0].id),
        nombre: data[0].nombre,
      },
      error: null,
    };
  }

  return { data: null, error: "Error al agregar dependencia" };
}

export async function removeDependencia(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const { error } = await supabase
    .from("dependencias")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
