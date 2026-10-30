/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  User,
  AlertCircle,
  FilePlus,
} from 'lucide-react';

import type { Ticket, TicketCreateRequest } from '../types';

import {
  buildTicketCreateRequest,
  validateTicketCreateInput,
} from '../services/ticketContract';

interface UserViewProps {
  currentTicket: Ticket | null;
  onSubmitTicket: (data: TicketCreateRequest) => Promise<Ticket>;
  onNewTicketRequest: () => void;
}

export const UserView: React.FC<UserViewProps> = ({
  currentTicket,
  onSubmitTicket,
  onNewTicketRequest,
}) => {
  const [cliente, setCliente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [touched, setTouched] = useState({
    cliente: false,
    titulo: false,
    descripcion: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);

  const validation = validateTicketCreateInput({
    cliente,
    titulo,
    descripcion,
  });

  const clienteError = touched.cliente
    ? validation.errors.cliente
    : undefined;

  const tituloError = touched.titulo
    ? validation.errors.titulo
    : undefined;

  const descripcionError = touched.descripcion
    ? validation.errors.descripcion
    : undefined;

  const isFormValid = validation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      cliente: true,
      titulo: true,
      descripcion: true,
    });

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const requestPayload = buildTicketCreateRequest(
        cliente,
        titulo,
        descripcion
      );

      const newTicket = await onSubmitTicket(requestPayload);

      setConfirmedTicket(newTicket);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error al crear ticket:', error);

      setSubmitError(
        'No pudimos registrar tu solicitud. Verifica tu conexión e inténtalo nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setCliente('');
    setTitulo('');
    setDescripcion('');

    setTouched({
      cliente: false,
      titulo: false,
      descripcion: false,
    });

    setSubmitError(null);
    setConfirmedTicket(null);
    setShowConfirmation(false);

    onNewTicketRequest();
  };

  const displayedTicket = confirmedTicket ?? currentTicket;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-10">

      {/* Encabezado principal */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¿En qué podemos ayudarte?
        </h1>

        <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Envía tu consulta o reporte técnico a nuestro equipo.
          Te responderemos a la brevedad con el seguimiento correspondiente.
        </p>
      </div>

      {showConfirmation && displayedTicket ? (

        /* Confirmación de ticket creado */
        <div className="bg-[#121825] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tu solicitud ha sido registrada
            </h2>

            <p className="text-slate-400 text-sm">
              Hemos recibido tu reporte correctamente.
              Conserva tu número de seguimiento.
            </p>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-xl p-4 sm:p-5 text-left space-y-3 max-w-lg mx-auto">

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs text-slate-400">
                Número de seguimiento:
              </span>

              <span className="font-mono font-bold text-sm text-blue-400">
                #{displayedTicket.id}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">
                Solicitante:
              </span>

              <span className="text-sm font-medium text-white block">
                {displayedTicket.cliente}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block">
                Asunto:
              </span>

              <span className="text-sm text-slate-200 block">
                {displayedTicket.titulo}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleCreateAnother}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-600/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Crear otra solicitud</span>
            </button>
          </div>
        </div>

      ) : (

        /* Formulario de soporte */
        <div className="bg-[#121825] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre del cliente */}
            <div className="space-y-1.5">
              <label
                htmlFor="cliente"
                className="block text-xs font-semibold text-slate-200 uppercase tracking-wider"
              >
                Tu nombre
              </label>

              <div className="relative">
                <input
                  id="cliente"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={cliente}
                  onChange={(e) => {
                    setCliente(e.target.value);
                    setTouched((prev) => ({
                      ...prev,
                      cliente: true,
                    }));
                  }}
                  onBlur={() =>
                    setTouched((prev) => ({
                      ...prev,
                      cliente: true,
                    }))
                  }
                  className={`w-full bg-[#0b0f17] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all pl-10 ${
                    clienteError
                      ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'
                  }`}
                />

                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>

              {clienteError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{clienteError}</span>
                </p>
              )}
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label
                htmlFor="titulo"
                className="block text-xs font-semibold text-slate-200 uppercase tracking-wider"
              >
                Asunto
              </label>

              <input
                id="titulo"
                type="text"
                placeholder="Ej. No puedo iniciar sesión en mi cuenta"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  setTouched((prev) => ({
                    ...prev,
                    titulo: true,
                  }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    titulo: true,
                  }))
                }
                className={`w-full bg-[#0b0f17] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all ${
                  tituloError
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'
                }`}
              />

              {tituloError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{tituloError}</span>
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="descripcion"
                  className="block text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  Describe tu problema
                </label>

                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {descripcion.length} caracteres
                </span>
              </div>

              <textarea
                id="descripcion"
                rows={5}
                placeholder="Explica qué estaba sucediendo, los pasos para reproducir el fallo y el impacto en tu trabajo..."
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  setTouched((prev) => ({
                    ...prev,
                    descripcion: true,
                  }));
                }}
                onBlur={() =>
                  setTouched((prev) => ({
                    ...prev,
                    descripcion: true,
                  }))
                }
                className={`w-full bg-[#0b0f17] border rounded-xl p-4 text-sm text-white placeholder-slate-500 outline-none transition-all resize-y ${
                  descripcionError
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50'
                }`}
              />

              {descripcionError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{descripcionError}</span>
                </p>
              )}
            </div>

            {/* Error de comunicación con FastAPI */}
            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Botón de envío */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3.5 px-6 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-800/90 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-4 h-4" />

                <span>
                  {isSubmitting
                    ? 'Enviando solicitud...'
                    : 'Enviar solicitud'}
                </span>
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};
