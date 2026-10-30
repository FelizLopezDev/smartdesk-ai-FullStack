import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_ID = "gemini-3.5-flash-lite"


def clasificar_ticket(titulo: str, descripcion: str):
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY no configurada")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{MODEL_ID}:generateContent"
    )

    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    prompt = (
        "Eres un clasificador de tickets de soporte técnico.\n"
        "Analiza el título y la descripción.\n"
        "Asigna una prioridad: alta, media o baja.\n"
        "Asigna una categoría breve.\n"
        "Responde únicamente con un objeto JSON que contenga "
        "'prioridad' y 'categoria'.\n\n"
        f"Título: {titulo}\n"
        f"Descripción: {descripcion}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 150,
            "responseMimeType": "application/json"
        }
    }

    response = httpx.post(
        url,
        headers=headers,
        json=payload,
        timeout=30.0
    )

    response.raise_for_status()

    datos = response.json()
    contenido = datos["candidates"][0]["content"]["parts"][0]["text"]

    clasificacion = json.loads(contenido)

    prioridad = clasificacion["prioridad"].lower().strip()
    categoria = clasificacion["categoria"].strip()

    if prioridad not in {"alta", "media", "baja"}:
        raise ValueError("Prioridad inválida devuelta por la IA")

    if not categoria:
        raise ValueError("Categoría vacía devuelta por la IA")

    return {
        "prioridad": prioridad,
        "categoria": categoria
    }