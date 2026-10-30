/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Code2, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'support' | 'api-inspector';
  onViewChange: (view: 'support' | 'api-inspector') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
              SmartDesk AI
            </span>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Centro de Atención y Soporte Técnico
            </p>
          </div>
        </div>

        {/* Acceso Secundario: Botón para Desarrolladores o Volver */}
        <div className="flex items-center gap-3 shrink-0">
          {currentView === 'support' ? (
            <button
              type="button"
              onClick={() => onViewChange('api-inspector')}
              className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/70 hover:bg-slate-800/70 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
              title="Abrir inspector técnico de la API HTTP (Swagger UI)"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Inspeccionar API</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewChange('support')}
              className="flex items-center gap-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-md shadow-blue-900/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al soporte</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
