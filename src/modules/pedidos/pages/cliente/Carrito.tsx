

// Pantalla 03 · Carrito
// Responsable: Hilda
// Si un producto del carrito ya no está disponible se muestra el estado de la pantalla 04 (components/cliente/ProductoNoDisponible).
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { Boton, Etiqueta, FotoProducto, Tarjeta, claseBoton } from '../../../../shared/components/ui'
import { ResumenPedido } from '../../../../shared/components/pedido'
import { calcularTotales, precioLinea, soles } from '../../../../shared/utils/calculos'
import { SelectorCantidad } from '../../components/comunes'
import ProductoNoDisponible, { AvisoNoDisponible } from '../../components/cliente/ProductoNoDisponible'
import { detalleItem, revisarCarrito, type ResultadoDisponibilidad } from '../../services/disponibilidadService'

export default function Carrito() {
  const { items, cantidadItems, cambiarCantidad, quitarItem, reemplazarProducto } = usePedido()
  const navigate = useNavigate()
  const [revision, setRevision] = useState<ResultadoDisponibilidad>()

  // Se revisa la disponibilidad al entrar y cada vez que cambian los productos del carrito
  const clave = items.map((i) => i.producto.id).join(',')
  useEffect(() => {
    revisarCarrito(items).then(setRevision)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  if (!items.length)
    return (
      <div className="contenedor">
        <Tarjeta className="mx-auto flex max-w-[640px] flex-col items-center gap-4 !p-10 text-center">
          <ShoppingCart size={48} className="text-gris-300" />
          <h1 className="titulo-2">Tu carrito está vacío</h1>
          <p className="text-gris-700">Agrega tus hamburguesas, alitas o bebidas favoritas desde la carta.</p>
          <Link to="/" className={claseBoton('primario')}>Ver la carta</Link>
        </Tarjeta>
      </div>
    )

  const agotados = revision?.agotados ?? []
  const estaAgotado = (id: number) => agotados.includes(id)
  const hayAgotados = items.some((i) => estaAgotado(i.producto.id))
  const totalesOk = calcularTotales(items.filter((i) => !estaAgotado(i.producto.id)))

  return (
    <div className="contenedor flex flex-col gap-6">
      <h1 className="titulo-1">Mi carrito ({cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'})</h1>
      {hayAgotados && <AvisoNoDisponible nombres={items.filter((i) => estaAgotado(i.producto.id)).map((i) => i.producto.nombre)} />}

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <Tarjeta className="!px-6 !py-2">
          {items.map((item, n) => (
            <Fragment key={item.idLinea}>
              {estaAgotado(item.producto.id) ? (
                <div className="py-2">
                  <ProductoNoDisponible
                    item={item}
                    sugerido={revision?.sugerencias[item.producto.id]}
                    onQuitar={() => quitarItem(item.idLinea)}
                    onCambiar={(p) => reemplazarProducto(item.idLinea, p)}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4 sm:flex-nowrap">
                  <Link to={`/producto/${item.producto.id}`} className="w-[88px] shrink-0 overflow-hidden rounded-[10px]">
                    <FotoProducto src={item.producto.imagenUrl} alto={88} texto="Foto" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <strong>{item.producto.nombre}</strong>
                    <span className="text-[13px] text-gris-500">{detalleItem(item)}</span>
                    {item.indicaciones && <span className="text-[13px] text-gris-500">"{item.indicaciones}"</span>}
                    <Etiqueta variante="disponible">✓ Disponible</Etiqueta>
                  </div>
                  <div className="flex w-full items-center justify-between gap-5 sm:w-auto">
                    <SelectorCantidad cantidad={item.cantidad} onCambiar={(c) => cambiarCantidad(item.idLinea, c)} />
                    <strong className="ml-auto w-20 whitespace-nowrap text-right">{soles(precioLinea(item))}</strong>
                    <button type="button" aria-label="Quitar" className="cursor-pointer text-gris-500 hover:text-error" onClick={() => quitarItem(item.idLinea)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
              {n < items.length - 1 && !hayAgotados && <hr className="border-gris-100" />}
            </Fragment>
          ))}
        </Tarjeta>

        {hayAgotados ? (
          <Tarjeta className="flex flex-col gap-3.5">
            <h3 className="titulo-3">Resumen</h3>
            {items.map((i) =>
              estaAgotado(i.producto.id) ? (
                <div key={i.idLinea} className="flex justify-between text-gris-500">
                  <span>{i.cantidad} x {i.producto.nombre} (agotado)</span>
                  <span>—</span>
                </div>
              ) : (
                <div key={i.idLinea} className="flex justify-between">
                  <span>{i.cantidad} x {i.producto.nombre}</span>
                  <span>{soles(precioLinea(i))}</span>
                </div>
              ),
            )}
            <hr className="border-gris-100" />
            <div className="flex items-center justify-between">
              <strong className="titulo-3">Total</strong>
              <strong className="titulo-2">{soles(totalesOk.total)}</strong>
            </div>
            <Boton ancho disabled>Continuar con la compra</Boton>
            <p className="text-[13px] text-gris-500">Se habilita cuando todos los productos estén disponibles.</p>
          </Tarjeta>
        ) : (
          <ResumenPedido titulo="Resumen">
            <Boton ancho disabled={!revision} onClick={() => navigate('/checkout/entrega')}>
              Continuar con la compra
            </Boton>
            <p className="text-[13px] text-gris-500">La disponibilidad se vuelve a verificar antes de confirmar tu pedido.</p>
          </ResumenPedido>
        )}
      </div>

      <Link to="/" className="w-fit font-semibold text-gris-700 hover:text-negro">← Seguir comprando</Link>
    </div>
  )
}
