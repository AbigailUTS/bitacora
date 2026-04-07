"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDependencias } from "../../lib/dependenciasService";
import { fetchReportesGraficas } from "../../lib/reportesService";

interface GraficasPanelProps {
  onClose: () => void;
}

interface DependenciaOption {
  value: string;
  label: string;
}

type Period = 'dia' | 'semana' | 'mes' | 'ano';

const allOption: DependenciaOption = { value: 'all', label: 'Todas las dependencias' };

export default function GraficasPanel({ onClose }: GraficasPanelProps) {
  const [dependencias, setDependencias] = useState<DependenciaOption[]>([]);
  const [selectedDependencias, setSelectedDependencias] = useState<readonly DependenciaOption[]>([allOption]);
  const [period, setPeriod] = useState<Period>('mes');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [useDateRange, setUseDateRange] = useState<boolean>(false);
  const [chartData, setChartData] = useState<{ fecha: string; cantidad: number }[]>([]);
  const [totalReportes, setTotalReportes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDependencias = async () => {
      const { data, error } = await fetchDependencias();
      if (!error && data) {
        const options = data.map(dep => ({ value: dep.id, label: dep.nombre }));
        setDependencias(options);
      }
    };
    loadDependencias();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const isAll = selectedDependencias.some(d => d.value === 'all');
      const dependenciaIds = isAll || selectedDependencias.length === 0 ? null : selectedDependencias.map(d => d.value);
      const start = useDateRange && startDate ? startDate : null;
      const end = useDateRange && endDate ? endDate : null;
      const { data, error } = await fetchReportesGraficas(dependenciaIds, start, end, period);

      if (error) {
        setChartData([]);
        setTotalReportes(0);
        setError(error);
      } else if (!data || data.length === 0) {
        setChartData([]);
        setTotalReportes(0);
      } else {
        setChartData(data);
        setTotalReportes(data.reduce((sum, item) => sum + item.cantidad, 0));
      }

      setLoading(false);
    };
    loadData();
  }, [selectedDependencias, period, startDate, endDate, useDateRange]);

  const handleDependenciaChange = (selected: readonly DependenciaOption[] | null) => {
    if (!selected || selected.length === 0) {
      setSelectedDependencias([allOption]);
      return;
    }

    const selectedValues = selected.map((opt) => opt.value);
    const selectedHasAll = selectedValues.includes('all');

    if (selectedHasAll && selected.length === 1) {
      setSelectedDependencias([allOption]);
      return;
    }

    if (selectedHasAll && selected.length > 1) {
      setSelectedDependencias(selected.filter((opt) => opt.value !== 'all'));
      return;
    }

    setSelectedDependencias(selected);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gráficas y métricas
        </h3>
        <p className="text-gray-600">
          Visualización de datos y estadísticas de reportes.
        </p>
      </div>

      {/* Filtros */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dependencias
          </label>
          <Select
            isMulti
            options={[allOption, ...dependencias]}
            value={selectedDependencias}
            onChange={handleDependenciaChange}
            placeholder="Seleccionar dependencias..."
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista por
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="ano">Año</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de fechas
          </label>
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="dateRange"
                checked={!useDateRange}
                onChange={() => setUseDateRange(false)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Siempre</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="dateRange"
                checked={useDateRange}
                onChange={() => setUseDateRange(true)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Rango personalizado</span>
            </div>
            {useDateRange && (
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-gray-100 rounded-lg p-8 h-48 flex items-center justify-center">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="text-md font-semibold mb-2">Cantidad de reportes</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} tickFormatter={(value) => String(value)} />
                <Tooltip formatter={(value) => [Number(value).toFixed(0), 'Reportes']} />
                <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
            {error && (
              <p className="text-sm text-red-600 mt-3">Error al cargar datos: {error}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total de reportes</p>
          <p className="text-2xl font-bold text-indigo-600">{totalReportes}</p>
        </div>
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
