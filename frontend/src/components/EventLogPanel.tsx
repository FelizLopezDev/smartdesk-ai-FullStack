/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, ShieldAlert, Sparkles, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { SimulatedEvent } from '../types';

interface EventLogPanelProps {
  events: SimulatedEvent[];
  isSimulating: boolean;
}

export const EventLogPanel: React.FC<EventLogPanelProps> = ({ events, isSimulating }) => {
  return (
    <div className="bg-[#101622] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Monitor de Eventos del Sistema
            </h3>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/50">
            <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Eventos representados con fines didácticos</span>
          </div>
        </div>

        {/* Notice of simulated logs */}
        <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
          <span>Cronología de micro-operaciones simuladas del backend.</span>
          {isSimulating && (
            <span className="flex items-center gap-1 text-blue-400 font-mono text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Ejecutando simulación...</span>
            </span>
          )}
        </div>

        {/* Event List */}
        <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
          {events.length === 0 ? (
            <div className="text-center py-10 space-y-2 border border-dashed border-slate-800 rounded-xl">
              <Clock className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                Ningún evento simulado registrado. Pulsa "Simular procesamiento" para iniciar.
              </p>
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#0b1019] border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3 text-xs space-y-1.5 transition-colors animate-in fade-in duration-200"
              >
                {/* Event Top Meta */}
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 tabular-nums">{evt.hora}</span>
                    <span className="text-slate-400">·</span>
                    <span className="px-1.5 py-0.5 rounded font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                      {evt.operacion}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">({evt.etapaNombre})</span>
                  </div>

                  <span
                    className={`font-semibold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded ${
                      evt.estado === 'exito'
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : evt.estado === 'procesando'
                        ? 'text-blue-400 bg-blue-950/60'
                        : 'text-slate-400'
                    }`}
                  >
                    {evt.estado}
                  </span>
                </div>

                {/* Event Detail */}
                <p className="text-slate-200 text-xs font-mono leading-relaxed">
                  {evt.detalleResultado}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-mono">
                  <span>Simulación Frontend</span>
                  <span>ID: {evt.id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span>Total eventos registrados: {events.length}</span>
        <span className="font-mono text-blue-400">Motor de simulación activo</span>
      </div>
    </div>
  );
};
