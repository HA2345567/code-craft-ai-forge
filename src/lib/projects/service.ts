
import { SupabaseClient } from '@supabase/supabase-js';
import { Project, CreateProjectParams, UpdateProjectParams, ProjectFilter, ProjectVersion, DeploymentStatus, Entity } from './types';
import { AIEngineOutput } from '@/lib/ai-engine/types';

interface ProjectRecord {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  settings: any;
  tech_stack: any;
  publish_url: string;
  published: boolean;
  user_id: string;
  deployment_history: any[];
}

export class ProjectService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    // Using type assertion to avoid issues with supabase imports
    this.supabase = supabaseClient || ({} as SupabaseClient);
  }

  async listProjects(filter: ProjectFilter = {}): Promise<Project[]> {
    try {
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Failed to get user:', userError);
        return [];
      }
      
      const userId = userData.user.id;
      
      let query = this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);
      
      // Apply filters
      if (filter.search) {
        query = query.ilike('name', `%${filter.search}%`);
      }
      
      // Apply sorting
      if (filter.sortBy) {
        const column = filter.sortBy === 'name' ? 'name' : 
                      filter.sortBy === 'createdAt' ? 'created_at' : 'updated_at';
        const ascending = filter.sortDirection !== 'desc';
        
        query = query.order(column, { ascending });
      } else {
        // Default sort by updated_at desc
        query = query.order('updated_at', { ascending: false });
      }
      
      // Apply pagination
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
      
      if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
      }
      
      const { data: projects, error } = await query;
      
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
      
      return projects.map(this.mapProjectData);
    } catch (error) {
      console.error('Error in getProjects:', error);
      return [];
    }
  }

  async getProjects(): Promise<Project[]> {
    return this.listProjects();
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const { data: projectData, error } = await this.supabase
        .from('projects')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      
      return this.mapProjectData(projectData);
    } catch (error) {
      console.error('Error in getProjectById:', error);
      return null;
    }
  }

  async createProject(params: CreateProjectParams): Promise<Project | null> {
    try {
      // Get the current user
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Failed to get user:', userError);
        return null;
      }
      
      const userId = userData.user.id;
      
      const now = new Date().toISOString();
      
      // Extract tech stack from specification if available
      let techStack = {};
      if (params.specification) {
        techStack = {
          framework: params.specification.framework,
          database: params.specification.database,
          authentication: params.specification.authentication
        };
      }
      
      // Create project record
      const { data: projectData, error: projectError } = await this.supabase
        .from('projects')
        .insert({
          name: params.name,
          description: params.description,
          settings: {
            tags: params.tags || [],
            isPublic: params.isPublic || false,
            version: 1
          },
          tech_stack: techStack,
          created_at: now,
          updated_at: now,
          user_id: userId
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Failed to create project:', projectError);
        return null;
      }
      
      // If specification is provided, create data models
      if (params.specification?.entities && params.specification.entities.length > 0) {
        for (const entity of params.specification.entities) {
          // Convert fields to JSON to match the database schema
          const fieldsJson = JSON.stringify(entity.fields || []);
          
          try {
            const { error } = await this.supabase
              .from('data_models')
              .insert({
                project_id: projectData.id,
                name: entity.name,
                fields: fieldsJson,
                is_timestamped: true,
                created_at: now,
                updated_at: now
              });
            
            if (error) {
              console.error(`Failed to create data model for ${entity.name}:`, error);
            }
          } catch (error) {
            console.error(`Error creating data model for ${entity.name}:`, error);
          }
        }
      }
      
      return this.mapProjectData(projectData);
      
    } catch (error) {
      console.error('Error in createProject:', error);
      return null;
    }
  }

  private mapProjectData(projectData: any): Project {
    // Handle case where projectData might be null or undefined
    if (!projectData) {
      return {
        id: '',
        name: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        isPublic: false,
        version: 1,
        framework: null,
        database: null,
        authentication: null
      };
    }
    
    // Extract tech stack info if available
    const techStack = projectData.tech_stack || {};
    
    // Extract settings
    const settings = typeof projectData.settings === 'object' ? projectData.settings : {};
    
    return {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description || '',
      createdAt: projectData.created_at,
      updatedAt: projectData.updated_at,
      tags: settings.tags || [],
      isPublic: settings.isPublic || false,
      version: settings.version || 1,
      framework: techStack.framework || null,
      database: techStack.database || null,
      authentication: techStack.authentication || null
    };
  }

  async updateProject(id: string, data: UpdateProjectParams): Promise<Project | null> {
    try {
      const { data: projectData, error } = await this.supabase
        .from('projects')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      
      // Extract current settings
      const currentSettings = typeof projectData.settings === 'object' ? projectData.settings : {};
      
      // Update the settings with new data
      const updatedSettings = {
        ...currentSettings,
        tags: data.tags || currentSettings.tags || [],
        isPublic: data.isPublic !== undefined ? data.isPublic : currentSettings.isPublic || false,
        version: currentSettings.version ? (currentSettings.version + 1) : 1
      };
      
      // Update tech stack if provided
      let techStack = projectData.tech_stack || {};
      if (data.framework !== undefined || data.database !== undefined || data.authentication !== undefined) {
        techStack = {
          ...techStack,
          framework: data.framework !== undefined ? data.framework : techStack.framework,
          database: data.database !== undefined ? data.database : techStack.database,
          authentication: data.authentication !== undefined ? data.authentication : techStack.authentication
        };
      }
      
      // If there's version history in the settings, append the current version
      if (currentSettings.versionHistory) {
        const historyItem = {
          version: currentSettings.version || 1,
          timestamp: new Date().toISOString(),
          changes: Object.keys(data).filter(key => key !== 'version')
        };
        
        updatedSettings.versionHistory = [
          ...currentSettings.versionHistory,
          historyItem
        ];
      } else {
        // Initialize version history
        updatedSettings.versionHistory = [{
          version: currentSettings.version || 1,
          timestamp: new Date().toISOString(),
          changes: Object.keys(data).filter(key => key !== 'version')
        }];
      }
      
      // Update the project
      const { data: updatedProject, error: updateError } = await this.supabase
        .from('projects')
        .update({
          name: data.name || projectData.name,
          description: data.description !== undefined ? data.description : projectData.description,
          settings: updatedSettings,
          tech_stack: techStack,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating project:', updateError);
        return null;
      }
      
      // If entities are provided, update data models
      if (data.entities) {
        // For each entity, upsert the data model
        for (const entity of data.entities) {
          // Convert fields to JSON to match the database schema
          const fieldsJson = JSON.stringify(entity.fields || []);
          
          try {
            const { error } = await this.supabase
              .from('data_models')
              .upsert({
                project_id: id,
                name: entity.name,
                fields: fieldsJson,
                is_timestamped: true,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'project_id,name'
              });
            
            if (error) {
              console.error(`Failed to update data model for ${entity.name}:`, error);
            }
          } catch (error) {
            console.error(`Error updating data model for ${entity.name}:`, error);
          }
        }
      }
      
      return this.mapProjectData(updatedProject);
      
    } catch (error) {
      console.error('Error in updateProject:', error);
      return null;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return false;
    }
  }

  async updateProjectDeployment(id: string, deployment: DeploymentStatus): Promise<Project | null> {
    try {
      const now = new Date().toISOString();
      
      // Get project to update deployment history
      const { data: projectData, error: projectError } = await this.supabase
        .from('projects')
        .select()
        .eq('id', id)
        .single();
      
      if (projectError) {
        console.error('Error fetching project for deployment update:', projectError);
        return null;
      }
      
      // Create deployment record - need to stringify the config
      const deploymentConfig = JSON.stringify(deployment.config || {});
      
      try {
        const { error } = await this.supabase
          .from('environments')
          .insert({
            project_id: id,
            name: deployment.name || 'main',
            status: deployment.status,
            url: deployment.url || '',
            provider: deployment.provider || 'lovable',
            config: deploymentConfig,
            created_at: now,
            updated_at: now
          });
        
        if (error) {
          console.error('Error creating deployment record:', error);
        }
      } catch (error) {
        console.error('Error inserting deployment record:', error);
      }
      
      // Update project with deployment history
      const deploymentHistory = projectData.deployment_history || [];
      deploymentHistory.push({
        timestamp: now,
        status: deployment.status,
        url: deployment.url || '',
        provider: deployment.provider || 'lovable'
      });
      
      const { data: updatedProject, error: updateError } = await this.supabase
        .from('projects')
        .update({
          publish_url: deployment.url || projectData.publish_url,
          published: deployment.status === 'published',
          updated_at: now,
          deployment_history: deploymentHistory
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating project with deployment info:', updateError);
        return null;
      }
      
      return this.mapProjectData(updatedProject);
      
    } catch (error) {
      console.error('Error in updateDeploymentStatus:', error);
      return null;
    }
  }

  async getProjectVersions(id: string): Promise<ProjectVersion[]> {
    try {
      const { data: projectData, error } = await this.supabase
        .from('projects')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project versions:', error);
        return [];
      }
      
      // Check if the settings has version history
      const settings = typeof projectData.settings === 'object' ? projectData.settings : {};
      
      if (!settings || !settings.versionHistory) {
        return [];
      }
      
      return settings.versionHistory.map((version: any) => ({
        version: version.version,
        createdAt: version.timestamp,
        description: version.description || `Version ${version.version}`,
        specification: version.specification || {},
      }));
      
    } catch (error) {
      console.error('Error in getProjectVersions:', error);
      return [];
    }
  }

  async getProjectVersion(id: string, versionNumber?: number): Promise<ProjectVersion | null> {
    try {
      const { data: projectData, error } = await this.supabase
        .from('projects')
        .select()
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching project version:', error);
        return null;
      }
      
      // If no specific version requested, return current version
      if (!versionNumber) {
        const currentVersion = typeof projectData.settings === 'object' && projectData.settings.version 
          ? projectData.settings.version 
          : 1;
          
        return {
          version: currentVersion,
          createdAt: projectData.updated_at,
          description: `Current version (${currentVersion})`,
          specification: {}
        };
      }
      
      // Check if the settings has version history
      const settings = typeof projectData.settings === 'object' ? projectData.settings : {};
      
      if (!settings || !settings.versionHistory) {
        console.error('No version history found for project');
        return null;
      }
      
      // Find the requested version
      const versionHistory = settings.versionHistory || [];
      const requestedVersion = versionHistory.find((v: any) => v.version === versionNumber);
      
      if (!requestedVersion) {
        console.error(`Version ${versionNumber} not found in history`);
        return null;
      }
      
      // Return the project version details
      return {
        version: versionNumber,
        createdAt: requestedVersion.timestamp,
        description: requestedVersion.description || `Version ${versionNumber}`,
        specification: requestedVersion.specification || {}
      };
      
    } catch (error) {
      console.error('Error in getProjectVersion:', error);
      return null;
    }
  }
  
  async updateProjectWithOutput(id: string, output: AIEngineOutput): Promise<Project | null> {
    try {
      // Get the current project
      const project = await this.getProject(id);
      
      if (!project) {
        console.error('Project not found');
        return null;
      }
      
      // Update the project with the generated output
      return this.updateProject(id, {
        generatedOutput: output
      });
      
    } catch (error) {
      console.error('Error updating project with output:', error);
      return null;
    }
  }
}
