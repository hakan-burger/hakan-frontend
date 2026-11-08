// Pantalla 25 · Atención – Revisar pedido y verificar pago
// Responsable: Eber
// Ruta: /panel/pedidos/:id. Usar obtenerPedido(id), verificarPago(id) y cambiarEstado(id, "EN_PREPARACION").
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CircleAlert, CircleCheck } from 'lucide-react'
import type { Pedido } from '../../../../shared/types'
import { cambiarEstado, obtenerPedido, verificarPago } from '../../../../shared/services/pedidoService'
import { Alerta, Boton, Etiqueta, FotoProducto, Tarjeta } from '../../../../shared/components/ui'
import { calcularVuelto, soles, textoEstado } from '../../../../shared/utils/calculos'
import { EncabezadoPanel, Entre, OpcionTarjeta } from '../../components/comunes'
import { detalleItem } from '../../services/disponibilidadService'

type Abono = 'COMPLETO' | 'NO_LLEGO'

const celular = (c: string) => c.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')

export default function RevisarPedido() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<Pedido | null>()
  const [abono, setAbono] = useState<Abono>()
  const [avisado, setAvisado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    obtenerPedido(Number(id)).then((p) => {
      setPedido(p ?? null)
      if (p?.pagoVerificado) setAbono('COMPLETO')
    })
  }, [id])

  if (pedido === undefined) return <p className="text-[13px] text-gris-500">Cargando pedido...</p>
  if (pedido === null)
    return (
      <div className="flex flex-col gap-3">
        <h1 className="titulo-2">No encontramos el pedido #{id}</h1>
        <Link to="/panel/pedidos" className="font-semibold text-rojo-hakan">← Volver a la bandeja</Link>
      </div>
    )

  const p = pedido
  const yape = p.pago.metodo === 'YAPE_PLIN'
  const pendiente = p.estado === 'REGISTRADO'
  // Con Yape/Plin solo se envía a cocina cuando el abono llegó completo; contraentrega se cobra al entregar
  const puedeAceptar = pendiente && (!yape || abono === 'COMPLETO')

  const aceptar = async () => {
    setEnviando(true)
    if (yape && !p.pagoVerificado) await verificarPago(p.id)
    await cambiarEstado(p.id, 'EN_PREPARACION')
    navigate('/panel/pedidos')
  }

  const entrega =
    p.entrega.modalidad === 'DELIVERY'
      ? `Delivery · ${p.entrega.direccion?.direccion}, ${p.entrega.direccion?.distrito} · Zona ${p.entrega.direccion?.zona.codigo} (${soles(p.totales.delivery)})`
      : 'Recojo en local'
  const comprobante = p.comprobante.tipo === 'BOLETA' ? `Boleta · DNI ${p.comprobante.documento}` : `Factura · RUC ${p.comprobante.documento} · ${p.comprobante.nombreORazonSocial}`

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPanel titulo={`Revisar pedido #${p.id}`} subtitulo={`Estado: ${textoEstado[p.estado]}`}>
        <Link to="/panel/pedidos" className="text-[13px] font-semibold text-gris-700 hover:text-negro">← Volver a la bandeja</Link>
      </EncabezadoPanel>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_460px]">
        <div className="flex flex-col gap-4">
          <Tarjeta className="flex flex-col gap-1.5">
            <h3 className="titulo-3">Cliente y entrega</h3>
            <span className="text-[13px] text-gris-700">{p.cliente.nombre} · {celular(p.entrega.celularContacto)}</span>
            <span className="text-[13px] text-gris-700">{entrega}</span>
            <span className="text-[13px] text-gris-700">{comprobante}</span>
          </Tarjeta>

          <Tarjeta className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="titulo-3">Productos</h3>
              <Etiqueta variante="disponible">Disponibilidad verificada al confirmar</Etiqueta>
            </div>
            {p.items.map((i) => (
              <div key={i.idLinea} className="text-[13px]">
                ✓ {i.cantidad} x {i.producto.nombre}
                {(i.sinIngredientes.length > 0 || i.adicionales.length > 0) && <span className="text-gris-500"> ({detalleItem(i).toLowerCase()})</span>}
                {i.indicaciones && <span className="text-gris-500"> · "{i.indicaciones}"</span>}
              </div>
            ))}
            <hr className="my-1 border-gris-100" />
            <div className="flex items-center justify-between">
              <strong className="titulo-3">Total</strong>
              <strong className="titulo-2">{soles(p.totales.total)}</strong>
            </div>
          </Tarjeta>

          {pendiente ? (
            <Boton ancho disabled={!puedeAceptar || enviando} onClick={aceptar}>
              {enviando ? 'Enviando...' : 'Aceptar pedido y enviar a cocina'}
            </Boton>
          ) : (
            <Alerta tipo="ok" titulo={`Este pedido ya fue aceptado (${textoEstado[p.estado]})`} />
          )}
        </div>

        <Tarjeta className="flex flex-col gap-3.5">
          {yape ? (
            <>
              <h3 className="titulo-3">Pago anticipado · Yape/Plin</h3>
              <Entre izq="N.° de operación" der={<strong>{p.pago.numeroOperacion}</strong>} />
              <Entre izq="Monto" der={<strong>{soles(p.totales.total)}</strong>} />
              <div className="overflow-hidden rounded-[10px]">
                <FotoProducto alto={160} texto="Captura enviada por el cliente" />
              </div>
              <OpcionTarjeta
                icono={<CircleCheck size={24} />}
                titulo="El abono llegó completo"
                seleccionada={abono === 'COMPLETO'}
                onClick={() => pendiente && setAbono('COMPLETO')}
              />
              <OpcionTarjeta
                icono={<CircleAlert size={24} />}
                titulo="El abono no llegó o el monto es diferente"
                seleccionada={abono === 'NO_LLEGO'}
                onClick={() => pendiente && setAbono('NO_LLEGO')}
              />
              <Boton variante="secundario" ancho disabled={abono !== 'NO_LLEGO' || avisado} onClick={() => setAvisado(true)}>
                Pedir al cliente que regularice el pago
              </Boton>
              {avisado && (
                <Alerta tipo="info" titulo="Se avisó al cliente">
                  Le pedimos por WhatsApp al {celular(p.cliente.celular)} que envíe el abono o la captura correcta.
                </Alerta>
              )}
            </>
          ) : (
            <>
              <h3 className="titulo-3">
                {p.pago.metodo === 'EFECTIVO' ? 'Efectivo' : 'POS'} · {p.entrega.modalidad === 'DELIVERY' ? 'contraentrega' : 'paga en caja'}
              </h3>
              <Entre izq="Monto a cobrar" der={<strong>{soles(p.totales.total)}</strong>} />
              {p.pago.metodo === 'EFECTIVO' ? (
                <>
                  <Entre izq="Paga con" der={<strong>{soles(p.pago.montoConQuePaga ?? 0)}</strong>} />
                  <Entre izq="Vuelto a llevar" der={<strong className="text-verde">{soles(calcularVuelto(p.totales.total, p.pago.montoConQuePaga ?? 0))}</strong>} />
                </>
              ) : (
                <Entre izq="Tarjeta" der={<strong>{p.pago.tipoTarjeta === 'CREDITO' ? 'Crédito' : 'Débito'}</strong>} />
              )}
              <p className="text-[13px] text-gris-500">
                No hay que verificar nada ahora: el pago se cobra {p.entrega.modalidad === 'DELIVERY' ? 'al entregar el pedido' : 'cuando el cliente recoja en el local'}.
              </p>
            </>
          )}
        </Tarjeta>
      </div>
    </div>
  )
}
