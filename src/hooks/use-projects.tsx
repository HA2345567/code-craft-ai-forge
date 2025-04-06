
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './use-toast';
import { ProjectService } from '@/lib/projects/service';
import { 
  Project, 
  ProjectFilter, 
  CreateProjectParams, 
  UpdateProjectParams, 
  ProjectVersion,
  DeploymentStatus
} from '@/lib/projects/types';
import { AIEngineOutput } from '@/lib/ai-engine/types';
import { supabaseClient } from '@/integrations/supabase/client';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  filter: ProjectFilter;
  
  setFilter: (filter: ProjectFilter) => void;
  refreshProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  createProject: (params: CreateProjectParams) => Promise<Project>;
  updateProject: (id: string, params: UpdateProjectParams) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  setCurrentProject: (project: Project | null) => void;
  
  getProjectVersions: (id: string) => Promise<ProjectVersion[]>;
  getProjectVersion: (id: string, version: number) => Promise<ProjectVersion | null>;
  updateProjectWithOutput: (id: string, output: AIEngineOutput) => Promise<Project | null>;
  updateProjectDeployment: (id: string, deployment: DeploymentStatus) => Promise<Project | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>({
    sortBy: 'updatedAt',
    sortDirection: 'desc'
  });
  
  const { toast } = useToast();
  const projectService = new ProjectService(supabaseClient);
  
  // Load projects on mount and when filter changes
  useEffect(() => {
    refreshProjects();
  }, [filter]);
  
  // Function to refresh projects from the service
  const refreshProjects = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedProjects = await projectService.listProjects(filter);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a specific project by ID
  const getProject = async (id: string): Promise<Project | null> => {
    try {
      return await projectService.getProject(id);
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
      toast({
        title: 'Error',
        description: `Failed to load project details`,
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Create a new project
  const createProject = async (params: CreateProjectParams): Promise<Project> => {
    try {
      const newProject = await projectService.createProject(params);
      
      if (!newProject) {
        throw new Error('Failed to create project');
      }
      
      // Refresh projects list
      await refreshProjects();
      
      toast({
        title: 'Project Created',
        description: `Project "${newProject.name}" has been created successfully`
      });
      
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  // Update an existing project
  const updateProject = async (id: string, params: UpdateProjectParams): Promise<Project | null> => {
    try {
      const updatedProject = await projectService.updateProject(id, params);
      
      if (updatedProject) {
        // Refresh projects list
        await refreshProjects();
        
        // Update current project if it's the one being edited
        if (currentProject?.id === id) {
          setCurrentProject(updatedProject);
        }
        
        toast({
          title: 'Project Updated',
          description: `Project "${updatedProject.name}" has been updated successfully`
        });
      }
      
      return updatedProject;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Delete a project
  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const deleted = await projectService.deleteProject(id);
      
      if (deleted) {
        // Refresh projects list
        await refreshProjects();
        
        // Clear current project if it's the one being deleted
        if (currentProject?.id === id) {
          setCurrentProject(null);
        }
        
        toast({
          title: 'Project Deleted',
          description: 'Project has been deleted successfully'
        });
      }
      
      return deleted;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  // Get all versions of a project
  const getProjectVersions = async (id: string): Promise<ProjectVersion[]> => {
    try {
      return await projectService.getProjectVersions(id);
    } catch (error) {
      console.error(`Error getting versions for project ${id}:`, error);
      return [];
    }
  };
  
  // Get a specific version of a project
  const getProjectVersion = async (id: string, version: number): Promise<ProjectVersion | null> => {
    try {
      return await projectService.getProjectVersion(id, version);
    } catch (error) {
      console.error(`Error getting version ${version} for project ${id}:`, error);
      return null;
    }
  };
  
  // Update a project with generated output
  const updateProjectWithOutput = async (id: string, output: AIEngineOutput): Promise<Project | null> => {
    try {
      const updatedProject = await projectService.updateProjectWithOutput(id, output);
      
      if (updatedProject) {
        // Refresh the projects list
        await refreshProjects();
        
        // Update current project if it's the one being updated
        if (currentProject?.id === id) {
          setCurrentProject(updatedProject);
        }
        
        toast({
          title: 'Code Generated',
          description: 'Generated code has been saved to the project'
        });
      }
      
      return updatedProject;
    } catch (error) {
      console.error(`Error updating project ${id} with output:`, error);
      toast({
        title: 'Error',
        description: 'Failed to save generated code to the project',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  // Update a project with deployment status
  const updateProjectDeployment = async (id: string, deployment: DeploymentStatus): Promise<Project | null> => {
    try {
      const updatedProject = await projectService.updateProjectDeployment(id, deployment);
      
      if (updatedProject) {
        // Refresh the projects list
        await refreshProjects();
        
        // Update current project if it's the one being updated
        if (currentProject?.id === id) {
          setCurrentProject(updatedProject);
        }
        
        if (deployment.status === 'deployed') {
          toast({
            title: 'Deployment Saved',
            description: 'Deployment information has been saved to the project'
          });
        }
      }
      
      return updatedProject;
    } catch (error) {
      console.error(`Error updating project ${id} with deployment:`, error);
      toast({
        title: 'Error',
        description: 'Failed to save deployment information to the project',
        variant: 'destructive'
      });
      return null;
    }
  };
  
  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        isLoading,
        error,
        filter,
        setFilter,
        refreshProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        setCurrentProject,
        getProjectVersions,
        getProjectVersion,
        updateProjectWithOutput,
        updateProjectDeployment
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
