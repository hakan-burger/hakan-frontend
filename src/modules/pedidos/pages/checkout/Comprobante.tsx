// Pantalla 11 y 12 · Checkout 2 – Comprobante (boleta / factura)
// Responsable: Daniel
// Una página con dos opciones: components/checkout/FormBoleta (11) y FormFactura (12). Al continuar: usePedido().setComprobante(...).
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Comprobante() {
  return <EnConstruccion numero="11 y 12" nombre="Checkout 2 – Comprobante (boleta / factura)" responsable="Daniel" siguientes={[{ texto: 'Continuar', to: '/checkout/pago' }, { texto: 'Volver', to: '/checkout/entrega' }]} />
}
