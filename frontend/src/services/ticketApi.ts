
import type { Ticket, TicketCreateRequest } from '../types';
import { loggedFetch } from './httpLogger';

/**
 * Crear un ticket real en FastAPI.
 *
 * Flujo:
 * 1. POST /tickets
 * 2. POST /tickets/{id}/clasificar
 * 3. GET /tickets/{id}
 *
 * Todas las solicitudes quedan registradas
 * mediante loggedFetch().
 */
export async function createTicket(
  data: TicketCreateRequest
): Promise<Ticket> {

  // PASO 1: Crear el ticket en SQLite.
  const createResponse = await loggedFetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!createResponse.ok) {
    throw new Error(
      `No se pudo crear el ticket: HTTP ${createResponse.status}`
    );
  }

  const createdTicket = await createResponse.json();
  const ticketId = createdTicket.id;

  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    throw new Error(
      'FastAPI no devolvió un identificador válido.'
    );
  }

  // PASO 2: Clasificar el ticket con Gemini.
  // Si Gemini falla, conservamos el ticket.
  try {
    const classifyResponse = await loggedFetch(
      `/api/tickets/${ticketId}/clasificar`,
      {
        method: 'POST',
      }
    );

    if (!classifyResponse.ok) {
      console.warn(
        `Ticket #${ticketId} creado, pero Gemini no pudo clasificarlo. HTTP ${classifyResponse.status}`
      );
    }
  } catch (error) {
    console.warn(
      `Ticket #${ticketId} creado, pero ocurrió un error de clasificación:`,
      error
    );
  }

  // PASO 3: Recuperar el ticket completo desde SQLite.
  const detailResponse = await loggedFetch(
    `/api/tickets/${ticketId}`
  );

  if (!detailResponse.ok) {
    console.warn(
      `Ticket #${ticketId} creado, pero no se pudo consultar su detalle.`
    );

    return {
      ...data,
      id: ticketId,
      estado: createdTicket.estado ?? 'abierto',
      prioridad: null,
      categoria: null,
    } as Ticket;
  }

  return (await detailResponse.json()) as Ticket;
}

/**
 * Consultar los tickets existentes en SQLite.
 */
export async function getTickets(): Promise<Ticket[]> {
  const response = await loggedFetch('/api/tickets');

  if (!response.ok) {
    throw new Error(
      `No se pudieron consultar los tickets: HTTP ${response.status}`
    );
  }

  return (await response.json()) as Ticket[];
}
