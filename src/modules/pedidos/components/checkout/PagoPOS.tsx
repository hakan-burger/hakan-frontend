// Pantalla 15 · Pago con POS contraentrega
// Responsable: Daniel
// Elige débito o crédito.
type Tarjeta = 'DEBITO' | 'CREDITO'

export default function PagoPOS({ tipo, onTipo }: { tipo: Tarjeta; onTipo: (t: Tarjeta) => void }) {
  const opcion = (valor: Tarjeta, texto: string) => (
    <button
      type="button"
      onClick={() => onTipo(valor)}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${valor === tipo ? 'bg-rojo-hakan text-blanco' : 'bg-gris-100 text-gris-700'}`}
    >
      {texto}
    </button>
  )

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex gap-2.5">
        {opcion('DEBITO', 'Débito')}
        {opcion('CREDITO', 'Crédito')}
      </div>
      <p className="text-[13px] text-gris-700">Aceptamos Visa, Mastercard, American Express y Diners.</p>
      <p className="text-[13px] text-gris-700">El repartidor llevará el POS a tu puerta; no ingresas datos de tu tarjeta en la web.</p>
    </div>
  )
}
