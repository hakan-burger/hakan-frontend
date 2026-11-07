// Marcador temporal: cada dev lo reemplaza por su pantalla real.
import { Link } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { Tarjeta, claseBoton } from './ui'

interface Props {
  numero: string // número de la pantalla en el Figma
  nombre: string
  responsable: 'Hilda' | 'Daniel' | 'Eber'
  siguientes?: { texto: string; to: string }[] // enlaces para recorrer el flujo mientras tanto
}

const COLOR = { Hilda: 'bg-hilda', Daniel: 'bg-daniel', Eber: 'bg-eber' }

export default function EnConstruccion({ numero, nombre, responsable, siguientes = [] }: Props) {
  return (
    <div className="contenedor">
      <Tarjeta className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Construction size={22} />
          <h1 className="titulo-2">{numero} · {nombre}</h1>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold text-blanco ${COLOR[responsable]}`}>
          Responsable: {responsable}
        </span>
        <p className="text-[13px] text-gris-500">
          Pantalla en construcción. Ver el diseño en Figma → página "📱 Pantallas" → marco "{numero} …".
        </p>
        {siguientes.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {siguientes.map((s) => (
              <Link key={s.to} to={s.to} className={claseBoton('secundario')}>{s.texto}</Link>
            ))}
          </div>
        )}
      </Tarjeta>
    </div>
  )
}
