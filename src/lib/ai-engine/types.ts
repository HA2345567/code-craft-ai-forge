/**
 * Types for AI Engine that powers code generation
 */

// Input specification for the AI Engine
export interface AIEngineInput {
  projectName: string;
  description: string;
  framework: BackendFramework;
  database: DatabaseType;
  apiStyle: APIStyle;
  dataModels: DataModel[];
  features: Feature[];
  deployment?: DeploymentTarget;
}

// Output from the AI Engine
export interface AIEngineOutput {
  files: GeneratedFile[];
  explanation: string;
  dependencies: Dependency[];
  setupInstructions: string[];
  apiDocs: APIDocumentation;
  generatedAt: Date;
}

export type BackendFramework = 
  | 'express' 
  | 'nestjs' 
  | 'fastapi' 
  | 'django'
  | 'rails'
  | 'spring';

export type DatabaseType = 
  | 'PostgreSQL' 
  | 'MySQL' 
  | 'MongoDB' 
  | 'SQLite' 
  | 'Redis' 
  | 'DynamoDB' 
  | 'Firestore'
  | 'Supabase';

export type APIStyle = 
  | 'rest' 
  | 'graphql' 
  | 'grpc';

export type DeploymentTarget = 
  | 'aws' 
  | 'gcp' 
  | 'azure' 
  | 'vercel' 
  | 'heroku' 
  | 'digital-ocean'
  | 'docker';

export interface DataModel {
  name: string;
  tableName?: string;
  fields: DataModelField[];
  relationships: Relationship[];
  timestamps: boolean;
  softDeletes: boolean;
}

export interface DataModelField {
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  default?: any;
  validations: Validation[];
}

export type FieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'object'
  | 'array'
  | 'enum'
  | 'id';

export interface Validation {
  type: 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'enum';
  value: any;
}

export interface Relationship {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany';
  model: string;
  foreignKey?: string;
  throughModel?: string; // For many-to-many relationships
}

export type Feature = 
  | 'authentication' 
  | 'authorization' 
  | 'fileUpload' 
  | 'email' 
  | 'logging'
  | 'caching'
  | 'testing'
  | 'swagger'
  | 'websockets';

export interface GeneratedCode {
  files: CodeFile[];
  entryPoint: string;
  packageJson?: Record<string, any>;
  requirements?: string[]; // For Python projects
  gemfile?: string[]; // For Ruby projects
}

export interface CodeFile {
  path: string;
  content: string;
  language: 'javascript' | 'typescript' | 'python' | 'ruby' | 'java' | 'yaml' | 'json' | 'other';
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  authenticated: boolean;
  requestBody?: any;
  responseBody?: any;
  queryParams?: any;
  pathParams?: any;
}

export interface GeneratedDataModel {
  name: string;
  schema: string;
  migrations?: string;
}

export interface Documentation {
  overview: string;
  setup: string;
  endpoints: APIEndpointDoc[];
  models: ModelDoc[];
}

export interface APIEndpointDoc {
  path: string;
  method: string;
  description: string;
  request?: any;
  response?: any;
}

export interface ModelDoc {
  name: string;
  description: string;
  fields: { name: string; type: string; description: string }[];
}

export interface DeploymentConfiguration {
  type: DeploymentTarget;
  config: Record<string, any>;
  instructions: string;
}

// Represents a technology/framework option for the backend
export type BackendTechnology = {
  id: string;
  name: string;
  description: string;
  category: 'framework' | 'database' | 'authentication' | 'cache' | 'queue' | 'other';
  icon?: string;
  documentation?: string;
  popularity?: number; // 1-10 rating
};

// Framework types that can be selected
export type FrameworkType = 
  | 'Express' 
  | 'NestJS' 
  | 'Fastify' 
  | 'Koa' 
  | 'Hapi' 
  | 'Django' 
  | 'Flask' 
  | 'FastAPI' 
  | 'Spring Boot' 
  | 'Laravel';

// Authentication strategies
export type AuthStrategy = 
  | 'JWT' 
  | 'OAuth2' 
  | 'Session' 
  | 'Basic' 
  | 'API Key' 
  | 'Passport' 
  | 'Auth0' 
  | 'Firebase Auth'
  | 'Clerk';

// API specification - what the user wants to build
export interface APISpecification {
  name: string;
  description: string;
  framework: FrameworkType;
  database: DatabaseType;
  authentication: AuthStrategy;
  entities: EntityDefinition[];
  endpoints: EndpointDefinition[];
  relationships: RelationshipDefinition[];
  securityRequirements?: SecurityRequirement[];
  additionalFeatures?: AdditionalFeature[];
}

// Entity (database model) definition
export interface EntityDefinition {
  name: string;
  description: string;
  fields: FieldDefinition[];
  timestamps?: boolean;
  softDelete?: boolean;
}

// Field of an entity
export interface FieldDefinition {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
}

// Validation rules for fields
export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'enum' | 'custom';
  value: any;
  message?: string;
}

// API endpoint definition
export interface EndpointDefinition {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  handler: string;
  requestBody?: RequestBodyDefinition;
  parameters?: ParameterDefinition[];
  responses: ResponseDefinition[];
  security?: string[];
  rateLimit?: RateLimitDefinition;
  middleware?: string[];
}

// Request body definition
export interface RequestBodyDefinition {
  contentType: 'application/json' | 'multipart/form-data' | 'application/x-www-form-urlencoded';
  schema: any;
  description?: string;
}

// Parameter definition (path, query, header)
export interface ParameterDefinition {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  type: string;
  description?: string;
}

// Response definition
export interface ResponseDefinition {
  statusCode: number;
  description: string;
  schema?: any;
}

// Rate limiting definition
export interface RateLimitDefinition {
  limit: number;
  window: string; // e.g., '1m', '1h', '1d'
}

// Relationship between entities
export interface RelationshipDefinition {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  source: string;
  target: string;
  sourceProperty: string;
  targetProperty: string;
  description?: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

// Security requirement
export interface SecurityRequirement {
  type: 'JWT' | 'API Key' | 'OAuth2' | 'Basic';
  description: string;
  scopes?: string[];
}

// Additional feature requests
export interface AdditionalFeature {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// Generated file from the AI engine
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'code' | 'config' | 'documentation';
  language: string;
  description?: string;
}

// Dependency information
export interface Dependency {
  name: string;
  version: string;
  type: 'production' | 'development';
}

// API documentation
export interface APIDocumentation {
  overview: string;
  models: any;
  title: string;
  description: string;
  version: string;
  endpoints: EndpointDocumentation[];
}

// Documentation for an API endpoint
export interface EndpointDocumentation {
  path: string;
  method: string;
  description: string;
  requestExample?: string;
  responseExample?: string;
  parameters?: ParameterDocumentation[];
}

// Parameter documentation
export interface ParameterDocumentation {
  name: string;
  description: string;
  type: string;
  required: boolean;
  example?: string;
}

// AI Engine service configuration
export interface AIEngineConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  enableCustomizations: boolean;
  templateLibrary: boolean;
}

// AI request status
export type AIRequestStatus = 
  | 'idle' 
  | 'preparing' 
  | 'generating' 
  | 'succeeded' 
  | 'failed';

// AI generation progress
export interface AIGenerationProgress {
  status: AIRequestStatus;
  step: string;
  percentComplete: number;
  currentTask?: string;
  estimatedTimeRemaining?: number;
} 