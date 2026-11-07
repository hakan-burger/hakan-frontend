// Pantalla 24 · Atención – Bandeja de pedidos
// Responsable: Eber
// Usar listarPedidos(estado) del pedidoService.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function BandejaPedidos() {
  return <EnConstruccion numero="24" nombre="Atención – Bandeja de pedidos" responsable="Eber" siguientes={[{ texto: 'Revisar pedido #1047', to: '/panel/pedidos/1047' }]} />
}
