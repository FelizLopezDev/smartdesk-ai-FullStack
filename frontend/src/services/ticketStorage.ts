/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, TicketCreateRequest } from '../types';
import { buildTicketCreateRequest } from './ticketContract';

const STORAGE_TICKETS_KEY = 'smartdesk_tickets';
const STORAGE_SELECTED_ID_KEY = 'smartdesk_selected_ticket_id';

/**
 * Recupera todos los tickets almacenados en localStorage.
 */
export function getStoredTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_TICKETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer tickets de localStorage:', error);
    return [];
  }
}

/**
 * Obtiene el ID del ticket actualmente seleccionado desde localStorage.
 */
export function getStoredSelectedTicketId(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_SELECTED_ID_KEY);
    if (!raw) return null;
    const num = Number(raw);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

/**
 * Guarda el ID del ticket seleccionado en localStorage.
 */
export function setStoredSelectedTicketId(id: number | null): void {
  try {
    if (id === null) {
      localStorage.removeItem(STORAGE_SELECTED_ID_KEY);
    } else {
      localStorage.setItem(STORAGE_SELECTED_ID_KEY, String(id));
    }
  } catch (error) {
    console.error('Error al guardar selectedTicketId en localStorage:', error);
  }
}

/**
 * Genera un nuevo ticket localmente a partir del contrato estricto TicketCreateRequest
 * (cliente, titulo, descripcion).
 * 
 * Asigna internamente el id numérico único, estado 'abierto', prioridad null y categoria null,
 * conservando la separación del backend FastAPI.
 */
export function createAndSaveTicket(request: TicketCreateRequest): Ticket {
  // Aseguramos la construcción centralizada del contrato
  const standardizedRequest = buildTicketCreateRequest(
    request.cliente,
    request.titulo,
    request.descripcion
  );

  const existingTickets = getStoredTickets();

  // Generar ID numérico único incremental a partir de 1001 o el mayor existente + 1
  const maxId = existingTickets.reduce((max, t) => (t.id > max ? t.id : max), 1000);
  const newId = maxId + 1;

  const newTicket: Ticket = {
    id: newId,
    cliente: standardizedRequest.cliente,
    titulo: standardizedRequest.titulo,
    descripcion: standardizedRequest.descripcion,
    estado: 'abierto',
    prioridad: null,
    categoria: null,
    fechaCreacion: new Date().toISOString(),
  };

  const updatedTickets = [newTicket, ...existingTickets];

  try {
    localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(updatedTickets));
    setStoredSelectedTicketId(newTicket.id);
  } catch (error) {
    console.error('Error al guardar nuevo ticket en localStorage:', error);
  }

  return newTicket;
}

/**
 * Restablece o vacía los tickets almacenados.
 */
export function clearAllStoredTickets(): void {
  try {
    localStorage.removeItem(STORAGE_TICKETS_KEY);
    localStorage.removeItem(STORAGE_SELECTED_ID_KEY);
  } catch (error) {
    console.error('Error al limpiar tickets de localStorage:', error);
  }
}
