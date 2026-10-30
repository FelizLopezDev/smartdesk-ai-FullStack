/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  FileCode,
  ArrowRight,
  Clock,
  User,
  Inbox,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Ticket, SimulationStage, SimulatedClassification, SimulatedEvent } from '../types';
import { 
  getInitialStages, 
  classifyTicketLocally, 
  createSimulatedClassification, 
  getStageExecutionDetail, 
  getCurrentTimeFormatted 
} from '../services/simulationEngine';
import { buildTicketCreateRequest } from '../services/ticketContract';
import { PipelineFlow } from './PipelineFlow';
import { EventLogPanel } from './EventLogPanel';
import { SimulationResultCard } from './SimulationResultCard';

interface BackendViewProps {
  selectedTicket: Ticket | null;
  allTickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onNavigateToUser: () => void;
}

export const BackendView: React.FC<BackendViewProps> = ({
  selectedTicket,
  allTickets,
  onSelectTicket,
  onNavigateToUser,
}) => {
  const [stages, setStages] = useState<SimulationStage[]>(getInitialStages());
  const [activeStageId, setActiveStageId] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [events, setEvents] = useState<SimulatedEvent[]>([]);
  const [simulatedResult, setSimulatedResult] = useState<SimulatedClassification | null>(null);

  const [activeJsonTab, setActiveJsonTab] = useState<'ticket' | 'fastapi_contract' | 'simulated_payload'>('fastapi_contract');
  const [copiedCode, setCopiedCode] = useState(false);

  // Referencias para limpiar timeouts si se reinicia o desmonta
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  // Reiniciar la simulación al cambiar de ticket
  useEffect(() => {
    handleResetSimulation();
  }, [selectedTicket?.id]);

  const handleResetSimulation = () => {
    clearTimeouts();
    setStages(getInitialStages());
    setActiveStageId(null);
    setIsSimulating(false);
    setEvents([]);
    setSimulatedResult(null);
  };

  const handleStartSimulation = () => {
    if (!selectedTicket || isSimulating) return;

    clearTimeouts();
    setStages(getInitialStages());
    setEvents([]);
    setSimulatedResult(null);
    setIsSimulating(true);

    const ticket = selectedTicket;
    const initialTime = getCurrentTimeFormatted();

    // Etapa 1: Recepción HTTP (Inicio t = 0)
    setActiveStageId(1);
    setStages((prev) =>
      prev.map((s) => (s.id === 1 ? { ...s, estado: 'procesando' } : s))
    );

    const initialEvent: SimulatedEvent = {
      id: `sim-evt-1`,
      hora: initialTime,
      etapaId: 1,
      etapaNombre: 'Recepción HTTP',
      operacion: 'POST /tickets',
      estado: 'procesando',
      detalleResultado: `Petición REST recibida en el gateway con los datos de ${ticket.cliente}`,
      esSimulado: true,
    };
    setEvents([initialEvent]);

    // Fin Etapa 1 & Inicio Etapa 2 (t = 1100ms)
    const t1 = setTimeout(() => {
      const time1 = getCurrentTimeFormatted();
      setStages((prev) =>
        prev.map((s) =>
          s.id === 1
            ? { ...s, estado: 'completado', resultadoDetalle: getStageExecutionDetail(1, ticket) }
            : s.id === 2
            ? { ...s, estado: 'procesando' }
            : s
        )
      );
      setActiveStageId(2);

      setEvents((prev) => [
        {
          id: `sim-evt-2`,
          hora: time1,
          etapaId: 2,
          etapaNombre: 'Validación',
          operacion: 'Pydantic',
          estado: 'procesando',
          detalleResultado: 'FastAPI ejecuta validadores de tipos y longitudes de campo (>=2, >=5, >=10)',
          esSimulado: true,
        },
        ...prev.map((e) => (e.id === 'sim-evt-1' ? { ...e, estado: 'exito' as const } : e)),
      ]);
    }, 1100);
    timeoutsRef.current.push(t1);

    // Fin Etapa 2 & Inicio Etapa 3 (t = 2200ms)
    const t2 = setTimeout(() => {
      const time2 = getCurrentTimeFormatted();
      setStages((prev) =>
        prev.map((s) =>
          s.id === 2
            ? { ...s, estado: 'completado', resultadoDetalle: getStageExecutionDetail(2, ticket) }
            : s.id === 3
            ? { ...s, estado: 'procesando' }
            : s
        )
      );
      setActiveStageId(3);

      setEvents((prev) => [
        {
          id: `sim-evt-3`,
          hora: time2,
          etapaId: 3,
          etapaNombre: 'Persistencia',
          operacion: 'SQLite',
          estado: 'procesando',
          detalleResultado: 'Persistencia representada: Ejecución de transacción ACID en SQLite',
          esSimulado: true,
        },
        ...prev.map((e) => (e.id === 'sim-evt-2' ? { ...e, estado: 'exito' as const } : e)),
      ]);
    }, 2200);
    timeoutsRef.current.push(t2);

    // Fin Etapa 3 & Inicio Etapa 4 (t = 3400ms)
    const t3 = setTimeout(() => {
      const time3 = getCurrentTimeFormatted();
      setStages((prev) =>
        prev.map((s) =>
          s.id === 3
            ? { ...s, estado: 'completado', resultadoDetalle: getStageExecutionDetail(3, ticket) }
            : s.id === 4
            ? { ...s, estado: 'procesando' }
            : s
        )
      );
      setActiveStageId(4);

      setEvents((prev) => [
        {
          id: `sim-evt-4`,
          hora: time3,
          etapaId: 4,
          etapaNombre: 'Clasificación',
          operacion: 'Gemini',
          estado: 'procesando',
          detalleResultado: 'Gemini analiza intención, urgencia semántica y departamento sugerido',
          esSimulado: true,
        },
        ...prev.map((e) => (e.id === 'sim-evt-3' ? { ...e, estado: 'exito' as const } : e)),
      ]);
    }, 3400);
    timeoutsRef.current.push(t3);

    // Fin Etapa 4 & Inicio Etapa 5 (t = 4800ms)
    const t4 = setTimeout(() => {
      const time4 = getCurrentTimeFormatted();
      const localClassification = createSimulatedClassification(ticket);

      setStages((prev) =>
        prev.map((s) =>
          s.id === 4
            ? { ...s, estado: 'completado', resultadoDetalle: getStageExecutionDetail(4, ticket) }
            : s.id === 5
            ? { ...s, estado: 'procesando' }
            : s
        )
      );
      setActiveStageId(5);

      setEvents((prev) => [
        {
          id: `sim-evt-5`,
          hora: time4,
          etapaId: 5,
          etapaNombre: 'Resultado',
          operacion: 'Response',
          estado: 'procesando',
          detalleResultado: `Construyendo HTTP 201: Prioridad "${localClassification.prioridad.toUpperCase()}", Categoría "${localClassification.categoria}"`,
          esSimulado: true,
        },
        ...prev.map((e) =>
          e.id === 'sim-evt-4'
            ? {
                ...e,
                estado: 'exito' as const,
                detalleResultado: `Clasificación simulada: ${localClassification.prioridad.toUpperCase()} - ${localClassification.categoria}`,
              }
            : e
        ),
      ]);
    }, 4800);
    timeoutsRef.current.push(t4);

    // Cierre del Pipeline & Publicación de Resultado (t = 5900ms)
    const t5 = setTimeout(() => {
      const time5 = getCurrentTimeFormatted();
      const finalResult = createSimulatedClassification(ticket);

      setStages((prev) =>
        prev.map((s) =>
          s.id === 5
            ? { ...s, estado: 'completado', resultadoDetalle: getStageExecutionDetail(5, ticket) }
            : s
        )
      );
      setActiveStageId(null);
      setIsSimulating(false);
      setSimulatedResult(finalResult);

      setEvents((prev) => [
        {
          id: `sim-evt-6`,
          hora: time5,
          etapaId: 5,
          etapaNombre: 'Resultado',
          operacion: 'Response',
          estado: 'exito',
          detalleResultado: `Procesamiento simulado completado exitosamente para el ticket #${ticket.id}`,
          esSimulado: true,
        },
        ...prev.map((e) => (e.id === 'sim-evt-5' ? { ...e, estado: 'exito' as const } : e)),
      ]);
    }, 5900);
    timeoutsRef.current.push(t5);
  };

  const getTicketJson = () => {
    if (!selectedTicket) return { message: 'Sin ticket seleccionado' };

    if (activeJsonTab === 'fastapi_contract') {
      // Contrato exacto de POST /tickets (sin id, estado, prioridad ni categoria)
      return buildTicketCreateRequest(
        selectedTicket.cliente,
        selectedTicket.titulo,
        selectedTicket.descripcion
      );
    } else if (activeJsonTab === 'ticket') {
      return {
        id: selectedTicket.id,
        cliente: selectedTicket.cliente,
        titulo: selectedTicket.titulo,
        descripcion: selectedTicket.descripcion,
        estado: selectedTicket.estado,
        prioridad: selectedTicket.prioridad, // null
        categoria: selectedTicket.categoria, // null
        fechaCreacion: selectedTicket.fechaCreacion,
      };
    } else {
      return {
        simulacion_activa: true,
        ticket_id: selectedTicket.id,
        clasificacion_simulada: simulatedResult || 'Aún no ejecutada. Pulsa "Simular procesamiento".',
        etapas_simuladas: stages.map((s) => ({
          numero: s.numero,
          nombre: s.nombre,
          operacion: s.operacion,
          estado: s.estado,
        })),
        es_simulacion_educativa: true,
      };
    }
  };

  const currentJsonString = JSON.stringify(getTicketJson(), null, 2);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ESTADO VACÍO CUANDO NO HAY TICKET SELECCIONADO
  if (!selectedTicket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <Inbox className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            No hay ningún ticket seleccionado
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Para visualizar el procesamiento técnico en el backend e iniciar la simulación interactiva, primero crea una solicitud de soporte desde la Vista Usuario.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onNavigateToUser}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Ir a la Vista Usuario para crear un ticket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 space-y-8">
      {/* Top Header Section with Simulation Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Fase 3 · Visualizador del Procesamiento
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Procesamiento del sistema
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Simula de forma didáctica e interactiva cómo una arquitectura con FastAPI, SQLite y Google Gemini procesaría esta solicitud.
          </p>
        </div>

        {/* Action Buttons: Simular & Reiniciar */}
        <div className="flex items-center gap-3 shrink-0">
          {allTickets.length > 1 && (
            <div className="hidden sm:flex items-center gap-2 bg-[#121824] border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-400 font-mono">Ticket:</span>
              <select
                value={selectedTicket.id}
                onChange={(e) => {
                  const found = allTickets.find((t) => t.id === Number(e.target.value));
                  if (found) onSelectTicket(found);
                }}
                className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 outline-none text-xs font-mono cursor-pointer"
              >
                {allTickets.map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.id} - {t.cliente}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetSimulation}
            disabled={isSimulating}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isSimulating
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Reiniciar simulación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <button
            type="button"
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className={`px-5 py-2.5 rounded-xl text-xs font-medium text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              isSimulating
                ? 'bg-blue-800/60 cursor-wait opacity-80'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-pulse' : ''}`} />
            <span>{isSimulating ? 'Simulando procesamiento...' : 'Simular procesamiento'}</span>
          </button>
        </div>
      </div>

      {/* PANEL DE DATOS ORIGINALES DEL TICKET (CONSERVA LA IDENTIDAD FASE 2) */}
      <div className="bg-[#121825] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Datos del Ticket en LocalStorage
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Ticket #{selectedTicket.id}</span>
                <span className="text-xs font-normal text-slate-400">({selectedTicket.cliente})</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Estado local:</span>
            <span className="capitalize px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
              {selectedTicket.estado}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
              Título
            </span>
            <p className="text-xs font-medium text-slate-200 truncate">
              {selectedTicket.titulo}
            </p>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
              Prioridad Original
            </span>
            <span className="font-mono text-xs text-amber-400/90 bg-amber-950/30 border border-amber-900/40 px-2 py-0.5 rounded inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{selectedTicket.prioridad ?? 'Pendiente'}</span>
            </span>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-xl p-3 space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
              Categoría Original
            </span>
            <span className="font-mono text-xs text-amber-400/90 bg-amber-950/30 border border-amber-900/40 px-2 py-0.5 rounded inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{selectedTicket.categoria ?? 'Pendiente'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* FLUJO VISUAL CONECTADO EN 5 ETAPAS */}
      <PipelineFlow stages={stages} activeStageId={activeStageId} />

      {/* TARJETA DE RESULTADO TRAS COMPLETAR LA SIMULACIÓN */}
      {simulatedResult && (
        <SimulationResultCard
          ticket={selectedTicket}
          classification={simulatedResult}
        />
      )}

      {/* DUAL OBSERVABILITY MONITOR: EVENT LOG & JSON INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* MONITOR DE EVENTOS CRONOLÓGICOS (LG: COL-7) */}
        <div className="lg:col-span-7">
          <EventLogPanel events={events} isSimulating={isSimulating} />
        </div>

        {/* INSPECTOR DE ESTRUCTURA DE DATOS (LG: COL-5) */}
        <div className="lg:col-span-5 bg-[#101622] border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Inspector de Datos (JSON)
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Copiar JSON"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-mono">{copiedCode ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Sub-tabs con el contrato exacto de FastAPI */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveJsonTab('fastapi_contract')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  activeJsonTab === 'fastapi_contract'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Contrato POST /tickets
              </button>
              <button
                type="button"
                onClick={() => setActiveJsonTab('ticket')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  activeJsonTab === 'ticket'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Ticket en Storage
              </button>
              <button
                type="button"
                onClick={() => setActiveJsonTab('simulated_payload')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap cursor-pointer ${
                  activeJsonTab === 'simulated_payload'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Estado Simulación
              </button>
            </div>

            {/* Code Output */}
            <div className="bg-[#090d15] border border-slate-800/90 rounded-xl p-4 overflow-hidden shadow-inner">
              <pre className="font-mono text-xs text-blue-200/90 overflow-x-auto max-h-[300px] leading-relaxed">
                {currentJsonString}
              </pre>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Contrato: {"{ cliente, titulo, descripcion }"}</span>
            <span className="font-mono text-emerald-400">FastAPI Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
