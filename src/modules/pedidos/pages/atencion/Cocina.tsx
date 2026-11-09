// Pantalla 28 · Cocina – Pedidos por preparar
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import type { Pedido } from '../../../../shared/types'
import { cambiarEstado, listarPedidos } from '../../../../shared/services/pedidoService'
import { Boton, Tarjeta } from '../../../../shared/components/ui'
import { EncabezadoPanel, FilaCasilla } from '../../components/comunes'

const MINUTOS_ALERTA = 8 // desde este tiempo el reloj se pone en rojo

const minutosDesde = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000))
const textoTiempo = (min: number, iso: string) =>
  min < 1 ? 'recién llegado' : min < 180 ? `hace ${min} min` : new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function Cocina() {
  const [pedidos, setPedidos] = useState<Pedido[]>()
  const [empaquetados, setEmpaquetados] = useState<number[]>([])
  const [, setReloj] = useState(0)

  useEffect(() => {
    const cargar = () => listarPedidos('EN_PREPARACION').then(setPedidos)
    cargar()
    const datos = setInterval(cargar, 20000)
    const reloj = setInterval(() => setReloj((n) => n + 1), 60000) // actualiza el "hace X min"
    return () => {
      clearInterval(datos)
      clearInterval(reloj)
    }
  }, [])

  const alternar = (id: number) => setEmpaquetados((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))

  const marcarListo = async (id: number) => {
    await cambiarEstado(id, 'LISTO')
    setPedidos((l) => l?.filter((p) => p.id !== id))
  }

  // el más antiguo primero
  const lista = [...(pedidos ?? [])].sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPanel titulo="Cocina" subtitulo="Pedidos aceptados por atención (En preparación)" />

      {!pedidos && <p className="text-[13px] text-gris-500">Cargando pedidos...</p>}
      {pedidos && !lista.length && (
        <Tarjeta className="text-center text-[13px] text-gris-500">No hay pedidos por preparar. Aparecerán aquí cuando atención los acepte.</Tarjeta>
      )}

      <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((p) => {
          const min = minutosDesde(p.fecha)
          const tarde = min >= MINUTOS_ALERTA
          const listo = empaquetados.includes(p.id)
          return (
            <Tarjeta key={p.id} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="titulo-3">#{p.id} · {p.entrega.modalidad === 'DELIVERY' ? 'Delivery' : 'Recojo'}</h3>
                <span className={`flex items-center gap-1.5 text-[13px] font-semibold ${tarde ? 'text-error' : 'text-gris-500'}`}>
                  <Clock size={18} /> {textoTiempo(min, p.fecha)}
                </span>
              </div>
              <hr className="border-gris-100" />
              {p.items.map((i) => (
                <div key={i.idLinea}>
                  <div>
                    {i.cantidad} x {i.producto.nombre}
                    {i.tamano && i.producto.tamanos.length > 1 ? ` (${i.tamano.nombre.toLowerCase()})` : ''}
                  </div>
                  {(i.adicionales.length > 0 || i.sinIngredientes.length > 0) && (
                    <div className="pl-4">
                      {[...i.adicionales.map((a) => `+ extra ${a.nombre.toLowerCase()}`), ...i.sinIngredientes.map((s) => s.toUpperCase())].join(' · ')}
                    </div>
                  )}
                  {i.indicaciones && <div className="pl-4 text-[13px] text-gris-700">Nota: {i.indicaciones}</div>}
                </div>
              ))}
              <div className="h-6" />
              <FilaCasilla marcada={listo} onClick={() => alternar(p.id)}>Pedido empaquetado</FilaCasilla>
              <Boton ancho disabled={!listo} onClick={() => marcarListo(p.id)}>Marcar como Listo</Boton>
            </Tarjeta>
          )
        })}
      </div>
    </div>
  )
}
