// Contrato con el backend: POST /api/pedidos, GET /api/pedidos?estado=, GET /api/pedidos/{id},
// PATCH /api/pedidos/{id}/estado, PATCH /api/pedidos/{id}/verificar-pago
import type { EstadoPedido, NuevoPedido, Pedido } from '../types'
import { pedidosDemo, clienteDemo } from '../data/mock'
import { calcularTotales } from '../utils/calculos'
import { http, esperar, USAR_MOCK } from './api'

const pedidos: Pedido[] = [...pedidosDemo]

// Pantalla 16: el cliente confirma -> el pedido queda "REGISTRADO"
export function registrarPedido(nuevo: NuevoPedido): Promise<Pedido> {
  if (!USAR_MOCK) return http('/pedidos', { method: 'POST', body: JSON.stringify(nuevo) })
  const pedido: Pedido = {
    ...nuevo,
    id: Math.max(...pedidos.map((p) => p.id)) + 1,
    fecha: new Date().toISOString(),
    cliente: { id: clienteDemo.id, nombre: clienteDemo.nombre, celular: clienteDemo.celular },
    pagoVerificado: false,
    totales: calcularTotales(nuevo.items, nuevo.entrega),
    estado: 'REGISTRADO',
  }
  pedidos.unshift(pedido)
  return esperar(pedido)
}

// Pantallas 24 y 28: lista de pedidos filtrados por estado
export function listarPedidos(estado?: EstadoPedido): Promise<Pedido[]> {
  if (!USAR_MOCK) return http(`/pedidos${estado ? `?estado=${estado}` : ''}`)
  return esperar(pedidos.filter((p) => !estado || p.estado === estado))
}

export function obtenerPedido(id: number): Promise<Pedido | undefined> {
  return USAR_MOCK ? esperar(pedidos.find((p) => p.id === id)) : http(`/pedidos/${id}`)
}

// Pantalla 21: pedidos del cliente que inició sesión
export function misPedidos(): Promise<Pedido[]> {
  if (!USAR_MOCK) return http('/pedidos/mios')
  return esperar(pedidos.filter((p) => p.cliente.id === clienteDemo.id))
}

// Pantalla 25: la atención confirma que el pago llegó
export function verificarPago(id: number): Promise<void> {
  if (!USAR_MOCK) return http(`/pedidos/${id}/verificar-pago`, { method: 'PATCH' })
  const p = pedidos.find((x) => x.id === id)
  if (p) p.pagoVerificado = true
  return esperar(undefined)
}

// Pantallas 25 y 28: cambiar el estado (enviar a cocina, marcar como listo...)
export function cambiarEstado(id: number, estado: EstadoPedido): Promise<void> {
  if (!USAR_MOCK) return http(`/pedidos/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) })
  const p = pedidos.find((x) => x.id === id)
  if (p) p.estado = estado
  return esperar(undefined)
}
