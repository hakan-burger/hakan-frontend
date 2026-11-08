// Validación del RUC con SUNAT (pantalla 12).
// Contrato con el backend: GET /api/sunat/ruc/{ruc} -> { ruc, razonSocial, direccionFiscal, estado, condicion }
import { http, esperar, USAR_MOCK } from '../../../shared/services/api'

export interface DatosRuc {
  ruc: string
  razonSocial: string
  direccionFiscal: string
  estado: string // "ACTIVO"
  condicion: string // "HABIDO"
}

// RUC de prueba mientras no hay backend
const RUC_PRUEBA: Record<string, Omit<DatosRuc, 'ruc'>> = {
  '20601234567': { razonSocial: 'INVERSIONES ANDINAS S.A.C.', direccionFiscal: 'Av. Separadora Industrial 320, Ate', estado: 'ACTIVO', condicion: 'HABIDO' },
  '10481391143': { razonSocial: 'ADAUTO CARBAJAL MIGUEL GUSTAVO', direccionFiscal: 'Av. Julio C. Tello 203, Santa Clara, Ate', estado: 'ACTIVO', condicion: 'HABIDO' },
}

// Formato: 11 dígitos y empieza con 10, 15, 17 o 20
export const rucConFormatoValido = (ruc: string) => /^(10|15|17|20)\d{9}$/.test(ruc)

export const consultarRuc = (ruc: string): Promise<DatosRuc | undefined> => {
  if (!USAR_MOCK) return http(`/sunat/ruc/${ruc}`)
  const datos = RUC_PRUEBA[ruc] ?? { razonSocial: `EMPRESA ${ruc.slice(-4)} S.A.C.`, direccionFiscal: 'Lima', estado: 'ACTIVO', condicion: 'HABIDO' }
  return esperar({ ruc, ...datos }, 600)
}
