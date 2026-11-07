// Encabezado y pie de página de todas las pantallas del cliente (01 a 21)
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User } from 'lucide-react'
import { usePedido } from '../context/PedidoContext'
import logo from '../../assets/logo.jpeg'

const claseNav = ({ isActive }: { isActive: boolean }) => (isActive ? 'text-naranja' : 'hover:text-naranja')

export default function ClienteLayout() {
  const { cantidadItems } = usePedido()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-gris-100 bg-blanco">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-4 py-3 md:flex-nowrap md:gap-7 md:px-6">
          <Link to="/"><img src={logo} alt="Hakan Burger" className="h-11 w-auto" /></Link>
          <nav className="order-3 flex w-full gap-5 text-[15px] font-medium md:order-none md:w-auto md:flex-1 md:gap-6">
            <NavLink to="/" end className={claseNav}>Carta</NavLink>
            <NavLink to="/promociones" className={claseNav}>Promociones</NavLink>
            <NavLink to="/mi-perfil" className={claseNav}>Mis pedidos</NavLink>
          </nav>
          <form
            className="ml-auto hidden w-64 items-center gap-2 rounded-full bg-gris-50 px-4 py-2 text-gris-500 md:ml-0 md:flex"
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q')
              navigate(`/?buscar=${encodeURIComponent(String(q ?? ''))}`)
            }}
          >
            <Search size={16} />
            <input name="q" placeholder="Buscar en la carta" className="w-full bg-transparent text-sm text-negro outline-none" />
          </form>
          <div className="ml-auto flex items-center gap-5 md:ml-0">
            <Link to="/mi-perfil" aria-label="Mi perfil"><User size={22} /></Link>
            <Link to="/carrito" aria-label="Carrito" className="relative">
              <ShoppingCart size={22} />
              {cantidadItems > 0 && (
                <span className="absolute -top-2 -right-2.5 rounded-full bg-naranja px-1.5 text-[11px] font-bold">{cantidadItems}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-negro text-blanco">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-8 px-4 py-8 text-[13px] md:gap-16 md:px-6">
          <div className="flex flex-col gap-2">
            <img src={logo} alt="Hakan Burger" className="h-11 w-fit invert mix-blend-screen" />
            <span>Av. Julio C. Tello 203, Santa Clara, Ate</span>
          </div>
          <div className="flex flex-col gap-1">
            <strong>Contacto</strong>
            <span>WhatsApp: 987 654 321</span>
            <span>Facebook · Instagram: @hakan_burger</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
