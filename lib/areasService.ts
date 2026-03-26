import { supabase } from "./supabaseClient";

export interface AreaItem {
  id: string;
  nombre: string;
  id_dependencias: string;
  created_at: string;
}

interface AreaRow {
  id: number;
  nombre: string;
  id_dependencias: number;
  created_at: string;
}

export async function fetchAreasByDependencia(
  dependenciaId: string
): Promise<{
  data: AreaItem[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("areas")
    .select("id,nombre,id_dependencias,created_at")
    .eq("id_dependencias", parseInt(dependenciaId))
    .order("nombre", { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  const areas: AreaItem[] = (data || []).map((a: AreaRow) => ({
    id: String(a.id),
    nombre: a.nombre,
    id_dependencias: String(a.id_dependencias),
    created_at: a.created_at,
  }));

  return { data: areas, error: null };
}

export async function addArea(
  nombre: string,
  dependenciaId: string
): Promise<{
  data: AreaItem | null;
  error: string | null;
}> {
  if (!nombre.trim()) {
    return { data: null, error: "El nombre del área no puede estar vacío" };
  }

  const { data, error } = await supabase
    .from("areas")
    .insert([
      {
        nombre: nombre.trim(),
        id_dependencias: parseInt(dependenciaId),
      },
    ])
    .select("id,nombre,id_dependencias,created_at");

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data || data.length === 0) {
    return { data: null, error: "No se pudo crear el área" };
  }

  const area: AreaItem = {
    id: String(data[0].id),
    nombre: data[0].nombre,
    id_dependencias: String(data[0].id_dependencias),
    created_at: data[0].created_at,
  };

  return { data: area, error: null };
}

export async function updateArea(
  areaId: string,
  nombre: string
): Promise<{
  data: AreaItem | null;
  error: string | null;
}> {
  if (!nombre.trim()) {
    return { data: null, error: "El nombre del área no puede estar vacío" };
  }

  const { data, error } = await supabase
    .from("areas")
    .update({ nombre: nombre.trim() })
    .eq("id", parseInt(areaId))
    .select("id,nombre,id_dependencias,created_at");

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data || data.length === 0) {
    return { data: null, error: "No se pudo actualizar el área" };
  }

  const area: AreaItem = {
    id: String(data[0].id),
    nombre: data[0].nombre,
    id_dependencias: String(data[0].id_dependencias),
    created_at: data[0].created_at,
  };

  return { data: area, error: null };
}

export async function deleteArea(areaId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const { error } = await supabase
    .from("areas")
    .delete()
    .eq("id", parseInt(areaId));

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
