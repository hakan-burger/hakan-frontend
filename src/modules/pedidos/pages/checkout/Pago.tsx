// Pantalla 13, 14 y 15 · Checkout 3 – Método de pago
// Responsable: Daniel
// Una página con tres opciones: PagoYapePlin (13), PagoEfectivo (14) y PagoPOS (15). Al continuar: usePedido().setPago(...). Vuelto: calcularVuelto() de shared/utils/calculos.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Pago() {
  return <EnConstruccion numero="13, 14 y 15" nombre="Checkout 3 – Método de pago" responsable="Daniel" siguientes={[{ texto: 'Continuar', to: '/checkout/confirmacion' }, { texto: 'Volver', to: '/checkout/comprobante' }]} />
}
