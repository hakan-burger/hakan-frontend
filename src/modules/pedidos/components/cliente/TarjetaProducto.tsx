// Tarjeta de producto de la carta (componente "Tarjeta de producto" del Figma)
import { Link } from 'react-router-dom'
import type { Producto } from '../../../../shared/types'
import { Boton, Etiqueta, FotoProducto } from '../../../../shared/components/ui'
import { soles } from '../../../../shared/utils/calculos'

export default function TarjetaProducto({ producto, onAgregar }: { producto: Producto; onAgregar: () => void }) {
  const agotado = !producto.disponible
  const etiqueta = agotado ? 'Agotado' : producto.etiqueta
  const variante = agotado ? 'agotado' : producto.etiqueta === 'Promo 2x1' ? 'promo' : 'neutro'

  return (
    <div className="flex h-[384px] flex-col overflow-hidden rounded-2xl border border-gris-100 bg-blanco">
      <Link to={`/producto/${producto.id}`}>
        <FotoProducto src={producto.imagenUrl} texto={producto.nombre} />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className={etiqueta ? '' : 'invisible'}>
          <Etiqueta variante={variante}>{etiqueta ?? '-'}</Etiqueta>
        </span>
        <Link to={`/producto/${producto.id}`} className="titulo-3 hover:text-rojo-hakan">{producto.nombre}</Link>
        <p className="flex-1 text-[13px] text-gris-500">{producto.descripcion}</p>
        <div className="flex items-center justify-between pt-2">
          <strong className="titulo-3">{soles(producto.precio)}</strong>
          <Boton className="!px-4 !py-2.5" disabled={agotado} onClick={onAgregar}>
            {agotado ? 'Agotado' : 'Agregar'}
          </Boton>
        </div>
      </div>
    </div>
  )
}
