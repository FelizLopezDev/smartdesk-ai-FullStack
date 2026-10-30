/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserView } from './components/UserView';
import { HttpApiInspector } from './components/HttpApiInspector';
import type { Ticket, TicketCreateRequest } from './types';
import { createTicket, getTickets } from './services/ticketApi';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'support' | 'api-inspector'
  >('support');

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<
    number | null
  >(null);

  // Cargar tickets reales desde FastAPI y SQLite.
  useEffect(() => {
    let active = true;

    const loadTickets = async () => {
      try {
        const stored = await getTickets();

        if (!active) return;

        setTickets(stored);

        if (stored.length > 0) {
          setSelectedTicketId(stored[0].id);
        }
      } catch (error) {
        console.error(
          'Error al consultar los tickets:',
          error
        );
      }
    };

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  // Ticket seleccionado o recién creado.
  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ??
    null;

  // Crear un ticket real mediante FastAPI.
  const handleTicketSubmit = async (
    data: TicketCreateRequest
  ): Promise<Ticket> => {
    const newTicket = await createTicket(data);

    // Actualizar la interfaz después de que FastAPI
    // confirme que el ticket fue creado.
    setTickets((previousTickets) => [
      newTicket,
      ...previousTickets.filter(
        (ticket) => ticket.id !== newTicket.id
      ),
    ]);

    setSelectedTicketId(newTicket.id);

    return newTicket;
  };

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Encabezado */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Contenido principal */}
      <main className="flex-1 pb-16">
        {currentView === 'support' ? (
          <UserView
            currentTicket={selectedTicket}
            onSubmitTicket={handleTicketSubmit}
            onNewTicketRequest={() => {
              // El formulario administra su propio reinicio.
            }}
          />
        ) : (
          <HttpApiInspector
            tickets={tickets}
            selectedTicket={selectedTicket}
          />
        )}
      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-800/80 bg-[#090c13] py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">
              SmartDesk AI
            </span>

            <span>·</span>

            <span>Sistema de Soporte Técnico</span>
          </div>

          <p className="text-[11px] text-slate-500">
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
