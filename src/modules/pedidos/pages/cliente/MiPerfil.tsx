// Pantalla 21 · Mi perfil y mis pedidos
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Direccion, Pedido } from '../../../../shared/types'
import { misPedidos } from '../../../../shared/services/pedidoService'
import { clienteDemo } from '../../../../shared/data/mock'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { Alerta, Boton, Campo, Etiqueta, Tarjeta } from '../../../../shared/components/ui'
import { soles, textoEstado, textoMetodoPago } from '../../../../shared/utils/calculos'
import { Chips } from '../../components/comunes'
import { listarDirecciones, textoZona } from '../../services/direccionService'
import { detalleItem } from '../../services/disponibilidadService'

type Pestana = 'datos' | 'direcciones' | 'facturacion' | 'pedidos'

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })

const MisPedidos = () => {
  const { agregarProducto } = usePedido()
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>()
  const [abierto, setAbierto] = useState<number>()

  useEffect(() => {
    misPedidos().then(setPedidos)
  }, [])

  const volverAPedir = (p: Pedido) => {
    p.items.filter((i) => i.producto.disponible).forEach(({ producto, cantidad, tamano, sinIngredientes, adicionales, indicaciones }) =>
      agregarProducto(producto, { cantidad, tamano, sinIngredientes, adicionales, indicaciones }),
    )
    navigate('/carrito')
  }

  if (!pedidos) return <p className="text-[13px] text-gris-500">Cargando tus pedidos...</p>
  if (!pedidos.length) return <Alerta tipo="info" titulo="Aún no tienes pedidos">Cuando hagas tu primer pedido lo verás aquí con su estado.</Alerta>

  const accion = (p: Pedido) =>
    p.estado === 'ENTREGADO' ? (
      <button className="cursor-pointer font-semibold text-rojo-hakan" onClick={() => volverAPedir(p)}>Volver a pedir</button>
    ) : (
      <button className="cursor-pointer font-semibold text-gris-700" onClick={() => setAbierto(abierto === p.id ? undefined : p.id)}>
        {abierto === p.id ? 'Ocultar detalle' : 'Ver detalle'}
      </button>
    )

  const detalle = (p: Pedido) => (
    <div className="text-gris-700">
      {p.items.map((i) => (
        <div key={i.idLinea}>{i.cantidad} x {i.producto.nombre} ({detalleItem(i)})</div>
      ))}
      <div className="mt-1">
        {p.entrega.modalidad === 'DELIVERY' ? `Delivery · ${p.entrega.direccion?.direccion}` : 'Recojo en local'} · Pago: {textoMetodoPago[p.pago.metodo]}
      </div>
    </div>
  )

  const etiqueta = (p: Pedido) => (
    <Etiqueta variante={p.estado === 'ENTREGADO' ? 'disponible' : p.estado === 'CANCELADO' ? 'neutro' : 'promo'}>{textoEstado[p.estado]}</Etiqueta>
  )

  return (
    <>
      {/* celular: tarjetas */}
      <div className="flex flex-col gap-3 md:hidden">
        {pedidos.map((p) => (
          <Tarjeta key={p.id} className="flex flex-col gap-2 !p-4 text-[13px]">
            <div className="flex items-center justify-between">
              <strong className="text-[15px]">#{p.id} · {fecha(p.fecha)}</strong>
              {etiqueta(p)}
            </div>
            <span>{p.items.map((i) => `${i.cantidad > 1 ? i.cantidad + ' ' : ''}${i.producto.nombre}`).join(', ')}</span>
            <div className="flex items-center justify-between">
              <strong>{soles(p.totales.total)}</strong>
              {accion(p)}
            </div>
            {abierto === p.id && detalle(p)}
          </Tarjeta>
        ))}
      </div>

      <Tarjeta className="hidden overflow-x-auto !p-0 md:block">
        <table className="w-full min-w-[700px] text-left text-[13px]">
          <thead className="bg-gris-50 text-xs font-semibold text-gris-500">
            <tr>
              <th className="w-[90px] px-4 py-3">Pedido</th>
              <th className="w-[120px] px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Productos</th>
              <th className="w-[100px] px-4 py-3">Total</th>
              <th className="w-[200px] px-4 py-3">Estado</th>
              <th className="w-[130px] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-t border-gris-100">
                  <td className="px-4 py-3">#{p.id}</td>
                  <td className="px-4 py-3">{fecha(p.fecha)}</td>
                  <td className="px-4 py-3">{p.items.map((i) => `${i.cantidad > 1 ? i.cantidad + ' ' : ''}${i.producto.nombre}`).join(', ')}</td>
                  <td className="px-4 py-3">{soles(p.totales.total)}</td>
                  <td className="px-4 py-3">{etiqueta(p)}</td>
                  <td className="px-4 py-3">{accion(p)}</td>
                </tr>
                {abierto === p.id && (
                  <tr className="bg-gris-50">
                    <td colSpan={6} className="px-4 py-3">{detalle(p)}</td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Tarjeta>
    </>
  )
}

const DatosPersonales = () => {
  const [guardado, setGuardado] = useState(false)
  return (
    <Tarjeta className="flex max-w-[640px] flex-col gap-4">
      <h2 className="titulo-3">Datos personales</h2>
      <Campo etiqueta="Nombres y apellidos" defaultValue={clienteDemo.nombre} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="DNI" defaultValue={clienteDemo.dni} inputMode="numeric" maxLength={8} />
        <Campo etiqueta="Celular" defaultValue={clienteDemo.celular} inputMode="tel" maxLength={9} />
      </div>
      <Campo etiqueta="Correo" type="email" defaultValue={clienteDemo.correo} />
      {guardado && <Alerta tipo="ok" titulo="Datos actualizados" />}
      <Boton className="w-fit" onClick={() => setGuardado(true)}>Guardar cambios</Boton>
    </Tarjeta>
  )
}

const Direcciones = () => {
  const [lista, setLista] = useState<Direccion[]>([])
  useEffect(() => {
    listarDirecciones().then(setLista)
  }, [])
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lista.map((d) => (
        <Tarjeta key={d.id} className="flex gap-3.5 !p-5">
          <MapPin size={24} className="shrink-0" />
          <div className="flex flex-col gap-1">
            <strong>{d.nombre}</strong>
            <span className="text-[13px] text-gris-700">
              {d.direccion}, {d.distrito}
              {d.referencia ? ` · Ref.: ${d.referencia}` : ''}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <Etiqueta>Zona {d.zona.codigo} · {textoZona[d.zona.codigo]}</Etiqueta>
              <Etiqueta>Delivery {soles(d.zona.tarifa)}</Etiqueta>
            </div>
          </div>
        </Tarjeta>
      ))}
    </div>
  )
}

const Facturacion = () => (
    <Tarjeta className="flex max-w-[640px] flex-col gap-3">
      <h2 className="titulo-3">Datos de facturación</h2>
      <p className="text-[13px] text-gris-700">Boleta de venta electrónica · {clienteDemo.nombre} · DNI {clienteDemo.dni}</p>
      <p className="text-[13px] text-gris-700">Comprobantes enviados a {clienteDemo.correo}</p>
      <p className="text-[13px] text-gris-500">Si necesitas factura, ingresa el RUC de tu empresa al finalizar el pedido.</p>
    </Tarjeta>
)

export default function MiPerfil() {
  const [pestana, setPestana] = useState<Pestana>('pedidos')
  return (
    <div className="contenedor flex flex-col gap-6">
      <h1 className="titulo-1">Mi cuenta</h1>
      <Chips
        activa={pestana}
        onCambiar={setPestana}
        opciones={[
          { valor: 'datos', texto: 'Datos personales' },
          { valor: 'direcciones', texto: 'Direcciones' },
          { valor: 'facturacion', texto: 'Datos de facturación' },
          { valor: 'pedidos', texto: 'Mis pedidos' },
        ]}
      />
      {pestana === 'datos' && <DatosPersonales />}
      {pestana === 'direcciones' && <Direcciones />}
      {pestana === 'facturacion' && <Facturacion />}
      {pestana === 'pedidos' && <MisPedidos />}
    </div>
  )
}
