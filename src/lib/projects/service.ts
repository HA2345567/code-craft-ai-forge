import { SupabaseClient } from '@supabase/supabase-js';
import { Project, CreateProjectParams, DeploymentStatus } from './types';
import { DatabaseType, FrameworkType, AuthStrategy } from '@/lib/ai-engine/types';

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

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  async getProjects(): Promise<Project[]> {
    try {
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Failed to get user:', userError);
        return [];
      }
      
      const userId = userData.user.id;
      
      const { data: projects, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
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

  async getProjectById(id: string): Promise<Project | null> {
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
          tech_stack: params.specification ? {
            framework: params.specification.framework,
            database: params.specification.database,
            authentication: params.specification.authentication
          } : null,
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
      if (params.specification && params.specification.entities && params.specification.entities.length > 0) {
        for (const entity of params.specification.entities) {
          // Convert fields to JSON to match the database schema
          const fieldsJson = JSON.parse(JSON.stringify(entity.fields || []));
          
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

  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
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
          const fieldsJson = JSON.parse(JSON.stringify(entity.fields || []));
          
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
        }
      }
      
      return this.mapProjectData(updatedProject);
      
    } catch (error) {
      console.error('Error in updateProject:', error);
      return null;
    }
  }

  async updateDeploymentStatus(projectId: string, deploymentStatus: DeploymentStatus): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      
      // Get project to update deployment history
      const { data: projectData, error: projectError } = await this.supabase
        .from('projects')
        .select()
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('Error fetching project for deployment update:', projectError);
        return false;
      }
      
      // Create deployment record
      const { error } = await this.supabase
        .from('deployments')
        .insert({
          project_id: projectId,
          name: deploymentStatus.name || 'main',
          status: deploymentStatus.status,
          url: deploymentStatus.url || '',
          provider: deploymentStatus.provider || 'lovable',
          config: JSON.parse(JSON.stringify(deploymentStatus.config || {})),
          created_at: now,
          updated_at: now
        });
      
      if (error) {
        console.error('Error creating deployment record:', error);
        return false;
      }
      
      // Update project with deployment history
      const deploymentHistory = projectData.deployment_history || [];
      deploymentHistory.push({
        timestamp: now,
        status: deploymentStatus.status,
        url: deploymentStatus.url || '',
        provider: deploymentStatus.provider || 'lovable'
      });
      
      const { error: updateError } = await this.supabase
        .from('projects')
        .update({
          publish_url: deploymentStatus.url || projectData.publish_url,
          published: deploymentStatus.status === 'published',
          updated_at: now
        })
        .eq('id', projectId);
      
      if (updateError) {
        console.error('Error updating project with deployment info:', updateError);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Error in updateDeploymentStatus:', error);
      return false;
    }
  }

  async getProjectVersion(projectId: string, versionNumber?: number): Promise<Project | null> {
    try {
      const { data: projectData, error } = await this.supabase
        .from('projects')
        .select()
        .eq('id', projectId)
        .single();
      
      if (error) {
        console.error('Error fetching project version:', error);
        return null;
      }
      
      // If no specific version requested, return current version
      if (!versionNumber) {
        return this.mapProjectData(projectData);
      }
      
      // Check if the settings has version history
      const settings = typeof projectData.settings === 'object' ? projectData.settings : {};
      
      if (!settings || !settings.versionHistory) {
        console.error('No version history found for project');
        return this.mapProjectData(projectData);
      }
      
      // Find the requested version
      const versionHistory = settings.versionHistory || [];
      const requestedVersion = versionHistory.find((v: any) => v.version === versionNumber);
      
      if (!requestedVersion) {
        console.error(`Version ${versionNumber} not found in history`);
        return this.mapProjectData(projectData);
      }
      
      // Return the project with the specific version details
      // This is a simplified implementation - in a real app, you would need to actually
      // reconstruct the project state at that version
      
      return {
        ...this.mapProjectData(projectData),
        version: versionNumber
      };
      
    } catch (error) {
      console.error('Error in getProjectVersion:', error);
      return null;
    }
  }
}
