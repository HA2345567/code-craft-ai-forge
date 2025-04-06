import { Project, ProjectFilter, CreateProjectParams, UpdateProjectParams, ProjectVersion } from './types';
import { AIEngineInput, AIEngineOutput } from '@/lib/ai-engine/types';
import { DeploymentStatus } from '@/lib/deployment/service';

/**
 * Service for managing projects
 */
export class ProjectService {
  private projects: Project[] = [];
  private localStorageKey = 'aiforge_projects';
  
  constructor() {
    this.loadProjects();
  }
  
  /**
   * Load projects from local storage
   */
  private loadProjects(): void {
    try {
      const storedProjects = localStorage.getItem(this.localStorageKey);
      
      if (storedProjects) {
        this.projects = JSON.parse(storedProjects);
      }
    } catch (error) {
      console.error('Error loading projects from local storage:', error);
      this.projects = [];
    }
  }
  
  /**
   * Save projects to local storage
   */
  private saveProjects(): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.projects));
    } catch (error) {
      console.error('Error saving projects to local storage:', error);
    }
  }
  
  /**
   * List all projects with optional filtering
   */
  async listProjects(filter?: ProjectFilter): Promise<Project[]> {
    let filteredProjects = [...this.projects];
    
    // Apply filters if provided
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          project.name.toLowerCase().includes(searchLower) || 
          project.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.tags && filter.tags.length > 0) {
        filteredProjects = filteredProjects.filter(project => 
          project.tags?.some(tag => filter.tags?.includes(tag))
        );
      }
      
      if (filter.framework) {
        filteredProjects = filteredProjects.filter(project => 
          project.specification.framework === filter.framework
        );
      }
      
      if (filter.database) {
        filteredProjects = filteredProjects.filter(project => 
          project.specification.database === filter.database
        );
      }
      
      // Apply sorting
      if (filter.sortBy) {
        filteredProjects.sort((a, b) => {
          const direction = filter.sortDirection === 'desc' ? -1 : 1;
          
          switch (filter.sortBy) {
            case 'name':
              return direction * a.name.localeCompare(b.name);
            case 'createdAt':
              return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'updatedAt':
              return direction * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
            default:
              return 0;
          }
        });
      }
      
      // Apply pagination
      if (filter.offset !== undefined && filter.limit !== undefined) {
        filteredProjects = filteredProjects.slice(filter.offset, filter.offset + filter.limit);
      }
    }
    
    return filteredProjects;
  }
  
  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    const project = this.projects.find(p => p.id === id);
    return project || null;
  }
  
  /**
   * Create a new project
   */
  async createProject(params: CreateProjectParams): Promise<Project> {
    const id = `project-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newProject: Project = {
      id,
      name: params.name,
      description: params.description,
      createdAt: now,
      updatedAt: now,
      specification: params.specification,
      tags: params.tags || [],
      isPublic: params.isPublic || false,
      version: 1,
      versionHistory: []
    };
    
    this.projects.push(newProject);
    this.saveProjects();
    
    return newProject;
  }
  
  /**
   * Update an existing project
   */
  async updateProject(id: string, params: UpdateProjectParams): Promise<Project | null> {
    const projectIndex = this.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return null;
    }
    
    const project = this.projects[projectIndex];
    const now = new Date().toISOString();
    
    // Create a new project version if specification is being updated
    if (params.specification) {
      const newVersion: ProjectVersion = {
        version: project.version + 1,
        createdAt: now,
        description: `Updated project specification`,
        specification: { ...project.specification },
        generatedOutput: project.generatedOutput
      };
      
      project.versionHistory = [
        ...(project.versionHistory || []),
        newVersion
      ];
      
      project.version += 1;
    }
    
    // Update the project with new values
    const updatedProject: Project = {
      ...project,
      name: params.name || project.name,
      description: params.description || project.description,
      specification: params.specification || project.specification,
      tags: params.tags !== undefined ? params.tags : project.tags,
      isPublic: params.isPublic !== undefined ? params.isPublic : project.isPublic,
      updatedAt: now
    };
    
    // Update generated output if provided
    if (params.generatedOutput) {
      updatedProject.generatedOutput = params.generatedOutput;
    }
    
    // Update deployment status if provided
    if (params.lastDeployment) {
      updatedProject.lastDeployment = params.lastDeployment;
    }
    
    this.projects[projectIndex] = updatedProject;
    this.saveProjects();
    
    return updatedProject;
  }
  
  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    
    const deleted = initialLength > this.projects.length;
    
    if (deleted) {
      this.saveProjects();
    }
    
    return deleted;
  }
  
  /**
   * Get all versions of a project
   */
  async getProjectVersions(id: string): Promise<ProjectVersion[]> {
    const project = await this.getProject(id);
    
    if (!project) {
      return [];
    }
    
    return project.versionHistory || [];
  }
  
  /**
   * Get a specific version of a project
   */
  async getProjectVersion(id: string, version: number): Promise<ProjectVersion | null> {
    const versions = await this.getProjectVersions(id);
    return versions.find(v => v.version === version) || null;
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
} 