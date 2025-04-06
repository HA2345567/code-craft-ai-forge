
import { Project, ProjectFilter, CreateProjectParams, UpdateProjectParams, ProjectVersion } from './types';
import { AIEngineInput, AIEngineOutput } from '@/lib/ai-engine/types';
import { DeploymentStatus } from '@/lib/deployment/service';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for managing projects with Supabase
 */
export class ProjectService {
  /**
   * List all projects with optional filtering
   */
  async listProjects(filter?: ProjectFilter): Promise<Project[]> {
    try {
      let query = supabase.from('projects').select(`
        *,
        environments(*)
      `);

      // Apply filters if provided
      if (filter) {
        if (filter.search) {
          const searchLower = filter.search.toLowerCase();
          query = query.or(`name.ilike.%${searchLower}%,description.ilike.%${searchLower}%`);
        }
        
        if (filter.tags && filter.tags.length > 0) {
          query = query.contains('settings->tags', filter.tags);
        }
        
        if (filter.framework) {
          query = query.eq('tech_stack->>framework', filter.framework);
        }
        
        if (filter.database) {
          query = query.eq('tech_stack->>database', filter.database);
        }
        
        // Apply sorting
        if (filter.sortBy) {
          const direction = filter.sortDirection || 'asc';
          query = query.order(filter.sortBy, { ascending: direction === 'asc' });
        } else {
          // Default sorting by updated_at
          query = query.order('updated_at', { ascending: false });
        }
        
        // Apply pagination
        if (filter.offset !== undefined && filter.limit !== undefined) {
          query = query.range(filter.offset, filter.offset + filter.limit - 1);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match Project interface
      return (data || []).map(this.mapProjectFromDb);
    } catch (error) {
      console.error('Error listing projects:', error);
      return [];
    }
  }
  
  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          environments(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return this.mapProjectFromDb(data);
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Create a new project
   */
  async createProject(params: CreateProjectParams): Promise<Project> {
    try {
      const now = new Date().toISOString();
      
      // Prepare project data for Supabase
      const projectData = {
        name: params.name,
        description: params.description || '',
        settings: {
          tags: params.tags || [],
          isPublic: params.isPublic || false,
          version: 1,
        },
        tech_stack: params.specification ? {
          framework: params.specification.framework,
          database: params.specification.database,
          authentication: params.specification.authentication
        } : {},
        created_at: now,
        updated_at: now
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();
      
      if (error) throw error;
      
      // If we have a specification, store it in data_models
      if (params.specification && params.specification.entities) {
        const dataModelPromises = params.specification.entities.map(entity => {
          return supabase.from('data_models').insert({
            project_id: data.id,
            name: entity.name,
            fields: entity.fields || []
          });
        });
        
        await Promise.all(dataModelPromises);
      }
      
      return this.mapProjectFromDb(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing project
   */
  async updateProject(id: string, params: UpdateProjectParams): Promise<Project | null> {
    try {
      // Get current project data
      const { data: currentProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (params.name !== undefined) {
        updateData.name = params.name;
      }
      
      if (params.description !== undefined) {
        updateData.description = params.description;
      }
      
      if (params.tags !== undefined || params.isPublic !== undefined) {
        // Update only the changed settings properties
        const settings = currentProject.settings || {};
        updateData.settings = {
          ...settings,
          ...(params.tags !== undefined ? { tags: params.tags } : {}),
          ...(params.isPublic !== undefined ? { isPublic: params.isPublic } : {})
        };
      }
      
      // Update specification in tech_stack if provided
      if (params.specification) {
        updateData.tech_stack = {
          ...(currentProject.tech_stack || {}),
          framework: params.specification.framework,
          database: params.specification.database,
          authentication: params.specification.authentication
        };
        
        // Increment version in settings
        updateData.settings = {
          ...(updateData.settings || currentProject.settings || {}),
          version: ((currentProject.settings?.version || 1) + 1)
        };
        
        // Save version history
        const versionData = {
          version: updateData.settings.version,
          created_at: updateData.updated_at,
          description: `Updated project specification`,
          specification: params.specification
        };
        
        const versionHistory = currentProject.settings?.versionHistory || [];
        updateData.settings.versionHistory = [...versionHistory, versionData];
        
        // Update data models if entities are provided
        if (params.specification.entities) {
          // Delete existing models and create new ones
          await supabase
            .from('data_models')
            .delete()
            .eq('project_id', id);
            
          const dataModelInserts = params.specification.entities.map(entity => {
            return supabase.from('data_models').insert({
              project_id: id,
              name: entity.name,
              fields: entity.fields || []
            });
          });
          
          await Promise.all(dataModelInserts);
        }
      }
      
      // Update generated output if provided
      if (params.generatedOutput) {
        updateData.settings = {
          ...(updateData.settings || currentProject.settings || {}),
          generatedOutput: params.generatedOutput
        };
      }
      
      // Update deployment status if provided
      if (params.lastDeployment) {
        // Store deployment in environments table
        await supabase
          .from('environments')
          .upsert({
            project_id: id,
            name: params.lastDeployment.environment || 'production',
            url: params.lastDeployment.url,
            status: params.lastDeployment.status,
            config: params.lastDeployment
          }, {
            onConflict: 'project_id,name'
          });
        
        // Add to deployment history
        const deployHistory = currentProject.deployment_history || [];
        updateData.deployment_history = [
          ...deployHistory,
          {
            timestamp: updateData.updated_at,
            ...params.lastDeployment
          }
        ];
      }
      
      // Perform update
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          environments(*)
        `)
        .single();
      
      if (error) throw error;
      
      return this.mapProjectFromDb(data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Get all versions of a project
   */
  async getProjectVersions(id: string): Promise<ProjectVersion[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('settings->versionHistory')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data?.settings?.versionHistory || [];
    } catch (error) {
      console.error(`Error getting versions for project ${id}:`, error);
      return [];
    }
  }
  
  /**
   * Get a specific version of a project
   */
  async getProjectVersion(id: string, version: number): Promise<ProjectVersion | null> {
    try {
      const versions = await this.getProjectVersions(id);
      return versions.find(v => v.version === version) || null;
    } catch (error) {
      console.error(`Error getting version ${version} for project ${id}:`, error);
      return null;
    }
  }
  
  /**
   * Update project with generated output
   */
  async updateProjectWithOutput(id: string, output: AIEngineOutput): Promise<Project | null> {
    return this.updateProject(id, { generatedOutput: output });
  }
  
  /**
   * Update project with deployment status
   */
  async updateProjectDeployment(id: string, deployment: DeploymentStatus): Promise<Project | null> {
    return this.updateProject(id, { lastDeployment: deployment });
  }
  
  /**
   * Map database project object to Project interface
   */
  private mapProjectFromDb(dbProject: any): Project {
    if (!dbProject) return null as any;
    
    const settings = dbProject.settings || {};
    const techStack = dbProject.tech_stack || {};
    
    return {
      id: dbProject.id,
      name: dbProject.name,
      description: dbProject.description || '',
      createdAt: dbProject.created_at,
      updatedAt: dbProject.updated_at,
      lastDeployment: dbProject.environments?.[0] ? {
        environment: dbProject.environments[0].name,
        status: dbProject.environments[0].status,
        url: dbProject.environments[0].url,
        timestamp: dbProject.environments[0].updated_at,
        ...dbProject.environments[0].config
      } : undefined,
      
      // Map specification from tech_stack
      specification: {
        name: dbProject.name,
        description: dbProject.description,
        framework: techStack.framework,
        database: techStack.database,
        authentication: techStack.authentication,
        entities: [],
        endpoints: [],
        relationships: []
      },
      
      // Map other fields from settings
      generatedOutput: settings.generatedOutput,
      tags: settings.tags || [],
      isPublic: settings.isPublic || false,
      collaborators: settings.collaborators || [],
      version: settings.version || 1,
      versionHistory: settings.versionHistory || []
    };
  }
}
