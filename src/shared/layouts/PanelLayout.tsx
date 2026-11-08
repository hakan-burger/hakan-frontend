// Menú lateral del panel de gestión del personal (pantallas 24 a 29)
// En celular y tablet el menú se abre con el botón de la barra superior.
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Bell, ChefHat, ClipboardList, ListChecks, LogOut, Menu, Truck, User, X } from 'lucide-react'
import logo from '../../assets/logo.jpeg'

const MENU = [
  { to: '/panel/pedidos', texto: 'Pedidos', icono: ClipboardList },
  { to: '/panel/despacho', texto: 'Despacho', icono: Truck }, // módulo delivery (otro avance)
  { to: '/panel/cocina', texto: 'Cocina', icono: ChefHat },
  { to: '/panel/disponibilidad', texto: 'Disponibilidad', icono: ListChecks },
]

export default function PanelLayout() {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* barra superior solo en celular y tablet */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-negro px-4 py-3 text-blanco lg:hidden">
        <img src={logo} alt="Hakan Burger" className="h-9 w-fit invert mix-blend-screen" />
        <button className="cursor-pointer" aria-label="Abrir menú" onClick={() => setAbierto(true)}>
          <Menu size={26} />
        </button>
      </header>

      {abierto && <div className="fixed inset-0 z-30 bg-negro/50 lg:hidden" onClick={() => setAbierto(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-62 shrink-0 flex-col gap-1 bg-negro px-4 py-7 text-blanco transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between">
          <img src={logo} alt="Hakan Burger" className="h-11 w-fit invert mix-blend-screen" />
          <button className="cursor-pointer lg:hidden" aria-label="Cerrar menú" onClick={() => setAbierto(false)}>
            <X size={22} />
          </button>
        </div>
        <span className="text-[13px] text-gris-500">Panel de gestión</span>
        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {MENU.map(({ to, texto, icono: Icono }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-rojo-hakan text-blanco' : 'hover:bg-[#222]'}`
              }
            >
              <Icono size={18} /> {texto}
            </NavLink>
          ))}
        </nav>
        <span className="text-[13px] text-gris-500">Rol: Atención al cliente</span>
        <button className="flex cursor-pointer items-center gap-1.5 text-[13px] text-rojo-hakan">
          <LogOut size={14} /> Cerrar sesión
        </button>
      </aside>

      <div className="min-w-0 flex-1 px-4 pt-5 pb-10 md:px-6 lg:px-10 lg:pt-7">
        <div className="mb-2 hidden items-center justify-end gap-4 lg:flex">
          <span className="relative">
            <Bell size={20} />
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-gris-100"><User size={18} /></span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
