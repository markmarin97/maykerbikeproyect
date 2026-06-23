// ============================================================
// MaykerBike - Admin Dashboard
// ============================================================

import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Sorteo, SorteoEstado } from '../types';
import {
  LayoutDashboard, Trophy, Users, Ticket, ShoppingBag, Settings,
  Plus, Edit2, Trash2, Eye, Play, CheckCircle, XCircle, Clock,
  Upload, X, Save, AlertTriangle, DollarSign, ToggleRight, Image,
  Star, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

type AdminTab = 'dashboard' | 'sorteos' | 'pagos' | 'usuarios' | 'configuracion';

interface SorteoFormData {
  nombre_producto: string;
  descripcion: string;
  imagen: string;
  precio_ticket: number;
  cantidad_tickets: number;
  fecha_sorteo: string;
  estado: SorteoEstado;
}

const EMPTY_FORM: SorteoFormData = {
  nombre_producto: '',
  descripcion: '',
  imagen: '',
  precio_ticket: 10,
  cantidad_tickets: 100,
  fecha_sorteo: '',
  estado: 'borrador',
};

export default function AdminPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const store = useStore();
  const { currentUser, sorteos, compras, tickets, usuarios, configuracion } = store;

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showSorteoModal, setShowSorteoModal] = useState(false);
  const [editingSorteo, setEditingSorteo] = useState<Sorteo | null>(null);
  const [sorteoForm, setSorteoForm] = useState<SorteoFormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<{ ticket: string; sorteoId: string } | null>(null);
  const [configForm, setConfigForm] = useState({
    numero_yape: configuracion.numero_yape,
    titular_yape: configuracion.titular_yape,
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser || currentUser.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Acceso restringido</p>
          <button onClick={() => onNavigate('inicio')} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────────────────────
  const stats = {
    totalUsuarios: usuarios.filter(u => u.rol === 'user').length,
    sorteosActivos: sorteos.filter(s => s.estado === 'activo').length,
    sorteosFinalizados: sorteos.filter(s => s.estado === 'finalizado').length,
    ticketsVendidos: tickets.length,
    totalVentas: compras.filter(c => c.estado_pago === 'aprobado').reduce((sum, c) => sum + c.monto, 0),
    pagosPendientes: compras.filter(c => c.estado_pago === 'pendiente').length,
  };

  // ── Handlers ───────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingSorteo(null);
    setSorteoForm(EMPTY_FORM);
    setShowSorteoModal(true);
  };

  const openEditModal = (sorteo: Sorteo) => {
    setEditingSorteo(sorteo);
    setSorteoForm({
      nombre_producto: sorteo.nombre_producto,
      descripcion: sorteo.descripcion,
      imagen: sorteo.imagen,
      precio_ticket: sorteo.precio_ticket,
      cantidad_tickets: sorteo.cantidad_tickets,
      fecha_sorteo: sorteo.fecha_sorteo.split('T')[0],
      estado: sorteo.estado,
    });
    setShowSorteoModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error('La imagen no puede superar 8MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setSorteoForm(f => ({ ...f, imagen: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSaveSorteo = () => {
    if (!sorteoForm.nombre_producto.trim()) { toast.error('El nombre es requerido'); return; }
    if (!sorteoForm.fecha_sorteo) { toast.error('La fecha del sorteo es requerida'); return; }
    if (sorteoForm.precio_ticket <= 0) { toast.error('El precio debe ser mayor a 0'); return; }
    if (sorteoForm.cantidad_tickets <= 0) { toast.error('La cantidad de tickets debe ser mayor a 0'); return; }

    const data = { ...sorteoForm, fecha_sorteo: new Date(`${sorteoForm.fecha_sorteo}T12:00:00`).toISOString() };

    if (editingSorteo) {
      store.editarSorteo(editingSorteo.id, data);
      toast.success('Sorteo actualizado exitosamente ✅');
    } else {
      store.crearSorteo(data);
      toast.success('Sorteo creado exitosamente 🎉');
    }

    setShowSorteoModal(false);
    setEditingSorteo(null);
    setSorteoForm(EMPTY_FORM);
  };

  const handleDeleteSorteo = (id: string) => {
    store.eliminarSorteo(id);
    setDeleteConfirm(null);
    toast.success('Sorteo eliminado');
  };

  const handlePublicar = (id: string) => {
    store.publicarSorteo(id);
    toast.success('Sorteo publicado ✅');
  };

  const handleEjecutarSorteo = (sorteoId: string) => {
    const ticketsSorteo = tickets.filter(t => t.sorteo_id === sorteoId);
    if (ticketsSorteo.length === 0) {
      toast.error('No hay tickets vendidos para este sorteo');
      return;
    }
    const winner = store.ejecutarSorteo(sorteoId);
    if (winner) {
      setWinnerInfo({ ticket: winner.numero_ticket, sorteoId });
      toast.success(`¡Ganador seleccionado! Ticket #${winner.numero_ticket} 🏆`);
    }
  };

  const handleAprobarPago = (compraId: string) => {
    store.aprobarPago(compraId);
    toast.success('Pago aprobado. Tickets asignados automáticamente ✅');
  };

  const handleRechazarPago = (compraId: string) => {
    store.rechazarPago(compraId);
    toast.error('Pago rechazado');
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    await new Promise(r => setTimeout(r, 600));
    store.actualizarConfiguracion(configForm);
    setSavingConfig(false);
    toast.success('Configuración guardada exitosamente ✅');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateTime = (d: string) => new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const getPagosBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" />Pendiente</span>;
      case 'aprobado': return <span className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2.5 py-1 rounded-full"><CheckCircle className="w-3 h-3" />Aprobado</span>;
      case 'rechazado': return <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" />Rechazado</span>;
      default: return null;
    }
  };

  const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sorteos', label: 'Sorteos', icon: Trophy },
    { id: 'pagos', label: 'Pagos', icon: ShoppingBag, badge: stats.pagosPendientes },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#121212]" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Sidebar + Content layout */}
      <div className="flex min-h-screen pt-16">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-gray-950 border-r border-white/10 fixed top-16 bottom-0 left-0 z-40">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Panel Admin</p>
                <p className="text-gray-500 text-xs">MaykerBike</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => onNavigate('inicio')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <ToggleRight className="w-5 h-5" />
              Ver sitio web
            </button>
          </div>
        </aside>

        {/* Mobile top tabs */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-gray-950 border-b border-white/10 overflow-x-auto">
          <div className="flex px-2 py-2 gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all relative ${
                  activeTab === tab.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 mt-10 lg:mt-0">

          {/* ─── DASHBOARD ─── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  📊 Dashboard
                </h1>
                <p className="text-gray-400 text-sm">Resumen general del sistema</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Usuarios Registrados', value: stats.totalUsuarios, icon: Users, color: 'from-blue-600 to-blue-800', text: 'text-blue-400' },
                  { label: 'Sorteos Activos', value: stats.sorteosActivos, icon: Trophy, color: 'from-red-600 to-red-800', text: 'text-red-400' },
                  { label: 'Sorteos Finalizados', value: stats.sorteosFinalizados, icon: CheckCircle, color: 'from-gray-600 to-gray-800', text: 'text-gray-400' },
                  { label: 'Tickets Vendidos', value: stats.ticketsVendidos, icon: Ticket, color: 'from-orange-500 to-orange-700', text: 'text-orange-400' },
                  { label: 'Total Ventas (S/)', value: stats.totalVentas.toFixed(2), icon: DollarSign, color: 'from-green-600 to-green-800', text: 'text-green-400' },
                  { label: 'Pagos Pendientes', value: stats.pagosPendientes, icon: Clock, color: 'from-yellow-500 to-yellow-700', text: 'text-yellow-400' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <s.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className={`text-3xl font-black mb-1 ${s.text}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.value}</div>
                    <div className="text-gray-400 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent purchases */}
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Compras Recientes</h2>
                  <button onClick={() => setActiveTab('pagos')} className="text-red-400 text-sm hover:text-red-300 transition-colors">Ver todas →</button>
                </div>
                {compras.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay compras registradas</p>
                ) : (
                  <div className="space-y-3">
                    {compras.slice(-5).reverse().map(compra => {
                      const user = usuarios.find(u => u.id === compra.usuario_id);
                      const sorteo = sorteos.find(s => s.id === compra.sorteo_id);
                      return (
                        <div key={compra.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-bold">
                              {user?.nombre?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">{user?.nombre || 'Usuario'}</p>
                              <p className="text-gray-500 text-xs truncate max-w-[200px]">{sorteo?.nombre_producto || 'Sorteo eliminado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-orange-400 font-bold text-sm">S/ {compra.monto.toFixed(2)}</span>
                            {getPagosBadge(compra.estado_pago)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SORTEOS ─── */}
          {activeTab === 'sorteos' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>🏆 Gestión de Sorteos</h1>
                  <p className="text-gray-400 text-sm">Crear, editar y administrar todos los sorteos</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-5 h-5" /> Nuevo Sorteo
                </button>
              </div>

              {sorteos.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border border-white/10 rounded-2xl">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-xl font-bold mb-2">No hay sorteos</p>
                  <p className="text-gray-400 mb-6">Crea tu primer sorteo para comenzar</p>
                  <button onClick={openCreateModal} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors">
                    Crear Sorteo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {sorteos.map(sorteo => {
                    const vendidos = tickets.filter(t => t.sorteo_id === sorteo.id).length;
                    const porcentaje = Math.min((vendidos / sorteo.cantidad_tickets) * 100, 100);

                    return (
                      <div key={sorteo.id} className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="flex gap-4 p-4">
                          <img
                            src={sorteo.imagen}
                            alt={sorteo.nombre_producto}
                            className="w-24 h-24 object-cover rounded-xl border border-white/10 flex-shrink-0"
                            onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjMWYxZjFmIi8+PC9zdmc+'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-white font-bold leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{sorteo.nombre_producto}</h3>
                              <StatusBadge estado={sorteo.estado} />
                            </div>
                            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{sorteo.descripcion}</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-gray-800 rounded-lg p-2 text-center">
                                <div className="text-orange-400 font-bold">S/ {sorteo.precio_ticket}</div>
                                <div className="text-gray-500">precio</div>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-2 text-center">
                                <div className="text-white font-bold">{vendidos}/{sorteo.cantidad_tickets}</div>
                                <div className="text-gray-500">vendidos</div>
                              </div>
                              <div className="bg-gray-800 rounded-lg p-2 text-center">
                                <div className="text-red-400 font-bold">{formatDate(sorteo.fecha_sorteo)}</div>
                                <div className="text-gray-500">fecha</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="px-4 pb-2">
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full" style={{ width: `${porcentaje}%` }} />
                          </div>
                        </div>

                        {/* Winner announcement */}
                        {sorteo.estado === 'finalizado' && sorteo.ganador_ticket && (
                          <div className="mx-4 mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="text-yellow-400 text-xs font-bold">
                              Ganador: Ticket #{sorteo.ganador_ticket}
                              {(() => {
                                const winnerTicket = tickets.find(t => t.numero_ticket === sorteo.ganador_ticket && t.sorteo_id === sorteo.id);
                                const winnerUser = winnerTicket ? usuarios.find(u => u.id === winnerTicket.usuario_id) : null;
                                return winnerUser ? ` — ${winnerUser.nombre}` : '';
                              })()}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => openEditModal(sorteo)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Editar
                          </button>

                          {sorteo.estado === 'borrador' && (
                            <button
                              onClick={() => handlePublicar(sorteo.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-semibold rounded-lg transition-colors border border-green-600/30"
                            >
                              <Eye className="w-3.5 h-3.5" /> Publicar
                            </button>
                          )}

                          {sorteo.estado === 'activo' && vendidos > 0 && (
                            <button
                              onClick={() => handleEjecutarSorteo(sorteo.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-semibold rounded-lg transition-colors border border-yellow-600/30"
                            >
                              <Play className="w-3.5 h-3.5" /> Realizar Sorteo
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteConfirm(sorteo.id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold rounded-lg transition-colors border border-red-600/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── PAGOS ─── */}
          {activeTab === 'pagos' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>💳 Gestión de Pagos</h1>
                <p className="text-gray-400 text-sm">Revisar, aprobar o rechazar solicitudes de compra</p>
              </div>

              {/* Filter tabs - inline below */}

              {compras.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 border border-white/10 rounded-2xl">
                  <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-xl font-bold mb-2">No hay solicitudes</p>
                  <p className="text-gray-400">Las solicitudes de compra aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Pending first */}
                  {['pendiente', 'aprobado', 'rechazado'].map(estado => {
                    const filtered = compras.filter(c => c.estado_pago === estado)
                      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
                    if (filtered.length === 0) return null;

                    return (
                      <div key={estado}>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                          {getPagosBadge(estado)}
                          <span className="text-gray-400 text-sm">({filtered.length})</span>
                        </h3>
                        <div className="space-y-3">
                          {filtered.map(compra => {
                            const user = usuarios.find(u => u.id === compra.usuario_id);
                            const sorteo = sorteos.find(s => s.id === compra.sorteo_id);
                            const assignedTickets = tickets.filter(t => t.compra_id === compra.id);

                            return (
                              <div key={compra.id} className={`bg-gray-900 border rounded-2xl p-5 ${
                                estado === 'pendiente' ? 'border-yellow-500/30' :
                                estado === 'aprobado' ? 'border-green-500/20' : 'border-red-500/20'
                              }`}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                  {/* Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                      <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400 font-bold text-sm flex-shrink-0">
                                        {user?.nombre?.charAt(0).toUpperCase() || '?'}
                                      </div>
                                      <span className="text-white font-bold">{user?.nombre || 'Usuario eliminado'}</span>
                                      <span className="text-gray-500 text-xs">{user?.correo}</span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                                      <div className="bg-gray-800 rounded-lg p-2">
                                        <div className="text-gray-500 mb-0.5">Sorteo</div>
                                        <div className="text-white font-semibold truncate">{sorteo?.nombre_producto || 'N/A'}</div>
                                      </div>
                                      <div className="bg-gray-800 rounded-lg p-2">
                                        <div className="text-gray-500 mb-0.5">Tickets</div>
                                        <div className="text-white font-bold">{compra.cantidad}</div>
                                      </div>
                                      <div className="bg-gray-800 rounded-lg p-2">
                                        <div className="text-gray-500 mb-0.5">Monto</div>
                                        <div className="text-orange-400 font-bold">S/ {compra.monto.toFixed(2)}</div>
                                      </div>
                                      <div className="bg-gray-800 rounded-lg p-2">
                                        <div className="text-gray-500 mb-0.5">Fecha</div>
                                        <div className="text-white font-semibold">{formatDateTime(compra.fecha)}</div>
                                      </div>
                                    </div>

                                    {assignedTickets.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5">
                                        <span className="text-gray-500 text-xs self-center">Tickets:</span>
                                        {assignedTickets.map(t => (
                                          <span key={t.id} className="bg-gray-800 border border-white/10 text-gray-300 text-xs font-mono px-2 py-0.5 rounded">#{t.numero_ticket}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Comprobante + actions */}
                                  <div className="flex flex-col items-end gap-3">
                                    {compra.comprobante && (
                                      <div>
                                        <p className="text-gray-500 text-xs mb-1 text-center">Comprobante</p>
                                        <img
                                          src={compra.comprobante}
                                          alt="Comprobante Yape"
                                          className="w-20 h-20 object-cover rounded-xl border border-white/10 cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={() => window.open(compra.comprobante, '_blank')}
                                        />
                                      </div>
                                    )}

                                    {estado === 'pendiente' && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleAprobarPago(compra.id)}
                                          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-xl transition-colors"
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                                        </button>
                                        <button
                                          onClick={() => handleRechazarPago(compra.id)}
                                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors"
                                        >
                                          <XCircle className="w-3.5 h-3.5" /> Rechazar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── USUARIOS ─── */}
          {activeTab === 'usuarios' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>👥 Gestión de Usuarios</h1>
                <p className="text-gray-400 text-sm">Todos los usuarios registrados en la plataforma</p>
              </div>

              <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <span className="text-white font-semibold">{usuarios.filter(u => u.rol === 'user').length} usuarios registrados</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        {['Usuario', 'Correo', 'Fecha Registro', 'Tickets', 'Compras', 'Rol'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {usuarios.filter(u => u.rol === 'user').map(user => {
                        const userTickets = tickets.filter(t => t.usuario_id === user.id).length;
                        const userCompras = compras.filter(c => c.usuario_id === user.id).length;
                        return (
                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {user.nombre.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white font-semibold text-sm">{user.nombre}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-400 text-sm">{user.correo}</td>
                            <td className="px-4 py-4 text-gray-400 text-sm">{formatDate(user.fecha_registro)}</td>
                            <td className="px-4 py-4">
                              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full">{userTickets}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">{userCompras}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2.5 py-1 rounded-full">👤 Usuario</span>
                            </td>
                          </tr>
                        );
                      })}
                      {usuarios.filter(u => u.rol === 'user').length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-500">
                            No hay usuarios registrados aún
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── CONFIGURACIÓN ─── */}
          {activeTab === 'configuracion' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>⚙️ Configuración</h1>
                <p className="text-gray-400 text-sm">Configura los datos de Yape y opciones del sistema</p>
              </div>

              <div className="max-w-2xl space-y-6">
                {/* Yape config */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-600/20 border border-green-600/30 rounded-xl flex items-center justify-center">
                      <span className="text-xl">💚</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Configuración de Yape</h3>
                      <p className="text-gray-400 text-xs">Datos que se mostrarán a los usuarios al momento del pago</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Número de Celular Yape</label>
                      <input
                        type="tel"
                        value={configForm.numero_yape}
                        onChange={e => setConfigForm(f => ({ ...f, numero_yape: e.target.value }))}
                        placeholder="961 359 573"
                        className="w-full bg-gray-800 border border-white/10 focus:border-green-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Nombre del Titular</label>
                      <input
                        type="text"
                        value={configForm.titular_yape}
                        onChange={e => setConfigForm(f => ({ ...f, titular_yape: e.target.value }))}
                        placeholder="Nombre completo del titular"
                        className="w-full bg-gray-800 border border-white/10 focus:border-green-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-5 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 text-xs font-semibold mb-2">Vista previa (como lo verán los usuarios):</p>
                    <div className="text-center">
                      <div className="text-2xl font-black text-green-400">{configForm.numero_yape || '---'}</div>
                      <div className="text-gray-400 text-sm">Titular: <span className="text-white">{configForm.titular_yape || '---'}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    disabled={savingConfig}
                    className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {savingConfig ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Guardando...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Guardar Configuración</>
                    )}
                  </button>
                </div>

                {/* Admin info note */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold mb-2">Información del Sistema</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Las credenciales de administrador están configuradas de forma segura en el sistema.
                        Para cambiar las credenciales de acceso, contacta al equipo de desarrollo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Sorteo Form Modal ── */}
      {showSorteoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSorteoModal(false)} />
          <div className="relative bg-gray-900 border border-white/20 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto" onClick={e => e.stopPropagation()}>

            <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-white font-black text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {editingSorteo ? '✏️ Editar Sorteo' : '➕ Nuevo Sorteo'}
              </h2>
              <button onClick={() => setShowSorteoModal(false)} className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-3">
                  <Image className="w-4 h-4 inline mr-1" /> Imagen del Producto
                </label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className={`relative h-40 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200 ${
                    sorteoForm.imagen
                      ? 'border-red-500/50'
                      : 'border-white/20 hover:border-red-500/50 hover:bg-red-500/5'
                  }`}
                >
                  {sorteoForm.imagen ? (
                    <>
                      <img src={sorteoForm.imagen} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="text-white text-sm font-semibold flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Cambiar imagen
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3">
                      <Upload className="w-8 h-8 text-gray-500" />
                      <div className="text-center">
                        <p className="text-gray-300 text-sm font-semibold">Cargar imagen desde tu computador</p>
                        <p className="text-gray-500 text-xs">PNG, JPG • Máx 8MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                {/* URL alternative */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={sorteoForm.imagen.startsWith('data:') ? '' : sorteoForm.imagen}
                    onChange={e => setSorteoForm(f => ({ ...f, imagen: e.target.value }))}
                    placeholder="O ingresa URL de imagen..."
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Nombre del Producto *</label>
                  <input
                    type="text"
                    value={sorteoForm.nombre_producto}
                    onChange={e => setSorteoForm(f => ({ ...f, nombre_producto: e.target.value }))}
                    placeholder="Ej: Casco Racing Pro X1"
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Descripción</label>
                  <textarea
                    value={sorteoForm.descripcion}
                    onChange={e => setSorteoForm(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Describe las características del producto..."
                    rows={3}
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Precio del Ticket (S/) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.50"
                    value={sorteoForm.precio_ticket}
                    onChange={e => setSorteoForm(f => ({ ...f, precio_ticket: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white px-4 py-3 rounded-xl outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Cantidad de Tickets *</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={sorteoForm.cantidad_tickets}
                    onChange={e => setSorteoForm(f => ({ ...f, cantidad_tickets: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white px-4 py-3 rounded-xl outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Fecha del Sorteo *</label>
                  <input
                    type="date"
                    value={sorteoForm.fecha_sorteo}
                    onChange={e => setSorteoForm(f => ({ ...f, fecha_sorteo: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white px-4 py-3 rounded-xl outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Estado</label>
                  <select
                    value={sorteoForm.estado}
                    onChange={e => setSorteoForm(f => ({ ...f, estado: e.target.value as SorteoEstado }))}
                    className="w-full bg-gray-800 border border-white/10 focus:border-red-500/50 text-white px-4 py-3 rounded-xl outline-none transition-all duration-200"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="activo">Activo</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Revenue preview */}
              {sorteoForm.precio_ticket > 0 && sorteoForm.cantidad_tickets > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Recaudación total estimada:</span>
                    <span className="text-orange-400 font-black text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      S/ {(sorteoForm.precio_ticket * sorteoForm.cantidad_tickets).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSorteoModal(false)}
                  className="flex-1 py-3.5 border border-white/20 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveSorteo}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-900/50 transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                  {editingSorteo ? 'Actualizar' : 'Crear Sorteo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-gray-900 border border-red-600/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-600/20 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>¿Eliminar Sorteo?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Esta acción es irreversible. Se eliminarán también todos los tickets y compras asociados a este sorteo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-white/20 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteSorteo(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Winner Modal ── */}
      {winnerInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative bg-gray-900 border border-yellow-500/40 rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center overflow-hidden">
            {/* Confetti effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: ['#E53935', '#FF6F00', '#FFD700', '#4CAF50'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.5 + Math.random() * 1}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="text-7xl mb-4 animate-bounce">🏆</div>
              <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ¡GANADOR!
              </h3>
              <p className="text-gray-400 mb-4">El ticket ganador es:</p>
              <div className="text-6xl font-black text-yellow-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                #{winnerInfo.ticket}
              </div>
              {(() => {
                const winnerTicket = tickets.find(t => t.numero_ticket === winnerInfo.ticket && t.sorteo_id === winnerInfo.sorteoId);
                const winnerUser = winnerTicket ? usuarios.find(u => u.id === winnerTicket.usuario_id) : null;
                return winnerUser ? (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-3">
                    <p className="text-yellow-400 font-bold text-lg">{winnerUser.nombre}</p>
                    <p className="text-gray-400 text-sm">{winnerUser.correo}</p>
                  </div>
                ) : null;
              })()}
              <button
                onClick={() => setWinnerInfo(null)}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black rounded-xl text-lg hover:opacity-90 transition-opacity"
              >
                ¡Fantástico! 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Status badge helper component
function StatusBadge({ estado }: { estado: string }) {
  switch (estado) {
    case 'activo': return <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">🟢 ACTIVO</span>;
    case 'borrador': return <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">📝 BORRADOR</span>;
    case 'finalizado': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">✅ FINALIZADO</span>;
    case 'cancelado': return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">❌ CANCELADO</span>;
    default: return null;
  }
}
