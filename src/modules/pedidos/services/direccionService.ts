// Direcciones del cliente y zonas de reparto (pantallas 09, 10 y 21).
// Contrato con el backend: GET /api/direcciones, POST /api/direcciones
import type { Direccion, Zona } from '../../../shared/types'
import { direccionesCliente, zonas } from '../../../shared/data/mock'
import { http, esperar, USAR_MOCK } from '../../../shared/services/api'

const CLAVE = 'hakan-direcciones'

// Distritos que atiende el local y la zona que les corresponde
export const DISTRITOS: { nombre: string; zona: Zona }[] = [
  { nombre: 'Santa Clara, Ate', zona: zonas[0] },
  { nombre: 'Ate', zona: zonas[1] },
  { nombre: 'Huachipa', zona: zonas[2] },
  { nombre: 'Chaclacayo (Ñaña)', zona: zonas[3] },
  { nombre: 'La Molina', zona: zonas[3] },
]

export const textoZona: Record<string, string> = { A: 'hasta 2 km', B: '2 a 4 km', C: '4 a 6 km', D: '6 a 9 km' }

const guardadas = (): Direccion[] => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
  } catch {
    return []
  }
}

export const listarDirecciones = (): Promise<Direccion[]> => {
  if (!USAR_MOCK) return http('/direcciones')
  return esperar([...direccionesCliente, ...guardadas()], 150)
}

export const guardarDireccion = (d: Omit<Direccion, 'id'>, enMisDirecciones: boolean): Promise<Direccion> => {
  if (!USAR_MOCK && enMisDirecciones) return http('/direcciones', { method: 'POST', body: JSON.stringify(d) })
  const nueva: Direccion = { ...d, id: Date.now() }
  if (enMisDirecciones) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify([...guardadas(), nueva]))
    } catch {
      /* sin almacenamiento */
    }
  }
  return esperar(nueva, 150)
}

// Celular peruano: 9 dígitos y empieza con 9
export const celularValido = (c: string) => /^9\d{8}$/.test(c.replace(/\s/g, ''))
