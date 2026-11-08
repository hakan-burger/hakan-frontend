// Piezas pequeñas del Figma que se repiten en las pantallas del módulo:
// casillas, radios, tarjetas de opción, selector de cantidad, chips de filtro e interruptor.
import type { ReactNode } from 'react'
import { Check, Minus, Plus } from 'lucide-react'

export const Casilla = ({ marcada, redonda }: { marcada: boolean; redonda?: boolean }) => {
  return (
    <span
      className={`grid size-5 shrink-0 place-items-center border-2 ${redonda ? 'rounded-full' : 'rounded-[5px]'} ${
        marcada ? 'border-rojo-hakan bg-rojo-hakan text-blanco' : 'border-gris-300 bg-blanco'
      }`}
    >
      {marcada && (redonda ? <span className="size-2 rounded-full bg-blanco" /> : <Check size={12} strokeWidth={3} />)}
    </span>
  )
}

// Fila clicable con casilla: "Acepto los términos", "Pedido empaquetado"...
export const FilaCasilla = ({ marcada, onClick, children }: { marcada: boolean; onClick: () => void; children: ReactNode }) => {
  return (
    <button type="button" onClick={onClick} className="flex w-fit cursor-pointer items-center gap-2.5 text-left text-[13px]">
      <Casilla marcada={marcada} />
      {children}
    </button>
  )
}

// Tarjeta de opción con radio (modalidad, comprobante, método de pago...)
export const OpcionTarjeta = ({
  icono,
  titulo,
  descripcion,
  seleccionada,
  onClick,
  children,
}: {
  icono?: ReactNode
  titulo: string
  descripcion?: ReactNode
  seleccionada: boolean
  onClick: () => void
  children?: ReactNode
}) => {
  return (
    <div
      role="radio"
      aria-checked={seleccionada}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && onClick()}
      className={`flex cursor-pointer items-start gap-3.5 rounded-[14px] p-5 ${
        seleccionada ? 'border-2 border-rojo-hakan bg-rojo-hakan-claro' : 'border border-gris-300 bg-blanco hover:border-gris-500'
      }`}
    >
      <span className={`grid size-[22px] shrink-0 place-items-center rounded-full border-2 ${seleccionada ? 'border-rojo-hakan' : 'border-gris-300'}`}>
        {seleccionada && <span className="size-2.5 rounded-full bg-rojo-hakan" />}
      </span>
      {icono && <span className="shrink-0">{icono}</span>}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className="text-[15px]">{titulo}</strong>
        {descripcion && <span className="text-[13px] text-gris-700">{descripcion}</span>}
        {seleccionada && children && (
          <div className="cursor-default" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export const SelectorCantidad = ({ cantidad, onCambiar, conBorde }: { cantidad: number; onCambiar: (n: number) => void; conBorde?: boolean }) => {
  return (
    <div className={`flex items-center gap-3.5 ${conBorde ? 'rounded-[10px] border border-gris-300 bg-blanco px-3.5 py-2.5' : ''}`}>
      <button type="button" aria-label="Quitar uno" className="cursor-pointer disabled:opacity-30" disabled={conBorde && cantidad <= 1} onClick={() => onCambiar(cantidad - 1)}>
        <Minus size={20} />
      </button>
      <strong className="w-4 text-center">{cantidad}</strong>
      <button type="button" aria-label="Agregar uno" className="cursor-pointer" onClick={() => onCambiar(cantidad + 1)}>
        <Plus size={20} />
      </button>
    </div>
  )
}

export const Chips = <T extends string,>({ opciones, activa, onCambiar }: { opciones: { valor: T; texto: string }[]; activa: T; onCambiar: (v: T) => void }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          onClick={() => onCambiar(o.valor)}
          className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
            o.valor === activa ? 'border-negro bg-negro text-blanco' : 'border-gris-300 bg-blanco hover:border-negro'
          }`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  )
}

export const Interruptor = ({ encendido, onCambiar, disabled }: { encendido: boolean; onCambiar: () => void; disabled?: boolean }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={encendido}
      disabled={disabled}
      onClick={onCambiar}
      className={`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors disabled:opacity-50 ${
        encendido ? 'justify-end bg-verde' : 'justify-start bg-gris-300'
      }`}
    >
      <span className="size-5 rounded-full bg-blanco" />
    </button>
  )
}

// Título de las pantallas del panel del personal
export const EncabezadoPanel = ({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children?: ReactNode }) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="titulo-1">{titulo}</h1>
        {subtitulo && <span className="text-[13px] text-gris-500">{subtitulo}</span>}
      </div>
      {children}
    </div>
  )
}

// Fila "texto ........ valor"
export const Entre = ({ izq, der, className = '' }: { izq: ReactNode; der: ReactNode; className?: string }) => {
  return (
    <div className={`flex items-center justify-between gap-3 text-[15px] ${className}`}>
      <span>{izq}</span>
      <span className="text-right">{der}</span>
    </div>
  )
}
