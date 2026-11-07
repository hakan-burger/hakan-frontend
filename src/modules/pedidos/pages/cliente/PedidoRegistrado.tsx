// Pantalla 18 · Pedido registrado
// Responsable: Hilda
// Mostrar usePedido().ultimoPedido (número, estado, total, entrega).
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function PedidoRegistrado() {
  return <EnConstruccion numero="18" nombre="Pedido registrado" responsable="Hilda" siguientes={[{ texto: 'Ver mis pedidos', to: '/mi-perfil' }, { texto: 'Volver a la carta', to: '/' }]} />
}
