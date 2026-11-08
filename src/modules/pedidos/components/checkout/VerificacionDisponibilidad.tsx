// Pantalla 17 · Verificación de disponibilidad antes de confirmar
// Responsable: Eber
// Se muestra en Confirmacion si verificarDisponibilidad() devuelve productos agotados.
import { Fragment } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import type { ItemCarrito, Producto } from '../../../../shared/types'
import { Alerta, Boton, Etiqueta, Tarjeta } from '../../../../shared/components/ui'
import type { ResultadoDisponibilidad } from '../../services/disponibilidadService'

export default function VerificacionDisponibilidad({
  items,
  revision,
  onQuitar,
  onCambiar,
}: {
  items: ItemCarrito[]
  revision: ResultadoDisponibilidad
  onQuitar: (idLinea: string) => void
  onCambiar: (idLinea: string, p: Producto) => void
}) {
  const varios = items.filter((i) => revision.agotados.includes(i.producto.id)).length > 1
  const nombre = (i: ItemCarrito) => `${i.producto.nombre}${i.producto.etiqueta === 'Promo 2x1' ? ' (2x1)' : ''}`

  return (
    <>
      <Alerta tipo="error" titulo={varios ? 'Algunos productos se agotaron mientras finalizabas tu compra' : 'Un producto se agotó mientras finalizabas tu compra'}>
        Quítalo o cámbialo por otro para poder confirmar. No se te cobrará nada hasta que confirmes.
      </Alerta>
      <Tarjeta className="!px-5 !py-2">
        {items.map((item, n) => {
          const agotado = revision.agotados.includes(item.producto.id)
          const sugerido = revision.sugerencias[item.producto.id]
          return (
            <Fragment key={item.idLinea}>
              <div className="flex flex-wrap items-center gap-3 py-3.5">
                {agotado ? <CircleX size={22} className="text-error" /> : <CircleCheck size={22} className="text-verde" />}
                <span className="flex-1">{nombre(item)}</span>
                <Etiqueta variante={agotado ? 'agotado' : 'disponible'}>{agotado ? 'Agotado' : 'Disponible'}</Etiqueta>
                {agotado && (
                  <>
                    <Boton variante="secundario" onClick={() => onQuitar(item.idLinea)}>Quitar</Boton>
                    {sugerido && (
                      <Boton variante="oscuro" onClick={() => onCambiar(item.idLinea, sugerido)}>
                        Cambiar por {sugerido.nombre}
                      </Boton>
                    )}
                  </>
                )}
              </div>
              {n < items.length - 1 && <hr className="border-gris-100" />}
            </Fragment>
          )
        })}
      </Tarjeta>
    </>
  )
}