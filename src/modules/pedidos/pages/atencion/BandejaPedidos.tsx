// Pantalla 24 · Atención – Bandeja de pedidos
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EstadoPedido, Pedido } from '../../../../shared/types'
import { listarPedidos } from '../../../../shared/services/pedidoService'
import { Boton, Tarjeta } from '../../../../shared/components/ui'
import { soles, textoMetodoPago } from '../../../../shared/utils/calculos'
import { Chips, EncabezadoPanel } from '../../components/comunes'
import EstadoPago from '../../components/atencion/EstadoPago'

const FILTROS: { valor: EstadoPedido; texto: string }[] = [
  { valor: 'REGISTRADO', texto: 'Registrados' },
  { valor: 'EN_PREPARACION', texto: 'En preparación' },
  { valor: 'LISTO', texto: 'Listos' },
  { valor: 'EN_CAMINO', texto: 'En camino' },
  { valor: 'ENTREGADO', texto: 'Entregados' },
  { valor: 'CANCELADO', texto: 'Cancelados' },
]

const hora = (iso: string) => new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
const hoy = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })

export default function BandejaPedidos() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [estado, setEstado] = useState<EstadoPedido>('REGISTRADO')
  const [cargando, setCargando] = useState(true)

  // Se actualiza sola cada 20 segundos para ver los pedidos nuevos
  useEffect(() => {
    const cargar = () =>
      listarPedidos().then((p) => {
        setPedidos(p)
        setCargando(false)
      })
    cargar()
    const t = setInterval(cargar, 20000)
    return () => clearInterval(t)
  }, [])

  const lista = pedidos.filter((p) => p.estado === estado)
  const contar = (e: EstadoPedido) => pedidos.filter((p) => p.estado === e).length

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPanel titulo="Bandeja de pedidos" subtitulo={`Hoy, ${hoy}`} />
      <Chips activa={estado} onCambiar={setEstado} opciones={FILTROS.map((f) => ({ valor: f.valor, texto: `${f.texto} (${contar(f.valor)})` }))} />

      {/* celular: tarjetas */}
      <div className="flex flex-col gap-3 md:hidden">
        {lista.map((p) => (
          <Tarjeta key={p.id} className="flex flex-col gap-2 !p-4">
            <div className="flex items-center justify-between">
              <strong>#{p.id} · {hora(p.fecha)}</strong>
              <strong>{soles(p.totales.total)}</strong>
            </div>
            <span className="text-[13px]">{p.cliente.nombre}</span>
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-gris-700">
              {p.entrega.modalidad === 'DELIVERY' ? 'Delivery' : 'Recojo'} · {textoMetodoPago[p.pago.metodo]} <EstadoPago pedido={p} />
            </div>
            <Boton variante="oscuro" ancho className="!py-2.5" onClick={() => navigate(`/panel/pedidos/${p.id}`)}>
              {estado === 'REGISTRADO' ? 'Revisar' : 'Ver'}
            </Boton>
          </Tarjeta>
        ))}
        {!cargando && !lista.length && <Tarjeta className="text-center text-[13px] text-gris-500">No hay pedidos en este estado.</Tarjeta>}
      </div>

      <Tarjeta className="hidden overflow-x-auto !p-0 md:block">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-gris-50 text-xs font-semibold text-gris-500">
            <tr>
              <th className="w-20 px-4 py-3">Pedido</th>
              <th className="w-[70px] px-4 py-3">Hora</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="w-[100px] px-4 py-3">Modalidad</th>
              <th className="w-[100px] px-4 py-3">Pago</th>
              <th className="w-[150px] px-4 py-3">Estado del pago</th>
              <th className="w-[90px] px-4 py-3">Total</th>
              <th className="w-[110px] px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id} className="border-t border-gris-100">
                <td className="px-4 py-3">#{p.id}</td>
                <td className="px-4 py-3">{hora(p.fecha)}</td>
                <td className="px-4 py-3">{p.cliente.nombre}</td>
                <td className="px-4 py-3">{p.entrega.modalidad === 'DELIVERY' ? 'Delivery' : 'Recojo'}</td>
                <td className="px-4 py-3">{textoMetodoPago[p.pago.metodo]}</td>
                <td className="px-4 py-3"><EstadoPago pedido={p} /></td>
                <td className="px-4 py-3">{soles(p.totales.total)}</td>
                <td className="px-4 py-3">
                  <Boton variante="oscuro" className="!px-4 !py-2" onClick={() => navigate(`/panel/pedidos/${p.id}`)}>
                    {estado === 'REGISTRADO' ? 'Revisar' : 'Ver'}
                  </Boton>
                </td>
              </tr>
            ))}
            {!cargando && !lista.length && (
              <tr className="border-t border-gris-100">
                <td colSpan={8} className="px-4 py-6 text-center text-gris-500">No hay pedidos en este estado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Tarjeta>

      <p className="text-[13px] text-gris-500">Los pedidos llegan con la disponibilidad ya verificada; aquí solo se verifica el pago y se envían a cocina.</p>
    </div>
  )
}
