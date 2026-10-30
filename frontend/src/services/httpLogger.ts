export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  url: string;
  status: number | null;
  durationMs: number;
  requestBody: unknown | null;
  responseBody: unknown | null;
  error: string | null;
}

type HttpLogListener = () => void;

const MAX_LOGS = 100;

let logs: HttpLog[] = [];
const listeners = new Set<HttpLogListener>();

export function getHttpLogs(): HttpLog[] {
  return [...logs];
}

export function subscribeHttpLogs(
  listener: HttpLogListener
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function addHttpLog(
  log: Omit<HttpLog, 'id' | 'timestamp'>
): void {
  const newLog: HttpLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  logs = [newLog, ...logs].slice(0, MAX_LOGS);

  listeners.forEach((listener) => listener());
}

export function clearHttpLogs(): void {
  logs = [];
  listeners.forEach((listener) => listener());
}

export async function loggedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = (
    options.method ?? 'GET'
  ).toUpperCase() as HttpMethod;

  const startTime = performance.now();

  let requestBody: unknown | null = null;

  if (typeof options.body === 'string') {
    try {
      requestBody = JSON.parse(options.body);
    } catch {
      requestBody = options.body;
    }
  }

  try {
    const response = await fetch(url, options);

    let responseBody: unknown | null = null;

    try {
      const text = await response.clone().text();

      if (text) {
        try {
          responseBody = JSON.parse(text);
        } catch {
          responseBody = text;
        }
      }
    } catch {
      responseBody = null;
    }

    addHttpLog({
      method,
      url,
      status: response.status,
      durationMs: Math.round(performance.now() - startTime),
      requestBody,
      responseBody,
      error: response.ok
        ? null
        : `HTTP ${response.status}`,
    });

    return response;
  } catch (error) {
    addHttpLog({
      method,
      url,
      status: null,
      durationMs: Math.round(performance.now() - startTime),
      requestBody,
      responseBody: null,
      error:
        error instanceof Error
          ? error.message
          : 'Error de conexión desconocido',
    });

    throw error;
  }
}
