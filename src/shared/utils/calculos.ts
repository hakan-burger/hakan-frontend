import type { ItemCarrito, Totales, Entrega, EstadoPedido, MetodoPago } from '../types'

// Formato de moneda: S/ 27.90
export const soles = (monto: number) => `S/ ${monto.toFixed(2)}`

// Precio de una línea del carrito (producto + tamaño + adicionales) x cantidad
export function precioLinea(item: ItemCarrito): number {
  const base = item.producto.precio + (item.tamano?.precioExtra ?? 0)
  const extras = item.adicionales.reduce((s, a) => s + a.precio, 0)
  return (base + extras) * item.cantidad
}

// Descuento de la promo 2x1: por cada 2 unidades, una sale gratis
function descuentoPromo(items: ItemCarrito[]): number {
  return items
    .filter((i) => i.producto.etiqueta === 'Promo 2x1')
    .reduce((s, i) => s + Math.floor(i.cantidad / 2) * i.producto.precio, 0)
}

export function calcularTotales(items: ItemCarrito[], entrega?: Entrega): Totales {
  const subtotal = items.reduce((s, i) => s + precioLinea(i), 0)
  const descuento = descuentoPromo(items)
  const delivery = entrega?.modalidad === 'DELIVERY' ? entrega.direccion?.zona.tarifa ?? 0 : 0
  return { subtotal, descuento, delivery, total: subtotal - descuento + delivery }
}

export function calcularVuelto(total: number, pagaCon: number): number {
  return Math.max(0, pagaCon - total)
}

// Textos para mostrar en pantalla
export const textoEstado: Record<EstadoPedido, string> = {
  REGISTRADO: 'Registrado',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const textoMetodoPago: Record<MetodoPago, string> = {
  YAPE_PLIN: 'Yape/Plin',
  EFECTIVO: 'Efectivo',
  POS: 'POS',
}
