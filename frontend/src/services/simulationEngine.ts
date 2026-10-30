/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ticket, SimulationStage, SimulatedClassification, SimulatedEvent } from '../types';

/**
 * Retorna las 5 etapas en su estado inicial "pendiente".
 */
export function getInitialStages(): SimulationStage[] {
  return [
    {
      id: 1,
      numero: '01',
      nombre: 'Recepción HTTP',
      tecnologia: 'FastAPI Router',
      operacion: 'POST /tickets',
      estado: 'pendiente',
      resumen: 'Captura y desencapsulación de la petición REST con el payload JSON.',
    },
    {
      id: 2,
      numero: '02',
      nombre: 'Validación de Datos',
      tecnologia: 'Pydantic v2',
      operacion: 'Pydantic Validation',
      estado: 'pendiente',
      resumen: 'Comprobación de tipos, longitudes mínimas y sanitización de campos.',
    },
    {
      id: 3,
      numero: '03',
      nombre: 'Persistencia en Base de Datos',
      tecnologia: 'SQLite 3 Engine',
      operacion: 'SQLite INSERT',
      estado: 'pendiente',
      resumen: 'Registro atómico ACID en la tabla tickets de la base de datos.',
    },
    {
      id: 4,
      numero: '04',
      nombre: 'Clasificación con IA',
      tecnologia: 'Google Gemini',
      operacion: 'Gemini Classification',
      estado: 'pendiente',
      resumen: 'Análisis de lenguaje natural para determinar prioridad y categoría.',
    },
    {
      id: 5,
      numero: '05',
      nombre: 'Resultado del Sistema',
      tecnologia: 'HTTP 201 Response',
      operacion: 'Response Dispatch',
      estado: 'pendiente',
      resumen: 'Devolución del ticket clasificado estructurado para el cliente.',
    },
  ];
}

/**
 * Reglas locales ficticias para simular la clasificación de Gemini
 * sin realizar llamadas externas.
 */
export function classifyTicketLocally(ticket: Ticket): {
  prioridad: 'alta' | 'media' | 'baja';
  categoria: string;
  explicacion: string;
} {
  const content = (ticket.titulo + ' ' + ticket.descripcion).toLowerCase();

  if (
    content.includes('401') ||
    content.includes('auth') ||
    content.includes('login') ||
    content.includes('token') ||
    content.includes('seguridad') ||
    content.includes('bloqueo') ||
    content.includes('caída') ||
    content.includes('crítico') ||
    content.includes('urgente')
  ) {
    return {
      prioridad: 'alta',
      categoria: 'Seguridad y Autenticación',
      explicacion: 'Se detectó afectación directa en mecanismos de acceso o bloqueo operativo.',
    };
  }

  if (
    content.includes('sql') ||
    content.includes('base de datos') ||
    content.includes('timeout') ||
    content.includes('lento') ||
    content.includes('rendimiento') ||
    content.includes('inventario') ||
    content.includes('sincroniz')
  ) {
    return {
      prioridad: 'alta',
      categoria: 'Base de Datos e Infraestructura',
      explicacion: 'Se identificó degradación de latencia o fallo en persistencia de datos.',
    };
  }

  if (
    content.includes('factura') ||
    content.includes('cobro') ||
    content.includes('pago') ||
    content.includes('cargo') ||
    content.includes('duplic') ||
    content.includes('precio')
  ) {
    return {
      prioridad: 'media',
      categoria: 'Facturación y Suscripciones',
      explicacion: 'Consulta administrativa de cobros o facturación comercial.',
    };
  }

  if (
    content.includes('duda') ||
    content.includes('pregunta') ||
    content.includes('ayuda') ||
    content.includes('como') ||
    content.includes('guía')
  ) {
    return {
      prioridad: 'baja',
      categoria: 'Consultas Generales y Uso',
      explicacion: 'Solicitud informativa sin afectación a la operatividad continua.',
    };
  }

  return {
    prioridad: 'media',
    categoria: 'Soporte Técnico Nivel 2',
    explicacion: 'Incidencia técnica estándar pendiente de revisión asignada a mesa de soporte.',
  };
}

/**
 * Genera el resultado de clasificación simulada para el ticket.
 */
export function createSimulatedClassification(ticket: Ticket): SimulatedClassification {
  const { prioridad, categoria, explicacion } = classifyTicketLocally(ticket);
  return {
    ticketId: ticket.id,
    prioridad,
    categoria,
    explicacionSimulada: explicacion,
    timestampSimulacion: new Date().toLocaleTimeString(),
  };
}

/**
 * Genera el detalle del resultado específico de cada etapa para el ticket.
 */
export function getStageExecutionDetail(stageId: number, ticket: Ticket): string {
  switch (stageId) {
    case 1:
      return `Payload recibido (cliente: "${ticket.cliente}", asunto: "${ticket.titulo.slice(0, 30)}...")`;
    case 2:
      return `Validaciones Pydantic OK: cliente (${ticket.cliente.length}c), titulo (${ticket.titulo.length}c), descripcion (${ticket.descripcion.length}c)`;
    case 3:
      return `Registro simulado en smartdesk.db (INSERT INTO tickets, estado: "abierto", ref: #${ticket.id})`;
    case 4: {
      const { prioridad, categoria } = classifyTicketLocally(ticket);
      return `Inferencia simulada: Prioridad "${prioridad.toUpperCase()}", Categoría "${categoria}"`;
    }
    case 5:
      return `Respuesta HTTP 201 Created construida con ticket clasificado (#${ticket.id})`;
    default:
      return 'Operación completada';
  }
}

/**
 * Formatea la hora actual como HH:mm:ss para los eventos simulados.
 */
export function getCurrentTimeFormatted(): string {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}
