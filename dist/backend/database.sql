-- ============================================================
-- MaykerBike - Script SQL de Base de Datos
-- Compatible con MySQL 8.0+
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS maykerbike
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE maykerbike;

-- ============================================================
-- Tabla: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    correo      VARCHAR(200) NOT NULL UNIQUE,
    contrasena  VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
    rol         ENUM('admin','user') NOT NULL DEFAULT 'user',
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo      TINYINT(1) NOT NULL DEFAULT 1,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Usuarios registrados en la plataforma';

-- ============================================================
-- Tabla: sorteos
-- ============================================================
CREATE TABLE IF NOT EXISTS sorteos (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_producto     VARCHAR(250) NOT NULL,
    descripcion         TEXT,
    imagen              VARCHAR(500) COMMENT 'Ruta relativa al archivo subido',
    precio_ticket       DECIMAL(10,2) NOT NULL,
    cantidad_tickets    INT UNSIGNED NOT NULL DEFAULT 100,
    fecha_sorteo        DATETIME NOT NULL,
    estado              ENUM('borrador','activo','finalizado','cancelado') NOT NULL DEFAULT 'borrador',
    ganador_ticket      VARCHAR(10) NULL COMMENT 'Número del ticket ganador',
    ganador_usuario_id  INT UNSIGNED NULL,
    fecha_creacion      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_fecha_sorteo (fecha_sorteo),
    FOREIGN KEY (ganador_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Sorteos de productos para motocicletas';

-- ============================================================
-- Tabla: compras
-- ============================================================
CREATE TABLE IF NOT EXISTS compras (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT UNSIGNED NOT NULL,
    sorteo_id       INT UNSIGNED NOT NULL,
    cantidad        INT UNSIGNED NOT NULL DEFAULT 1,
    monto           DECIMAL(10,2) NOT NULL,
    estado_pago     ENUM('pendiente','aprobado','rechazado') NOT NULL DEFAULT 'pendiente',
    comprobante     VARCHAR(500) NULL COMMENT 'Ruta al comprobante de pago Yape',
    fecha           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario_id),
    INDEX idx_sorteo (sorteo_id),
    INDEX idx_estado_pago (estado_pago),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (sorteo_id) REFERENCES sorteos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Compras de tickets realizadas por usuarios';

-- ============================================================
-- Tabla: tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_ticket   VARCHAR(10) NOT NULL,
    usuario_id      INT UNSIGNED NOT NULL,
    compra_id       INT UNSIGNED NOT NULL,
    sorteo_id       INT UNSIGNED NOT NULL,
    fecha_asignacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_ticket_sorteo (numero_ticket, sorteo_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_sorteo (sorteo_id),
    INDEX idx_compra (compra_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (sorteo_id) REFERENCES sorteos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tickets asignados a usuarios por sorteo';

-- ============================================================
-- Tabla: configuracion
-- ============================================================
CREATE TABLE IF NOT EXISTS configuracion (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clave           VARCHAR(100) NOT NULL UNIQUE,
    valor           TEXT NOT NULL,
    descripcion     VARCHAR(255) NULL,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Configuración general del sistema';

-- ============================================================
-- Datos iniciales
-- ============================================================

-- Administrador por defecto
-- Contraseña: mayker2026 (hash bcrypt)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Administrador', 'admin@maykerbike.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTL0KRo0cMJ7Pv6vVxZk9vXaRm', 'admin');

-- Configuración inicial de Yape
INSERT INTO configuracion (clave, valor, descripcion) VALUES
('numero_yape', '999-888-777', 'Número de celular de Yape para recibir pagos'),
('titular_yape', 'MaykerBike Oficial', 'Nombre del titular de la cuenta Yape'),
('sitio_nombre', 'MaykerBike', 'Nombre del sitio web'),
('sitio_email', 'contacto@maykerbike.com', 'Email de contacto del sitio'),
('tickets_max_por_compra', '20', 'Máximo de tickets que puede comprar un usuario por sorteo'),
('moneda', 'S/', 'Símbolo de moneda');

-- Sorteo de ejemplo
INSERT INTO sorteos (nombre_producto, descripcion, imagen, precio_ticket, cantidad_tickets, fecha_sorteo, estado) VALUES
('Casco Racing Pro X1',
 'Casco de alto rendimiento con certificación ECE 22.06, ventilación avanzada, visera anti-arañazos y sistema de liberación de emergencia.',
 'uploads/productos/casco-racing-pro.jpg',
 10.00, 100,
 DATE_ADD(NOW(), INTERVAL 30 DAY),
 'activo');
