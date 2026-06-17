// ============================================================
// MaykerBike - User Panel Page
// ============================================================

import { useStore } from '../store/useStore';
import { Ticket, ShoppingBag, Clock, CheckCircle, XCircle, Trophy, Calendar, User } from 'lucide-react';

interface UserPanelPageProps {
  onNavigate: (page: string) => void;
}

export default function UserPanelPage({ onNavigate }: UserPanelPageProps) {
  const { currentUser, compras, tickets, sorteos } = useStore();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Debes iniciar sesión</p>
          <button onClick={() => onNavigate('login')} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const misCompras = compras.filter(c => c.usuario_id === currentUser.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const misTickets = tickets.filter(t => t.usuario_id === currentUser.id);

  const estadisticas = {
    sorteosParticipados: new Set(misCompras.map(c => c.sorteo_id)).size,
    ticketsTotal: misTickets.length,
    comprasPendientes: misCompras.filter(c => c.estado_pago === 'pendiente').length,
    comprasAprobadas: misCompras.filter(c => c.estado_pago === 'aprobado').length,
    totalGastado: misCompras.filter(c => c.estado_pago === 'aprobado').reduce((sum, c) => sum + c.monto, 0),
  };

  const getSorteo = (id: string) => sorteos.find(s => s.id === id);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold px-3 py-1 rounded-full">
          <Clock className="w-3 h-3" /> Pendiente
        </span>;
      case 'aprobado':
        return <span className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" /> Aprobado
        </span>;
      case 'rechazado':
        return <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full">
          <XCircle className="w-3 h-3" /> Rechazado
        </span>;
      default:
        return null;
    }
  };

  const formatDate = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-16" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-red-900/20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-red-900/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {currentUser.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ¡Hola, <span className="text-orange-400">{currentUser.nombre.split(' ')[0]}</span>!
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <User className="w-4 h-4" /> {currentUser.correo}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Sorteos participados', value: estadisticas.sorteosParticipados, icon: Trophy, color: 'from-red-600 to-red-800', textColor: 'text-red-400' },
            { label: 'Mis tickets', value: estadisticas.ticketsTotal, icon: Ticket, color: 'from-orange-500 to-orange-700', textColor: 'text-orange-400' },
            { label: 'Pendientes', value: estadisticas.comprasPendientes, icon: Clock, color: 'from-yellow-500 to-yellow-700', textColor: 'text-yellow-400' },
            { label: 'Aprobados', value: estadisticas.comprasAprobadas, icon: CheckCircle, color: 'from-green-500 to-green-700', textColor: 'text-green-400' },
            { label: 'Total gastado', value: `S/ ${estadisticas.totalGastado.toFixed(0)}`, icon: ShoppingBag, color: 'from-purple-500 to-purple-700', textColor: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-white/10 rounded-2xl p-5 text-center">
              <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`text-2xl font-black ${stat.textColor} mb-1`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-xs leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Tickets by Sorteo */}
        {misTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-white mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🎟️ Mis Números de Ticket
            </h2>
            <div className="space-y-4">
              {Array.from(new Set(misTickets.map(t => t.sorteo_id))).map(sorteoId => {
                const sorteo = getSorteo(sorteoId);
                if (!sorteo) return null;
                const myTicketsForSorteo = misTickets.filter(t => t.sorteo_id === sorteoId);
                const isWinner = sorteo.ganador_ticket &&
                  myTicketsForSorteo.some(t => t.numero_ticket === sorteo.ganador_ticket);

                return (
                  <div key={sorteoId} className={`bg-gray-900 border rounded-2xl p-5 ${isWinner ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10'}`}>
                    {isWinner && (
                      <div className="flex items-center gap-2 text-yellow-400 font-bold mb-3 bg-yellow-500/10 rounded-lg px-4 py-2">
                        <Trophy className="w-5 h-5" />
                        🏆 ¡FELICITACIONES! ¡ERES EL GANADOR!
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sorteo.imagen}
                          alt={sorteo.nombre_producto}
                          className="w-14 h-14 object-cover rounded-xl border border-white/10"
                          onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjMWYxZjFmIi8+PC9zdmc+'; }}
                        />
                        <div>
                          <h4 className="text-white font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{sorteo.nombre_producto}</h4>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Sorteo: {new Date(sorteo.fecha_sorteo).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">Mis tickets</div>
                        <div className="text-2xl font-black text-orange-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>{myTicketsForSorteo.length}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {myTicketsForSorteo.map(ticket => (
                        <span
                          key={ticket.id}
                          className={`text-sm font-bold px-3 py-1.5 rounded-lg border font-mono ${
                            sorteo.ganador_ticket === ticket.numero_ticket
                              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 shadow-lg shadow-yellow-900/30'
                              : 'bg-gray-800 border-white/10 text-gray-300'
                          }`}
                        >
                          #{ticket.numero_ticket}
                          {sorteo.ganador_ticket === ticket.numero_ticket && ' 🏆'}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Purchase History */}
        <div>
          <h2 className="text-xl font-black text-white mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            🧾 Historial de Compras
          </h2>

          {misCompras.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-white/10 rounded-2xl">
              <div className="text-6xl mb-4">🎟️</div>
              <h3 className="text-xl font-bold text-white mb-2">Aún no has participado</h3>
              <p className="text-gray-400 mb-6">Explora los sorteos disponibles y participa para ganar</p>
              <button
                onClick={() => onNavigate('sorteos')}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200"
              >
                Ver Sorteos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {misCompras.map(compra => {
                const sorteo = getSorteo(compra.sorteo_id);
                const myTicketsForCompra = tickets.filter(t => t.compra_id === compra.id);

                return (
                  <div key={compra.id} className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {sorteo && (
                          <img
                            src={sorteo.imagen}
                            alt={sorteo?.nombre_producto}
                            className="w-14 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0"
                            onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjMWYxZjFmIi8+PC9zdmc+'; }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="text-white font-bold truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {sorteo?.nombre_producto || 'Sorteo eliminado'}
                            </h4>
                            {getEstadoBadge(compra.estado_pago)}
                          </div>
                          <p className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                            <Clock className="w-3 h-3" /> {formatDate(compra.fecha)}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400"><span className="text-white font-semibold">{compra.cantidad}</span> ticket{compra.cantidad !== 1 ? 's' : ''}</span>
                            <span className="text-orange-400 font-bold">S/ {compra.monto.toFixed(2)}</span>
                          </div>

                          {/* Assigned tickets */}
                          {myTicketsForCompra.length > 0 && (
                            <div className="mt-3">
                              <p className="text-gray-500 text-xs mb-1.5">Tickets asignados:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {myTicketsForCompra.map(t => (
                                  <span key={t.id} className="bg-gray-800 border border-white/10 text-gray-300 text-xs font-bold px-2.5 py-1 rounded-lg font-mono">
                                    #{t.numero_ticket}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {compra.estado_pago === 'pendiente' && (
                            <p className="text-yellow-400/80 text-xs mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Esperando verificación del administrador
                            </p>
                          )}
                          {compra.estado_pago === 'rechazado' && (
                            <p className="text-red-400/80 text-xs mt-2 flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Pago rechazado. Contacta con soporte
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Comprobante thumbnail */}
                      {compra.comprobante && (
                        <div className="flex-shrink-0">
                          <p className="text-gray-500 text-xs mb-1 text-center">Comprobante</p>
                          <img
                            src={compra.comprobante}
                            alt="Comprobante"
                            className="w-16 h-16 object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
