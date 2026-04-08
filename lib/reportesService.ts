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

  const areas: AreaOption[] = data.map(({ id, nombre }) => ({
    id: String(id),
    nombre,
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

export async function fetchReportes(userId: string, isAdmin: boolean): Promise<{ data: (Reporte & { user_name?: string; dependencia_nombre?: string; area_nombre?: string; clasificacion_nombre?: string })[] | null; error: string | null }> {
  let reportesQuery = supabase.from('reportes').select(`
    *,
    dependencias:dependencia_id (
      nombre
    ),
    areas:area_id (
      nombre
    ),
    clasificacion:clasificacion_id (
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
      clasificacion_nombre: reporte.clasificacion?.nombre || 'Sin clasificar',
    }));
    return { data: transformedData, error: null };
  }
  const userMap = new Map(usersData?.map(u => [u.id, u.email]) || []);
  // Siempre mostrar el email correspondiente a cada usuario_id
  const transformedData = reportesData.map(reporte => {
    const dependenciaInfo = Array.isArray(reporte.dependencias) ? reporte.dependencias[0] : reporte.dependencias;
    const areaInfo = Array.isArray(reporte.areas) ? reporte.areas[0] : reporte.areas;
    const clasificacionInfo = Array.isArray(reporte.clasificacion) ? reporte.clasificacion[0] : reporte.clasificacion;

    return {
      ...reporte,
      user_name: userMap.get(reporte.usuario_id) || 'Desconocido',
      dependencia_nombre: dependenciaInfo?.nombre || 'Sin dependencia',
      area_nombre: areaInfo?.nombre || 'General',
      clasificacion_nombre: clasificacionInfo?.nombre || 'Sin clasificar',
    };
  });
  return { data: transformedData, error: null };
}

export async function updateReporte(id: number, updates: Partial<Reporte>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reportes').update(updates).eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export interface ReportesGraficasItem {
  fecha: string;
  total: number;
  [categoria: string]: string | number;
}

export interface ReportesGraficasCategory {
  key: string;
  label: string;
}

export async function fetchReportesGraficas(
  dependenciaIds: string[] | null,
  startDate: string | null,
  endDate: string | null,
  period: 'dia' | 'semana' | 'mes' | 'ano'
): Promise<{ data: ReportesGraficasItem[] | null; categories: ReportesGraficasCategory[]; error: string | null }> {
  let query = supabase
    .from('reportes')
    .select('created_at, dependencia_id, dependencias:dependencia_id(nombre)');

  if (dependenciaIds && dependenciaIds.length > 0) {
    query = query.in('dependencia_id', dependenciaIds.map(id => parseInt(id)));
  }

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data, error } = await query;
  if (error) return { data: null, categories: [], error: error.message };

  if (!data || data.length === 0) return { data: [], categories: [], error: null };

  const grouped = data.reduce((acc: { [fecha: string]: ReportesGraficasItem }, reporte) => {
    const date = new Date(reporte.created_at);
    let key: string;

    switch (period) {
      case 'dia':
        key = date.toISOString().split('T')[0];
        break;
      case 'semana':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split('T')[0];
        break;
      case 'mes':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'ano':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    const dependenciaId = reporte.dependencia_id !== null && reporte.dependencia_id !== undefined ? String(reporte.dependencia_id) : 'sin-dependencia';
    const categoryKey = `dep_${dependenciaId}`;

    if (!acc[key]) {
      acc[key] = { fecha: key, total: 0 };
    }

    acc[key].total += 1;
    acc[key][categoryKey] = (Number(acc[key][categoryKey] ?? 0) + 1) as number;
    return acc;
  }, {} as { [fecha: string]: ReportesGraficasItem });

  const categoriesMap = new Map<string, string>();
  data.forEach((reporte) => {
    const dependenciaId = reporte.dependencia_id !== null && reporte.dependencia_id !== undefined ? String(reporte.dependencia_id) : 'sin-dependencia';
    const dependenciaInfo = Array.isArray(reporte.dependencias) ? reporte.dependencias[0] : reporte.dependencias;
    const dependenciaNombre = dependenciaInfo?.nombre ?? 'Sin dependencia';
    categoriesMap.set(`dep_${dependenciaId}`, dependenciaNombre);
  });

  const categories = Array.from(categoriesMap.entries()).map(([key, label]) => ({ key, label }));

  const result = Object.values(grouped)
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .map((item) => {
      categories.forEach((category) => {
        if (item[category.key] === undefined) {
          item[category.key] = 0;
        }
      });
      return item;
    });

  return { data: result, categories, error: null };
}
