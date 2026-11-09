
// Etiqueta "Estado del pago" de la bandeja (24) y de revisar pedido (25)
import type { Pedido } from '../../../../shared/types'
import { Etiqueta } from '../../../../shared/components/ui'

export default function EstadoPago({ pedido }: { pedido: Pedido }) {
  if (pedido.pago.metodo !== 'YAPE_PLIN') return <Etiqueta>{pedido.entrega.modalidad === 'RECOJO' ? 'Paga en caja' : 'Contraentrega'}</Etiqueta>
  return pedido.pagoVerificado ? <Etiqueta variante="disponible">Verificado</Etiqueta> : <Etiqueta variante="promo">Por verificar</Etiqueta>
}
