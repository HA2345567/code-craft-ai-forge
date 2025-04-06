import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Server, Cloud, GitBranch, Terminal, RotateCw, Globe, AlertCircle, Rocket, ExternalLink, Code, Database } from 'lucide-react';
import { useDeployment } from '@/hooks/use-deployment';
import { useProjects } from '@/hooks/use-projects';
import { DeploymentConfig, DeploymentPlatform } from '@/lib/deployment/service';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Empty } from '@/components/Empty';

// Deployments page to handle deploying generated backends to various platforms
const Deployments = () => {
  const [deploymentPlatform, setDeploymentPlatform] = useState<DeploymentPlatform>('vercel');
  const [deploySettings, setDeploySettings] = useState<Record<string, string>>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Use the deployment hook
  const {
    isDeploying,
    deploymentProgress,
    deploymentStatus,
    deploymentResult,
    deploymentHistory,
    deployProject,
    clearDeploymentResult
  } = useDeployment();
  
  // Use the projects hook
  const { projects, currentProject, setCurrentProject } = useProjects();
  
  // Set initial settings based on platform
  useEffect(() => {
    // Reset settings when platform changes
    setDeploySettings({});
  }, [deploymentPlatform]);
  
  // Sample deployment configurations
  const deploymentConfigs = {
    vercel: {
      name: 'Vercel',
      logo: '▲',
      description: 'Serverless deployment with automatic CI/CD and previews',
      settings: [
        { name: 'projectName', label: 'Project Name', type: 'text', default: 'my-api', required: true },
        { name: 'environment', label: 'Environment', type: 'select', options: ['Production', 'Preview', 'Development'], default: 'Development' }
      ]
    },
    aws: {
      name: 'AWS Elastic Beanstalk',
      logo: '☁️',
      description: 'Managed AWS service for web applications',
      settings: [
        { name: 'projectName', label: 'Application Name', type: 'text', default: 'my-api', required: true },
        { name: 'environment', label: 'Environment Name', type: 'text', default: 'my-api-env', required: true },
        { name: 'instanceType', label: 'Instance Type', type: 'select', options: ['t2.micro', 't2.small', 't2.medium'], default: 't2.micro' }
      ]
    },
    heroku: {
      name: 'Heroku',
      logo: '⬢',
      description: 'Fully-managed platform with simple scaling',
      settings: [
        { name: 'projectName', label: 'App Name', type: 'text', default: 'my-api', required: true },
        { name: 'region', label: 'Region', type: 'select', options: ['United States', 'Europe'], default: 'United States' },
        { name: 'dynoType', label: 'Dyno Type', type: 'select', options: ['Free', 'Hobby', 'Standard-1X'], default: 'Free' }
      ]
    },
    docker: {
      name: 'Docker',
      logo: '🐳',
      description: 'Deploy using Docker containers for portability',
      settings: [
        { name: 'projectName', label: 'Container Name', type: 'text', default: 'api-container', required: true },
        { name: 'port', label: 'Port', type: 'text', default: '3000', required: true }
      ]
    }
  };
  
  // Function to handle setting changes
  const handleSettingChange = (name: string, value: string) => {
    setDeploySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Select a project for deployment
  const selectProject = (project: any) => {
    setSelectedProjectId(project.id);
    setCurrentProject(project);
    // Pre-fill project name in deployment settings
    handleSettingChange('projectName', project.name);
  };
  
  // Get the selected project
  const getSelectedProject = () => {
    return projects.find(p => p.id === selectedProjectId);
  };
  
  // Function to handle deployment initiation
  const handleDeploy = async () => {
    const project = getSelectedProject();
    if (!project || !project.generatedOutput) {
      console.error('Project has no generated output to deploy');
      return;
    }
    
    // Create deployment config
    const config: DeploymentConfig = {
      platform: deploymentPlatform,
      projectName: deploySettings.projectName || project.name,
      settings: deploySettings,
      environmentVariables: {
        NODE_ENV: 'production'
      }
    };
    
    // Call the deployment service
    await deployProject(project.generatedOutput, config);
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  const selectedProject = getSelectedProject();
  
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deployments</h1>
        <p className="text-muted-foreground mt-1">Deploy and manage your backend APIs</p>
      </div>
      
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Deployment</TabsTrigger>
          <TabsTrigger value="recent">Recent Deployments</TabsTrigger>
          <TabsTrigger value="settings">Deployment Settings</TabsTrigger>
        </TabsList>
        
        {/* New Deployment Tab */}
        <TabsContent value="new">
          {isDeploying ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary animate-pulse" />
                  <span>Deploying {selectedProject?.name}</span>
                </CardTitle>
                <CardDescription>
                  Deploying your backend to {deploymentConfigs[deploymentPlatform]?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{deploymentStatus}</span>
                    <span>{Math.round(deploymentProgress)}%</span>
                  </div>
                  <Progress value={deploymentProgress} className="h-2" />
                </div>
                <div className="bg-muted p-4 rounded-md max-h-40 overflow-y-auto text-sm font-mono">
                  <p>• Preparing deployment package...</p>
                  {deploymentProgress > 20 && <p>• Setting up environment variables...</p>}
                  {deploymentProgress > 40 && <p>• Uploading code to {deploymentConfigs[deploymentPlatform]?.name}...</p>}
                  {deploymentProgress > 70 && <p>• Building application...</p>}
                  {deploymentProgress > 90 && <p>• Finalizing deployment...</p>}
                  {deploymentProgress >= 100 && <p className="text-green-500">• Deployment completed successfully!</p>}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Selection Section */}
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-primary" />
                        <span>Select Project</span>
                      </CardTitle>
                      <CardDescription>Choose a project to deploy</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-[500px] overflow-y-auto">
                      {projects.length > 0 ? (
                        <div className="space-y-2">
                          {projects.map((project) => (
                            <div 
                              key={project.id} 
                              className={cn(
                                "p-3 rounded-md cursor-pointer border transition-all",
                                selectedProjectId === project.id 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/40"
                              )}
                              onClick={() => selectProject(project)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="font-medium flex items-center gap-2">
                                    {project.name}
                                    {project.lastDeployment && (
                                      <Badge className="text-xs">
                                        Deployed
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground line-clamp-2">
                                    {project.description}
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                      <Code className="h-3 w-3" />
                                      <span>{project.specification?.framework}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                      <Database className="h-3 w-3" />
                                      <span>{project.specification?.database}</span>
                                    </div>
                                  </div>
                                </div>
                                {selectedProjectId === project.id && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty 
                          icon={GitBranch}
                          title="No projects found"
                          description="Create a project first to deploy it"
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Deployment Configuration Section */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-primary" />
                        <span>Deployment Platform</span>
                      </CardTitle>
                      <CardDescription>Choose where to deploy your backend API</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(deploymentConfigs).map(([key, config]) => (
                          <Card 
                            key={key} 
                            className={cn(
                              "overflow-hidden transition-colors hover:shadow-md cursor-pointer",
                              deploymentPlatform === key ? 'border-primary bg-primary/5' : 'border-border'
                            )}
                            onClick={() => setDeploymentPlatform(key as DeploymentPlatform)}
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <span className="text-lg">{config.logo}</span>
                                  <span>{config.name}</span>
                                </CardTitle>
                                {deploymentPlatform === key && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {config.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedProject && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Terminal className="h-5 w-5 text-primary" />
                          <span>Deployment Configuration</span>
                        </CardTitle>
                        <CardDescription>Configure your deployment settings for {selectedProject.name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {deploymentConfigs[deploymentPlatform]?.settings.map((setting, index) => (
                            <div key={index} className="space-y-2">
                              <label htmlFor={setting.name} className="text-sm font-medium">
                                {setting.label}
                                {setting.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {setting.type === 'text' ? (
                                <Input 
                                  id={setting.name} 
                                  value={
                                    deploySettings[setting.name] || 
                                    (setting.name === 'projectName' ? selectedProject.name : setting.default)
                                  }
                                  onChange={(e) => handleSettingChange(setting.name, e.target.value)}
                                />
                              ) : (
                                <Select 
                                  value={deploySettings[setting.name] || setting.default}
                                  onValueChange={(value) => handleSettingChange(setting.name, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select ${setting.label}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {setting.options?.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-border p-4 flex justify-end">
                        <Button 
                          size="lg" 
                          className="gap-2"
                          onClick={handleDeploy}
                          disabled={!selectedProject.generatedOutput}
                        >
                          <Rocket className="h-4 w-4" />
                          <span>Deploy {selectedProject.name}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Recent Deployments Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCw className="h-5 w-5 text-primary" />
                <span>Recent Deployments</span>
              </CardTitle>
              <CardDescription>
                Monitor your recent deployments and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deploymentHistory.length > 0 ? (
                  deploymentHistory.map((deployment) => (
                    <Card key={deployment.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {deployment.projectId}
                              <Badge 
                                className={cn(
                                  "text-xs",
                                  deployment.status === 'deployed' ? 'bg-green-500' : 
                                  deployment.status === 'deploying' ? 'bg-blue-500' : 
                                  'bg-red-500'
                                )}
                              >
                                {deployment.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatRelativeTime(deployment.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {deployment.status === 'deployed' && deployment.url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                                onClick={() => window.open(deployment.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>View Live</span>
                              </Button>
                            )}
                            
                            {deployment.status === 'failed' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="gap-2"
                              >
                                <RotateCw className="h-4 w-4" />
                                <span>Retry</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {deployment.status === 'failed' && deployment.error && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <div className="flex items-center text-xs text-red-500 gap-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>{deployment.error}</span>
                            </div>
                          </div>
                        )}
                        
                        {deployment.status === 'deployed' && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Platform: </span>
                              <span>{deployment.platformSpecific?.platform || 'Unknown'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Region: </span>
                              <span>{deployment.platformSpecific?.region || 'Default'}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Empty 
                    icon={Cloud}
                    title="No deployments yet"
                    description="Deploy a project to see it here"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Deployment Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Environment Variables</span>
              </CardTitle>
              <CardDescription>
                Configure secrets and environment variables for your deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variable Name</label>
                    <Input placeholder="DATABASE_URL" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Value</label>
                    <Input placeholder="mongodb://localhost:27017/myapp" type="password" />
                  </div>
                  <div className="flex items-end">
                    <Button>Add Variable</Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Existing Variables</h3>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border rounded-md divide-y">
                    <div className="flex items-center p-3">
                      <div className="flex-1 font-mono text-sm">NODE_ENV</div>
                      <div className="flex-1 font-mono text-sm text-muted-foreground">production</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex items-center p-3">
                      <div className="flex-1 font-mono text-sm">PORT</div>
                      <div className="flex-1 font-mono text-sm text-muted-foreground">3000</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex items-center p-3">
                      <div className="flex-1 font-mono text-sm">DATABASE_URL</div>
                      <div className="flex-1 font-mono text-sm text-muted-foreground">••••••••••••</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                    <div className="flex items-center p-3">
                      <div className="flex-1 font-mono text-sm">JWT_SECRET</div>
                      <div className="flex-1 font-mono text-sm text-muted-foreground">••••••••••••</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Deployments; 