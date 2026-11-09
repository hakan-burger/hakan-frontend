// Pantalla 18 · Pedido registrado
// Muestra el número, estado, total y entrega del pedido recién registrado.
import { Link } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { Tarjeta, claseBoton } from '../../../../shared/components/ui'
import { soles, textoEstado, textoMetodoPago } from '../../../../shared/utils/calculos'
import { Entre } from '../../components/comunes'

export default function PedidoRegistrado() {
  const { ultimoPedido: p } = usePedido()

  if (!p)
    return (
      <div className="contenedor">
        <Tarjeta className="mx-auto flex max-w-[640px] flex-col items-center gap-4 !p-10 text-center">
          <h1 className="titulo-2">No hay un pedido reciente</h1>
          <p className="text-gris-700">Puedes revisar el estado de tus pedidos en "Mis pedidos".</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className={claseBoton('secundario')}>Ir a la carta</Link>
            <Link to="/mi-perfil" className={claseBoton('primario')}>Mis pedidos</Link>
          </div>
        </Tarjeta>
      </div>
    )

  const delivery = p.entrega.modalidad === 'DELIVERY'
  const tiempo = delivery ? p.entrega.direccion?.zona.tiempo : '20 a 30 min'
  const pago = p.pago.metodo === 'YAPE_PLIN' ? 'Yape/Plin' : `${textoMetodoPago[p.pago.metodo]} contraentrega`

  return (
    <div className="contenedor">
      <Tarjeta className="mx-auto flex max-w-[640px] flex-col items-center gap-4 !p-10 text-center">
        <CircleCheck size={64} className="text-verde" />
        <h1 className="titulo-1">¡Pedido #{p.id} registrado!</h1>
        <p className="text-gris-700">
          Estado: {textoEstado[p.estado]} · Tiempo estimado: {tiempo}
        </p>
        <div className="flex w-full flex-col gap-2.5 rounded-2xl border border-gris-100 bg-gris-50 p-5 text-left">
          <Entre izq="Total" der={<strong>{soles(p.totales.total)}</strong>} />
          <Entre izq="Pago" der={pago} />
          <Entre
            izq="Entrega"
            der={delivery ? `${p.entrega.direccion?.direccion}, ${p.entrega.direccion?.distrito.split(',')[0]}` : 'Recojo en local'}
          />
        </div>
        <p className="text-[13px] text-gris-500">
          {p.pago.metodo === 'YAPE_PLIN'
            ? 'Verificaremos tu pago y te avisaremos cuando tu pedido entre a cocina.'
            : 'Te avisaremos cuando tu pedido entre a cocina.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className={claseBoton('secundario')}>Seguir comprando</Link>
          <Link to="/mi-perfil" className={claseBoton('primario')}>Ver seguimiento</Link>
        </div>
      </Tarjeta>
    </div>
  )
}
