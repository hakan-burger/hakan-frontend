// URL base del backend (Spring Boot). Se configura en el archivo .env
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

// true = usa los datos de prueba de shared/data/mock.ts
// false = llama al backend. Se configura con VITE_USAR_MOCK en el .env
export const USAR_MOCK = (import.meta.env.VITE_USAR_MOCK ?? 'true') === 'true'

// Llamada genérica al backend
export async function http<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  if (!res.ok) {
    const mensaje = await res.text()
    throw new Error(mensaje || `Error ${res.status}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

// Simula la demora de la red cuando se usan datos de prueba
export const esperar = <T,>(dato: T, ms = 300) => new Promise<T>((r) => setTimeout(() => r(dato), ms))
