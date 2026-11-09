// Rutas del módulo Gestión de pedidos.
// El comentario de cada ruta es el número de la pantalla en el Figma.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PedidoProvider } from './shared/context/PedidoContext'
import ClienteLayout from './shared/layouts/ClienteLayout'
import PanelLayout from './shared/layouts/PanelLayout'

// Cliente
import Carta from './modules/pedidos/pages/cliente/Carta'
import DetalleProducto from './modules/pedidos/pages/cliente/DetalleProducto'
import Carrito from './modules/pedidos/pages/cliente/Carrito'
import PedidoRegistrado from './modules/pedidos/pages/cliente/PedidoRegistrado'
import MiPerfil from './modules/pedidos/pages/cliente/MiPerfil'
// Checkout
import Entrega from './modules/pedidos/pages/checkout/Entrega'
import NuevaDireccion from './modules/pedidos/pages/checkout/NuevaDireccion'
import Comprobante from './modules/pedidos/pages/checkout/Comprobante'
import Pago from './modules/pedidos/pages/checkout/Pago'
import Confirmacion from './modules/pedidos/pages/checkout/Confirmacion'
// Atención
import BandejaPedidos from './modules/pedidos/pages/atencion/BandejaPedidos'
import RevisarPedido from './modules/pedidos/pages/atencion/RevisarPedido'
import Cocina from './modules/pedidos/pages/atencion/Cocina'
import Disponibilidad from './modules/pedidos/pages/atencion/Disponibilidad'

export default function App() {
  return (
    <PedidoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ClienteLayout />}>
            <Route path="/" element={<Carta />} /> {/* 01 */}
            <Route path="/producto/:id" element={<DetalleProducto />} /> {/* 02 */}
            <Route path="/carrito" element={<Carrito />} /> {/* 03 y 04 */}
            <Route path="/checkout/entrega" element={<Entrega />} /> {/* 09 */}
            <Route path="/checkout/entrega/nueva-direccion" element={<NuevaDireccion />} /> {/* 10 */}
            <Route path="/checkout/comprobante" element={<Comprobante />} /> {/* 11 y 12 */}
            <Route path="/checkout/pago" element={<Pago />} /> {/* 13, 14 y 15 */}
            <Route path="/checkout/confirmacion" element={<Confirmacion />} /> {/* 16 y 17 */}
            <Route path="/pedido-registrado" element={<PedidoRegistrado />} /> {/* 18 */}
            <Route path="/mi-perfil" element={<MiPerfil />} /> {/* 21 */}
          </Route>

          <Route path="/panel" element={<PanelLayout />}>
            <Route index element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<BandejaPedidos />} /> {/* 24 */}
            <Route path="pedidos/:id" element={<RevisarPedido />} /> {/* 25 */}
            <Route path="cocina" element={<Cocina />} /> {/* 28 */}
            <Route path="disponibilidad" element={<Disponibilidad />} /> {/* 29 */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PedidoProvider>
  )
}
