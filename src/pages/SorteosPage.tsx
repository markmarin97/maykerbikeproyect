// ============================================================
// MaykerBike - Sorteos Page (Public + Purchase flow)
// ============================================================

import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Sorteo } from '../types';
import {
  Trophy, Ticket, Calendar, Clock, Users, ShoppingCart,
  X, Upload, CheckCircle, AlertCircle, Filter, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SorteosPageProps {
  onNavigate: (page: string) => void;
}

type FilterEstado = 'todos' | 'activo' | 'finalizado';

export default function SorteosPage({ onNavigate }: SorteosPageProps) {
  const { sorteos, tickets, currentUser, configuracion, crearCompra } = useStore();
  const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null);
  const [filtro, setFiltro] = useState<FilterEstado>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [comprobante, setComprobante] = useState<string | null>(null);
  const [step, setStep] = useState<'info' | 'pago' | 'confirmado'>('info');
  const [loading, setLoading] = useState(false);

  const sorteosFiltrados = sorteos
    .filter(s => s.estado !== 'borrador')
    .filter(s => filtro === 'todos' || s.estado === filtro)
    .filter(s =>
      !busqueda || s.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());

  const getTicketsVendidos = (sorteoId: string) => tickets.filter(t => t.sorteo_id === sorteoId).length;

  const handleOpenSorteo = (sorteo: Sorteo) => {
    setSelectedSorteo(sorteo);
    setCantidad(1);
    setComprobante(null);
    setStep('info');
  };

  const handleClose = () => {
    setSelectedSorteo(null);
    setStep('info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setComprobante(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirmPago = async () => {
    if (!selectedSorteo || !currentUser) return;
    if (!comprobante) {
      toast.error('Por favor sube el comprobante de pago');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    crearCompra(
      currentUser.id,
      selectedSorteo.id,
      cantidad,
      cantidad * selectedSorteo.precio_ticket,
      comprobante
    );

    setLoading(false);
    setStep('confirmado');
    toast.success('¡Solicitud enviada! El admin verificará tu pago 🎉');
  };

  const getDiasRestantes = (fecha: string) =>
    Math.max(0, Math.ceil((new Date(fecha).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const formatDate = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'activo': return <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">🟢 ACTIVO</span>;
      case 'finalizado': return <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs font-bold px-3 py-1 rounded-full">⚫ FINALIZADO</span>;
      case 'cancelado': return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full">🔴 CANCELADO</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-16" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-transparent py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-orange-900/20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold px-4 py-2 rounded-full mb-4 tracking-widest uppercase">
            <Trophy className="w-4 h-4" /> Sorteos Premium
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            TODOS LOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">SORTEOS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige tu sorteo favorito, compra tus tickets y participa por increíbles premios
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar sorteos..."
              className="w-full bg-gray-900 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-900 border border-white/10 rounded-xl p-1">
            <Filter className="w-4 h-4 text-gray-400 ml-3" />
            {(['todos', 'activo', 'finalizado'] as FilterEstado[]).map(f => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  filtro === f
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'activo' ? 'Activos' : 'Finalizados'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {sorteosFiltrados.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">🏍️</div>
            <h3 className="text-2xl font-bold text-white mb-3">No hay sorteos disponibles</h3>
            <p className="text-gray-400">Pronto habrá nuevos sorteos emocionantes. ¡Mantente atento!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorteosFiltrados.map(sorteo => {
              const vendidos = getTicketsVendidos(sorteo.id);
              const disponibles = sorteo.cantidad_tickets - vendidos;
              const porcentaje = Math.min((vendidos / sorteo.cantidad_tickets) * 100, 100);
              const dias = getDiasRestantes(sorteo.fecha_sorteo);
              // ganador info reserved for future use

              return (
                <div
                  key={sorteo.id}
                  className="group bg-gray-900 border border-white/10 hover:border-red-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                      src={sorteo.imagen}
                      alt={sorteo.nombre_producto}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFmMWYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNDQ0IiBmb250LXNpemU9IjE0Ij5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">{getStatusBadge(sorteo.estado)}</div>
                    {sorteo.estado === 'activo' && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
                        {dias}d restantes
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {sorteo.nombre_producto}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{sorteo.descripcion}</p>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                        <Calendar className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-semibold">{formatDate(sorteo.fecha_sorteo).split(' ').slice(0, 2).join(' ')}</div>
                        <div className="text-gray-500 text-[10px]">Fecha sorteo</div>
                      </div>
                      <div className="bg-gray-800/60 rounded-xl p-3 text-center">
                        <Ticket className="w-4 h-4 text-red-400 mx-auto mb-1" />
                        <div className="text-white text-xs font-semibold">{disponibles} / {sorteo.cantidad_tickets}</div>
                        <div className="text-gray-500 text-[10px]">Disponibles</div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vendidos} vendidos</span>
                        <span>{Math.round(porcentaje)}% ocupado</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${porcentaje}%`,
                            background: porcentaje > 80 ? 'linear-gradient(to right, #dc2626, #ea580c)' : 'linear-gradient(to right, #E53935, #FF6F00)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Winner info */}
                    {sorteo.estado === 'finalizado' && sorteo.ganador_ticket && (
                      <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-yellow-400 text-xs font-bold">🏆 TICKET GANADOR</p>
                        <p className="text-white font-black text-xl">#{sorteo.ganador_ticket}</p>
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-gray-500 text-xs">Por ticket</span>
                        <div className="text-2xl font-black text-orange-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          S/ {sorteo.precio_ticket.toFixed(2)}
                        </div>
                      </div>
                      {sorteo.estado === 'activo' && disponibles > 0 ? (
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              toast.error('Debes iniciar sesión para participar');
                              onNavigate('login');
                              return;
                            }
                            handleOpenSorteo(sorteo);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 hover:scale-105"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Participar
                        </button>
                      ) : sorteo.estado === 'activo' && disponibles === 0 ? (
                        <span className="bg-gray-700 text-gray-400 text-sm font-bold px-5 py-2.5 rounded-xl">Agotado</span>
                      ) : (
                        <span className="bg-gray-700 text-gray-400 text-sm font-bold px-5 py-2.5 rounded-xl">Finalizado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Purchase Modal ── */}
      {selectedSorteo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-gray-900 border border-white/20 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-white font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {step === 'info' ? '🎟️ Comprar Tickets' : step === 'pago' ? '💳 Realizar Pago' : '✅ Confirmado'}
              </h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Step: Info & Quantity */}
              {step === 'info' && (
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <img
                      src={selectedSorteo.imagen}
                      alt={selectedSorteo.nombre_producto}
                      className="w-24 h-24 object-cover rounded-xl border border-white/10 flex-shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFmMWYxZiIvPjwvc3ZnPg=='; }}
                    />
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{selectedSorteo.nombre_producto}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-3">{selectedSorteo.descripcion}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/60 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" />Fecha del sorteo</span>
                      <span className="text-white font-semibold">{formatDate(selectedSorteo.fecha_sorteo)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><Ticket className="w-4 h-4" />Disponibles</span>
                      <span className="text-white font-semibold">{selectedSorteo.cantidad_tickets - getTicketsVendidos(selectedSorteo.id)} tickets</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4" />Precio unitario</span>
                      <span className="text-orange-400 font-bold">S/ {selectedSorteo.precio_ticket.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-3">Cantidad de Tickets</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCantidad(q => Math.max(1, q - 1))}
                        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl rounded-xl transition-colors border border-white/10"
                      >−</button>
                      <div className="flex-1 text-center">
                        <div className="text-4xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{cantidad}</div>
                        <div className="text-gray-500 text-xs">ticket{cantidad !== 1 ? 's' : ''}</div>
                      </div>
                      <button
                        onClick={() => setCantidad(q => Math.min(selectedSorteo.cantidad_tickets - getTicketsVendidos(selectedSorteo.id), q + 1))}
                        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl rounded-xl transition-colors border border-white/10"
                      >+</button>
                    </div>
                  </div>

                  {/* Quick amounts */}
                  <div className="flex gap-2">
                    {[1, 3, 5, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setCantidad(Math.min(n, selectedSorteo.cantidad_tickets - getTicketsVendidos(selectedSorteo.id)))}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-colors ${
                          cantidad === n ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-800 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {n}x
                      </button>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-600/20 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-semibold">Total a pagar:</span>
                      <div className="text-right">
                        <div className="text-3xl font-black text-orange-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          S/ {(cantidad * selectedSorteo.precio_ticket).toFixed(2)}
                        </div>
                        <div className="text-gray-500 text-xs">{cantidad} ticket{cantidad !== 1 ? 's' : ''} × S/ {selectedSorteo.precio_ticket.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('pago')}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Continuar al Pago →
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {step === 'pago' && (
                <div className="space-y-5">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                    <div className="text-4xl mb-2">💚</div>
                    <h3 className="text-white font-bold text-lg mb-1">Pago por Yape</h3>
                    <p className="text-gray-400 text-sm mb-4">Realiza el pago al siguiente número de Yape:</p>

                    <div className="bg-gray-900/80 rounded-xl p-4 mb-3">
                      <div className="text-3xl font-black text-green-400 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {configuracion.numero_yape}
                      </div>
                      <div className="text-gray-400 text-sm">Titular: <span className="text-white font-semibold">{configuracion.titular_yape}</span></div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2 inline-block">
                      <span className="text-orange-400 font-bold text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Monto: S/ {(cantidad * selectedSorteo.precio_ticket).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Comprobante upload */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-3">
                      Subir Comprobante de Pago *
                    </label>
                    <label className={`flex flex-col items-center justify-center gap-3 h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                      comprobante
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-white/20 hover:border-red-500/50 hover:bg-red-500/5 bg-gray-800/40'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {comprobante ? (
                        <>
                          <img src={comprobante} alt="Comprobante" className="h-20 object-contain rounded-lg" />
                          <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Comprobante cargado
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <div className="text-center">
                            <p className="text-gray-300 text-sm font-semibold">Sube la captura de tu Yape</p>
                            <p className="text-gray-500 text-xs">PNG, JPG o JPEG • Máx 5MB</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-blue-300 text-xs leading-relaxed">
                      Tu solicitud quedará <strong>pendiente de verificación</strong>. El administrador revisará tu comprobante
                      y aprobará el pago. Una vez aprobado, recibirás tus números de ticket automáticamente.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('info')}
                      className="flex-1 py-3.5 border border-white/20 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors"
                    >
                      ← Atrás
                    </button>
                    <button
                      onClick={handleConfirmPago}
                      disabled={!comprobante || loading}
                      className="flex-2 flex-1 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        'Enviar Solicitud ✓'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Confirmed */}
              {step === 'confirmado' && (
                <div className="text-center py-8 space-y-5">
                  <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      ¡Solicitud Enviada!
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Tu solicitud de <strong className="text-orange-400">{cantidad} ticket{cantidad !== 1 ? 's' : ''}</strong>{' '}
                      para <strong className="text-white">{selectedSorteo.nombre_producto}</strong> ha sido enviada.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      El administrador verificará tu comprobante de pago. Revisa el estado en tu panel.
                    </p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Sorteo:</span><span className="text-white font-semibold">{selectedSorteo.nombre_producto}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Tickets:</span><span className="text-white font-semibold">{cantidad}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Total:</span><span className="text-orange-400 font-bold">S/ {(cantidad * selectedSorteo.precio_ticket).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Estado:</span><span className="text-yellow-400 font-semibold">⏳ Pendiente</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { handleClose(); onNavigate('mi-panel'); }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200"
                    >
                      Ver mi Panel
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3.5 border border-white/20 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Ver más Sorteos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
