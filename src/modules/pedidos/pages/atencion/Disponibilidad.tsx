// Pantalla 29 · Atención – Disponibilidad de productos
import { useEffect, useState } from 'react'
import type { Categoria, Producto } from '../../../../shared/types'
import { cambiarDisponibilidad, listarCategorias, listarProductos } from '../../../../shared/services/catalogoService'
import { Boton, Tarjeta } from '../../../../shared/components/ui'
import { EncabezadoPanel, Interruptor } from '../../components/comunes'

const USUARIO = 'Rosa H.' // usuario de atención (cuando haya login vendrá de la sesión)

export default function Disponibilidad() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cambios, setCambios] = useState<Record<number, string>>({}) // id -> "Hoy 19:05 · Rosa H."
  const [guardando, setGuardando] = useState<number[]>([])

  useEffect(() => {
    listarProductos().then(setProductos)
    listarCategorias().then(setCategorias)
  }, [])

  const ahora = () => `Hoy ${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })} · ${USUARIO}`
  const categoria = (id: number) => categorias.find((c) => c.id === id)?.nombre ?? ''

  const cambiar = async (p: Producto, disponible: boolean) => {
    setGuardando((l) => [...l, p.id])
    await cambiarDisponibilidad(p.id, disponible)
    setProductos((l) => l.map((x) => (x.id === p.id ? { ...x, disponible } : x)))
    setCambios((c) => ({ ...c, [p.id]: ahora() }))
    setGuardando((l) => l.filter((x) => x !== p.id))
  }

  const agotados = productos.filter((p) => !p.disponible)

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPanel
        titulo="Disponibilidad de productos"
        subtitulo="Lo que marques como agotado deja de poder pedirse en la carta, el carrito y el checkout."
      />

      {/* celular: lista */}
      <Tarjeta className="!px-4 !py-1 md:hidden">
        {productos.map((p, n) => (
          <div key={p.id} className={`flex items-center gap-3 py-3 ${n ? 'border-t border-gris-100' : ''}`}>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[15px] font-semibold">{p.nombre}</span>
              <span className="text-xs text-gris-500">{categoria(p.categoriaId)} · {cambios[p.id] ?? 'Inicio del día'}</span>
            </div>
            <strong className={`text-[13px] ${p.disponible ? '' : 'text-error'}`}>{p.disponible ? 'Sí' : 'Agotado'}</strong>
            <Interruptor encendido={p.disponible} disabled={guardando.includes(p.id)} onCambiar={() => cambiar(p, !p.disponible)} />
          </div>
        ))}
      </Tarjeta>

      <Tarjeta className="hidden overflow-x-auto !p-0 md:block">
        <table className="w-full min-w-[680px] text-left text-[13px]">
          <thead className="bg-gris-50 text-xs font-semibold text-gris-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="w-[180px] px-4 py-3">Categoría</th>
              <th className="w-[180px] px-4 py-3">Disponible</th>
              <th className="w-[240px] px-4 py-3">Último cambio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t border-gris-100">
                <td className="px-4 py-3">{p.nombre}</td>
                <td className="px-4 py-3">{categoria(p.categoriaId)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Interruptor encendido={p.disponible} disabled={guardando.includes(p.id)} onCambiar={() => cambiar(p, !p.disponible)} />
                    <strong className={p.disponible ? '' : 'text-error'}>{p.disponible ? 'Sí' : 'Agotado'}</strong>
                  </div>
                </td>
                <td className="px-4 py-3">{cambios[p.id] ?? 'Inicio del día'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tarjeta>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-gris-700">
          {productos.length - agotados.length} disponibles · {agotados.length} agotados · Al cerrar el día todo vuelve a "Sí".
        </span>
        <Boton variante="secundario" disabled={!agotados.length} onClick={() => agotados.forEach((p) => cambiar(p, true))}>
          Marcar todo como disponible
        </Boton>
      </div>
    </div>
  )
}
