// Pantalla 13 · Pago anticipado Yape/Plin
// Responsable: Daniel
// Pide el número de operación y la captura del pago.
import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import { Boton, Campo, FotoProducto } from '../../../../shared/components/ui'
import { soles } from '../../../../shared/utils/calculos'

export default function PagoYapePlin({
  total,
  numeroOperacion,
  captura,
  error,
  onNumero,
  onCaptura,
}: {
  total: number
  numeroOperacion: string
  captura?: File
  error?: string
  onNumero: (n: string) => void
  onCaptura: (f?: File) => void
}) {
  const archivo = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-wrap gap-5">
        <div className="w-[140px] overflow-hidden rounded-[10px]">
          <FotoProducto alto={140} texto="Código QR" />
        </div>
        <ol className="flex flex-1 flex-col gap-1.5 text-[13px]">
          <li>1. Yapea {soles(total)} al 987 654 321 (Hakan Burger)</li>
          <li>2. Copia el número de operación</li>
          <li>3. Ingrésalo aquí y adjunta la captura</li>
        </ol>
      </div>
      <Campo
        etiqueta="N.° de operación"
        inputMode="numeric"
        maxLength={12}
        placeholder="02345678"
        value={numeroOperacion}
        error={error}
        onChange={(e) => onNumero(e.target.value.replace(/\D/g, ''))}
      />
      <input ref={archivo} type="file" accept="image/*" hidden onChange={(e) => onCaptura(e.target.files?.[0])} />
      <div className="flex flex-wrap items-center gap-3">
        <Boton variante="secundario" onClick={() => archivo.current?.click()}>
          <Paperclip size={16} /> {captura ? 'Cambiar captura' : 'Adjuntar captura del pago'}
        </Boton>
        {captura && <span className="text-[13px] text-gris-700">{captura.name}</span>}
      </div>
    </div>
  )
}
