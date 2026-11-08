// Datos y validaciones de los formularios de comprobante (pantallas 11 y 12)

export interface DatosBoleta {
  dni: string
  nombre: string
  correo: string
}

export type ErroresBoleta = Partial<Record<keyof DatosBoleta, string>>

export const validarBoleta = (d: DatosBoleta): ErroresBoleta => {
  const e: ErroresBoleta = {}
  if (!/^\d{8}$/.test(d.dni)) e.dni = 'El DNI tiene 8 dígitos'
  if (d.nombre.trim().length < 3) e.nombre = 'Ingresa tus nombres y apellidos'
  if (!/^\S+@\S+\.\S+$/.test(d.correo)) e.correo = 'Ingresa un correo válido'
  return e
}

export interface DatosFactura {
  ruc: string
  razonSocial: string
  direccionFiscal: string
  correo: string
  validado: boolean // true cuando SUNAT respondió que el RUC está activo y habido
}

export type ErroresFactura = Partial<Record<keyof DatosFactura, string>>

export const validarFactura = (d: DatosFactura): ErroresFactura => {
  const e: ErroresFactura = {}
  if (!d.validado) e.ruc = 'Valida el RUC en SUNAT antes de continuar'
  if (!d.razonSocial.trim()) e.razonSocial = 'Falta la razón social'
  if (!d.direccionFiscal.trim()) e.direccionFiscal = 'Falta la dirección fiscal'
  if (!/^\S+@\S+\.\S+$/.test(d.correo)) e.correo = 'Ingresa un correo válido'
  return e
}
