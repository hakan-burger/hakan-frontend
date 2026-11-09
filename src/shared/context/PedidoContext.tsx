// Estado del pedido en curso: carrito + datos del checkout.
// Se guarda en el navegador para no perder el carrito al recargar la página.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Comprobante, Entrega, ItemCarrito, Pago, Pedido, Producto, Totales } from '../types'
import { calcularTotales } from '../utils/calculos'
import { registrarPedido } from '../services/pedidoService'

interface PedidoEnCurso {
  items: ItemCarrito[]
  entrega?: Entrega
  comprobante?: Comprobante
  pago?: Pago
}

interface PedidoContextValue extends PedidoEnCurso {
  totales: Totales
  cantidadItems: number
  // carrito
  agregarProducto: (producto: Producto, opciones?: Partial<Omit<ItemCarrito, 'idLinea' | 'producto'>>) => void
  cambiarCantidad: (idLinea: string, cantidad: number) => void
  quitarItem: (idLinea: string) => void
  reemplazarProducto: (idLinea: string, nuevo: Producto) => void
  // checkout
  setEntrega: (entrega: Entrega) => void
  setComprobante: (comprobante: Comprobante) => void
  setPago: (pago: Pago) => void
  // confirmación
  confirmar: () => Promise<Pedido>
  ultimoPedido?: Pedido // para la pantalla 18
  vaciar: () => void
}

const CLAVE = 'hakan-pedido-en-curso'
const PedidoContext = createContext<PedidoContextValue | null>(null)

function leerGuardado(): PedidoEnCurso {
  try {
    const t = localStorage.getItem(CLAVE)
    if (t) return JSON.parse(t)
  } catch {
    /* sin almacenamiento disponible */
  }
  return { items: [] }
}

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<PedidoEnCurso>(leerGuardado)
  const [ultimoPedido, setUltimoPedido] = useState<Pedido>()

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado))
    } catch {
      /* sin almacenamiento disponible */
    }
  }, [estado])

  const value = useMemo<PedidoContextValue>(() => {
    const setItems = (fn: (items: ItemCarrito[]) => ItemCarrito[]) => setEstado((e) => ({ ...e, items: fn(e.items) }))
    return {
      ...estado,
      ultimoPedido,
      totales: calcularTotales(estado.items, estado.entrega),
      cantidadItems: estado.items.reduce((s, i) => s + i.cantidad, 0),

      agregarProducto: (producto, op = {}) =>
        setItems((items) => [
          ...items,
          {
            idLinea: crypto.randomUUID(),
            producto,
            cantidad: op.cantidad ?? 1,
            tamano: op.tamano ?? producto.tamanos[0],
            sinIngredientes: op.sinIngredientes ?? [],
            adicionales: op.adicionales ?? [],
            indicaciones: op.indicaciones,
          },
        ]),
      cambiarCantidad: (idLinea, cantidad) =>
        setItems((items) =>
          cantidad <= 0 ? items.filter((i) => i.idLinea !== idLinea) : items.map((i) => (i.idLinea === idLinea ? { ...i, cantidad } : i)),
        ),
      quitarItem: (idLinea) => setItems((items) => items.filter((i) => i.idLinea !== idLinea)),
      reemplazarProducto: (idLinea, nuevo) =>
        setItems((items) =>
          items.map((i) => (i.idLinea === idLinea ? { ...i, producto: nuevo, tamano: nuevo.tamanos[0], adicionales: [], sinIngredientes: [] } : i)),
        ),

      setEntrega: (entrega) => setEstado((e) => ({ ...e, entrega })),
      setComprobante: (comprobante) => setEstado((e) => ({ ...e, comprobante })),
      setPago: (pago) => setEstado((e) => ({ ...e, pago })),

      confirmar: async () => {
        const { items, entrega, comprobante, pago } = estado
        if (!items.length || !entrega || !comprobante || !pago) throw new Error('Faltan datos del pedido')
        const pedido = await registrarPedido({ items, entrega, comprobante, pago })
        setUltimoPedido(pedido)
        setEstado({ items: [] })
        return pedido
      },
      vaciar: () => setEstado({ items: [] }),
    }
  }, [estado, ultimoPedido])

  return <PedidoContext.Provider value={value}>{children}</PedidoContext.Provider>
}

export function usePedido() {
  const ctx = useContext(PedidoContext)
  if (!ctx) throw new Error('usePedido debe usarse dentro de <PedidoProvider>')
  return ctx
}
