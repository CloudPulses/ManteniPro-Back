import { OpenAPIV3 } from '../../../types/openapi';

export const swaggerDocument: OpenAPIV3 = {
  openapi: '3.0.3',
  info: {
    title: 'ManteniPro API',
    version: '1.0.0',
    description: 'API para la plataforma SaaS de gestión de mantenimiento. Multi-tenant con JWT.',
    contact: {
      name: 'ManteniPro',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['tenantSlug', 'email', 'password'],
        properties: {
          tenantSlug: { type: 'string', example: 'mi-empresa' },
          email: { type: 'string', format: 'email', example: 'admin@empresa.com' },
          password: { type: 'string', example: 'contraseña123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              uuid: { type: 'string', format: 'uuid' },
              tenantId: { type: 'integer', example: 1 },
              roleId: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Admin' },
              email: { type: 'string', example: 'admin@empresa.com' },
            },
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['tenantSlug', 'name', 'email', 'password', 'roleId'],
        properties: {
          tenantSlug: { type: 'string', example: 'mi-empresa' },
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', format: 'email', example: 'juan@empresa.com' },
          password: { type: 'string', minLength: 8, example: 'contraseña123' },
          phone: { type: 'string', example: '3001234567' },
          roleId: { type: 'integer', example: 2 },
        },
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          tenantId: { type: 'integer' },
          roleId: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          active: { type: 'boolean' },
        },
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          tenantId: { type: 'integer' },
          clientTypeId: { type: 'integer' },
          statusId: { type: 'integer' },
          displayName: { type: 'string' },
          notes: { type: 'string', nullable: true },
          active: { type: 'boolean' },
          createdByUserId: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateClientRequest: {
        type: 'object',
        required: ['clientTypeId', 'statusId', 'displayName'],
        properties: {
          clientTypeId: { type: 'integer', example: 1 },
          statusId: { type: 'integer', example: 1 },
          displayName: { type: 'string', example: 'Empresa ABC SAS' },
          notes: { type: 'string', example: 'Cliente referido' },
        },
      },
      UpdateClientRequest: {
        type: 'object',
        properties: {
          clientTypeId: { type: 'integer' },
          statusId: { type: 'integer' },
          displayName: { type: 'string' },
          notes: { type: 'string' },
          active: { type: 'boolean' },
        },
      },
      Equipment: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          tenantId: { type: 'integer' },
          clientId: { type: 'integer' },
          equipmentTypeId: { type: 'integer' },
          currentStatusId: { type: 'integer' },
          internalCode: { type: 'string', example: 'EQ-001' },
          brand: { type: 'string', nullable: true, example: 'Samsung' },
          model: { type: 'string', nullable: true, example: 'Split 12000BTU' },
          serialNumber: { type: 'string', nullable: true, example: 'SN123456' },
          active: { type: 'boolean' },
        },
      },
      CreateEquipmentRequest: {
        type: 'object',
        required: ['clientId', 'equipmentTypeId', 'currentStatusId', 'internalCode'],
        properties: {
          clientId: { type: 'integer', example: 1 },
          equipmentTypeId: { type: 'integer', example: 1 },
          currentStatusId: { type: 'integer', example: 1 },
          internalCode: { type: 'string', example: 'EQ-002' },
          brand: { type: 'string', example: 'LG' },
          model: { type: 'string', example: 'Inverter 18000BTU' },
          serialNumber: { type: 'string', example: 'LG-789456' },
        },
      },
      UpdateEquipmentRequest: {
        type: 'object',
        properties: {
          currentStatusId: { type: 'integer' },
          brand: { type: 'string' },
          model: { type: 'string' },
          serialNumber: { type: 'string' },
          active: { type: 'boolean' },
        },
      },
      RequestListItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          consecutive: { type: 'integer' },
          clientTypeName: { type: 'string', example: 'Empresa' },
          companyName: { type: 'string', example: 'Empresa ABC' },
          email: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          statusName: { type: 'string', example: 'Pendiente' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AssignRequestBody: {
        type: 'object',
        required: ['operatorUserId'],
        properties: {
          operatorUserId: { type: 'integer', example: 3 },
        },
      },
      DiscardRequestBody: {
        type: 'object',
        required: ['reason'],
        properties: {
          reason: { type: 'string', example: 'Cliente no responde después de 3 intentos' },
        },
      },
      CreateMaintenanceOrderRequest: {
        type: 'object',
        required: ['clientId', 'serviceId', 'scheduledDate', 'scheduledTime', 'assignedUserId'],
        properties: {
          clientId: { type: 'integer', example: 1 },
          equipmentId: { type: 'integer', example: 2 },
          addressId: { type: 'integer', example: 1 },
          serviceId: { type: 'integer', example: 1 },
          scheduledDate: { type: 'string', format: 'date', example: '2026-05-20' },
          scheduledTime: { type: 'string', example: '10:00:00' },
          assignedUserId: { type: 'integer', example: 3 },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
          notes: { type: 'string', example: 'Revisar sistema de refrigeración' },
        },
      },
      MaintenanceOrder: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          tenantId: { type: 'integer' },
          clientId: { type: 'integer' },
          equipmentId: { type: 'integer', nullable: true },
          serviceId: { type: 'integer' },
          scheduledDate: { type: 'string', format: 'date' },
          scheduledTime: { type: 'string' },
          assignedUserId: { type: 'integer' },
          statusId: { type: 'integer' },
          notes: { type: 'string', nullable: true },
        },
      },
      CloseMaintenanceRequest: {
        type: 'object',
        required: ['workDone'],
        properties: {
          diagnostic: { type: 'string', example: 'Filtro obstruido' },
          workDone: { type: 'string', example: 'Se reemplazó filtro y se limpió sistema' },
          warrantyApplies: { type: 'boolean', default: false },
          warrantyDetails: { type: 'string', nullable: true },
          recommendations: { type: 'string', example: 'Revisar filtro cada 3 meses' },
        },
      },
      CloseMaintenanceResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          uuid: { type: 'string', format: 'uuid' },
          orderId: { type: 'integer' },
          orderUuid: { type: 'string', format: 'uuid' },
          clientName: { type: 'string', example: 'Empresa ABC' },
          equipmentReference: { type: 'string', nullable: true, example: 'EQ-001' },
          diagnostic: { type: 'string', nullable: true },
          workDone: { type: 'string' },
          warrantyApplies: { type: 'boolean' },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      DashboardStats: {
        type: 'object',
        properties: {
          upcomingMaintenances: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                uuid: { type: 'string', format: 'uuid' },
                scheduledDate: { type: 'string', format: 'date' },
                scheduledTime: { type: 'string', example: '09:00:00' },
                clientName: { type: 'string' },
                serviceName: { type: 'string' },
                operatorName: { type: 'string' },
                statusName: { type: 'string' },
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description: 'Autentica un usuario y devuelve un token JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login exitoso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          '401': {
            description: 'Credenciales incorrectas',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar usuario',
        description: 'Crea un nuevo usuario en el tenant identificado por tenantSlug. Ruta pública.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario creado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterResponse' } } },
          },
          '400': {
            description: 'Error de validación',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Obtener panel de control',
        description: 'Devuelve los próximos mantenimientos programados con hora, cliente, servicio, operario y estado.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Estadísticas del dashboard',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/DashboardStats' } } },
          },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/clients': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        description: 'Obtiene todos los clientes del tenant.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de clientes',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Client' } } } },
          },
          '401': { description: 'No autenticado' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Crear cliente',
        description: 'Crea un nuevo cliente en el tenant.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClientRequest' } } },
        },
        responses: {
          '201': {
            description: 'Cliente creado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } },
          },
          '400': { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/clients/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Obtener cliente por ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Cliente encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } } },
          '404': { description: 'Cliente no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Actualizar cliente',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClientRequest' } } },
        },
        responses: {
          '200': { description: 'Cliente actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } } },
          '400': { description: 'Error de validación' },
          '404': { description: 'Cliente no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Eliminar cliente',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Cliente eliminado' },
          '404': { description: 'Cliente no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/equipments': {
      get: {
        tags: ['Equipos'],
        summary: 'Listar equipos',
        description: 'Obtiene todos los equipos del tenant.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de equipos',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Equipment' } } } },
          },
          '401': { description: 'No autenticado' },
        },
      },
      post: {
        tags: ['Equipos'],
        summary: 'Crear equipo',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEquipmentRequest' } } },
        },
        responses: {
          '201': { description: 'Equipo creado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Equipment' } } } },
          '400': { description: 'Error de validación' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/equipments/{id}': {
      get: {
        tags: ['Equipos'],
        summary: 'Obtener equipo por ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Equipo encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Equipment' } } } },
          '404': { description: 'Equipo no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
      put: {
        tags: ['Equipos'],
        summary: 'Actualizar equipo',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateEquipmentRequest' } } },
        },
        responses: {
          '200': { description: 'Equipo actualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Equipment' } } } },
          '404': { description: 'Equipo no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
      delete: {
        tags: ['Equipos'],
        summary: 'Eliminar equipo',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'Equipo eliminado' },
          '404': { description: 'Equipo no encontrado' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/requests': {
      get: {
        tags: ['Peticiones'],
        summary: 'Listar peticiones',
        description: 'Obtiene todas las peticiones entrantes con tipo de cliente, consecutivo, empresa, email, teléfono y estado.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de peticiones',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/RequestListItem' } } } },
          },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/requests/{id}/assign': {
      post: {
        tags: ['Peticiones'],
        summary: 'Asignar petición',
        description: 'Asigna una petición a un operario.',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignRequestBody' } } },
        },
        responses: {
          '200': { description: 'Petición asignada exitosamente' },
          '400': { description: 'Error al asignar' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/requests/{id}/discard': {
      post: {
        tags: ['Peticiones'],
        summary: 'Descartar petición',
        description: 'Descarta una petición con un motivo obligatorio.',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/DiscardRequestBody' } } },
        },
        responses: {
          '200': { description: 'Petición descartada exitosamente' },
          '400': { description: 'Error al descartar' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/maintenances/orders': {
      post: {
        tags: ['Mantenimientos'],
        summary: 'Crear orden de mantenimiento',
        description: 'Crea una nueva orden con cliente, equipo/dirección, fecha, hora, operario y notas.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateMaintenanceOrderRequest' } } },
        },
        responses: {
          '201': { description: 'Orden creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/MaintenanceOrder' } } } },
          '400': { description: 'Error de validación' },
          '401': { description: 'No autenticado' },
        },
      },
    },
    '/maintenances/orders/{id}/close': {
      post: {
        tags: ['Mantenimientos'],
        summary: 'Cerrar orden de mantenimiento',
        description: 'Completa una orden y devuelve consecutivo, cliente y referencia del equipo.',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CloseMaintenanceRequest' } } },
        },
        responses: {
          '200': { description: 'Orden cerrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/CloseMaintenanceResponse' } } } },
          '400': { description: 'Orden no encontrada' },
          '401': { description: 'No autenticado' },
        },
      },
    },
  },
  tags: [
    { name: 'Autenticación', description: 'Login y registro de usuarios' },
    { name: 'Dashboard', description: 'Panel de control' },
    { name: 'Clientes', description: 'Gestión de clientes (CRUD)' },
    { name: 'Equipos', description: 'Gestión de equipos (CRUD)' },
    { name: 'Peticiones', description: 'Gestión de peticiones entrantes' },
    { name: 'Mantenimientos', description: 'Órdenes de mantenimiento' },
  ],
};
