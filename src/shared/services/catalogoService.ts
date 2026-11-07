// Contrato con el backend: GET /api/categorias, GET /api/productos, GET /api/productos/{id},
// PATCH /api/productos/{id}/disponibilidad
import type { Categoria, Producto } from '../types'
import { categorias, productos } from '../data/mock'
import { http, esperar, USAR_MOCK } from './api'

export function listarCategorias(): Promise<Categoria[]> {
  return USAR_MOCK ? esperar(categorias) : http('/categorias')
}

export function listarProductos(categoriaId?: number, buscar?: string): Promise<Producto[]> {
  if (!USAR_MOCK) {
    const q = new URLSearchParams()
    if (categoriaId) q.set('categoria', String(categoriaId))
    if (buscar) q.set('buscar', buscar)
    return http(`/productos?${q}`)
  }
  const texto = buscar?.toLowerCase() ?? ''
  return esperar(
    productos.filter((p) => (!categoriaId || p.categoriaId === categoriaId) && p.nombre.toLowerCase().includes(texto)),
  )
}

export function obtenerProducto(id: number): Promise<Producto | undefined> {
  return USAR_MOCK ? esperar(productos.find((p) => p.id === id)) : http(`/productos/${id}`)
}

// Pantalla 29: la atención marca un producto como disponible o agotado
export function cambiarDisponibilidad(id: number, disponible: boolean): Promise<void> {
  if (!USAR_MOCK) return http(`/productos/${id}/disponibilidad`, { method: 'PATCH', body: JSON.stringify({ disponible }) })
  const p = productos.find((x) => x.id === id)
  if (p) p.disponible = disponible
  return esperar(undefined)
}

// Pantallas 04 y 17: devuelve los productos del carrito que ya no están disponibles
export async function verificarDisponibilidad(ids: number[]): Promise<Producto[]> {
  if (!USAR_MOCK) return http('/productos/verificar-disponibilidad', { method: 'POST', body: JSON.stringify(ids) })
  return esperar(productos.filter((p) => ids.includes(p.id) && !p.disponible))
}
