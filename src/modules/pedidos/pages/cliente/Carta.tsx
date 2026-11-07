// Pantalla 01 · Carta (catálogo)
// Responsable: Hilda
// Usar listarCategorias() y listarProductos(categoriaId, buscar) del catalogoService.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function Carta() {
  return <EnConstruccion numero="01" nombre="Carta (catálogo)" responsable="Hilda" siguientes={[{ texto: 'Ver detalle de un producto', to: '/producto/4' }, { texto: 'Ir al carrito', to: '/carrito' }]} />
}
