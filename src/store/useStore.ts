// ============================================================
// MaykerBike - Global State Store (localStorage persistence)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { User, Sorteo, Compra, Ticket, Configuracion, AppState, EstadoPago, SorteoEstado } from '../types';

// ── Seed data ──────────────────────────────────────────────
const DEFAULT_CONFIG: Configuracion = {
  id: '1',
  numero_yape: '999-888-777',
  titular_yape: 'MaykerBike Oficial',
};

const ADMIN_USER: User = {
  id: 'admin-001',
  nombre: 'Administrador',
  correo: 'admin@maykerbike.com',
  contrasena: 'mayker2026',
  rol: 'admin',
  fecha_registro: new Date().toISOString(),
};

const DEMO_SORTEOS: Sorteo[] = [
  {
    id: 'sorteo-001',
    nombre_producto: 'Casco Racing Pro X1',
    descripcion: 'Casco de alto rendimiento con certificación ECE 22.06, ventilación avanzada, visera anti-arañazos y sistema de liberación de emergencia. Ideal para circuito y calle.',
    imagen: '/images/raffle-helmet.jpg',
    precio_ticket: 10,
    cantidad_tickets: 100,
    fecha_sorteo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activo',
    fecha_creacion: new Date().toISOString(),
  },
  {
    id: 'sorteo-002',
    nombre_producto: 'Chaqueta Moto Leather Sport',
    descripcion: 'Chaqueta de cuero genuino con protecciones CE nivel 2 en hombros, codos y espalda. Forro térmico removible, costuras reforzadas y estilo deportivo premium.',
    imagen: '/images/raffle-jacket.jpg',
    precio_ticket: 15,
    cantidad_tickets: 200,
    fecha_sorteo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activo',
    fecha_creacion: new Date().toISOString(),
  },
  {
    id: 'sorteo-003',
    nombre_producto: 'Guantes Moto Carbon Pro',
    descripcion: 'Guantes de motociclismo con nudilleras de carbono, palma reforzada anti-abrasión, compatible con pantallas táctiles y cierre ajustable. Máxima protección y confort.',
    imagen: '/images/raffle-gloves.jpg',
    precio_ticket: 5,
    cantidad_tickets: 150,
    fecha_sorteo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'activo',
    fecha_creacion: new Date().toISOString(),
  },
];

// ── localStorage helpers ───────────────────────────────────
const STORAGE_KEY = 'maykerbike_data';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // Ensure admin always exists
      const hasAdmin = parsed.usuarios.some(u => u.rol === 'admin');
      if (!hasAdmin) parsed.usuarios.unshift(ADMIN_USER);
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return {
    usuarios: [ADMIN_USER],
    sorteos: DEMO_SORTEOS,
    compras: [],
    tickets: [],
    configuracion: DEFAULT_CONFIG,
    currentUser: null,
  };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

// ── Singleton state ────────────────────────────────────────
let globalState: AppState = loadState();
const listeners: Set<() => void> = new Set();

function setState(updater: (prev: AppState) => AppState) {
  globalState = updater(globalState);
  saveState(globalState);
  listeners.forEach(l => l());
}

// ── Hook ───────────────────────────────────────────────────
export function useStore() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const listener = () => rerender(n => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  // ── Auth ────────────────────────────────────────────────
  const login = useCallback((correo: string, contrasena: string): User | null => {
    const user = globalState.usuarios.find(
      u => u.correo.toLowerCase() === correo.toLowerCase() && u.contrasena === contrasena
    );
    if (user) {
      setState(s => ({ ...s, currentUser: user }));
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setState(s => ({ ...s, currentUser: null }));
  }, []);

  const register = useCallback((nombre: string, correo: string, contrasena: string): boolean => {
    const exists = globalState.usuarios.some(u => u.correo.toLowerCase() === correo.toLowerCase());
    if (exists) return false;
    const newUser: User = {
      id: `user-${Date.now()}`,
      nombre,
      correo,
      contrasena,
      rol: 'user',
      fecha_registro: new Date().toISOString(),
    };
    setState(s => ({ ...s, usuarios: [...s.usuarios, newUser] }));
    return true;
  }, []);

  // ── Sorteos ─────────────────────────────────────────────
  const crearSorteo = useCallback((data: Omit<Sorteo, 'id' | 'fecha_creacion'>) => {
    const sorteo: Sorteo = { ...data, id: `sorteo-${Date.now()}`, fecha_creacion: new Date().toISOString() };
    setState(s => ({ ...s, sorteos: [...s.sorteos, sorteo] }));
    return sorteo;
  }, []);

  const editarSorteo = useCallback((id: string, data: Partial<Sorteo>) => {
    setState(s => ({ ...s, sorteos: s.sorteos.map(s2 => s2.id === id ? { ...s2, ...data } : s2) }));
  }, []);

  const eliminarSorteo = useCallback((id: string) => {
    setState(s => ({
      ...s,
      sorteos: s.sorteos.filter(s2 => s2.id !== id),
      compras: s.compras.filter(c => c.sorteo_id !== id),
      tickets: s.tickets.filter(t => t.sorteo_id !== id),
    }));
  }, []);

  const publicarSorteo = useCallback((id: string) => {
    setState(s => ({ ...s, sorteos: s.sorteos.map(s2 => s2.id === id ? { ...s2, estado: 'activo' as SorteoEstado } : s2) }));
  }, []);

  const ejecutarSorteo = useCallback((sorteoId: string): Ticket | null => {
    const tickets = globalState.tickets.filter(t => t.sorteo_id === sorteoId);
    if (tickets.length === 0) return null;
    const winner = tickets[Math.floor(Math.random() * tickets.length)];
    setState(s => ({
      ...s,
      sorteos: s.sorteos.map(s2 => s2.id === sorteoId
        ? { ...s2, estado: 'finalizado' as SorteoEstado, ganador_ticket: winner.numero_ticket, ganador_usuario_id: winner.usuario_id }
        : s2),
    }));
    return winner;
  }, []);

  // ── Compras ─────────────────────────────────────────────
  const crearCompra = useCallback((usuarioId: string, sorteoId: string, cantidad: number, monto: number, comprobante?: string): Compra => {
    const compra: Compra = {
      id: `compra-${Date.now()}`,
      usuario_id: usuarioId,
      sorteo_id: sorteoId,
      cantidad,
      monto,
      estado_pago: 'pendiente',
      fecha: new Date().toISOString(),
      comprobante,
    };
    setState(s => ({ ...s, compras: [...s.compras, compra] }));
    return compra;
  }, []);

  const aprobarPago = useCallback((compraId: string) => {
    const compra = globalState.compras.find(c => c.id === compraId);
    if (!compra) return;

    // Get current max ticket number for this sorteo
    const existingTickets = globalState.tickets.filter(t => t.sorteo_id === compra.sorteo_id);
    const maxNum = existingTickets.length > 0
      ? Math.max(...existingTickets.map(t => parseInt(t.numero_ticket)))
      : 0;

    const newTickets: Ticket[] = Array.from({ length: compra.cantidad }, (_, i) => ({
      id: `ticket-${Date.now()}-${i}`,
      numero_ticket: String(maxNum + i + 1).padStart(4, '0'),
      usuario_id: compra.usuario_id,
      compra_id: compraId,
      sorteo_id: compra.sorteo_id,
    }));

    setState(s => ({
      ...s,
      compras: s.compras.map(c => c.id === compraId ? { ...c, estado_pago: 'aprobado' as EstadoPago } : c),
      tickets: [...s.tickets, ...newTickets],
    }));
  }, []);

  const rechazarPago = useCallback((compraId: string) => {
    setState(s => ({
      ...s,
      compras: s.compras.map(c => c.id === compraId ? { ...c, estado_pago: 'rechazado' as EstadoPago } : c),
    }));
  }, []);

  // ── Configuración ───────────────────────────────────────
  const actualizarConfiguracion = useCallback((data: Partial<Configuracion>) => {
    setState(s => ({ ...s, configuracion: { ...s.configuracion, ...data } }));
  }, []);

  // ── Selectors ───────────────────────────────────────────
  const getTicketsBySorteo = useCallback((sorteoId: string) =>
    globalState.tickets.filter(t => t.sorteo_id === sorteoId), []);

  const getComprasByUsuario = useCallback((usuarioId: string) =>
    globalState.compras.filter(c => c.usuario_id === usuarioId), []);

  const getTicketsByUsuario = useCallback((usuarioId: string) =>
    globalState.tickets.filter(t => t.usuario_id === usuarioId), []);

  const getSorteoById = useCallback((id: string) =>
    globalState.sorteos.find(s => s.id === id), []);

  const getUserById = useCallback((id: string) =>
    globalState.usuarios.find(u => u.id === id), []);

  return {
    // state
    ...globalState,
    // auth
    login,
    logout,
    register,
    // sorteos
    crearSorteo,
    editarSorteo,
    eliminarSorteo,
    publicarSorteo,
    ejecutarSorteo,
    // compras
    crearCompra,
    aprobarPago,
    rechazarPago,
    // config
    actualizarConfiguracion,
    // selectors
    getTicketsBySorteo,
    getComprasByUsuario,
    getTicketsByUsuario,
    getSorteoById,
    getUserById,
  };
}
