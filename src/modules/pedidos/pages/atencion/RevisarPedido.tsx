// Pantalla 25 · Atención – Revisar pedido y verificar pago
// Responsable: Eber
// Ruta: /panel/pedidos/:id. Usar obtenerPedido(id), verificarPago(id) y cambiarEstado(id, "EN_PREPARACION").
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function RevisarPedido() {
  return <EnConstruccion numero="25" nombre="Atención – Revisar pedido y verificar pago" responsable="Eber" siguientes={[{ texto: 'Volver a la bandeja', to: '/panel/pedidos' }]} />
}
