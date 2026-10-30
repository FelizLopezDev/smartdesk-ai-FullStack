from backend.database import guardar_ticket, obtener_tickets, obtener_ticket_por_id, actualizar_ticket, eliminar_ticket 
import fastapi 
from fastapi import HTTPException
from backend.ai_service import clasificar_ticket
from backend.database import guardar_clasificacion
import httpx 

app = fastapi.FastAPI()

# Permite acceder a los endpoints tanto con /api como sin /api.
# Conserva las rutas originales para desarrollo local.
from fastapi.routing import APIRoute

@app.on_event("startup")
def registrar_rutas_api():
    rutas_originales = [
        ruta for ruta in app.routes
        if isinstance(ruta, APIRoute) and not ruta.path.startswith("/api/")
    ]

    for ruta in rutas_originales:
        app.add_api_route(
            path="/api" + ruta.path,
            endpoint=ruta.endpoint,
            methods=list(ruta.methods),
            include_in_schema=False,
        )


@app.get("/")
def home():
    return{"message": "bienvenido a SmartDesk Ai "}

from pydantic import BaseModel 
from pydantic import Field 

class TicketCreate(BaseModel):
    titulo: str = Field(min_length=5)
    descripcion: str = Field(min_length=10)
    cliente: str = Field(min_length=2)

@app.post("/tickets", status_code=201)
def crear_ticket(ticket: TicketCreate):
    ticket_id = guardar_ticket(
        titulo=ticket.titulo,
        descripcion=ticket.descripcion,
        cliente=ticket.cliente
    )
    return {"id": ticket_id}

@app.get("/tickets")
def listar_tickets():
  tickets = obtener_tickets() 
  return tickets 

@app.get("/tickets/{ticket_id}")
def consultar_ticket(ticket_id: int):
    ticket = obtener_ticket_por_id(ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return ticket 

@app.put("/tickets/{ticket_id}")
def modificar_ticket(ticket_id: int, ticket: TicketCreate):
    filas_afectadas = actualizar_ticket(
        ticket_id,
        ticket.titulo,
        ticket.descripcion,
        ticket.cliente
        
    )

    if filas_afectadas == 0:
        raise HTTPException (
            status_code=404,
            detail="Ticket no encontrado"
        )
    return obtener_ticket_por_id(ticket_id)

@app.delete("/tickets/{ticket_id}")
def borrar_ticket(ticket_id: int):
    filas_afectadas = eliminar_ticket(ticket_id)

    if filas_afectadas == 0:
       raise HTTPException(
            status_code=404,
            detail="Ticket no encontrado"
        )

    return{"mensaje": "Ticket eliminado correctamente"}

@app.post("/tickets/{ticket_id}/clasificar")
def clasificar_ticket_endpoint(ticket_id: int):
    ticket = obtener_ticket_por_id(ticket_id)

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket no encontrado"
        )

    try:
        clasificacion = clasificar_ticket(
            ticket["titulo"],
            ticket["descripcion"]
        )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="El modelo de IA tardó demasiado en responder"
        )

    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail="El proveedor de IA devolvió un error"
        )

    except (ValueError, KeyError, TypeError):
        raise HTTPException(
            status_code=502,
            detail="El modelo de IA devolvió una clasificación inválida"
        )

    guardar_clasificacion(
        ticket_id,
        clasificacion["prioridad"],
        clasificacion["categoria"]
    )

    return obtener_ticket_por_id(ticket_id)