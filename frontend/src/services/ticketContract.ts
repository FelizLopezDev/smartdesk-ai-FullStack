/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TicketCreateRequest } from '../types';

export const MIN_CLIENTE_LENGTH = 2;
export const MIN_TITULO_LENGTH = 5;
export const MIN_DESCRIPCION_LENGTH = 10;

export interface TicketValidationResult {
  isValid: boolean;
  errors: {
    cliente?: string;
    titulo?: string;
    descripcion?: string;
  };
}

/**
 * Valida un borrador de solicitud según las reglas estrictas de FastAPI / Pydantic:
 * - cliente: mínimo 2 caracteres
 * - titulo: mínimo 5 caracteres
 * - descripcion: mínimo 10 caracteres
 */
export function validateTicketCreateInput(input: {
  cliente: string;
  titulo: string;
  descripcion: string;
}): TicketValidationResult {
  const clienteTrimmed = input.cliente.trim();
  const tituloTrimmed = input.titulo.trim();
  const descripcionTrimmed = input.descripcion.trim();

  const errors: { cliente?: string; titulo?: string; descripcion?: string } = {};

  if (clienteTrimmed.length < MIN_CLIENTE_LENGTH) {
    errors.cliente = `El nombre del cliente debe tener al menos ${MIN_CLIENTE_LENGTH} caracteres.`;
  }

  if (tituloTrimmed.length < MIN_TITULO_LENGTH) {
    errors.titulo = `El título del problema debe tener al menos ${MIN_TITULO_LENGTH} caracteres.`;
  }

  if (descripcionTrimmed.length < MIN_DESCRIPCION_LENGTH) {
    errors.descripcion = `La descripción debe tener al menos ${MIN_DESCRIPCION_LENGTH} caracteres.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Función centralizada que construye el objeto de solicitud exacto
 * para ser enviado en el cuerpo de POST /tickets hacia FastAPI.
 * 
 * Contrato:
 * {
 *   "cliente": string,
 *   "titulo": string,
 *   "descripcion": string
 * }
 */
export function buildTicketCreateRequest(
  cliente: string,
  titulo: string,
  descripcion: string
): TicketCreateRequest {
  return {
    cliente: cliente.trim(),
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
  };
}
