# SmartDesk AI — Fase 1: Interfaz de Usuario y Visualizador del Backend

SmartDesk AI es una aplicación interactiva que desmitifica el ciclo de vida de un sistema de soporte impulsado por IA. Ofrece una doble perspectiva integrada: una vista de autoservicio minimalista para el usuario final y un panel de observabilidad técnica que expone el pipeline de procesamiento paso a paso.

### User Review & Critical Decisions

> [!IMPORTANT]
> Se han incorporado las preferencias confirmadas durante la fase de clarificación inicial:

- **Plantillas rápidas de prueba**: Se incluyen botones de escenarios de prueba (ej. "Problema de inicio de sesión", "Fallo al sincronizar base de datos", "Solicitud de facturación") para poblar los campos del formulario con un solo clic.
- **Visualizador del Pipeline**: Cada una de las 5 etapas del sistema de backend se representará como una tarjeta interactiva desplegable con detalles técnicos (entradas, procesamiento y salidas formateadas).
- **Estado inicial de observabilidad**: La pantalla del backend incluirá por defecto una solicitud de demostración ilustrativa completamente procesada, con su carga útil (payload JSON) y registro de eventos (event logs) accesibles de inmediato.

---

### 1. Overview & Core Concept

- **Qué hace**: Permite a cualquier persona reportar una incidencia técnica de manera intuitiva y, al alternar la vista superior, inspeccionar cómo una arquitectura moderna (FastAPI + Pydantic + SQLite + Google Gemini) procesaría y clasificaría esa solicitud en tiempo real.
- **Audiencia objetivo**: Estudiantes, desarrolladores y evaluadores técnicos que buscan comprender la anatomía de un sistema fullstack impulsado por LLMs sin la complejidad de configurar infraestructura en su fase inicial.
- **Valor clave**: Transformar una "caja negra" en una experiencia visual didáctica, interactiva y de estética cuidada con dark mode elegante.

---

### 2. User Experience & Visual Design

#### Flujos de Usuario Principales

1. **Navegación Global**: Barra superior limpia con selector de dos vistas: `Vista Usuario` y `Vista Backend`, junto con el identificador de marca "SmartDesk AI".
2. **Vista 1 (Usuario)**:
   - Encabezado con título claro: *"¿En qué podemos ayudarte?"* y subtítulo explicativo de soporte.
   - Selector de escenarios rápidos (chips de prueba) para autocompletar el formulario.
   - Formulario de alta legibilidad: Nombre del cliente, Asunto o título del problema, Descripción detallada (área amplia con conteo de caracteres).
   - Botón principal de acción *"Enviar solicitud"* (con estado visual de interacción y validación en cliente).
   - Tarjeta reservada para la confirmación del ticket (código de referencia ilustrativo, estado "Registrado" y acceso directo para ver su procesamiento en el backend).
3. **Vista 2 (Backend / Observabilidad)**:
   - Encabezado *"Procesamiento del sistema"* con estado ilustrativo del pipeline.
   - Flujo visual de 5 etapas secuenciales:
     1. Solicitud HTTP recibida (`POST /api/v1/tickets`)
     2. Validación de esquema (`FastAPI` + `Pydantic BaseModel`)
     3. Persistencia relacional (`SQLite` / Registro ACID)
     4. Clasificación semántica (`Google Gemini` / Categoría, Prioridad, Sugerencias)
     5. Despacho y respuesta (`HTTP 201 Created` / Payload al cliente)
   - Panel de inspección detallado:
     - Visor de carga útil (Payload JSON estructurado con resaltado de sintaxis sintético).
     - Panel de eventos cronológicos (Event Log con marcas temporales).
     - Métricas ilustrativas de paso (sin falsos cronómetros invasivos).

#### Identidad Visual & Paleta

- **Estilo**: Tecnológico, minimalista, limpio y moderno.
- **Colores**:
  - Fondo Canvas (60%): Gris carbón profundo (`#0b0f17` y `#111827`).
  - Superficies y Paneles (30%): Superficie oscura neutra (`#182234` / `#1f293d`) con bordes sutiles de un píxel (`border-slate-800`).
  - Acentos de Interacción (10%): Azul cobalto sutil (`#3b82f6` y `#2563eb`) para llamadas a la acción, etapas activas y selecciones.
  - Indicadores Semánticos: Esmeralda sobrio (`#10b981`) para completado/validado, ámbar (`#f59e0b`) para etapas en análisis, cian (`#06b6d4`) para clasificación IA.
- **Tipografía**:
  - Títulos y navegación: `Plus Jakarta Sans` / `Outfit` para estructura moderna.
  - Texto de lectura: `Plus Jakarta Sans` con interlineado generoso.
  - Código, esquemas y registros técnicos: `font-mono tabular-nums` para alineación visual precisa.
- **Reglas Anti-Slop**:
  - Cero etiquetas de pastilla vacías en metadatos (separadores unboxed `·` y `/`).
  - Cero encabezados con formato de comentario de código (`// 01_STAGE`).
  - Jerarquía sin anidación excesiva de tarjetas.

---

### 3. Key Product Decisions & Trade-Offs

- **Enfoque de Navegación Unificada (Tabs de Nivel Superior)**:
  - *Decisión*: Alternador de vistas ("Usuario" vs "Backend") situado en el encabezado principal, manteniendo el estado en memoria para que el ticket escrito por el usuario en la Vista 1 se refleje inmediatamente en el inspector de la Vista 2.
  - *Por qué*: Refuerza el valor educativo de causa y efecto sin recargar la página.
- **Simulación Ilustrativa Modular para Fase 1**:
  - *Decisión*: Crear una estructura de tipos TypeScript (`TicketData`, `PipelineStage`, `SystemEvent`) que sirva de contrato exacto para cuando en fases posteriores se conecte FastAPI y Gemini real.
  - *Por qué*: Garantiza que la Fase 2 sea una transición fluida sin reescribir la UI.
- **Sin Dependencias Pesadas Innecesarias**:
  - *Decisión*: Usar componentes React puros con Tailwind CSS v4 y Lucide React, evitando librerías de gráficos pesadas para un flujo más rápido y responsivo.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SmartDesk AI (App.tsx)                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Top Navigation Header: Brand + View Switcher (Usuario/Backend) │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│                 ┌─────────────────┴─────────────────┐                  │
│                 ▼                                   ▼                  │
│   ┌───────────────────────────┐       ┌────────────────────────────┐   │
│   │    Vista 1: Usuario       │       │    Vista 2: Backend        │   │
│   │                           │       │                            │   │
│   │ • Quick Scenario Chips    │       │ • Pipeline 5 Etapas        │   │
│   │ • Support Request Form    │ ───►  │   (HTTP > FastAPI >        │   │
│   │ • Status & Ticket Receipt │       │    SQLite > Gemini > Resp) │   │
│   │                           │       │ • JSON Payload Inspector   │   │
│   │                           │       │ • Event Log Chronology     │   │
│   └───────────────────────────┘       └────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Modelo de Datos Inicial (TypeScript Types)

```typescript
export interface TicketData {
  id: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'draft' | 'submitted' | 'processing' | 'processed';
  createdAt: string;
  classification?: {
    category: 'Authentication' | 'Database' | 'Billing' | 'Infrastructure' | 'General';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    confidence: number;
    recommendedAction: string;
  };
}

export interface PipelineStageInfo {
  id: 1 | 2 | 3 | 4 | 5;
  name: string;
  technology: string;
  summary: string;
  status: 'pending' | 'active' | 'completed';
  details: {
    input: string;
    process: string;
    output: string;
  };
}
```

---

### Plan de Verificación

1. **Compilación y TypeScript**: Ejecutar `compile_applet` para garantizar que la compilación con Vite y TypeScript sea 100% limpia.
2. **Responsividad**: Validar diseño adaptable en pantallas móviles, tablets y escritorios (1440px).
3. **Flujo de Interacción**:
   - Alternar fluidamente entre la Vista de Usuario y la Vista de Backend.
   - Probar los chips de escenarios rápidos para autocompletar el formulario.
   - Enviar una solicitud y ver la confirmación ilustrativa inmediata del ticket.
   - Inspeccionar cada una de las 5 etapas del backend desplegando sus detalles técnicos.
