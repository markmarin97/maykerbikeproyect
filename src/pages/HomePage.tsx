// ============================================================
// MaykerBike - Home Page
// ============================================================

import { useStore } from '../store/useStore';
import { Trophy, Ticket, Shield, Zap, ChevronRight, Star, Users, Award } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { sorteos, tickets, usuarios } = useStore();
  const activeSorteos = sorteos.filter(s => s.estado === 'activo');

  const stats = [
    { label: 'Sorteos Activos', value: sorteos.filter(s => s.estado === 'activo').length, icon: Trophy, color: 'from-red-600 to-red-800' },
    { label: 'Tickets Vendidos', value: tickets.length, icon: Ticket, color: 'from-orange-500 to-orange-700' },
    { label: 'Usuarios Registrados', value: usuarios.filter(u => u.rol === 'user').length, icon: Users, color: 'from-yellow-500 to-yellow-700' },
    { label: 'Sorteos Realizados', value: sorteos.filter(s => s.estado === 'finalizado').length, icon: Award, color: 'from-red-700 to-orange-600' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Sorteos 100% Seguros',
      desc: 'Sistema de selección aleatoria certificado. Transparencia total en cada sorteo realizado.',
      color: 'text-red-400',
      bg: 'bg-red-600/10 border-red-600/20',
    },
    {
      icon: Zap,
      title: 'Resultados Instantáneos',
      desc: 'Los ganadores son anunciados inmediatamente. Recibe tu premio en tiempo récord.',
      color: 'text-orange-400',
      bg: 'bg-orange-600/10 border-orange-600/20',
    },
    {
      icon: Trophy,
      title: 'Productos Premium',
      desc: 'Sorteamos los mejores productos para motociclistas. Calidad garantizada en cada sorteo.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-600/10 border-yellow-600/20',
    },
    {
      icon: Star,
      title: 'Tickets Accesibles',
      desc: 'Precios de tickets al alcance de todos. Más tickets, más chances de ganar.',
      color: 'text-red-400',
      bg: 'bg-red-600/10 border-red-600/20',
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        </div>

        {/* Animated particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-orange-500/40 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Sorteos en Vivo
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              GANA EL{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                EQUIPO
              </span>{' '}
              QUE{' '}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                MERECES
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
              Participa en los sorteos de <strong className="text-white">MaykerBike</strong> y gana los mejores
              productos para tu motocicleta. Cascos, chaquetas, guantes y más.
              <span className="text-orange-400"> ¡Tu próxima aventura te espera!</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('sorteos')}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-red-900/50 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
              >
                <Trophy className="w-5 h-5" />
                Ver Sorteos Activos
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('registro')}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-bold text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Únete Gratis
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-500 text-xs tracking-widest uppercase">Explorar</span>
          <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gradient-to-r from-red-900/40 via-gray-900 to-orange-900/40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Raffles Preview ── */}
      {activeSorteos.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase mb-3 block">🔥 En curso</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Sorteos <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Activos</span>
            </h2>
            <p className="text-gray-400 text-lg">Participa ahora y gana productos premium para tu moto</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {activeSorteos.slice(0, 3).map(sorteo => {
              const ticketsVendidos = tickets.filter(t => t.sorteo_id === sorteo.id).length;
              const porcentaje = Math.min((ticketsVendidos / sorteo.cantidad_tickets) * 100, 100);
              const diasRestantes = Math.max(0, Math.ceil((new Date(sorteo.fecha_sorteo).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

              return (
                <div
                  key={sorteo.id}
                  onClick={() => onNavigate('sorteos')}
                  className="group relative bg-gray-900 border border-white/10 hover:border-red-500/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-red-900/30 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={sorteo.imagen}
                      alt={sorteo.nombre_producto}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNDQ0IiBmb250LXNpemU9IjE0Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        🔴 ACTIVO
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/70 backdrop-blur text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
                        {diasRestantes}d restantes
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {sorteo.nombre_producto}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sorteo.descripcion}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{ticketsVendidos} vendidos</span>
                        <span>{sorteo.cantidad_tickets - ticketsVendidos} disponibles</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-xs">Precio por ticket</span>
                        <div className="text-2xl font-black text-orange-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          S/ {sorteo.precio_ticket.toFixed(2)}
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 hover:scale-105">
                        Participar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('sorteos')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-red-600/50 hover:border-red-500 text-red-400 hover:text-white hover:bg-red-600/20 font-bold rounded-xl transition-all duration-300"
            >
              Ver todos los sorteos
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="py-20 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-3 block">¿Por qué elegirnos?</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              La Plataforma <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Más Confiable</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              En MaykerBike nos comprometemos a brindar sorteos transparentes y justos para todos los motociclistas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div key={i} className={`group p-6 rounded-2xl border ${feat.bg} hover:scale-105 transition-all duration-300 cursor-default`}>
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feat.icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-red-900/40 via-gray-900 to-orange-900/30 border border-red-600/20 rounded-3xl p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="text-6xl mb-6">🏍️</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ¿Listo para <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Ganar</span>?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Regístrate gratis ahora y participa en nuestros sorteos exclusivos para motociclistas.
                Los mejores productos te esperan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('registro')}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-xl shadow-xl shadow-red-900/50 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
                >
                  Crear Cuenta Gratis
                </button>
                <button
                  onClick={() => onNavigate('sorteos')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg rounded-xl transition-all duration-300"
                >
                  Ver Sorteos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-red-600 to-orange-500 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-black text-xl tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  MAYKER<span className="text-red-500">BIKE</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                La plataforma líder en sorteos de productos premium para motociclistas.
                Participa, gana y disfruta de lo mejor.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Navegación</h4>
              <ul className="space-y-2">
                {['Inicio', 'Sorteos', 'Registro', 'Contacto'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => onNavigate(item.toLowerCase())}
                      className="text-gray-400 hover:text-red-400 text-sm transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 contacto@maykerbike.com</p>
                <p>📱 +51 961 359 573</p>
                <p>🌐 www.maykerbike.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MaykerBike. Todos los derechos reservados.
              Desarrollado con ❤️ para la comunidad motociclista.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
