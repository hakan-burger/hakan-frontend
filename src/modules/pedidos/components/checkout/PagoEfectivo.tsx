// Pantalla 14 · Pago contraentrega (efectivo)
// Responsable: Daniel
// Pide con cuánto paga y muestra el vuelto.
import { Campo } from '../../../../shared/components/ui'
import { calcularVuelto, soles } from '../../../../shared/utils/calculos'

export default function PagoEfectivo({
  total,
  monto,
  error,
  onMonto,
}: {
  total: number
  monto: string
  error?: string
  onMonto: (m: string) => void
}) {
  const pagaCon = Number(monto)
  const vuelto = monto && pagaCon >= total ? calcularVuelto(total, pagaCon) : undefined

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-end gap-4">
        <div className="min-w-0 flex-1">
          <Campo
            etiqueta="¿Con cuánto vas a pagar?"
            inputMode="decimal"
            placeholder="S/ 100.00"
            value={monto}
            error={error}
            onChange={(e) => onMonto(e.target.value.replace(/[^\d.]/g, ''))}
          />
        </div>
        <div className={`flex flex-col gap-0.5 pb-2.5 ${error ? 'mb-[26px]' : ''}`}>
          <span className="text-xs font-semibold text-gris-500">Vuelto</span>
          <strong className="titulo-3 text-verde">{vuelto !== undefined ? soles(vuelto) : '—'}</strong>
        </div>
      </div>
      <p className="text-[13px] text-gris-700">El repartidor llevará tu vuelto exacto.</p>
    </div>
  )
}
