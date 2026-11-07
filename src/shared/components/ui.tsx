// Componentes básicos reutilizables (botones, campos, etiquetas, tarjetas).
// Equivalen a los componentes de la página "Sistema de diseño" del Figma.
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { ImageIcon } from 'lucide-react'

type VarianteBoton = 'primario' | 'oscuro' | 'secundario'

const estiloBoton: Record<VarianteBoton, string> = {
  primario: 'bg-rojo-hakan text-blanco border-rojo-hakan',
  oscuro: 'bg-negro text-blanco border-negro',
  secundario: 'bg-blanco text-negro border-negro',
}

export const claseBoton = (variante: VarianteBoton = 'primario', ancho = false) =>
  `inline-flex items-center justify-center gap-2 rounded-[10px] border px-5 py-3 text-sm font-semibold transition-opacity
   hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:bg-gris-100 disabled:text-gris-500 disabled:border-gris-100
   ${estiloBoton[variante]} ${ancho ? 'w-full' : ''}`

export function Boton({
  variante = 'primario',
  ancho,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBoton; ancho?: boolean }) {
  return <button className={`${claseBoton(variante, ancho)} ${className}`} {...props} />
}

export function Campo({ etiqueta, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { etiqueta: string; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold">{etiqueta}</span>
      <input
        className={`rounded-[10px] border bg-blanco px-3.5 py-3 outline-none focus:border-rojo-hakan ${error ? 'border-error' : 'border-gris-300'}`}
        {...props}
      />
      {error && <span className="text-[13px] text-error">{error}</span>}
    </label>
  )
}

type VarianteEtiqueta = 'disponible' | 'agotado' | 'promo' | 'neutro'

const estiloEtiqueta: Record<VarianteEtiqueta, string> = {
  disponible: 'bg-verde-claro text-verde',
  agotado: 'bg-error-claro text-error',
  promo: 'bg-rojo-hakan text-blanco',
  neutro: 'bg-gris-100 text-gris-700',
}

export function Etiqueta({ variante = 'neutro', children }: { variante?: VarianteEtiqueta; children: ReactNode }) {
  return <span className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${estiloEtiqueta[variante]}`}>{children}</span>
}

export function Tarjeta({ children, className = '', seleccionada }: { children: ReactNode; className?: string; seleccionada?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ${
        seleccionada ? 'border-rojo-hakan bg-rojo-hakan-claro' : 'border-gris-100 bg-blanco'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// Recuadro gris en lugar de las fotos (hasta tener las fotos reales)
export function FotoProducto({ src, alto = 190, texto = 'Foto del producto' }: { src?: string; alto?: number; texto?: string }) {
  if (src) return <img src={src} alt={texto} className="w-full object-cover" style={{ height: alto }} />
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1.5 bg-gris-100 text-gris-500" style={{ height: alto }}>
      <ImageIcon size={20} />
      <span className="text-xs font-semibold">{texto}</span>
    </div>
  )
}

const estiloAlerta = { ok: 'bg-verde-claro text-verde', error: 'bg-error-claro text-error', info: 'bg-rojo-hakan-claro text-gris-700' }

export function Alerta({ tipo, titulo, children }: { tipo: 'ok' | 'error' | 'info'; titulo: string; children?: ReactNode }) {
  return (
    <div className={`flex flex-col gap-0.5 rounded-[10px] px-4 py-3 text-[13px] ${estiloAlerta[tipo]}`}>
      <strong>{titulo}</strong>
      {children && <div>{children}</div>}
    </div>
  )
}
