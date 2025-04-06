
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIEngineService } from '@/lib/ai-engine/service';
import { AIEngineInput, AIEngineOutput, FrameworkType, DatabaseType } from '@/lib/ai-engine/types';
import { useToast } from './use-toast';

// Mock API key - in a real app, this would be fetched from an environment variable
const API_KEY = 'dummy-api-key';

interface AIEngineContextType {
  isGenerating: boolean;
  progress: number;
  generatedOutput: AIEngineOutput | null;
  generateBackend: (input: AIEngineInput) => Promise<void>;
  downloadCode: () => void;
  clearOutput: () => void;
}

const AIEngineContext = createContext<AIEngineContextType | undefined>(undefined);

interface AIEngineProviderProps {
  children: ReactNode;
}

export const AIEngineProvider: React.FC<AIEngineProviderProps> = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedOutput, setGeneratedOutput] = useState<AIEngineOutput | null>(null);
  const { toast } = useToast();
  
  const aiEngine = new AIEngineService(API_KEY);
  
  const generateBackend = async (input: AIEngineInput) => {
    try {
      setIsGenerating(true);
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Generate code
      const output = await aiEngine.generateCode(input);
      
      // Finish progress and clean up
      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedOutput(output);
      setIsGenerating(false);
      
      toast({
        title: "Backend Generated Successfully",
        description: "Your backend code has been generated successfully",
      });
    } catch (error) {
      console.error('Error generating backend:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your backend code",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };
  
  const downloadCode = () => {
    if (!generatedOutput) {
      toast({
        title: "Nothing to Download",
        description: "Generate code first before downloading",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would create a zip file with all generated files
    toast({
      title: "Code Downloaded",
      description: "Your backend code has been downloaded",
    });
  };
  
  const clearOutput = () => {
    setGeneratedOutput(null);
    setProgress(0);
  };
  
  return (
    <AIEngineContext.Provider
      value={{
        isGenerating,
        progress,
        generatedOutput,
        generateBackend,
        downloadCode,
        clearOutput
      }}
    >
      {children}
    </AIEngineContext.Provider>
  );
};

export const useAIEngine = (): AIEngineContextType => {
  const context = useContext(AIEngineContext);
  if (context === undefined) {
    throw new Error('useAIEngine must be used within an AIEngineProvider');
  }
  return context;
};

// Utility function to create a new input object with default values
export const createDefaultAIEngineInput = (
  projectName: string,
  description: string
): AIEngineInput => {
  return {
    name: projectName,
    projectName,
    description,
    framework: 'express' as FrameworkType,
    database: 'mongodb' as DatabaseType,
    apiStyle: 'rest',
    dataModels: [],
    features: ['authentication'],
    entities: [],
    endpoints: [],
    relationships: [],
    authentication: 'JWT'
  };
};
