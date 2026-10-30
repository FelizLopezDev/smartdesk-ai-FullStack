/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contrato exacto de la petición recibida por el endpoint POST /tickets de FastAPI.
 * No incluye id, estado, prioridad ni categoria.
 */
export interface TicketCreateRequest {
  cliente: string;
  titulo: string;
  descripcion: string;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  cliente: string;
  estado: string; // "abierto"
  prioridad: 'alta' | 'media' | 'baja' | null;
  categoria: string | null;
  fechaCreacion?: string;
}

export type StageState = 'pendiente' | 'procesando' | 'completado' | 'error';

export interface SimulationStage {
  id: 1 | 2 | 3 | 4 | 5;
  numero: string;
  nombre: string;
  tecnologia: string;
  operacion: string;
  estado: StageState;
  resumen: string;
  resultadoDetalle?: string;
}

export type PipelineStage = SimulationStage;

export interface SimulatedClassification {
  ticketId: number;
  prioridad: 'alta' | 'media' | 'baja';
  categoria: string;
  explicacionSimulada: string;
  timestampSimulacion: string;
}

export interface SimulatedEvent {
  id: string;
  hora: string;
  etapaId: number;
  etapaNombre: string;
  operacion: string;
  estado: 'exito' | 'procesando' | 'pendiente' | 'error';
  detalleResultado: string;
  esSimulado: true;
}

export interface SampleScenario {
  id: string;
  label: string;
  cliente: string;
  titulo: string;
  descripcion: string;
}
