
// Pantalla 11 · Comprobante: boleta
// Responsable: Daniel MCD
// Pide DNI, nombre y correo.
import { Campo, Tarjeta } from '../../../../shared/components/ui'
import type { DatosBoleta, ErroresBoleta } from '../../services/validarComprobante'

export default function FormBoleta({ datos, errores, onCambiar }: { datos: DatosBoleta; errores: ErroresBoleta; onCambiar: (d: DatosBoleta) => void }) {
  return (
    <Tarjeta className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Tipo de documento" value="DNI" readOnly />
        <Campo
          etiqueta="Número"
          inputMode="numeric"
          maxLength={8}
          value={datos.dni}
          error={errores.dni}
          onChange={(e) => onCambiar({ ...datos, dni: e.target.value.replace(/\D/g, '') })}
        />
      </div>
      <Campo etiqueta="Nombres y apellidos" value={datos.nombre} error={errores.nombre} onChange={(e) => onCambiar({ ...datos, nombre: e.target.value })} />
      <Campo
        etiqueta="Correo para enviar el comprobante"
        type="email"
        value={datos.correo}
        error={errores.correo}
        onChange={(e) => onCambiar({ ...datos, correo: e.target.value })}
      />
    </Tarjeta>
  )
}