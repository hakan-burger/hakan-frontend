// Pantalla 16 · Checkout 4 – Resumen y confirmación
// Responsable: Eber
// Antes de confirmar se verifica la disponibilidad (pantalla 17, components/checkout/VerificacionDisponibilidad). Confirmar: await usePedido().confirmar() y navegar a /pedido-registrado.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Confirmacion() {
  return <EnConstruccion numero="16" nombre="Checkout 4 – Resumen y confirmación" responsable="Eber" siguientes={[{ texto: 'Confirmar pedido', to: '/pedido-registrado' }, { texto: 'Volver', to: '/checkout/pago' }]} />
}
