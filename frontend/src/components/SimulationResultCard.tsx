/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Tag, AlertOctagon, AlertCircle, Info, Clock } from 'lucide-react';
import { Ticket, SimulatedClassification } from '../types';

interface SimulationResultCardProps {
  ticket: Ticket;
  classification: SimulatedClassification;
}

export const SimulationResultCard: React.FC<SimulationResultCardProps> = ({
  ticket,
  classification,
}) => {
  const renderPriorityBadge = (priority: 'alta' | 'media' | 'baja') => {
    switch (priority) {
      case 'alta':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-sm shadow-rose-950/40">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Prioridad Alta</span>
          </span>
        );
      case 'media':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800/80 shadow-sm shadow-amber-950/40">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Prioridad Media</span>
          </span>
        );
      case 'baja':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-blue-950/80 text-blue-300 border border-blue-800/80 shadow-sm shadow-blue-950/40">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Prioridad Baja</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#101726] border border-blue-600/40 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header del resultado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Simulación Finalizada con Éxito
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Resultado de Clasificación Simulada
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Hora simulación:</span>
          <span className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            {classification.timestampSimulacion}
          </span>
        </div>
      </div>

      {/* Grid de Atributos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* ID y Cliente */}
        <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/90 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
            Ticket ID & Solicitante
          </span>
          <div className="font-mono font-bold text-base text-blue-400">
            #{ticket.id}
          </div>
          <div className="text-white font-medium text-sm">
            {ticket.cliente}
          </div>
        </div>

        {/* Estado y Título */}
        <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/90 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
            Estado & Asunto
          </span>
          <span className="capitalize px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 inline-block">
            {ticket.estado}
          </span>
          <p className="text-slate-200 text-xs font-medium truncate pt-1">
            {ticket.titulo}
          </p>
        </div>

        {/* Prioridad Asignada */}
        <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/90 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
            Prioridad Asignada
          </span>
          <div className="pt-0.5">
            {renderPriorityBadge(classification.prioridad)}
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            Determinada por análisis heurístico local
          </span>
        </div>

        {/* Categoría Asignada */}
        <div className="bg-[#0b1019] p-4 rounded-xl border border-slate-800/90 space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
            Categoría Asignada
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>{classification.categoria}</span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2 pt-1">
            {classification.explicacionSimulada}
          </p>
        </div>
      </div>

      {/* Aviso de separación arquitectónica */}
      <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-slate-300">Nota arquitectónica:</strong> Esta clasificación es una <span className="text-amber-300 font-semibold">simulación educativa local</span>. Los datos originales del ticket en <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">localStorage</code> mantienen sus campos originales (<code className="text-slate-300">prioridad: null</code>, <code className="text-slate-300">categoria: null</code>) intactos para no simular falsas escrituras en el backend real.
        </p>
      </div>
    </div>
  );
};
