import React, { useEffect, useState } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Database,
  RefreshCw,
} from 'lucide-react';

import type { Ticket } from '../types';

import {
  getHttpLogs,
  subscribeHttpLogs,
  clearHttpLogs,
  type HttpLog,
  type HttpMethod,
} from '../services/httpLogger';

interface HttpApiInspectorProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
}

interface Endpoint {
  method: HttpMethod;
  path: string;
  description: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'POST',
    path: '/tickets',
    description: 'Crear un nuevo ticket de soporte',
  },
  {
    method: 'GET',
    path: '/tickets',
    description: 'Consultar los tickets registrados',
  },
  {
    method: 'GET',
    path: '/tickets/{ticket_id}',
    description: 'Consultar un ticket por su identificador',
  },
  {
    method: 'PUT',
    path: '/tickets/{ticket_id}',
    description: 'Actualizar un ticket existente',
  },
  {
    method: 'DELETE',
    path: '/tickets/{ticket_id}',
    description: 'Eliminar un ticket',
  },
  {
    method: 'POST',
    path: '/tickets/{ticket_id}/clasificar',
    description: 'Clasificar un ticket mediante Gemini',
  },
];

function methodStyle(method: HttpMethod): string {
  switch (method) {
    case 'GET':
      return 'bg-blue-950 text-blue-300 border-blue-800';
    case 'POST':
      return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    case 'PUT':
      return 'bg-amber-950 text-amber-300 border-amber-800';
    case 'DELETE':
      return 'bg-rose-950 text-rose-300 border-rose-800';
  }
}

function statusStyle(status: number | null): string {
  if (status === null) {
    return 'bg-slate-800 text-slate-300';
  }

  if (status >= 200 && status < 300) {
    return 'bg-emerald-950 text-emerald-300';
  }

  if (status >= 400) {
    return 'bg-rose-950 text-rose-300';
  }

  return 'bg-amber-950 text-amber-300';
}

function JsonPanel({
  title,
  value,
}: {
  title: string;
  value: unknown;
}) {
  const [copied, setCopied] = useState(false);

  const content =
    value === null || value === undefined
      ? 'Sin cuerpo JSON'
      : JSON.stringify(value, null, 2) ?? String(value);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-[#090d15]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <span className="text-xs font-semibold text-slate-300">
          {title}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
        {content}
      </pre>
    </div>
  );
}

function HttpLogCard({ log }: { log: HttpLog }) {
  const [expanded, setExpanded] = useState(false);

  const successful =
    log.status !== null &&
    log.status >= 200 &&
    log.status < 300;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#101624]">
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left transition hover:bg-slate-800/40"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span
            className={`rounded border px-2.5 py-1 font-mono text-xs font-bold ${methodStyle(log.method)}`}
          >
            {log.method}
          </span>

          <span className="break-all font-mono text-sm text-white">
            {log.url}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded px-2 py-1 font-mono text-xs font-bold ${statusStyle(log.status)}`}
          >
            {log.status ?? 'NETWORK'}
          </span>

          <span className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {log.durationMs} ms
          </span>

          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-slate-800 p-4">
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <span>
              Fecha:{' '}
              {new Date(log.timestamp).toLocaleString()}
            </span>

            <span>
              Resultado:{' '}
              <strong
                className={
                  successful
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }
              >
                {successful ? 'Correcto' : 'Error'}
              </strong>
            </span>
          </div>

          {log.error && (
            <div className="rounded-lg border border-rose-900 bg-rose-950/30 p-3 text-xs text-rose-300">
              {log.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <JsonPanel
              title="Request Body"
              value={log.requestBody}
            />

            <JsonPanel
              title="Response Body"
              value={log.responseBody}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const HttpApiInspector: React.FC<HttpApiInspectorProps> = ({
  tickets,
  selectedTicket,
}) => {
  const [logs, setLogs] = useState<HttpLog[]>(getHttpLogs);
  const [showEndpoints, setShowEndpoints] = useState(true);

  useEffect(() => {
    return subscribeHttpLogs(() => {
      setLogs(getHttpLogs());
    });
  }, []);

  const successfulRequests = logs.filter(
    (log) =>
      log.status !== null &&
      log.status >= 200 &&
      log.status < 300
  ).length;

  const failedRequests = logs.length - successfulRequests;

  const averageDuration =
    logs.length > 0
      ? Math.round(
          logs.reduce(
            (total, log) => total + log.durationMs,
            0
          ) / logs.length
        )
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 font-sans sm:py-12">
      <section className="space-y-5 rounded-2xl border border-slate-800 bg-[#121825] p-6 shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />

              <span className="font-mono text-xs text-blue-400">
                FastAPI · HTTP Inspector
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              SmartDesk AI API Inspector
            </h1>

            <p className="text-sm text-slate-400">
              Inspección de las solicitudes HTTP realizadas
              desde esta aplicación React.
            </p>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-800 bg-blue-950/50 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-900/50"
          >
            Abrir Swagger UI
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-400">
          Este panel muestra solicitudes reales capturadas por
          loggedFetch(). No representa todas las operaciones
          internas del servidor ni las peticiones enviadas
          desde otros clientes.
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#121825] p-4">
          <p className="text-xs text-slate-400">
            Solicitudes
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {logs.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#121825] p-4">
          <p className="text-xs text-slate-400">
            Exitosas
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {successfulRequests}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#121825] p-4">
          <p className="text-xs text-slate-400">
            Fallidas
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-400">
            {failedRequests}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#121825] p-4">
          <p className="text-xs text-slate-400">
            Duración promedio
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {averageDuration} ms
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Historial HTTP real
            </h2>
            <p className="text-xs text-slate-400">
              Las operaciones más recientes aparecen primero.
            </p>
          </div>

          <button
            type="button"
            onClick={clearHttpLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar historial
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-[#101624] p-10 text-center">
            <RefreshCw className="mx-auto mb-3 h-7 w-7 text-slate-500" />

            <p className="font-medium text-slate-200">
              Todavía no hay operaciones registradas.
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Crea un ticket desde el formulario de soporte
              para observar las peticiones HTTP.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <HttpLogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#121825]">
        <button
          type="button"
          onClick={() => setShowEndpoints((value) => !value)}
          className="flex w-full items-center justify-between gap-3 p-5 text-left hover:bg-slate-800/30"
        >
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blue-400" />

            <div>
              <h2 className="font-bold text-white">
                Endpoints de FastAPI
              </h2>

              <p className="text-xs text-slate-400">
                Referencia de las seis operaciones del backend.
              </p>
            </div>
          </div>

          {showEndpoints ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {showEndpoints && (
          <div className="space-y-3 border-t border-slate-800 p-5">
            {endpoints.map((endpoint) => (
              <div
                key={`${endpoint.method}-${endpoint.path}`}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-800 bg-[#0d121c] p-3"
              >
                <span
                  className={`min-w-16 rounded border px-2 py-1 text-center font-mono text-xs font-bold ${methodStyle(endpoint.method)}`}
                >
                  {endpoint.method}
                </span>

                <code className="break-all text-sm text-white">
                  {endpoint.path}
                </code>

                <span className="text-xs text-slate-400">
                  {endpoint.description}
                </span>
              </div>
            ))}

            <p className="pt-2 text-xs text-slate-500">
              Para consultar los esquemas y las respuestas
              documentadas directamente por FastAPI,
              utiliza Swagger UI.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#121825] p-5">
        <h2 className="text-sm font-semibold text-white">
          Estado de la sesión
        </h2>

        <div className="mt-3 flex flex-wrap gap-5 text-xs text-slate-400">
          <span>
            Tickets cargados:{' '}
            <strong className="text-white">
              {tickets.length}
            </strong>
          </span>

          <span>
            Ticket seleccionado:{' '}
            <strong className="text-white">
              {selectedTicket
                ? `#${selectedTicket.id}`
                : 'Ninguno'}
            </strong>
          </span>
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        Herramienta local de desarrollo. El historial se
        mantiene únicamente en memoria y se pierde al
        recargar la página.
      </p>
    </div>
  );
};
