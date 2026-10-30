/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SampleScenario, SimulationStage } from '../types';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'auth-error',
    label: 'Error de Autenticación',
    cliente: 'Elena Martínez',
    titulo: 'Error 401 recurrente al renovar token OAuth2 en portal web',
    descripcion: 'Desde las 09:30 AM los usuarios del equipo de operaciones no pueden iniciar sesión en el panel de control. El servidor retorna un error HTTP 401 Unauthorized a pesar de que las credenciales son válidas y activas.',
  },
  {
    id: 'db-latency',
    label: 'Latencia en Base de Datos',
    cliente: 'Carlos Mendivil',
    titulo: 'Bloqueo y timeouts en sincronización de inventario nocturno',
    descripcion: 'El script de sincronización con la réplica de base de datos experimentó un timeout de conexión tras 60 segundos de espera. Solicitamos verificar el pool de conexiones y el estado del almacenamiento.',
  },
  {
    id: 'billing-invoice',
    label: 'Aclaración de Facturación',
    cliente: 'Sofía Valenzuela',
    titulo: 'Duplicación de cargo en suscripción mensual del plan Enterprise',
    descripcion: 'Aparecen dos cargos idénticos en la tarjeta corporativa fechados el 28 de octubre por un importe de $149 USD cada uno. Requiero la anulación del cobro duplicado y emisión de la factura corregida.',
  },
];

export const PIPELINE_STAGES: SimulationStage[] = [
  {
    id: 1,
    numero: '01',
    nombre: 'Recepción HTTP',
    tecnologia: 'FastAPI Router',
    operacion: 'POST /tickets',
    estado: 'pendiente',
    resumen: 'Captura y validación inicial de los datos del ticket en la capa de entrada.',
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
