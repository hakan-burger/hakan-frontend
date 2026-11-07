// Pantalla 09 · Checkout 1 – Modalidad y dirección de entrega
// Responsable: Daniel
// Al continuar: usePedido().setEntrega({ modalidad, direccion, celularContacto }). Usar <CheckoutLayout paso={1} ...> de shared/components/pedido.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Entrega() {
  return <EnConstruccion numero="09" nombre="Checkout 1 – Modalidad y dirección de entrega" responsable="Daniel" siguientes={[{ texto: 'Registrar nueva dirección', to: '/checkout/entrega/nueva-direccion' }, { texto: 'Continuar', to: '/checkout/comprobante' }, { texto: 'Volver al carrito', to: '/carrito' }]} />
}
