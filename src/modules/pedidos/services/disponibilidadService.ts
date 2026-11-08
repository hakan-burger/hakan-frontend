// Revisa qué productos del carrito se agotaron y sugiere un reemplazo de la misma categoría.
// Lo usan el carrito (pantallas 03 y 04) y la confirmación (pantallas 16 y 17).
import type { ItemCarrito, Producto } from '../../../shared/types'
import { listarProductos, verificarDisponibilidad } from '../../../shared/services/catalogoService'

export interface ResultadoDisponibilidad {
  agotados: number[] // ids de los productos agotados
  sugerencias: Record<number, Producto | undefined> // id agotado -> producto sugerido
  revisadoA: string // hora de la revisión, ej. "19:01"
}

export const revisarCarrito = async (items: ItemCarrito[]): Promise<ResultadoDisponibilidad> => {
  const ids = [...new Set(items.map((i) => i.producto.id))]
  const revisadoA = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  if (!ids.length) return { agotados: [], sugerencias: {}, revisadoA }

  const agotados = (await verificarDisponibilidad(ids)).map((p) => p.id)
  const sugerencias: Record<number, Producto | undefined> = {}

  if (agotados.length) {
    const disponibles = (await listarProductos()).filter((p) => p.disponible && !ids.includes(p.id))
    for (const id of agotados) {
      const original = items.find((i) => i.producto.id === id)?.producto
      sugerencias[id] = disponibles.find((p) => p.categoriaId === original?.categoriaId) ?? disponibles[0]
    }
  }
  return { agotados, sugerencias, revisadoA }
}

// Texto corto con las opciones elegidas: "Individual · extra Queso cheddar · sin cebolla"
export const detalleItem = (item: ItemCarrito): string => {
  const partes: string[] = []
  if (item.tamano) partes.push(item.tamano.nombre)
  item.adicionales.forEach((a) => partes.push(`extra ${a.nombre.toLowerCase()}`))
  item.sinIngredientes.forEach((s) => partes.push(s.toLowerCase()))
  if (item.producto.etiqueta === 'Promo 2x1') partes.push('Promo 2x1')
  return partes.join(' · ') || item.producto.descripcion
}
