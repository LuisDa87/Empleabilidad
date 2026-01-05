import swaggerJsdoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'Empleabilidad API',
    version: '1.0.0',
    description: 'API para gestión de vacantes y postulaciones (Riwi). Requiere JWT y x-api-key en los endpoints protegidos.',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Coder Demo' },
          email: { type: 'string', example: 'coder@riwi.com' },
          password: { type: 'string', example: 'coder123' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'coder@riwi.com' },
          password: { type: 'string', example: 'coder123' },
        },
      },
      VacancyInput: {
        type: 'object',
        required: [
          'title',
          'description',
          'technologies',
          'seniority',
          'softSkills',
          'location',
          'modality',
          'salaryRange',
          'company',
          'maxApplicants',
        ],
        properties: {
          title: { type: 'string', example: 'Backend Developer Node.js' },
          description: { type: 'string', example: 'Construir APIs y mantener servicios existentes.' },
          technologies: { type: 'string', example: 'Node.js, NestJS, PostgreSQL' },
          seniority: { type: 'string', example: 'Mid' },
          softSkills: { type: 'string', example: 'Comunicación, trabajo en equipo' },
          location: { type: 'string', example: 'Medellín' },
          modality: { type: 'string', enum: ['remoto', 'hibrido', 'presencial'], example: 'remoto' },
          salaryRange: { type: 'string', example: '6M - 8M COP' },
          company: { type: 'string', example: 'Riwi Partner' },
          maxApplicants: { type: 'integer', example: 5 },
        },
      },
      ApplyInput: {
        type: 'object',
        required: ['vacancyId'],
        properties: {
          vacancyId: { type: 'string', example: 'uuid-de-vacante' },
        },
      },
    },
  },
  security: [{ bearerAuth: [], ApiKeyAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registro de coder (rol por defecto coder)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          201: { description: 'Usuario creado' },
          400: { description: 'Error de validación' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login con email y password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          200: { description: 'Tokens emitidos' },
          400: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/api/vacancies': {
      get: {
        tags: ['Vacancies'],
        summary: 'Listar vacantes disponibles',
        responses: { 200: { description: 'Listado de vacantes' } },
        security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      },
      post: {
        tags: ['Vacancies'],
        summary: 'Crear vacante (admin/gestor)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/VacancyInput' } } } },
        responses: { 201: { description: 'Vacante creada' }, 400: { description: 'Error de validación' } },
        security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      },
    },
    '/api/vacancies/{id}/max-applicants': {
      patch: {
        tags: ['Vacancies'],
        summary: 'Actualizar cupo máximo (admin/gestor)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { maxApplicants: { type: 'integer', example: 8 } } } } },
        },
        responses: { 200: { description: 'Vacante actualizada' }, 400: { description: 'Error' } },
        security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      },
    },
    '/api/applications': {
      post: {
        tags: ['Applications'],
        summary: 'Postularse a una vacante (coder)',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplyInput' } } } },
        responses: { 201: { description: 'Postulación creada' }, 400: { description: 'Regla de negocio' } },
        security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      },
      get: {
        tags: ['Applications'],
        summary: 'Listar postulaciones (admin/gestor)',
        responses: { 200: { description: 'Listado de postulaciones' } },
        security: [{ bearerAuth: [], ApiKeyAuth: [] }],
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({ definition, apis: [] });
