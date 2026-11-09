// Pantalla 09 · Checkout 1 – Modalidad y dirección de entrega
// Responsable: Daniel
// Al continuar: usePedido().setEntrega({ modalidad, direccion, celularContacto }). Usar <CheckoutLayout paso={1} ...> de shared/components/pedido.
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MapPin, Store, Truck } from 'lucide-react'
import type { Direccion, Modalidad } from '../../../../shared/types'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { CheckoutLayout } from '../../../../shared/components/pedido'
import { Campo, Etiqueta } from '../../../../shared/components/ui'
import { clienteDemo } from '../../../../shared/data/mock'
import { soles } from '../../../../shared/utils/calculos'
import { OpcionTarjeta } from '../../components/comunes'
import BotonesPaso from '../../components/checkout/BotonesPaso'
import { celularValido, listarDirecciones, textoZona } from '../../services/direccionService'

export default function Entrega() {
  const { items, entrega, setEntrega } = usePedido()
  const navigate = useNavigate()

  const [modalidad, setModalidad] = useState<Modalidad>(entrega?.modalidad ?? 'DELIVERY')
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [direccionId, setDireccionId] = useState<number | undefined>(entrega?.direccion?.id)
  const [celular, setCelular] = useState(entrega?.celularContacto ?? clienteDemo.celular)
  const [error, setError] = useState('')

  useEffect(() => {
    listarDirecciones().then((lista) => {
      // si la dirección elegida antes no está en la lista (no se guardó), se agrega para poder verla
      const extra = entrega?.direccion && !lista.some((d) => d.id === entrega.direccion!.id) ? [entrega.direccion] : []
      setDirecciones([...lista, ...extra])
      setDireccionId((id) => id ?? lista[0]?.id)
    })
  }, [entrega])

  if (!items.length) return <Navigate to="/carrito" replace />

  const continuar = () => {
    if (!celularValido(celular)) return setError('Ingresa un celular de 9 dígitos que empiece con 9')
    const direccion = direcciones.find((d) => d.id === direccionId)
    if (modalidad === 'DELIVERY' && !direccion) return
    setEntrega({ modalidad, direccion: modalidad === 'DELIVERY' ? direccion : undefined, celularContacto: celular.replace(/\s/g, '') })
    navigate('/checkout/comprobante')
  }

  return (
    <CheckoutLayout paso={1} titulo="¿Cómo quieres recibir tu pedido?">
      <div className="grid gap-4 sm:grid-cols-2">
        <OpcionTarjeta
          icono={<Truck size={24} />}
          titulo="Delivery"
          descripcion="Te lo llevamos a tu dirección"
          seleccionada={modalidad === 'DELIVERY'}
          onClick={() => setModalidad('DELIVERY')}
        />
        <OpcionTarjeta
          icono={<Store size={24} />}
          titulo="Recojo en local"
          descripcion="Av. Julio C. Tello 203, Santa Clara"
          seleccionada={modalidad === 'RECOJO'}
          onClick={() => setModalidad('RECOJO')}
        />
      </div>

      {modalidad === 'DELIVERY' && (
        <>
          <h3 className="titulo-3">Dirección de entrega</h3>
          {direcciones.map((d) => {
            const elegida = d.id === direccionId
            return (
              <OpcionTarjeta
                key={d.id}
                icono={<MapPin size={24} />}
                titulo={d.nombre}
                descripcion={
                  elegida
                    ? `${d.direccion}, ${d.distrito}${d.referencia ? ` · Ref.: ${d.referencia}` : ''}`
                    : `${d.direccion}, ${d.distrito} · Zona ${d.zona.codigo} · ${soles(d.zona.tarifa)}`
                }
                seleccionada={elegida}
                onClick={() => setDireccionId(d.id)}
              >
                <div className="flex flex-wrap gap-2 pt-1">
                  <Etiqueta>Zona {d.zona.codigo} · {textoZona[d.zona.codigo]}</Etiqueta>
                  <Etiqueta>Delivery {soles(d.zona.tarifa)}</Etiqueta>
                  <Etiqueta>{d.zona.tiempo}</Etiqueta>
                </div>
              </OpcionTarjeta>
            )
          })}
          <Link to="/checkout/entrega/nueva-direccion" className="w-fit font-semibold text-rojo-hakan">+ Agregar nueva dirección</Link>
        </>
      )}

      <Campo
        etiqueta="Celular de contacto"
        inputMode="tel"
        maxLength={11}
        value={celular}
        error={error}
        onChange={(e) => {
          setCelular(e.target.value)
          setError('')
        }}
      />

      <BotonesPaso volver="/carrito" textoVolver="Volver al carrito" onContinuar={continuar} />
    </CheckoutLayout>
  )
}
