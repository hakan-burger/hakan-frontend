// Pantalla 13, 14 y 15 · Checkout 3 – Método de pago
// Responsable: Daniel
// Una página con tres opciones: PagoYapePlin (13), PagoEfectivo (14) y PagoPOS (15). Al continuar: usePedido().setPago(...). Vuelto: calcularVuelto() de shared/utils/calculos.
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import type { MetodoPago } from '../../../../shared/types'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { CheckoutLayout } from '../../../../shared/components/pedido'
import { OpcionTarjeta } from '../../components/comunes'
import BotonesPaso from '../../components/checkout/BotonesPaso'
import PagoYapePlin from '../../components/checkout/PagoYapePlin'
import PagoEfectivo from '../../components/checkout/PagoEfectivo'
import PagoPOS from '../../components/checkout/PagoPOS'

export default function Pago() {
  const { items, entrega, comprobante, pago, totales, setPago } = usePedido()
  const navigate = useNavigate()

  const [metodo, setMetodo] = useState<MetodoPago>(pago?.metodo ?? 'YAPE_PLIN')
  const [numeroOperacion, setNumeroOperacion] = useState(pago?.numeroOperacion ?? '')
  const [captura, setCaptura] = useState<File>()
  const [monto, setMonto] = useState(pago?.montoConQuePaga ? String(pago.montoConQuePaga) : '')
  const [tipoTarjeta, setTipoTarjeta] = useState<'DEBITO' | 'CREDITO'>(pago?.tipoTarjeta ?? 'DEBITO')
  const [error, setError] = useState('')

  if (!items.length) return <Navigate to="/carrito" replace />
  if (!entrega) return <Navigate to="/checkout/entrega" replace />
  if (!comprobante) return <Navigate to="/checkout/comprobante" replace />

  const recojo = entrega.modalidad === 'RECOJO'

  const elegir = (m: MetodoPago) => {
    setMetodo(m)
    setError('')
  }

  const continuar = () => {
    if (metodo === 'YAPE_PLIN') {
      if (numeroOperacion.length < 6) return setError('Ingresa el número de operación de tu Yape o Plin')
      setPago({ metodo, numeroOperacion })
    }
    if (metodo === 'EFECTIVO') {
      const pagaCon = Number(monto)
      if (!monto || Number.isNaN(pagaCon)) return setError('Indica con cuánto vas a pagar')
      if (pagaCon < totales.total) return setError('El monto no alcanza para el total del pedido')
      setPago({ metodo, montoConQuePaga: pagaCon })
    }
    if (metodo === 'POS') setPago({ metodo, tipoTarjeta })
    navigate('/checkout/confirmacion')
  }

  return (
    <CheckoutLayout paso={3} titulo="Elige cómo pagar">
      <OpcionTarjeta
        icono={<Smartphone size={24} />}
        titulo="Yape / Plin (pago anticipado)"
        descripcion={metodo === 'YAPE_PLIN' ? 'Atención verificará el abono antes de enviar tu pedido a cocina' : undefined}
        seleccionada={metodo === 'YAPE_PLIN'}
        onClick={() => elegir('YAPE_PLIN')}
      >
        <PagoYapePlin
          total={totales.total}
          numeroOperacion={numeroOperacion}
          captura={captura}
          error={error}
          onNumero={(n) => {
            setNumeroOperacion(n)
            setError('')
          }}
          onCaptura={setCaptura}
        />
      </OpcionTarjeta>

      <OpcionTarjeta
        icono={<Banknote size={24} />}
        titulo={recojo ? 'Efectivo en caja' : 'Efectivo contraentrega'}
        descripcion={metodo === 'EFECTIVO' ? 'Pagas al recibir tu pedido' : undefined}
        seleccionada={metodo === 'EFECTIVO'}
        onClick={() => elegir('EFECTIVO')}
      >
        <PagoEfectivo
          total={totales.total}
          monto={monto}
          error={error}
          onMonto={(m) => {
            setMonto(m)
            setError('')
          }}
        />
      </OpcionTarjeta>

      <OpcionTarjeta
        icono={<CreditCard size={24} />}
        titulo={recojo ? 'POS en caja (tarjeta)' : 'POS contraentrega (tarjeta)'}
        descripcion={metodo === 'POS' ? 'Pagas con tarjeta al recibir tu pedido' : undefined}
        seleccionada={metodo === 'POS'}
        onClick={() => elegir('POS')}
      >
        <PagoPOS tipo={tipoTarjeta} onTipo={setTipoTarjeta} />
      </OpcionTarjeta>

      <p className="text-[13px] text-gris-500">Si recoges en local, pagas en caja al retirar tu pedido. No hay recargos por pagar contraentrega.</p>

      <BotonesPaso volver="/checkout/comprobante" onContinuar={continuar} />
    </CheckoutLayout>
  )
}
