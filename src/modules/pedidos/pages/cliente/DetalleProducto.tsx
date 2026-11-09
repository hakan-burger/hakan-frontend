// Pantalla 02 · Detalle y personalización
// Responsable: Hilda
// Ruta: /producto/:id. Leer el id con useParams() y usar obtenerProducto(id). Al agregar: usePedido().agregarProducto(producto, opciones).
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Adicional, Categoria, OpcionTamano, Producto } from '../../../../shared/types'
import { listarCategorias, obtenerProducto } from '../../../../shared/services/catalogoService'
import { usePedido } from '../../../../shared/context/PedidoContext'
import { Boton, Campo, Etiqueta, FotoProducto, Tarjeta } from '../../../../shared/components/ui'
import { soles } from '../../../../shared/utils/calculos'
import { Casilla, SelectorCantidad } from '../../components/comunes'

const Grupo = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <Tarjeta className="flex flex-col gap-3 !p-5">
    <strong className="text-[15px]">{titulo}</strong>
    {children}
  </Tarjeta>
)

const Opcion = ({ texto, precio, marcada, redonda, onClick }: { texto: string; precio?: string; marcada: boolean; redonda?: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex cursor-pointer items-center justify-between gap-3 text-left">
    <span className="flex items-center gap-2.5 text-[15px]">
      <Casilla marcada={marcada} redonda={redonda} />
      {texto}
    </span>
    {precio && <span className="text-[13px] text-gris-500">{precio}</span>}
  </button>
)

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarProducto } = usePedido()

  const [producto, setProducto] = useState<Producto | null>()
  const [categoria, setCategoria] = useState<Categoria>()
  const [tamano, setTamano] = useState<OpcionTamano>()
  const [sin, setSin] = useState<string[]>([])
  const [extras, setExtras] = useState<Adicional[]>([])
  const [indicaciones, setIndicaciones] = useState('')
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    obtenerProducto(Number(id)).then((p) => {
      setProducto(p ?? null)
      setTamano(p?.tamanos[0])
      if (p) listarCategorias().then((cs) => setCategoria(cs.find((c) => c.id === p.categoriaId)))
    })
  }, [id])

  if (producto === undefined) return <div className="contenedor text-[13px] text-gris-500">Cargando...</div>
  if (producto === null)
    return (
      <div className="contenedor flex flex-col gap-3">
        <h1 className="titulo-2">No encontramos este producto</h1>
        <Link to="/" className="font-semibold text-rojo-hakan">← Volver a la carta</Link>
      </div>
    )

  const alternar = <T,>(lista: T[], valor: T) => (lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor])
  const precioUnitario = producto.precio + (tamano?.precioExtra ?? 0) + extras.reduce((s, a) => s + a.precio, 0)

  const agregar = () => {
    agregarProducto(producto, { cantidad, tamano, sinIngredientes: sin, adicionales: extras, indicaciones: indicaciones.trim() || undefined })
    navigate('/carrito')
  }

  return (
    <div className="contenedor flex flex-col gap-6">
      <p className="text-[13px] text-gris-500">
        <Link to="/" className="hover:text-negro">Carta</Link>
        {'  ›  '}
        {categoria?.nombre ?? '...'}
        {'  ›  '}
        {producto.nombre}
      </p>

      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,560px)_1fr] md:gap-12">
        <div className="overflow-hidden rounded-2xl">
          <FotoProducto src={producto.imagenUrl} alto={480} texto="Foto del producto" />
        </div>

        <div className="flex flex-col gap-5">
          <Etiqueta variante={producto.disponible ? 'disponible' : 'agotado'}>{producto.disponible ? 'Disponible' : 'Agotado'}</Etiqueta>
          <h1 className="titulo-1">{producto.nombre}</h1>
          <p className="text-gris-700">{producto.descripcion}.</p>
          <strong className="titulo-2">{soles(producto.precio)}</strong>

          {producto.tamanos.length > 0 && (
            <Grupo titulo="Tamaño (elige 1)">
              {producto.tamanos.map((t) => (
                <Opcion
                  key={t.id}
                  texto={t.nombre}
                  precio={t.precioExtra ? `+ ${soles(t.precioExtra)}` : 'Incluido'}
                  marcada={tamano?.id === t.id}
                  redonda
                  onClick={() => setTamano(t)}
                />
              ))}
            </Grupo>
          )}

          {producto.ingredientesQuitables.length > 0 && (
            <Grupo titulo="Quitar ingredientes (sin costo)">
              {producto.ingredientesQuitables.map((i) => (
                <Opcion key={i} texto={i} marcada={sin.includes(i)} onClick={() => setSin(alternar(sin, i))} />
              ))}
            </Grupo>
          )}

          {producto.adicionales.length > 0 && (
            <Grupo titulo="Agregar extras">
              {producto.adicionales.map((a) => (
                <Opcion key={a.id} texto={a.nombre} precio={`+ ${soles(a.precio)}`} marcada={extras.includes(a)} onClick={() => setExtras(alternar(extras, a))} />
              ))}
            </Grupo>
          )}

          <Campo
            etiqueta="Indicaciones para cocina (opcional)"
            placeholder="Ej.: la carne bien cocida"
            maxLength={150}
            value={indicaciones}
            onChange={(e) => setIndicaciones(e.target.value)}
          />

          <div className="flex gap-4">
            <SelectorCantidad cantidad={cantidad} onCambiar={(n) => setCantidad(Math.max(1, n))} conBorde />
            <Boton className="flex-1" disabled={!producto.disponible} onClick={agregar}>
              {producto.disponible ? `Agregar al carrito · ${soles(precioUnitario * cantidad)}` : 'Producto agotado'}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  )
}
