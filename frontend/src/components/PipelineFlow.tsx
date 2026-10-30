/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Server, 
  CheckCircle, 
  Database, 
  Cpu, 
  Layers, 
  Clock, 
  Loader2, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { SimulationStage, StageState } from '../types';

interface PipelineFlowProps {
  stages: SimulationStage[];
  activeStageId: number | null;
}

export const PipelineFlow: React.FC<PipelineFlowProps> = ({ stages, activeStageId }) => {
  const getStageIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Server className="w-5 h-5 text-blue-400" />;
      case 2:
        return <CheckCircle className="w-5 h-5 text-indigo-400" />;
      case 3:
        return <Database className="w-5 h-5 text-amber-400" />;
      case 4:
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 5:
        return <Layers className="w-5 h-5 text-emerald-400" />;
      default:
        return <Server className="w-5 h-5 text-blue-400" />;
    }
  };

  const renderStatusBadge = (estado: StageState) => {
    switch (estado) {
      case 'procesando':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Procesando</span>
          </span>
        );
      case 'completado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <Check className="w-3 h-3" />
            <span>Completado</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/80 text-red-300 border border-red-800/80">
            <AlertTriangle className="w-3 h-3" />
            <span>Error</span>
          </span>
        );
      case 'pendiente':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-normal bg-slate-900/90 text-slate-400 border border-slate-800">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Pendiente</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Flujo de Procesamiento en 5 Etapas
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            · Secuencia interactiva de simulación
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Simulación educativa
        </span>
      </div>

      {/* Grid de etapas conectadas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {stages.map((stage, idx) => {
          const isCurrentActive = activeStageId === stage.id;
          const isDone = stage.estado === 'completado';
          const isProcessing = stage.estado === 'procesando';

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                isProcessing
                  ? 'bg-[#152033] border-blue-500 shadow-lg shadow-blue-950/60 ring-1 ring-blue-500/50 scale-[1.02]'
                  : isDone
                  ? 'bg-[#101926] border-emerald-900/60 shadow-sm'
                  : 'bg-[#0f1420] border-slate-800/80 opacity-75'
              }`}
            >
              {/* Conector de flecha horizontal en desktop */}
              {idx < stages.length - 1 && (
                <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center">
                  <span
                    className={`text-xs font-mono font-bold transition-colors ${
                      isDone ? 'text-emerald-500' : 'text-slate-700'
                    }`}
                  >
                    ›
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                      isProcessing
                        ? 'bg-blue-900/40 border-blue-500 text-blue-300'
                        : isDone
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {getStageIcon(stage.id)}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    {stage.numero}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    {stage.nombre}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-blue-400/90 font-medium truncate">
                      {stage.operacion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1 line-clamp-2">
                    {stage.resumen}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/60 mt-3 flex items-center justify-between">
                {renderStatusBadge(stage.estado)}
                <span className="text-[10px] font-mono text-slate-400">
                  {stage.tecnologia.split(' ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
