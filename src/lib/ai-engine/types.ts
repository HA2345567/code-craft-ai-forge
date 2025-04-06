/**
 * Type for the AI engine framework selection
 */
export type FrameworkType = 
  'Express' | 
  'NestJS' | 
  'Fastify' | 
  'Koa' | 
  'Hapi' | 
  'Django' | 
  'Flask' | 
  'FastAPI' | 
  'Spring Boot' | 
  'Laravel';

/**
 * Type for the AI engine database selection
 */
export type DatabaseType = 
  'PostgreSQL' | 
  'MySQL' | 
  'MongoDB' | 
  'SQLite' | 
  'Redis' | 
  'DynamoDB' | 
  'Firestore' |
  'Supabase';

/**
 * Type for the AI engine authentication strategy selection
 */
export type AuthStrategy = 
  'JWT' | 
  'OAuth2' | 
  'Session' | 
  'Basic' | 
  'API Key' | 
  'Passport' | 
  'Auth0' | 
  'Firebase Auth' |
  'Clerk';

/**
 * Type for the AI engine field types
 */
export type FieldType = 
  'string' | 
  'number' | 
  'boolean' | 
  'date' | 
  'array' | 
  'object' | 
  'id' |
  'email' |
  'password' |
  'richtext' |
  'uuid' |
  'json';

/**
 * Type for the AI engine relationship types
 */
export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';

/**
 * Type for the AI engine input
 */
export interface AIEngineInput {
  name: string;
  description: string;
  framework: FrameworkType;
  database: DatabaseType;
  authentication: AuthStrategy;
  entities: Entity[];
  endpoints: Endpoint[];
  relationships: Relationship[];
}

/**
 * Type for the AI engine output
 */
export interface AIEngineOutput {
  code: string;
  message?: string;
  success: boolean;
}

/**
 * Type for the AI engine entity
 */
export interface Entity {
  name: string;
  description?: string;
  fields: Field[];
}

/**
 * Type for the AI engine field
 */
export interface Field {
  name: string;
  type: FieldType;
  description?: string;
  required: boolean;
  unique?: boolean;
  default?: any;
  validation?: Validation[];
}

/**
 * Type for the AI engine validation
 */
export interface Validation {
  type: string;
  value?: any;
  message?: string;
}

/**
 * Type for the AI engine endpoint
 */
export interface Endpoint {
  name: string;
  description?: string;
  method: string;
  path: string;
  input?: string;
  output?: string;
}

/**
 * Type for the AI engine relationship
 */
export interface Relationship {
  type: RelationshipType;
  source: string;
  target: string;
  description?: string;
}
