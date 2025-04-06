import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from './use-toast';
import { DeploymentService, DeploymentConfig, DeploymentStatus, DeploymentPlatform } from '@/lib/deployment/service';
import { AIEngineOutput } from '@/lib/ai-engine/types';

interface DeploymentContextType {
  isDeploying: boolean;
  deploymentProgress: number;
  deploymentStatus: string;
  deploymentResult: DeploymentStatus | null;
  deploymentHistory: DeploymentStatus[];
  deployProject: (
    generatedCode: AIEngineOutput,
    config: DeploymentConfig
  ) => Promise<DeploymentStatus>;
  getDeploymentStatus: (deploymentId: string) => Promise<DeploymentStatus | null>;
  clearDeploymentResult: () => void;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

interface DeploymentProviderProps {
  children: ReactNode;
}

export const DeploymentProvider: React.FC<DeploymentProviderProps> = ({ children }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deploymentResult, setDeploymentResult] = useState<DeploymentStatus | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentStatus[]>([]);
  
  const { toast } = useToast();
  const deploymentService = new DeploymentService();
  
  const deployProject = async (
    generatedCode: AIEngineOutput,
    config: DeploymentConfig
  ): Promise<DeploymentStatus> => {
    try {
      setIsDeploying(true);
      setDeploymentProgress(0);
      setDeploymentStatus('Starting deployment...');
      
      // Call the deployment service
      const result = await deploymentService.deployToProvider(
        generatedCode,
        config,
        (progress, status) => {
          setDeploymentProgress(progress);
          setDeploymentStatus(status);
        }
      );
      
      // Update state with deployment result
      setDeploymentResult(result);
      setDeploymentHistory(prev => [result, ...prev]);
      setIsDeploying(false);
      
      // Show toast notification
      if (result.status === 'deployed') {
        toast({
          title: "Deployment Successful",
          description: `Your API has been deployed to ${result.url}`,
        });
      } else {
        toast({
          title: "Deployment Failed",
          description: result.error || "An unknown error occurred during deployment",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error during deployment:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const failedDeployment: DeploymentStatus = {
        id: `deploy-error-${Date.now()}`,
        projectId: config.projectName,
        status: 'failed',
        error: errorMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setDeploymentResult(failedDeployment);
      setDeploymentHistory(prev => [failedDeployment, ...prev]);
      setIsDeploying(false);
      
      toast({
        title: "Deployment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return failedDeployment;
    }
  };
  
  const getDeploymentStatus = async (deploymentId: string): Promise<DeploymentStatus | null> => {
    try {
      return await deploymentService.getDeploymentStatus(deploymentId);
    } catch (error) {
      console.error('Error getting deployment status:', error);
      return null;
    }
  };
  
  const clearDeploymentResult = () => {
    setDeploymentResult(null);
    setDeploymentProgress(0);
    setDeploymentStatus('');
  };
  
  return (
    <DeploymentContext.Provider
      value={{
        isDeploying,
        deploymentProgress,
        deploymentStatus,
        deploymentResult,
        deploymentHistory,
        deployProject,
        getDeploymentStatus,
        clearDeploymentResult
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeployment = (): DeploymentContextType => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error('useDeployment must be used within a DeploymentProvider');
  }
  return context;
}; 