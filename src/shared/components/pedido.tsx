// Componentes del pedido que se repiten en varias pantallas:
// - ResumenPedido: el cuadro "Resumen del pedido" de la derecha (pantallas 03, 09 a 16)
// - PasosCheckout: Entrega > Comprobante > Pago > Confirmación (pantallas 09 a 17)
// - CheckoutLayout: título + pasos + contenido + resumen (pantallas 09 a 17)
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { usePedido } from '../context/PedidoContext'
import { soles, precioLinea } from '../utils/calculos'
import { Tarjeta } from './ui'

function Linea({ texto, valor, className = '' }: { texto: string; valor: string; className?: string }) {
  return (
    <div className={`flex justify-between gap-3 text-[13px] ${className}`}>
      <span>{texto}</span>
      <strong>{valor}</strong>
    </div>
  )
}

export function ResumenPedido({ titulo = 'Resumen del pedido', children }: { titulo?: string; children?: ReactNode }) {
  const { items, totales, entrega } = usePedido()
  return (
    <Tarjeta className="sticky top-24 flex flex-col gap-2.5">
      <h3 className="font-bold">{titulo}</h3>
      {items.map((i) => (
        <Linea key={i.idLinea} texto={`${i.cantidad} x ${i.producto.nombre}`} valor={soles(precioLinea(i))} />
      ))}
      <hr className="border-gris-100" />
      <Linea texto="Subtotal" valor={soles(totales.subtotal)} />
      {totales.descuento > 0 && <Linea texto="Promo 2x1" valor={`- ${soles(totales.descuento)}`} className="text-verde" />}
      <Linea
        texto={`Delivery${entrega?.direccion ? ` (zona ${entrega.direccion.zona.codigo})` : ''}`}
        valor={entrega ? soles(totales.delivery) : 'Siguiente paso'}
      />
      <hr className="border-gris-100" />
      <div className="flex items-center justify-between">
        <strong>Total</strong>
        <strong className="titulo-2">{soles(totales.total)}</strong>
      </div>
      {children}
    </Tarjeta>
  )
}

const PASOS = ['Entrega', 'Comprobante', 'Pago', 'Confirmación']

export function PasosCheckout({ actual }: { actual: 1 | 2 | 3 | 4 }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PASOS.map((p, i) => {
        const n = i + 1
        const hecho = n < actual
        const enCurso = n === actual
        return (
          <div key={p} className={`flex items-center gap-2 text-[13px] ${hecho || enCurso ? 'font-semibold' : 'text-gris-500'}`}>
            <span
              className={`grid size-[22px] place-items-center rounded-full text-xs font-bold ${
                hecho ? 'bg-negro text-blanco' : enCurso ? 'bg-naranja text-negro' : 'bg-gris-100 text-gris-500'
              }`}
            >
              {hecho ? <Check size={12} /> : n}
            </span>
            {p}
            {n < PASOS.length && <span className="h-px w-10 bg-gris-300" />}
          </div>
        )
      })}
    </div>
  )
}

export function CheckoutLayout({ paso, titulo, children }: { paso: 1 | 2 | 3 | 4; titulo: string; children: ReactNode }) {
  return (
    <div className="contenedor flex flex-col gap-5">
      <h1 className="titulo-1">Finalizar pedido</h1>
      <PasosCheckout actual={paso} />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <h2 className="titulo-2">{titulo}</h2>
          {children}
        </div>
        <ResumenPedido titulo={paso === 4 ? 'Tu pedido' : undefined} />
      </div>
    </div>
  )
}
