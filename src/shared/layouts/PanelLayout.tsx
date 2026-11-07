// Menú lateral del panel de gestión del personal (pantallas 24 a 29)
import { NavLink, Outlet } from 'react-router-dom'
import { Bell, ChefHat, ClipboardList, ListChecks, LogOut, Truck, User } from 'lucide-react'
import logo from '../../assets/logo.jpeg'

const MENU = [
  { to: '/panel/pedidos', texto: 'Pedidos', icono: ClipboardList },
  { to: '/panel/despacho', texto: 'Despacho', icono: Truck }, // módulo delivery (otro avance)
  { to: '/panel/cocina', texto: 'Cocina', icono: ChefHat },
  { to: '/panel/disponibilidad', texto: 'Disponibilidad', icono: ListChecks },
]

export default function PanelLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-62 shrink-0 flex-col gap-1 bg-negro px-4 py-7 text-blanco">
        <img src={logo} alt="Hakan Burger" className="h-11 w-fit invert mix-blend-screen" />
        <span className="text-[13px] text-gris-500">Panel de gestión</span>
        <nav className="mt-5 flex flex-1 flex-col gap-1">
          {MENU.map(({ to, texto, icono: Icono }) => (
            <NavLink
              key={to}
              to={to}
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
      <div className="min-w-0 flex-1 px-10 pt-7 pb-10">
        <div className="mb-2 flex items-center justify-end gap-4">
          <Bell size={20} />
          <span className="grid size-9 place-items-center rounded-full bg-gris-100"><User size={18} /></span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
