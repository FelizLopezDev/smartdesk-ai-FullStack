import sqlite3
import os

# En Vercel, SQLite usa almacenamiento temporal.
# En desarrollo local, conserva la base de datos habitual.
DB_NAME = "/tmp/smartdesk.db" if os.getenv("VERCEL") else "smartdesk.db"

def crear_tabla():
    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()
    cursor.execute("""
      CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY,
                      titulo TEXT NOT NULL,
                      descripcion TEXT NOT NULL,
                      cliente TEXT NOT NULL, 
                      estado TEXT NOT NULL,
                      prioridad TEXT,
                      categoria TEXT 
                      ) """
                    )
    
    conexion.commit()    
    conexion.close()

def guardar_ticket(titulo, descripcion, cliente):
    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()
    cursor.execute(""" INSERT INTO tickets (titulo, descripcion, cliente, estado) VALUES (?,?,?,?)""",
                  (titulo, descripcion, cliente, "abierto")

                  )
    ticket_id = cursor.lastrowid
    conexion.commit()
    conexion.close()
    return ticket_id

def obtener_tickets():
    conexion = sqlite3.connect(DB_NAME)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM tickets")
    filas = cursor.fetchall()
    conexion.close()
    return [dict(fila) for fila in filas]

def obtener_ticket_por_id(ticket_id):
    conexion = sqlite3.connect(DB_NAME)
    conexion.row_factory = sqlite3.Row
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id=?", (ticket_id,))
    fila = cursor.fetchone()
    conexion.close()
    return dict(fila)if fila else None

def actualizar_ticket(ticket_id, titulo, descripcion, cliente):
    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()

    cursor.execute(
        """ 
        UPDATE tickets
        SET titulo=?, descripcion=?, cliente=? 
        WHERE id=?
        """,
        (titulo, descripcion, cliente, ticket_id) 
                   
                   )

    filas_afectadas = cursor.rowcount 
    conexion.commit()
    conexion.close()
    return filas_afectadas > 0

def eliminar_ticket(ticket_id):
    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM tickets WHERE id=?",
                    (ticket_id,)
                   )
    filas_afectadas = cursor.rowcount
    conexion.commit()
    conexion.close()
    return filas_afectadas > 0

def guardar_clasificacion(ticket_id, prioridad, categoria):
    conexion = sqlite3.connect(DB_NAME)
    cursor = conexion.cursor()
    cursor.execute(
        """
        UPDATE tickets
        SET prioridad=?, categoria=?
        WHERE id=?
        """,
        (prioridad, categoria, ticket_id)
    )
    filas_afectadas = cursor.rowcount
    conexion.commit()
    conexion.close()
    return filas_afectadas > 0

crear_tabla()


