// Pantalla 03 · Carrito
// Responsable: Hilda
// Si un producto del carrito ya no está disponible se muestra el estado de la pantalla 04 (components/cliente/ProductoNoDisponible).
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Carrito() {
  return <EnConstruccion numero="03" nombre="Carrito" responsable="Hilda" siguientes={[{ texto: 'Continuar con la compra', to: '/checkout/entrega' }, { texto: 'Seguir comprando', to: '/' }]} />
}
