// Botones "Volver" y "Continuar" del final de cada paso del checkout
import { Link } from 'react-router-dom'
import { Boton, claseBoton } from '../../../../shared/components/ui'

export default function BotonesPaso({
  volver,
  textoVolver = 'Volver',
  textoContinuar = 'Continuar',
  onContinuar,
  deshabilitado,
}: {
  volver: string
  textoVolver?: string
  textoContinuar?: string
  onContinuar: () => void
  deshabilitado?: boolean
}) {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      <Link to={volver} className={claseBoton('secundario')}>{textoVolver}</Link>
      <Boton onClick={onContinuar} disabled={deshabilitado}>{textoContinuar}</Boton>
    </div>
  )
}
