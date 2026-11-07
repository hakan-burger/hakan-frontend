// Datos de prueba para trabajar mientras el backend no está listo.
// Son los mismos que aparecen en el Figma.
import type { Categoria, Producto, Adicional, OpcionTamano, Zona, Direccion, Pedido } from '../types'

export const categorias: Categoria[] = [
  { id: 1, nombre: 'Hamburguesas' },
  { id: 2, nombre: 'Alitas' },
  { id: 3, nombre: 'Salchipapas' },
  { id: 4, nombre: 'Shawarmas' },
  { id: 5, nombre: 'Bebidas' },
  { id: 6, nombre: 'Extras' },
]

const tamanosHamburguesa: OpcionTamano[] = [
  { id: 1, nombre: 'Individual', precioExtra: 0 },
  { id: 2, nombre: 'Doble carne', precioExtra: 6 },
]

const adicionalesHamburguesa: Adicional[] = [
  { id: 1, nombre: 'Queso cheddar', precio: 3 },
  { id: 2, nombre: 'Tocino', precio: 4 },
  { id: 3, nombre: 'Huevo frito', precio: 2.5 },
]

const quitables = ['Sin cebolla', 'Sin tomate', 'Sin lechuga']

const hamburguesa = (p: Pick<Producto, 'id' | 'nombre' | 'descripcion' | 'precio'> & Partial<Producto>): Producto => ({
  categoriaId: 1,
  disponible: true,
  tamanos: tamanosHamburguesa,
  ingredientesQuitables: quitables,
  adicionales: adicionalesHamburguesa,
  ...p,
})

const simple = (p: Pick<Producto, 'id' | 'nombre' | 'descripcion' | 'precio' | 'categoriaId'> & Partial<Producto>): Producto => ({
  disponible: true,
  tamanos: [],
  ingredientesQuitables: [],
  adicionales: [],
  ...p,
})

export const productos: Producto[] = [
  hamburguesa({ id: 1, nombre: 'Hakan Royal', descripcion: 'Doble carne, huevo, plátano, queso y jamón', precio: 27.9, etiqueta: 'Más pedida' }),
  hamburguesa({ id: 2, nombre: 'Clásica', descripcion: 'Carne 100% res, lechuga, tomate y queso', precio: 21.9 }),
  hamburguesa({ id: 3, nombre: 'Hawaiana', descripcion: 'Carne, piña a la plancha, jamón y queso', precio: 23.9 }),
  hamburguesa({ id: 4, nombre: 'Hamburguesa BBQ', descripcion: 'Carne 100% res, tocino crocante, queso cheddar y salsa BBQ de la casa', precio: 24.9, etiqueta: 'Nuevo' }),
  hamburguesa({ id: 5, nombre: 'Pollo Crispy', descripcion: 'Filete de pollo crocante y coleslaw', precio: 22.9, disponible: false }),
  simple({ id: 6, nombre: 'Alitas BBQ (6 und.)', descripcion: 'Con papas y crema a elección', precio: 22.9, categoriaId: 2 }),
  simple({ id: 7, nombre: 'Salchipapa Hakan', descripcion: 'Papas nativas, hot dog y cremas', precio: 18.9, categoriaId: 3 }),
  simple({ id: 8, nombre: 'Shawarma de pollo', descripcion: 'Pollo, verduras y salsa de ajo', precio: 19.9, categoriaId: 4 }),
  simple({ id: 9, nombre: 'Limonada Frozen', descripcion: 'Vaso de 500 ml', precio: 8, categoriaId: 5, etiqueta: 'Promo 2x1' }),
  simple({ id: 10, nombre: 'Chicha morada 1 L', descripcion: 'Hecha en casa', precio: 9, categoriaId: 5 }),
  simple({ id: 11, nombre: 'Gaseosa 500 ml', descripcion: 'Inca Kola o Coca-Cola', precio: 4.5, categoriaId: 5 }),
]

export const zonas: Zona[] = [
  { codigo: 'A', nombre: 'Santa Clara (hasta 2 km)', tarifa: 5, tiempo: '30 a 55 min' },
  { codigo: 'B', nombre: 'Ate', tarifa: 6, tiempo: '35 a 60 min' },
  { codigo: 'C', nombre: 'Huachipa', tarifa: 7, tiempo: '40 a 60 min' },
  { codigo: 'D', nombre: 'Ñaña / La Molina', tarifa: 9, tiempo: '40 a 60 min' },
]

export const direccionesCliente: Direccion[] = [
  { id: 1, nombre: 'Casa (principal)', direccion: 'Jr. Las Retamas 158', distrito: 'Santa Clara, Ate', referencia: 'frente al parque', zona: zonas[0] },
  { id: 2, nombre: 'Trabajo', direccion: 'Av. Nicolás Ayllón 4770', distrito: 'Ate', zona: zonas[2] },
]

export const clienteDemo = { id: 1, nombre: 'Juan Pérez Quispe', celular: '987654321', correo: 'juan.perez@gmail.com', dni: '45678912' }

// Pedidos para la bandeja de atención (24), revisar pago (25) y cocina (28)
const item = (productoId: number, cantidad: number, idLinea: string) => ({
  idLinea,
  producto: productos.find((p) => p.id === productoId)!,
  cantidad,
  sinIngredientes: [],
  adicionales: [],
})

export const pedidosDemo: Pedido[] = [
  {
    id: 1047,
    fecha: '2026-11-05T19:12:00',
    cliente: { id: 2, nombre: 'Ana Torres Ríos', celular: '945112870' },
    items: [item(4, 1, 'a'), item(6, 1, 'b'), item(10, 1, 'c')],
    entrega: { modalidad: 'DELIVERY', direccion: { id: 9, nombre: 'Casa', direccion: 'Av. Las Torres 512', distrito: 'Ate', zona: zonas[1] }, celularContacto: '945112870' },
    comprobante: { tipo: 'BOLETA', documento: '70845123', nombreORazonSocial: 'Ana Torres Ríos', correo: 'ana@gmail.com' },
    pago: { metodo: 'YAPE_PLIN', numeroOperacion: '02346001' },
    pagoVerificado: false,
    totales: { subtotal: 79.7, descuento: 0, delivery: 6, total: 85.7 },
    estado: 'REGISTRADO',
  },
  {
    id: 1048,
    fecha: '2026-11-05T19:14:00',
    cliente: { id: 3, nombre: 'Rosa Huamán', celular: '912345678' },
    items: [item(1, 1, 'a'), item(11, 1, 'b')],
    entrega: { modalidad: 'RECOJO', celularContacto: '912345678' },
    comprobante: { tipo: 'BOLETA', documento: '41234567', nombreORazonSocial: 'Rosa Huamán', correo: 'rosa@gmail.com' },
    pago: { metodo: 'EFECTIVO', montoConQuePaga: 40 },
    pagoVerificado: false,
    totales: { subtotal: 32.4, descuento: 0, delivery: 0, total: 32.4 },
    estado: 'REGISTRADO',
  },
  {
    id: 1049,
    fecha: '2026-11-05T19:15:00',
    cliente: { id: 4, nombre: 'Inversiones Andinas SAC', celular: '999888777' },
    items: [item(2, 2, 'a'), item(7, 1, 'b')],
    entrega: { modalidad: 'DELIVERY', direccion: { id: 10, nombre: 'Oficina', direccion: 'Av. Separadora Industrial 320', distrito: 'Ate', zona: zonas[1] }, celularContacto: '999888777' },
    comprobante: { tipo: 'FACTURA', documento: '20601234567', nombreORazonSocial: 'Inversiones Andinas S.A.C.', direccionFiscal: 'Av. Separadora Industrial 320, Ate', correo: 'compras@andinas.pe' },
    pago: { metodo: 'POS', tipoTarjeta: 'DEBITO' },
    pagoVerificado: false,
    totales: { subtotal: 62.7, descuento: 0, delivery: 6, total: 68.7 },
    estado: 'REGISTRADO',
  },
]
