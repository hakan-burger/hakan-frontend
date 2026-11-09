// Pantalla 11 y 12 · Checkout 2 – Comprobante (boleta / factura)
// Muestra el formulario de boleta (11) o de factura (12).
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ReceiptText } from 'lucide-react'
import type { TipoComprobante } from '../../../../shared/types'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { CheckoutLayout } from '../../../../shared/components/pedido'
import { clienteDemo } from '../../../../shared/data/mock'
import { OpcionTarjeta } from '../../components/comunes'
import BotonesPaso from '../../components/checkout/BotonesPaso'
import FormBoleta from '../../components/checkout/FormBoleta'
import FormFactura from '../../components/checkout/FormFactura'
import {
  validarBoleta,
  validarFactura,
  type DatosBoleta,
  type DatosFactura,
  type ErroresBoleta,
  type ErroresFactura,
} from '../../services/validarComprobante'

export default function Comprobante() {
  const { items, entrega, comprobante, setComprobante } = usePedido()
  const navigate = useNavigate()
  const previo = comprobante

  const [tipo, setTipo] = useState<TipoComprobante>(previo?.tipo ?? 'BOLETA')
  const [boleta, setBoleta] = useState<DatosBoleta>(
    previo?.tipo === 'BOLETA'
      ? { dni: previo.documento, nombre: previo.nombreORazonSocial, correo: previo.correo }
      : { dni: clienteDemo.dni, nombre: clienteDemo.nombre, correo: clienteDemo.correo },
  )
  const [factura, setFactura] = useState<DatosFactura>(
    previo?.tipo === 'FACTURA'
      ? { ruc: previo.documento, razonSocial: previo.nombreORazonSocial, direccionFiscal: previo.direccionFiscal ?? '', correo: previo.correo, validado: true }
      : { ruc: '', razonSocial: '', direccionFiscal: '', correo: clienteDemo.correo, validado: false },
  )
  const [erroresBoleta, setErroresBoleta] = useState<ErroresBoleta>({})
  const [erroresFactura, setErroresFactura] = useState<ErroresFactura>({})

  if (!items.length) return <Navigate to="/carrito" replace />
  if (!entrega) return <Navigate to="/checkout/entrega" replace />

  const continuar = () => {
    if (tipo === 'BOLETA') {
      const e = validarBoleta(boleta)
      setErroresBoleta(e)
      if (Object.keys(e).length) return
      setComprobante({ tipo, documento: boleta.dni, nombreORazonSocial: boleta.nombre.trim(), correo: boleta.correo.trim() })
    } else {
      const e = validarFactura(factura)
      setErroresFactura(e)
      if (Object.keys(e).length) return
      setComprobante({
        tipo,
        documento: factura.ruc,
        nombreORazonSocial: factura.razonSocial,
        direccionFiscal: factura.direccionFiscal.trim(),
        correo: factura.correo.trim(),
      })
    }
    navigate('/checkout/pago')
  }

  return (
    <CheckoutLayout paso={2} titulo="¿Qué comprobante necesitas?">
      <div className="grid gap-4 sm:grid-cols-2">
        <OpcionTarjeta
          icono={<ReceiptText size={24} />}
          titulo="Boleta de venta electrónica"
          descripcion="Con tu DNI"
          seleccionada={tipo === 'BOLETA'}
          onClick={() => setTipo('BOLETA')}
        />
        <OpcionTarjeta
          icono={<ReceiptText size={24} />}
          titulo="Factura electrónica"
          descripcion="Con el RUC de tu empresa"
          seleccionada={tipo === 'FACTURA'}
          onClick={() => setTipo('FACTURA')}
        />
      </div>

      {tipo === 'BOLETA' ? (
        <>
          <FormBoleta datos={boleta} errores={erroresBoleta} onCambiar={setBoleta} />
          <p className="text-[13px] text-gris-500">Si eliges factura, validamos el RUC con SUNAT y completamos la razón social automáticamente.</p>
        </>
      ) : (
        <FormFactura datos={factura} errores={erroresFactura} onCambiar={setFactura} />
      )}

      <BotonesPaso volver="/checkout/entrega" onContinuar={continuar} />
    </CheckoutLayout>
  )
}
