// ============================================================
// MaykerBike - Type Definitions
// ============================================================

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: UserRole;
  fecha_registro: string;
}

export type SorteoEstado = 'borrador' | 'activo' | 'finalizado' | 'cancelado';

export interface Sorteo {
  id: string;
  nombre_producto: string;
  descripcion: string;
  imagen: string; // base64 or URL
  precio_ticket: number;
  cantidad_tickets: number;
  fecha_sorteo: string;
  estado: SorteoEstado;
  ganador_ticket?: string;
  ganador_usuario_id?: string;
  fecha_creacion: string;
}

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado';

export interface Compra {
  id: string;
  usuario_id: string;
  sorteo_id: string;
  cantidad: number;
  monto: number;
  estado_pago: EstadoPago;
  fecha: string;
  comprobante?: string; // base64 image
}

export interface Ticket {
  id: string;
  numero_ticket: string;
  usuario_id: string;
  compra_id: string;
  sorteo_id: string;
}

export interface Configuracion {
  id: string;
  numero_yape: string;
  titular_yape: string;
}

export interface AppState {
  usuarios: User[];
  sorteos: Sorteo[];
  compras: Compra[];
  tickets: Ticket[];
  configuracion: Configuracion;
  currentUser: User | null;
}
