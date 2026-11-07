// Pantalla 21 · Mi perfil y mis pedidos
// Responsable: Hilda
// Usar misPedidos() del pedidoService.
import EnConstruccion from '../../../../shared/components/EnConstruccion'

export default function MiPerfil() {
  return <EnConstruccion numero="21" nombre="Mi perfil y mis pedidos" responsable="Hilda" siguientes={[{ texto: 'Volver a la carta', to: '/' }]} />
}
