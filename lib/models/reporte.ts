export interface Reporte {
  id: number;
  created_at: string; // timestamp - auto creada por BD
  usuario_id: string;
  asunto: string;
  descripcion: string;
  evidencias?: string; // puede ser null
  dependencia_id: number; // referencia a tabla dependencias, bigint not null
  area_id?: number | null; // referencia a tabla areas, bigint nullable
  clasificacion_id?: number | null; // referencia a tabla clasificacion, bigint nullable
  urgencia_reporte: string; // 'no urgente' | 'normal' | 'urgente' | 'muy urgente'
  estatus_ticket: string; // 'pendiente' | 'en progreso' | 'finalizado'
  updated_at?: string | null; // timestamp - actualizada cuando se modifica
  solucion?: string | null; // texto de la solución
  // rol se obtiene de otra tabla mediante join
}

export type ReporteInsert = Omit<Reporte, 'id' | 'created_at'>;
