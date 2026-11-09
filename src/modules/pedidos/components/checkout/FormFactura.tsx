// Pantalla 12 · Comprobante: factura (validación de RUC)
// Pide RUC (11 dígitos), razón social, dirección fiscal y correo.
import { useState } from 'react'
import { Alerta, Boton, Campo, Tarjeta } from '../../../../shared/components/ui'
import { consultarRuc, rucConFormatoValido } from '../../services/sunatService'
import type { DatosFactura, ErroresFactura } from '../../services/validarComprobante'

export default function FormFactura({ datos, errores, onCambiar }: { datos: DatosFactura; errores: ErroresFactura; onCambiar: (d: DatosFactura) => void }) {
  const [consultando, setConsultando] = useState(false)
  const [errorRuc, setErrorRuc] = useState('')

  const validarRuc = async () => {
    if (!rucConFormatoValido(datos.ruc)) return setErrorRuc('El RUC tiene 11 dígitos y empieza con 10 o 20')
    setConsultando(true)
    setErrorRuc('')
    try {
      const r = await consultarRuc(datos.ruc)
      if (!r) return setErrorRuc('No encontramos este RUC en SUNAT')
      if (r.estado !== 'ACTIVO' || r.condicion !== 'HABIDO') return setErrorRuc(`El RUC está ${r.estado.toLowerCase()} y ${r.condicion.toLowerCase()}; no se puede emitir factura`)
      onCambiar({ ...datos, razonSocial: r.razonSocial, direccionFiscal: r.direccionFiscal, validado: true })
    } catch {
      setErrorRuc('No pudimos conectar con SUNAT, inténtalo otra vez')
    } finally {
      setConsultando(false)
    }
  }

  return (
    <Tarjeta className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Campo
            etiqueta="RUC"
            inputMode="numeric"
            maxLength={11}
            value={datos.ruc}
            error={errorRuc || errores.ruc}
            onChange={(e) => onCambiar({ ...datos, ruc: e.target.value.replace(/\D/g, ''), validado: false })}
          />
        </div>
        <Boton variante="oscuro" className={errorRuc || errores.ruc ? 'sm:mb-[26px]' : ''} disabled={consultando} onClick={validarRuc}>
          {consultando ? 'Validando...' : 'Validar en SUNAT'}
        </Boton>
      </div>
      {datos.validado && (
        <Alerta tipo="ok" titulo="RUC válido · Activo y habido">Completamos los datos fiscales con la información de SUNAT.</Alerta>
      )}
      <Campo etiqueta="Razón social" value={datos.razonSocial} error={errores.razonSocial} readOnly={datos.validado} onChange={(e) => onCambiar({ ...datos, razonSocial: e.target.value })} />
      <Campo
        etiqueta="Dirección fiscal"
        value={datos.direccionFiscal}
        error={errores.direccionFiscal}
        onChange={(e) => onCambiar({ ...datos, direccionFiscal: e.target.value })}
      />
      <Campo etiqueta="Correo para enviar la factura" type="email" value={datos.correo} error={errores.correo} onChange={(e) => onCambiar({ ...datos, correo: e.target.value })} />
    </Tarjeta>
  )
}
