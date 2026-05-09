# ManteniPro Backend

Backend para la plataforma SaaS de gestión de mantenimiento preventivo y correctivo. Permite a múltiples empresas (tenants) gestionar clientes, equipos, peticiones de servicio y órdenes de mantenimiento.

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express 5
- **Lenguaje:** TypeScript 6
- **Base de datos:** PostgreSQL (driver `pg`, sin ORM)
- **Autenticación:** JWT con Bearer tokens (librería `jose`)
- **Hashing de passwords:** Argon2id
- **Arquitectura:** Hexagonal (Ports & Adapters)

## Estructura del proyecto

```
src/
├── config/
│   └── db.ts                          # Pool de conexión a PostgreSQL
├── domain/
│   ├── models/                        # Entidades del dominio
│   ├── dtos/                          # Data Transfer Objects
│   ├── repositories/                  # Interfaces (Ports)
│   └── services/                      # Interfaces de servicios
├── application/
│   └── use-cases/                     # Casos de uso (lógica de negocio)
└── infrastructure/
    ├── database/postgres/             # Implementaciones de repositorios
    ├── services/                      # Implementaciones de servicios
    └── http/
        ├── server.ts                  # Punto de entrada
        ├── app.ts                     # Configuración de Express
        ├── middlewares/               # Middleware de autenticación
        ├── controllers/               # Controladores HTTP
        └── routes/                    # Definición de rutas
```

## Requisitos previos

- Node.js >= 18
- PostgreSQL >= 14
- npm

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd mantenipro-back

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | — |
| `DB_NAME` | Nombre de la base de datos | `saas_maintenance_platform` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | — |

## Scripts

```bash
# Desarrollo (hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Producción
npm start
```

## Multi-tenancy

El sistema es multi-tenant. Cada request autenticado incluye el `tenantId` del usuario en el JWT. Todas las queries filtran por `tenant_id` para aislar los datos de cada organización.

El login requiere el `tenantSlug` para identificar a qué organización pertenece el usuario.

---

## API Reference

**Base URL:** `http://localhost:3000/api`

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

---

### Autenticación

#### POST `/auth/login`

Inicia sesión y obtiene un token JWT.

**Body:**
```json
{
  "tenantSlug": "mi-empresa",
  "email": "admin@empresa.com",
  "password": "contraseña123"
}
```

**Respuesta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "tenantId": 1,
    "roleId": 1,
    "name": "Admin",
    "email": "admin@empresa.com"
  }
}
```

**Errores:**
- `401` — Credenciales incorrectas

---

#### POST `/auth/register` 🔒

Registra un nuevo usuario dentro del tenant del usuario autenticado.

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "password": "contraseña123",
  "phone": "3001234567",
  "roleId": 2
}
```

**Respuesta 201:**
```json
{
  "id": 5,
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "tenantId": 1,
  "roleId": 2,
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "active": true
}
```

**Errores:**
- `400` — Validación fallida (email duplicado, contraseña corta, campos faltantes)
- `401` — No autenticado

---

### Dashboard

#### GET `/dashboard/stats` 🔒

Obtiene el panel de control con los próximos mantenimientos programados.

**Respuesta 200:**
```json
{
  "upcomingMaintenances": [
    {
      "id": 1,
      "uuid": "...",
      "scheduledDate": "2026-05-15",
      "scheduledTime": "09:00:00",
      "clientName": "Empresa ABC",
      "serviceName": "Mantenimiento preventivo",
      "operatorName": "Carlos López",
      "statusName": "Programado"
    }
  ]
}
```

---

### Clientes

#### GET `/clients` 🔒

Lista todos los clientes del tenant.

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "uuid": "...",
    "tenantId": 1,
    "clientTypeId": 1,
    "statusId": 1,
    "displayName": "Empresa ABC",
    "notes": null,
    "active": true,
    "createdByUserId": 1,
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-01T10:00:00.000Z"
  }
]
```

---

#### GET `/clients/:id` 🔒

Obtiene un cliente por ID.

**Respuesta 200:** Objeto cliente (mismo formato que arriba)

**Errores:**
- `404` — Cliente no encontrado

---

#### POST `/clients` 🔒

Crea un nuevo cliente.

**Body:**
```json
{
  "clientTypeId": 1,
  "statusId": 1,
  "displayName": "Nueva Empresa SAS",
  "notes": "Cliente referido"
}
```

**Respuesta 201:** Objeto cliente creado

---

#### PUT `/clients/:id` 🔒

Actualiza un cliente existente.

**Body (campos opcionales):**
```json
{
  "displayName": "Nombre actualizado",
  "statusId": 2,
  "notes": "Nota actualizada",
  "active": false
}
```

**Respuesta 200:** Objeto cliente actualizado

**Errores:**
- `404` — Cliente no encontrado

---

#### DELETE `/clients/:id` 🔒

Elimina un cliente.

**Respuesta 200:**
```json
{
  "message": "Cliente eliminado"
}
```

**Errores:**
- `404` — Cliente no encontrado

---

### Equipos

#### GET `/equipments` 🔒

Lista todos los equipos del tenant.

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "uuid": "...",
    "tenantId": 1,
    "clientId": 1,
    "equipmentTypeId": 1,
    "currentStatusId": 1,
    "internalCode": "EQ-001",
    "brand": "Samsung",
    "model": "Split 12000BTU",
    "serialNumber": "SN123456",
    "active": true
  }
]
```

---

#### GET `/equipments/:id` 🔒

Obtiene un equipo por ID.

**Respuesta 200:** Objeto equipo

**Errores:**
- `404` — Equipo no encontrado

---

#### POST `/equipments` 🔒

Crea un nuevo equipo.

**Body:**
```json
{
  "clientId": 1,
  "equipmentTypeId": 1,
  "currentStatusId": 1,
  "internalCode": "EQ-002",
  "brand": "LG",
  "model": "Inverter 18000BTU",
  "serialNumber": "LG-789456"
}
```

**Respuesta 201:** Objeto equipo creado

---

#### PUT `/equipments/:id` 🔒

Actualiza un equipo.

**Body (campos opcionales):**
```json
{
  "currentStatusId": 2,
  "brand": "LG",
  "model": "Nuevo modelo",
  "serialNumber": "SN-NUEVO",
  "active": false
}
```

**Respuesta 200:** Objeto equipo actualizado

**Errores:**
- `404` — Equipo no encontrado

---

#### DELETE `/equipments/:id` 🔒

Elimina un equipo.

**Respuesta 200:**
```json
{
  "message": "Equipo eliminado"
}
```

**Errores:**
- `404` — Equipo no encontrado

---

### Peticiones (Requests)

#### GET `/requests` 🔒

Lista todas las peticiones entrantes del tenant con datos enriquecidos.

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "uuid": "...",
    "consecutive": 1,
    "clientTypeName": "Empresa",
    "companyName": "Empresa ABC",
    "email": "contacto@empresa.com",
    "phone": "3001234567",
    "statusName": "Pendiente",
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
]
```

---

#### POST `/requests/:id/assign` 🔒

Asigna una petición a un operario.

**Body:**
```json
{
  "operatorUserId": 3
}
```

**Respuesta 200:**
```json
{
  "message": "Petición asignada exitosamente."
}
```

**Errores:**
- `400` — No se pudo asignar / Petición no encontrada

---

#### POST `/requests/:id/discard` 🔒

Descarta una petición con un motivo.

**Body:**
```json
{
  "reason": "Cliente no responde después de 3 intentos"
}
```

**Respuesta 200:**
```json
{
  "message": "Petición descartada exitosamente."
}
```

**Errores:**
- `400` — Motivo obligatorio / Petición no encontrada

---

### Mantenimientos

#### POST `/maintenances/orders` 🔒

Crea una nueva orden de mantenimiento.

**Body:**
```json
{
  "clientId": 1,
  "equipmentId": 2,
  "addressId": 1,
  "serviceId": 1,
  "scheduledDate": "2026-05-20",
  "scheduledTime": "10:00:00",
  "assignedUserId": 3,
  "priority": "HIGH",
  "notes": "Revisar sistema de refrigeración"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `clientId` | number | sí | ID del cliente |
| `equipmentId` | number | no | ID del equipo |
| `addressId` | number | no | ID de la dirección |
| `serviceId` | number | sí | ID del servicio del catálogo |
| `scheduledDate` | string | sí | Fecha programada (YYYY-MM-DD) |
| `scheduledTime` | string | sí | Hora programada (HH:mm:ss) |
| `assignedUserId` | number | sí | ID del operario asignado |
| `priority` | string | no | `LOW`, `MEDIUM`, `HIGH`, `URGENT` (default: `MEDIUM`) |
| `notes` | string | no | Notas del servicio |

**Respuesta 201:** Objeto orden de mantenimiento creada

---

#### POST `/maintenances/orders/:id/close` 🔒

Cierra (completa) una orden de mantenimiento. Devuelve datos enriquecidos.

**Body:**
```json
{
  "diagnostic": "Filtro obstruido",
  "workDone": "Se reemplazó filtro y se limpió sistema",
  "warrantyApplies": false,
  "warrantyDetails": null,
  "recommendations": "Revisar filtro cada 3 meses"
}
```

**Respuesta 200:**
```json
{
  "id": 1,
  "uuid": "...",
  "orderId": 5,
  "orderUuid": "...",
  "clientName": "Empresa ABC",
  "equipmentReference": "EQ-001",
  "diagnostic": "Filtro obstruido",
  "workDone": "Se reemplazó filtro y se limpió sistema",
  "warrantyApplies": false,
  "completedAt": "2026-05-20T15:30:00.000Z"
}
```

**Errores:**
- `400` — Orden no encontrada

---

### Health Check

#### GET `/health`

Verifica que el servidor esté funcionando.

**Respuesta 200:**
```json
{
  "status": "OK"
}
```

---

## Seguridad

- Las contraseñas se almacenan con **Argon2id** (64MB memoria, 3 iteraciones, 4 hilos paralelos)
- Los tokens JWT expiran en **8 horas**
- Todas las rutas protegidas validan el token y extraen el `tenantId` para aislamiento de datos
- El registro de usuarios solo es accesible por usuarios ya autenticados

## Licencia

ISC
