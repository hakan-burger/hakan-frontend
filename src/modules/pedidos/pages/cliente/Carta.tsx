// Pantalla 01 · Carta (catálogo)
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Categoria, Producto } from '../../../../shared/types'
import { listarCategorias, listarProductos } from '../../../../shared/services/catalogoService'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { Etiqueta, FotoProducto, claseBoton } from '../../../../shared/components/ui'
import TarjetaProducto from '../../components/cliente/TarjetaProducto'

type Orden = 'destacados' | 'menor' | 'mayor'

const ordenar = (lista: Producto[], orden: Orden) => {
  if (orden === 'menor') return [...lista].sort((a, b) => a.precio - b.precio)
  if (orden === 'mayor') return [...lista].sort((a, b) => b.precio - a.precio)
  // destacados: primero los que tienen etiqueta y al final los agotados
  return [...lista].sort((a, b) => Number(!a.disponible) - Number(!b.disponible) || Number(!a.etiqueta) - Number(!b.etiqueta))
}

export default function Carta() {
  const [params] = useSearchParams()
  const buscar = params.get('buscar') ?? ''
  const navigate = useNavigate()
  const { items, agregarProducto, cambiarCantidad } = usePedido()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [categoriaId, setCategoriaId] = useState<number>()
  const [orden, setOrden] = useState<Orden>('destacados')
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    listarCategorias().then(setCategorias)
  }, [])

  useEffect(() => {
    listarProductos(categoriaId, buscar).then((p) => {
      setProductos(p)
      setCargando(false)
    })
  }, [categoriaId, buscar])

  // Si no hay una categoría elegida se muestra la carta agrupada por categoría
  const secciones = useMemo(() => {
    const lista = categoriaId ? categorias.filter((c) => c.id === categoriaId) : categorias
    return lista
      .map((c) => ({ categoria: c, productos: ordenar(productos.filter((p) => p.categoriaId === c.id), orden) }))
      .filter((s) => s.productos.length > 0)
  }, [categorias, productos, categoriaId, orden])

  const agregar = (p: Producto) => {
    // Si el producto tiene opciones (tamaño, extras...) se elige en el detalle
    if (p.tamanos.length || p.adicionales.length || p.ingredientesQuitables.length) return navigate(`/producto/${p.id}`)
    // si ya está en el carrito se suma la cantidad (así aplica la promo 2x1)
    const linea = items.find((i) => i.producto.id === p.id)
    if (linea) cambiarCantidad(linea.idLinea, linea.cantidad + 1)
    else agregarProducto(p)
    setAviso(`${p.nombre} se agregó al carrito`)
    setTimeout(() => setAviso(''), 2500)
  }

  return (
    <>
      <section className="bg-negro">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-10 md:flex-row md:gap-12 md:px-[120px] md:py-14">
          <div className="flex flex-1 flex-col gap-4">
            <Etiqueta variante="promo">PROMO DE LA SEMANA</Etiqueta>
            <h1 className="display text-blanco">2x1 en Limonada Frozen</h1>
            <p className="max-w-[520px] text-gris-300">
              Pide online, paga con Yape/Plin o contraentrega y sigue tu pedido en tiempo real.
            </p>
            <a href="#carta" className={`${claseBoton('primario')} w-fit`}>Comienza tu pedido</a>
          </div>
          <div className="w-full overflow-hidden rounded-2xl md:w-[520px]">
            <FotoProducto alto={300} texto="Foto de la promoción" />
          </div>
        </div>
      </section>

      <div id="carta" className="contenedor flex scroll-mt-20 flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2.5">
            {[{ id: undefined, nombre: 'Todos' }, ...categorias].map((c) => {
              const activo = c.id === categoriaId
              return (
                <button
                  key={c.nombre}
                  onClick={() => setCategoriaId(c.id)}
                  className={`cursor-pointer rounded-full border px-[18px] py-2.5 text-[13px] font-semibold ${
                    activo ? 'border-negro bg-negro text-blanco' : 'border-gris-300 bg-blanco hover:border-negro'
                  }`}
                >
                  {c.nombre}
                </button>
              )
            })}
          </div>
          <label className="flex items-center gap-1 text-[13px] text-gris-500">
            Ordenar por:
            <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className="cursor-pointer bg-transparent text-gris-500 outline-none">
              <option value="destacados">Destacados</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
            </select>
          </label>
        </div>

        {buscar && <p className="text-[13px] text-gris-700">Resultados para "{buscar}"</p>}
        {cargando && <p className="text-[13px] text-gris-500">Cargando la carta...</p>}
        {!cargando && secciones.length === 0 && <p className="text-[13px] text-gris-500">No encontramos productos.</p>}

        {secciones.map((s) => (
          <section key={s.categoria.id} className="flex flex-col gap-6">
            <h2 className="titulo-2">{s.categoria.nombre}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
              {s.productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} onAgregar={() => agregar(p)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {aviso && (
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-[10px] bg-negro px-5 py-3 text-sm font-semibold text-blanco shadow-lg">
          {aviso}
        </div>
      )}
    </>
  )
}
