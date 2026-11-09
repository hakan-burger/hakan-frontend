// Pantalla 16 · Checkout 4 – Resumen y confirmación
// Responsable: Eberf
// Antes de confirmar se verifica la disponibilidad (pantalla 17, components/checkout/VerificacionDisponibilidad). Confirmar: await usePedido().confirmar() y navegar a /pedido-registrado.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { CheckoutLayout } from '../../../../shared/components/pedido'
import { Alerta, Tarjeta } from '../../../../shared/components/ui'
import { calcularVuelto, soles } from '../../../../shared/utils/calculos'
import { FilaCasilla } from '../../components/comunes'
import BotonesPaso from '../../components/checkout/BotonesPaso'
import VerificacionDisponibilidad from '../../components/checkout/VerificacionDisponibilidad'
import { detalleItem, revisarCarrito, type ResultadoDisponibilidad } from '../../services/disponibilidadService'

const Seccion = ({ titulo, editar, children }: { titulo: string; editar: string; children: ReactNode }) => (
  <Tarjeta className="flex flex-col gap-1.5 !p-5">
    <div className="flex justify-between gap-3">
      <strong className="text-[15px]">{titulo}</strong>
      <Link to={editar} className="text-[13px] font-semibold text-rojo-hakan">Editar</Link>
    </div>
    <div className="text-[13px] text-gris-700">{children}</div>
  </Tarjeta>
)

export default function Confirmacion() {
  const { items, entrega, comprobante, pago, totales, confirmar, quitarItem, reemplazarProducto } = usePedido()
  const navigate = useNavigate()
  const confirmado = useRef(false)

  const [revision, setRevision] = useState<ResultadoDisponibilidad>()
  const [acepta, setAcepta] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  // Pantalla 17: se vuelve a revisar la disponibilidad al entrar y cuando el cliente quita o cambia un producto
  const clave = items.map((i) => i.producto.id).join(',')
  useEffect(() => {
    if (items.length) revisarCarrito(items).then(setRevision)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave])

  if (confirmado.current) return null
  if (!items.length) return <Navigate to="/carrito" replace />
  if (!entrega) return <Navigate to="/checkout/entrega" replace />
  if (!comprobante) return <Navigate to="/checkout/comprobante" replace />
  if (!pago) return <Navigate to="/checkout/pago" replace />

  const hayAgotados = !!revision && items.some((i) => revision.agotados.includes(i.producto.id))

  const confirmarPedido = async () => {
    setEnviando(true)
    setError('')
    try {
      // última verificación justo antes de registrar el pedido
      const ultima = await revisarCarrito(items)
      setRevision(ultima)
      if (ultima.agotados.length) return
      confirmado.current = true
      await confirmar()
      navigate('/pedido-registrado')
    } catch {
      confirmado.current = false
      setError('No pudimos registrar tu pedido. Inténtalo otra vez.')
    } finally {
      setEnviando(false)
    }
  }

  const textoEntrega =
    entrega.modalidad === 'DELIVERY'
      ? `Delivery · ${entrega.direccion?.direccion}, ${entrega.direccion?.distrito} · ${entrega.direccion?.zona.tiempo}`
      : 'Recojo en local · Av. Julio C. Tello 203, Santa Clara · 20 a 30 min'

  const textoComprobante =
    comprobante.tipo === 'BOLETA'
      ? `Boleta de venta · ${comprobante.nombreORazonSocial} · DNI ${comprobante.documento}`
      : `Factura · ${comprobante.nombreORazonSocial} · RUC ${comprobante.documento}`

  const contra = entrega.modalidad === 'DELIVERY' ? 'contraentrega' : 'en caja'
  const textoPago =
    pago.metodo === 'YAPE_PLIN'
      ? `Yape/Plin (pago anticipado) · N.° de operación ${pago.numeroOperacion}`
      : pago.metodo === 'EFECTIVO'
        ? `Efectivo ${contra} · Pagas con ${soles(pago.montoConQuePaga ?? 0)} · Vuelto ${soles(calcularVuelto(totales.total, pago.montoConQuePaga ?? 0))}`
        : `POS ${contra} · Tarjeta de ${pago.tipoTarjeta === 'CREDITO' ? 'crédito' : 'débito'}`

  return (
    <CheckoutLayout paso={4} titulo="Revisa y confirma tu pedido">
      {!revision && <Alerta tipo="info" titulo="Verificando la disponibilidad de tus productos..." />}

      {hayAgotados ? (
        <VerificacionDisponibilidad items={items} revision={revision} onQuitar={quitarItem} onCambiar={reemplazarProducto} />
      ) : (
        revision && (
          <>
            <Alerta tipo="ok" titulo="Disponibilidad verificada">
              Todos los productos están disponibles en este momento (revisado a las {revision.revisadoA}).
            </Alerta>
            <Seccion titulo="Productos" editar="/carrito">
              {items.map((i) => (
                <div key={i.idLinea}>{i.cantidad} x {i.producto.nombre} ({detalleItem(i).toLowerCase()})</div>
              ))}
            </Seccion>
            <Seccion titulo="Entrega" editar="/checkout/entrega">{textoEntrega}</Seccion>
            <Seccion titulo="Comprobante" editar="/checkout/comprobante">{textoComprobante}</Seccion>
            <Seccion titulo="Pago" editar="/checkout/pago">{textoPago}</Seccion>
            <FilaCasilla marcada={acepta} onClick={() => setAcepta(!acepta)}>Acepto los términos y condiciones de compra</FilaCasilla>
          </>
        )
      )}

      {error && <Alerta tipo="error" titulo={error} />}

      <BotonesPaso
        volver="/checkout/pago"
        textoContinuar={enviando ? 'Confirmando...' : hayAgotados ? 'Confirmar pedido' : `Confirmar pedido · ${soles(totales.total)}`}
        deshabilitado={!revision || hayAgotados || !acepta || enviando}
        onContinuar={confirmarPedido}
      />
    </CheckoutLayout>
  )
}

