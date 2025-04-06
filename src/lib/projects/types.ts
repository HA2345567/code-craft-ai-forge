import { AIEngineInput, AIEngineOutput } from '@/lib/ai-engine/types';
import { DeploymentStatus } from '@/lib/deployment/service';

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
  specification: AIEngineInput;
  generatedOutput?: AIEngineOutput;
  
  // Project settings and metadata
  tags?: string[];
  isPublic?: boolean;
  collaborators?: string[];
  version: number;
  versionHistory?: ProjectVersion[];
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
  specification: AIEngineInput;
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