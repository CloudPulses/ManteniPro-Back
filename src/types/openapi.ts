/**
 * Tipo simplificado de OpenAPI 3.0 para tipar la especificación sin
 * necesidad de instalar paquetes externos de tipos.
 */
export interface OpenAPIV3 {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: { name?: string; email?: string; url?: string };
  };
  servers?: Array<{ url: string; description?: string }>;
  components?: Record<string, any>;
  paths: Record<string, any>;
  tags?: Array<{ name: string; description?: string }>;
}
