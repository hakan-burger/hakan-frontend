// Pantalla 02 · Detalle y personalización
// Responsable: Hilda
// Ruta: /producto/:id. Leer el id con useParams() y usar obtenerProducto(id). Al agregar: usePedido().agregarProducto(producto, opciones).
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function DetalleProducto() {
  return <EnConstruccion numero="02" nombre="Detalle y personalización" responsable="Hilda" siguientes={[{ texto: 'Volver a la carta', to: '/' }, { texto: 'Ir al carrito', to: '/carrito' }]} />
}
