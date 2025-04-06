
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
  'Laravel' |
  'express' |  // lowercase versions for compatibility
  'nestjs' | 
  'fastapi' |
  'django' |
  'rails' |
  'spring';

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
  'Supabase' |
  // Lowercase versions for compatibility
  'mongodb' |
  'postgresql' |
  'mysql' |
  'sqlite';

/**
 * Type for the API style
 */
export type APIStyle = 'rest' | 'graphql' | 'grpc';

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
 * Type for field validation
 */
export interface Validation {
  type: string;
  value?: any;
  message?: string;
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
  validations?: Validation[];
}

/**
 * Type for API endpoint
 */
export interface Endpoint {
  name: string;
  description?: string;
  method: string;
  path: string;
  input?: string;
  output?: string;
  authenticated?: boolean;
  requestBody?: any;
  responseBody?: any;
  pathParams?: any;
}

/**
 * Type for API Documentation
 */
export interface EndpointDocumentation {
  path: string;
  method: string;
  description: string;
  requestExample?: string;
  responseExample?: string;
}

/**
 * Type for API Documentation
 */
export interface APIDocumentation {
  title: string;
  description: string;
  version: string;
  endpoints?: EndpointDocumentation[];
  overview: string;
  models?: any[];
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

/**
 * Type for the code file
 */
export interface CodeFile {
  path: string;
  content: string;
  language: 'javascript' | 'typescript' | 'python' | 'ruby' | 'java' | 'yaml' | 'json' | 'other';
}

/**
 * Type for the generated file
 */
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'code' | 'config' | 'documentation';
  language: string;
  description: string;
}

/**
 * Type for the dependency
 */
export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
}

/**
 * Type for data model
 */
export interface DataModel {
  name: string;
  tableName?: string;
  fields: Field[];
  relationships?: Relationship[];
  timestamps?: boolean;
  softDeletes?: boolean;
}

/**
 * Type for feature
 */
export type Feature = 'authentication' | 'fileUpload' | 'logging' | 'swagger' | 'testing' | 'docker' | 'cicd' | 'monitoring';

/**
 * Type for backend framework
 */
export type BackendFramework = 'express' | 'nestjs' | 'fastapi' | 'django' | 'rails' | 'spring';

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
  // Additional fields used in the app
  projectName?: string;
  apiStyle?: APIStyle;
  features?: Feature[];
  dataModels?: DataModel[];
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
 * Type for the AI engine output
 */
export interface AIEngineOutput {
  code: string;
  message?: string;
  success: boolean;
  // Additional fields used in the app
  files?: GeneratedFile[] | CodeFile[];
  explanation?: string;
  dependencies?: Dependency[];
  setupInstructions?: string[];
  apiDocs?: APIDocumentation;
  generatedAt?: Date;
}
