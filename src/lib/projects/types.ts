
import { AIEngineInput, AIEngineOutput } from '@/lib/ai-engine/types';

/**
 * Project representing a backend API generation project
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lastDeployment?: DeploymentStatus;
  
  // AI generation inputs and outputs
  specification?: AIEngineInput;
  generatedOutput?: AIEngineOutput;
  
  // Project settings and metadata
  tags?: string[];
  isPublic?: boolean;
  collaborators?: string[];
  version: number;
  versionHistory?: ProjectVersion[];
  
  // Tech stack information (extracted from specification)
  framework?: string;
  database?: string;
  authentication?: string;
  entities?: Entity[];
}

/**
 * Entity representing a data model
 */
export interface Entity {
  name: string;
  description?: string;
  fields: Field[];
}

/**
 * Field representing a property in a data model
 */
export interface Field {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  default?: any;
  description?: string;
}

/**
 * Project version for tracking changes to a project
 */
export interface ProjectVersion {
  version: number;
  createdAt: string;
  description: string;
  specification: AIEngineInput;
  generatedOutput?: AIEngineOutput;
  snapshot?: string; // JSON stringified version of the project at this point
}

/**
 * Project filter options for listing projects
 */
export interface ProjectFilter {
  search?: string;
  tags?: string[];
  framework?: string;
  database?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Project creation parameters
 */
export interface CreateProjectParams {
  name: string;
  description: string;
  specification?: AIEngineInput;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * Project update parameters
 */
export interface UpdateProjectParams {
  name?: string;
  description?: string;
  specification?: AIEngineInput;
  tags?: string[];
  isPublic?: boolean;
  generatedOutput?: AIEngineOutput;
  lastDeployment?: DeploymentStatus;
  entities?: Entity[];
  framework?: string;
  database?: string;
  authentication?: string;
}

/**
 * Project collaboration roles
 */
export type ProjectRole = 'owner' | 'editor' | 'viewer';

/**
 * Project collaborator information
 */
export interface ProjectCollaborator {
  userId: string;
  role: ProjectRole;
  addedAt: string;
}

/**
 * Deployment status information
 */
export interface DeploymentStatus {
  status: 'pending' | 'building' | 'deployed' | 'published' | 'failed';
  url?: string;
  provider?: string;
  name?: string;
  config?: Record<string, any>;
  timestamp: string;
  error?: string;
}
