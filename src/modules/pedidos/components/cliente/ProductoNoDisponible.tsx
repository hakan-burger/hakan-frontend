
// Pantalla 04 · Carrito: producto no disponible
// Responsable: Hilda
// Se muestra dentro de Carrito cuando verificarDisponibilidad() devuelve productos agotados. Quitar o reemplazar con usePedido().quitarItem / reemplazarProducto.
import { Trash2 } from 'lucide-react'
import type { ItemCarrito, Producto } from '../../../../shared/types'
import { Alerta, Boton, Etiqueta, FotoProducto } from '../../../../shared/components/ui'
import { soles, precioLinea } from '../../../../shared/utils/calculos'
import { detalleItem } from '../../services/disponibilidadService'

// Aviso de arriba: "La Limonada Frozen se agotó..."
export const AvisoNoDisponible = ({ nombres }: { nombres: string[] }) => {
  const texto = nombres.length === 1 ? `${nombres[0]} se agotó. Quítalo o cámbialo` : `${nombres.join(', ')} se agotaron. Quítalos o cámbialos`
  return (
    <Alerta tipo="error" titulo="Revisamos la disponibilidad de tu carrito">
      {texto} para poder continuar.
    </Alerta>
  )
}

// Fila del producto agotado (fondo rojo claro, nombre tachado)
export default function ProductoNoDisponible({
  item,
  sugerido,
  onQuitar,
  onCambiar,
}: {
  item: ItemCarrito
  sugerido?: Producto
  onQuitar: () => void
  onCambiar: (p: Producto) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl bg-error-claro px-3 py-4 sm:flex-nowrap">
      <div className="w-[88px] shrink-0 overflow-hidden rounded-[10px]">
        <FotoProducto src={item.producto.imagenUrl} alto={88} texto="Foto" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="text-gris-500 line-through">{item.producto.nombre}</strong>
        <span className="text-[13px] text-gris-500">{detalleItem(item)}</span>
        <Etiqueta variante="agotado">Agotado</Etiqueta>
      </div>
      <div className="flex w-full items-center gap-5 sm:w-auto">
        {sugerido && (
          <Boton variante="oscuro" onClick={() => onCambiar(sugerido)}>
            Cambiar por {sugerido.nombre}
          </Boton>
        )}
        <strong className="ml-auto whitespace-nowrap text-gris-500">{soles(precioLinea(item))}</strong>
        <button type="button" aria-label="Quitar" className="cursor-pointer text-gris-500 hover:text-error" onClick={onQuitar}>
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}
