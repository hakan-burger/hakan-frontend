// Tipos de datos compartidos del sistema Hakan Burger.
// IMPORTANTE: no cambiar sin avisar al equipo; los usan todas las pantallas.

// ---------- Catálogo ----------
export interface Categoria {
  id: number
  nombre: string
}

export interface OpcionTamano {
  id: number
  nombre: string // "Individual", "Doble carne"
  precioExtra: number // 0 si está incluido
}

export interface Adicional {
  id: number
  nombre: string // "Queso cheddar", "Tocino"
  precio: number
}

export type EtiquetaProducto = 'Más pedida' | 'Nuevo' | 'Promo 2x1'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoriaId: number
  imagenUrl?: string
  disponible: boolean // lo marca la atención en la pantalla 29
  etiqueta?: EtiquetaProducto
  tamanos: OpcionTamano[]
  ingredientesQuitables: string[] // "Sin cebolla", "Sin tomate"...
  adicionales: Adicional[]
}

// ---------- Carrito ----------
export interface ItemCarrito {
  idLinea: string // identificador único de la línea del carrito
  producto: Producto
  cantidad: number
  tamano?: OpcionTamano
  sinIngredientes: string[]
  adicionales: Adicional[]
  indicaciones?: string
}

// ---------- Checkout ----------
export type Modalidad = 'DELIVERY' | 'RECOJO'

export interface Zona {
  codigo: string // "A", "B", ...
  nombre: string // "Santa Clara"
  tarifa: number // costo del delivery
  tiempo: string // "30 a 55 min"
}

export interface Direccion {
  id: number
  nombre: string // "Casa (principal)", "Trabajo"
  direccion: string
  distrito: string
  referencia?: string
  zona: Zona
}

export interface Entrega {
  modalidad: Modalidad
  direccion?: Direccion // solo si es DELIVERY
  celularContacto: string
}

export type TipoComprobante = 'BOLETA' | 'FACTURA'

export interface Comprobante {
  tipo: TipoComprobante
  documento: string // DNI (boleta) o RUC (factura)
  nombreORazonSocial: string
  direccionFiscal?: string // solo factura
  correo: string
}

export type MetodoPago = 'YAPE_PLIN' | 'EFECTIVO' | 'POS'

export interface Pago {
  metodo: MetodoPago
  numeroOperacion?: string // Yape/Plin
  montoConQuePaga?: number // efectivo, para calcular el vuelto
  tipoTarjeta?: 'DEBITO' | 'CREDITO' // POS
}

// ---------- Pedido ----------
export type EstadoPedido =
  | 'REGISTRADO' // el cliente confirmó
  | 'EN_PREPARACION' // atención aceptó y envió a cocina
  | 'LISTO' // cocina terminó
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'CANCELADO'

export interface Totales {
  subtotal: number
  descuento: number
  delivery: number
  total: number
}

export interface Pedido {
  id: number
  fecha: string // ISO
  cliente: { id: number; nombre: string; celular: string }
  items: ItemCarrito[]
  entrega: Entrega
  comprobante: Comprobante
  pago: Pago
  pagoVerificado: boolean
  totales: Totales
  estado: EstadoPedido
}

// Lo que el frontend envía al backend al confirmar (POST /api/pedidos)
export interface NuevoPedido {
  items: ItemCarrito[]
  entrega: Entrega
  comprobante: Comprobante
  pago: Pago
}
