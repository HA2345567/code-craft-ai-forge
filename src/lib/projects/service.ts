
import { SupabaseClient } from '@supabase/supabase-js';
import { Project, ProjectFilter, CreateProjectParams, UpdateProjectParams, ProjectVersion, DeploymentStatus } from './types';
import { AIEngineOutput, AIEngineInput } from '@/lib/ai-engine/types';

export class ProjectService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // Get projects with optional filtering
  async getProjects(filter?: ProjectFilter): Promise<Project[]> {
    try {
      let query = this.supabase
        .from('projects')
        .select('*');

      // Apply filters if provided
      if (filter) {
        if (filter.search) {
          query = query.ilike('name', `%${filter.search}%`);
        }
        
        if (filter.tags && filter.tags.length > 0) {
          query = query.contains('tags', filter.tags);
        }
        
        if (filter.framework) {
          query = query.eq('framework', filter.framework);
        }
        
        if (filter.database) {
          query = query.eq('database', filter.database);
        }
        
        // Apply sorting
        const sortBy = filter.sortBy || 'updatedAt';
        const sortDirection = filter.sortDirection || 'desc';
        query = query.order(sortBy, { ascending: sortDirection === 'asc' });
        
        // Apply pagination
        if (filter.limit) {
          query = query.limit(filter.limit);
        }
        
        if (filter.offset) {
          query = query.range(filter.offset, (filter.offset + (filter.limit || 10)) - 1);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return this.mapProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get a single project by ID
  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        throw error;
      }

      return this.mapProject(data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }

  // Create a new project
  async createProject(params: CreateProjectParams): Promise<Project> {
    try {
      const { name, description, specification, tags = [], isPublic = false } = params;
      
      // Extract technology info from specification if provided
      const framework = specification?.framework || undefined;
      const database = specification?.database || undefined;
      const authentication = specification?.authentication || undefined;
      
      const project = {
        name,
        description,
        specification: specification || {},
        tags,
        isPublic,
        version: 1,
        framework,
        database,
        authentication,
        entities: specification?.entities || []
      };
      
      const { data, error } = await this.supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapProject(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update an existing project
  async updateProject(id: string, params: UpdateProjectParams): Promise<Project | null> {
    try {
      // Get the current project first
      const currentProject = await this.getProject(id);
      if (!currentProject) return null;
      
      // Create updated project data
      const updatedProject: Partial<Project> = {
        ...params,
        updatedAt: new Date().toISOString()
      };
      
      // Handle special cases for framework, database, and authentication
      if (params.framework !== undefined && params.framework !== currentProject.framework) {
        updatedProject.framework = params.framework;
      }
      
      if (params.database !== undefined && params.database !== currentProject.database) {
        updatedProject.database = params.database;
      }
      
      if (params.authentication !== undefined && params.authentication !== currentProject.authentication) {
        updatedProject.authentication = params.authentication;
      }
      
      // Update version history if specification is being updated
      if (params.specification) {
        // Current version becomes part of history
        const versionHistory = currentProject.versionHistory || [];
        
        const newHistoryEntry: ProjectVersion = {
          version: currentProject.version,
          createdAt: currentProject.updatedAt,
          description: currentProject.description,
          specification: currentProject.specification || this.createDefaultSpecification()
        };
        
        versionHistory.push(newHistoryEntry);
        
        updatedProject.versionHistory = versionHistory;
        updatedProject.version = currentProject.version + 1;
      }
      
      // Handle entity updates if provided
      if (params.entities !== undefined) {
        updatedProject.entities = params.entities;
      }
      
      // Perform the update
      const { data, error } = await this.supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapProject(data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  // Get all versions of a project
  async getProjectVersions(id: string): Promise<ProjectVersion[]> {
    try {
      const project = await this.getProject(id);
      if (!project || !project.versionHistory) return [];
      
      return project.versionHistory;
    } catch (error) {
      console.error(`Error fetching project versions for ${id}:`, error);
      throw error;
    }
  }

  // Get a specific version of a project
  async getProjectVersion(id: string, version: number): Promise<ProjectVersion | null> {
    try {
      const versions = await this.getProjectVersions(id);
      return versions.find(v => v.version === version) || null;
    } catch (error) {
      console.error(`Error fetching version ${version} for project ${id}:`, error);
      throw error;
    }
  }

  // Update a project with AI-generated output
  async updateProjectWithOutput(id: string, output: AIEngineOutput): Promise<Project | null> {
    try {
      const currentProject = await this.getProject(id);
      if (!currentProject) return null;
      
      const updatedProject = {
        generatedOutput: output,
        updatedAt: new Date().toISOString()
      };
      
      const { data, error } = await this.supabase
        .from('projects')
        .update(updatedProject)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapProject(data);
    } catch (error) {
      console.error(`Error updating project ${id} with output:`, error);
      throw error;
    }
  }

  // Update a project with deployment information
  async updateProjectDeployment(id: string, deployment: DeploymentStatus): Promise<Project | null> {
    try {
      // Convert deployment to a JSON-compatible format
      const deploymentData = {
        status: deployment.status,
        url: deployment.url,
        provider: deployment.provider,
        name: deployment.name,
        config: deployment.config || {},
        timestamp: deployment.timestamp,
        error: deployment.error
      };
      
      const { data, error } = await this.supabase
        .from('projects')
        .update({
          lastDeployment: deploymentData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      return this.mapProject(data);
    } catch (error) {
      console.error(`Error updating project ${id} with deployment:`, error);
      throw error;
    }
  }

  // Helper method to map database rows to Project objects
  private mapProject(data: any): Project {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
      specification: data.specification || this.createDefaultSpecification(),
      generatedOutput: data.generated_output || data.generatedOutput,
      lastDeployment: data.last_deployment || data.lastDeployment,
      tags: data.tags || [],
      isPublic: data.is_public || data.isPublic || false,
      collaborators: data.collaborators || [],
      version: data.version || 1,
      versionHistory: data.version_history || data.versionHistory || [],
      framework: data.framework,
      database: data.database,
      authentication: data.authentication,
      entities: data.entities || []
    };
  }

  // Map an array of database rows to Project objects
  private mapProjects(data: any[]): Project[] {
    return data.map(item => this.mapProject(item));
  }

  // Create a default specification object
  private createDefaultSpecification(): AIEngineInput {
    return {
      name: '',
      description: '',
      framework: 'Express',
      database: 'PostgreSQL',
      authentication: 'JWT',
      entities: [],
      endpoints: [],
      relationships: []
    };
  }
}
