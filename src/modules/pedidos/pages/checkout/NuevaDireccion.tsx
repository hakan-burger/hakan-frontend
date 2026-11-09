// Pantalla 10 · Checkout 1 – Registrar nueva dirección de entrega
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { CheckoutLayout } from '../../../../shared/components/pedido'
import { Campo, FotoProducto, Tarjeta } from '../../../../shared/components/ui'
import { clienteDemo } from '../../../../shared/data/mock'
import { soles } from '../../../../shared/utils/calculos'
import { FilaCasilla } from '../../components/comunes'
import BotonesPaso from '../../components/checkout/BotonesPaso'
import { DISTRITOS, celularValido, guardarDireccion, textoZona } from '../../services/direccionService'

type Errores = Partial<Record<'nombre' | 'direccion' | 'distrito' | 'celular', string>>

export default function NuevaDireccion() {
  const { items, entrega, setEntrega } = usePedido()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [distrito, setDistrito] = useState('')
  const [referencia, setReferencia] = useState('')
  const [celular, setCelular] = useState(entrega?.celularContacto ?? clienteDemo.celular)
  const [guardar, setGuardar] = useState(true)
  const [errores, setErrores] = useState<Errores>({})
  const [enviando, setEnviando] = useState(false)

  if (!items.length) return <Navigate to="/carrito" replace />

  const zona = DISTRITOS.find((d) => d.nombre === distrito)?.zona

  const continuar = async () => {
    const e: Errores = {}
    if (!nombre.trim()) e.nombre = 'Ponle un nombre, ej.: Casa'
    if (direccion.trim().length < 5) e.direccion = 'Ingresa la dirección completa'
    if (!zona) e.distrito = 'Elige un distrito'
    if (!celularValido(celular)) e.celular = 'Ingresa un celular de 9 dígitos que empiece con 9'
    setErrores(e)
    if (Object.keys(e).length || !zona) return

    setEnviando(true)
    const nueva = await guardarDireccion(
      { nombre: nombre.trim(), direccion: direccion.trim(), distrito, referencia: referencia.trim() || undefined, zona },
      guardar,
    )
    setEntrega({ modalidad: 'DELIVERY', direccion: nueva, celularContacto: celular.replace(/\s/g, '') })
    navigate('/checkout/comprobante')
  }

  return (
    <CheckoutLayout paso={1} titulo="Nueva dirección de entrega">
      <div className="grid items-start gap-6 md:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3.5">
          <Campo etiqueta="Nombre de la dirección" placeholder="Casa de mi mamá" value={nombre} error={errores.nombre} onChange={(e) => setNombre(e.target.value)} />
          <Campo etiqueta="Dirección" placeholder="Calle Los Pinos 230" value={direccion} error={errores.direccion} onChange={(e) => setDireccion(e.target.value)} />
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Distrito</span>
            <select
              value={distrito}
              onChange={(e) => setDistrito(e.target.value)}
              className={`cursor-pointer rounded-[10px] border bg-blanco px-3.5 py-3 outline-none focus:border-rojo-hakan ${errores.distrito ? 'border-error' : 'border-gris-300'}`}
            >
              <option value="" disabled>Elige tu distrito</option>
              {DISTRITOS.map((d) => (
                <option key={d.nombre} value={d.nombre}>{d.nombre}</option>
              ))}
            </select>
            {errores.distrito && <span className="text-[13px] text-error">{errores.distrito}</span>}
          </label>
          <Campo etiqueta="Referencia" placeholder="Portón verde, al costado de la bodega" value={referencia} onChange={(e) => setReferencia(e.target.value)} />
          <Campo etiqueta="Celular de contacto" inputMode="tel" maxLength={11} value={celular} error={errores.celular} onChange={(e) => setCelular(e.target.value)} />
          <FilaCasilla marcada={guardar} onClick={() => setGuardar(!guardar)}>Guardar en mis direcciones</FilaCasilla>
        </div>

        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-2xl">
            <FotoProducto alto={260} texto="Mapa: mueve el pin a tu puerta" />
          </div>
          <Tarjeta className="flex flex-col gap-1 !p-4">
            {zona ? (
              <>
                <strong>Zona {zona.codigo} · {textoZona[zona.codigo]}</strong>
                <span className="text-[13px] text-gris-700">Delivery {soles(zona.tarifa)} · {zona.tiempo}</span>
              </>
            ) : (
              <span className="text-[13px] text-gris-500">Elige el distrito para ver la zona y el costo del delivery.</span>
            )}
          </Tarjeta>
        </div>
      </div>

      <BotonesPaso volver="/checkout/entrega" textoContinuar={enviando ? 'Guardando...' : 'Guardar y continuar'} deshabilitado={enviando} onContinuar={continuar} />
    </CheckoutLayout>
  )
}
