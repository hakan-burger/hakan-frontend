// Pantalla 10 · Checkout 1 – Registrar nueva dirección de entrega
// Responsable: Daniel
// Zonas y tarifas de prueba en shared/data/mock.ts (zonas).
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function NuevaDireccion() {
  return <EnConstruccion numero="10" nombre="Checkout 1 – Registrar nueva dirección de entrega" responsable="Daniel" siguientes={[{ texto: 'Guardar y continuar', to: '/checkout/comprobante' }, { texto: 'Volver', to: '/checkout/entrega' }]} />
}
