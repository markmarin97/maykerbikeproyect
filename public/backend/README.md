# MaykerBike - Backend PHP/MySQL

## Estructura del proyecto backend (PHP MVC + MySQL)

Este archivo describe la arquitectura completa del backend para producción.

---

## Estructura de carpetas

```
maykerbike/
├── config/
│   └── database.php          # Configuración de la base de datos
├── controllers/
│   ├── AuthController.php    # Login, registro, logout
│   ├── SorteoController.php  # CRUD sorteos
│   ├── CompraController.php  # Gestión de compras
│   ├── TicketController.php  # Gestión de tickets
│   ├── AdminController.php   # Panel administrativo
│   └── ConfigController.php  # Configuración Yape
├── models/
│   ├── Usuario.php           # Modelo de usuarios
│   ├── Sorteo.php            # Modelo de sorteos
│   ├── Compra.php            # Modelo de compras
│   ├── Ticket.php            # Modelo de tickets
│   └── Configuracion.php     # Modelo configuración
├── views/
│   ├── layout/
│   │   ├── header.php
│   │   └── footer.php
│   ├── auth/
│   │   ├── login.php
│   │   └── registro.php
│   ├── sorteos/
│   │   ├── index.php
│   │   └── detalle.php
│   ├── admin/
│   │   ├── dashboard.php
│   │   ├── sorteos.php
│   │   ├── pagos.php
│   │   ├── usuarios.php
│   │   └── configuracion.php
│   └── usuario/
│       └── panel.php
├── uploads/
│   ├── productos/            # Imágenes de productos
│   └── comprobantes/         # Comprobantes de pago
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── .htaccess                 # URL rewriting
├── index.php                 # Entry point
└── database.sql              # Script SQL completo
```

## Credenciales de administrador

- Usuario: Admin  
- Email: admin@maykerbike.com  
- Contraseña: mayker2026

**IMPORTANTE**: Cambiar las credenciales en producción.

## Requisitos del servidor

- PHP 8.0+
- MySQL 8.0+
- Apache con mod_rewrite
- Extensiones PHP: pdo, pdo_mysql, gd, fileinfo

## Configuración

1. Importar `database.sql` en MySQL
2. Configurar `config/database.php` con los datos de tu servidor
3. Configurar permisos de escritura en `/uploads/`
4. Apuntar el DocumentRoot de Apache a `/public/`
