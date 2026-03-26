import { supabase } from './supabaseClient';
import { ReporteInsert, Reporte } from './models/reporte';

export interface AreaOption {
  id: string;
  nombre: string;
}

export async function fetchUserRole(userId: string): Promise<{ role: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', userId)
    .limit(1)
    .single();

  if (error) return { role: null, error: error.message };
  return { role: data?.role ?? null, error: null };
}

export async function fetchAreasByDependenciaForReportes(dependenciaId: string): Promise<{ data: AreaOption[]; error: string | null }> {
  const { data, error } = await supabase
    .from('areas')
    .select('id,nombre')
    .eq('id_dependencias', parseInt(dependenciaId))
    .order('nombre', { ascending: true });

  if (error) {
    return { data: [], error: error.message };
  }

  // Si no hay áreas, retornar "General"
  if (!data || data.length === 0) {
    return { data: [{ id: 'general', nombre: 'General' }], error: null };
  }

  const areas: AreaOption[] = data.map((a: any) => ({
    id: String(a.id),
    nombre: a.nombre,
  }));

  return { data: areas, error: null };
}

export async function createReporte(reporte: ReporteInsert): Promise<{ data: ReporteInsert[] | null; error: string | null }> {
  console.log('createReporte called with:', reporte);
    const { data, error } = await supabase.from('reportes').insert([reporte]).select();
console.log('createReporte result:', { data, error });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function fetchReportes(userId: string, isAdmin: boolean): Promise<{ data: (Reporte & { user_name?: string; dependencia_nombre?: string; area_nombre?: string })[] | null; error: string | null }> {
  let reportesQuery = supabase.from('reportes').select(`
    *,
    dependencias:dependencia_id (
      nombre
    ),
    areas:area_id (
      nombre
    )
  `);
  if (!isAdmin) {
    reportesQuery = reportesQuery.eq('usuario_id', userId);
  }
  const { data: reportesData, error: reportesError } = await reportesQuery;
  if (reportesError) return { data: null, error: reportesError.message };
  if (!reportesData || reportesData.length === 0) {
    return { data: [], error: null };
  }
  // Obtener todos los usuario_id involucrados en los reportes
  const userIds = [...new Set(reportesData.map(r => r.usuario_id))];
  // Buscar emails en user_roles para todos los usuario_id
  const { data: usersData, error: usersError } = await supabase
    .from('user_roles')
    .select('id, email')
    .in('id', userIds);
  if (usersError) {
    const transformedData = reportesData.map(reporte => ({
      ...reporte,
      user_name: 'Desconocido',
      dependencia_nombre: reporte.dependencias?.nombre || 'Sin dependencia',
      area_nombre: reporte.areas?.nombre || 'General',
    }));
    return { data: transformedData, error: null };
  }
  const userMap = new Map(usersData?.map(u => [u.id, u.email]) || []);
  // Siempre mostrar el email correspondiente a cada usuario_id
  const transformedData = reportesData.map(reporte => ({
    ...reporte,
    user_name: userMap.get(reporte.usuario_id) || 'Desconocido',
    dependencia_nombre: reporte.dependencias?.nombre || 'Sin dependencia',
    area_nombre: reporte.areas?.nombre || 'General',
  }));
  return { data: transformedData, error: null };
}
