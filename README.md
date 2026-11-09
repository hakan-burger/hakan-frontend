# Hakan Burger – Frontend

Sistema web para la gestión de pedidos y delivery. React + TypeScript + Tailwind CSS.

## Cómo ejecutarlo

```bash
pnpm install
pnpm dev
```

Usar siempre **pnpm** (no npm). Para agregar una librería: `pnpm add nombre`.

Abrir http://localhost:5173 (cliente) y http://localhost:5173/panel (personal).

## Datos de prueba o backend

En el archivo `.env`:

- `VITE_USAR_MOCK=true` → usa los datos de prueba de `src/shared/data/mock.ts` (no necesita el backend).
- `VITE_USAR_MOCK=false` → llama al backend de Spring Boot en `VITE_API_URL`.

## Estructura

```
src/
├── shared/                 ← BASE COMPARTIDA (no cambiar sin avisar al equipo)
│   ├── types/              tipos de datos: Producto, ItemCarrito, Pedido...
│   ├── context/            PedidoContext: carrito y checkout (usePedido)
│   ├── services/           llamadas al backend (catalogoService, pedidoService)
│   ├── data/mock.ts        datos de prueba
│   ├── utils/calculos.ts   soles(), precioLinea(), calcularTotales(), calcularVuelto()
│   ├── components/         Boton, Campo, Etiqueta, Tarjeta, Alerta, FotoProducto,
│   │                       ResumenPedido, PasosCheckout, CheckoutLayout
│   └── layouts/            ClienteLayout (encabezado y pie) y PanelLayout (menú lateral)
└── modules/pedidos/        ← AQUÍ TRABAJA CADA UNO
    ├── pages/cliente/      Hilda
    ├── pages/checkout/     Daniel (Entrega, NuevaDireccion, Comprobante, Pago) y Eber (Confirmacion)
    ├── pages/atencion/     Eber
    └── components/         partes de cada pantalla (formularios de pago, avisos...)
```

## Reparto de pantallas (módulo Gestión de pedidos)

| Dev | Pantallas (número del Figma) | Archivos |
|---|---|---|
| Hilda | 01 Carta · 02 Detalle · 03 Carrito · 04 Producto no disponible · 18 Pedido registrado · 21 Mi perfil | `pages/cliente/*`, `components/cliente/*` |
| Daniel | 09 Entrega · 10 Nueva dirección · 11 Boleta · 12 Factura · 13 Yape/Plin · 14 Efectivo · 15 POS | `pages/checkout/*` (menos Confirmacion), `components/checkout/Form*` y `Pago*` |
| Eber | 16 Confirmación · 17 Verificación de disponibilidad · 24 Bandeja · 25 Revisar pedido · 28 Cocina · 29 Disponibilidad | `pages/checkout/Confirmacion`, `components/checkout/VerificacionDisponibilidad`, `pages/atencion/*` |

Cada archivo tiene arriba un comentario con lo que debe usar (servicios, funciones del carrito, etc.).

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | 01 Carta |
| `/producto/:id` | 02 Detalle |
| `/carrito` | 03 y 04 Carrito |
| `/checkout/entrega` | 09 Entrega |
| `/checkout/entrega/nueva-direccion` | 10 Nueva dirección |
| `/checkout/comprobante` | 11 y 12 Comprobante |
| `/checkout/pago` | 13, 14 y 15 Pago |
| `/checkout/confirmacion` | 16 y 17 Confirmación |
| `/pedido-registrado` | 18 Pedido registrado |
| `/mi-perfil` | 21 Mi perfil |
| `/panel/pedidos` | 24 Bandeja |
| `/panel/pedidos/:id` | 25 Revisar pedido |
| `/panel/cocina` | 28 Cocina |
| `/panel/disponibilidad` | 29 Disponibilidad |

## Reglas del equipo

1. Cada uno trabaja **solo en sus archivos** dentro de `modules/pedidos/`.
2. La carpeta `shared/` **no se cambia sin avisar**. Si necesitas un campo nuevo o un componente, se pide en el grupo y se agrega una sola vez.
3. Usar los colores del Figma con Tailwind: `bg-rojo-hakan` (color de la marca), `text-gris-500`, `border-gris-100`, `bg-verde-claro`, `text-error`...
   Títulos: `className="titulo-1"`, `titulo-2`, `titulo-3`, `display`.
4. Usar los componentes de `shared/components` (Boton, Campo, Tarjeta...) en vez de crear otros iguales.
5. Una rama por tarea y pull request para juntar a `main` (ver CONTRIBUTING.md).

## Ejemplo de uso del carrito

```tsx
import { usePedido } from '../../../../shared/context/PedidoContext'

const { items, totales, agregarProducto, setEntrega, confirmar } = usePedido()
agregarProducto(producto, { cantidad: 2, adicionales: [queso] })
```

## Forma de trabajo

Ramas, commits y pull requests: ver [CONTRIBUTING.md](CONTRIBUTING.md).

## Datos de prueba, backend local y backend desplegado

| Archivo | Cuándo se usa | Qué hace |
|---|---|---|
| `.env` | `pnpm dev` | Datos de prueba (`VITE_USAR_MOCK=true`). Así cualquiera puede trabajar sin el backend. |
| `.env.local` | `pnpm dev` (solo en tu PC, no se sube) | Para usar el backend en tu PC: `VITE_USAR_MOCK=false` |
| `.env.production` | `pnpm build` y el despliegue | Usa el backend desplegado: https://hakan-backend.onrender.com/api |

Después de cambiar un `.env` hay que reiniciar `pnpm dev`.

## Despliegue (Render + GitHub Actions)

El workflow `.github/workflows/ci-cd.yml` hace lo siguiente:

- En cada push o pull request a `main` o `development`: revisa el código (oxlint) y compila.
- En cada push a `main` (por ejemplo, al hacer merge de un PR): si compila, despliega en Render.

Configuración (una sola vez):

1. En Render: **New → Static Site** → repo `hakan-frontend`, rama `main`.
2. Build Command: `npx --yes pnpm@11.7.0 install --frozen-lockfile && npx --yes pnpm@11.7.0 build`
   · Publish Directory: `dist` · Variable de entorno `NODE_VERSION` = `24` · Auto-Deploy: **Off**.
3. En **Redirects/Rewrites** agregar: Source `/*` → Destination `/index.html` → Action **Rewrite**
   (si no, al recargar `/carrito` o `/producto/1` sale "Not Found").
4. En Render: **Settings → Deploy Hook** → copiar la URL y guardarla en GitHub
   (**Settings → Secrets and variables → Actions**) con el nombre `RENDER_DEPLOY_HOOK_URL`.
5. En el backend (Render), agregar la URL del frontend a la variable `APP_CORS_ORIGENES`.
