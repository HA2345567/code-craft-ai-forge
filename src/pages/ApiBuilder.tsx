import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CodeXml, Download, Copy, Play, FileJson, Server, Database, Webhook, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CodePreview from '@/components/builder/CodePreview';
import { useAIEngine, createDefaultAIEngineInput } from '@/hooks/use-ai-engine';
import { FrameworkType, DatabaseType, APIStyle, AIEngineInput, Feature } from '@/lib/ai-engine/types';
import { Progress } from '@/components/ui/progress';

const ApiBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [projectName, setProjectName] = useState('my-backend-api');
  const [framework, setFramework] = useState<FrameworkType>('express');
  const [database, setDatabase] = useState<DatabaseType>('mongodb');
  const [apiStyle, setApiStyle] = useState<APIStyle>('rest');
  const [features, setFeatures] = useState<Feature[]>(['authentication']);
  
  const { toast } = useToast();
  const { 
    isGenerating, 
    progress, 
    generatedOutput, 
    generateBackend,
    downloadCode
  } = useAIEngine();
  
  const handleToggleFeature = (feature: Feature) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  const handleGenerateCode = async () => {
    if (!prompt || !projectName) {
      toast({
        title: "Missing Information",
        description: "Please provide a project name and API description",
        variant: "destructive"
      });
      return;
    }
    
    const input: AIEngineInput = {
      ...createDefaultAIEngineInput(projectName, prompt),
      framework,
      database,
      apiStyle,
      features,
      dataModels: [
        {
          name: "User",
          tableName: "users",
          fields: [
            {
              name: "username",
              type: "string",
              required: true,
              unique: true,
              validations: [{ type: "minLength", value: 3 }]
            },
            {
              name: "email",
              type: "string",
              required: true,
              unique: true,
              validations: [{ type: "pattern", value: "email" }]
            },
            {
              name: "password",
              type: "string",
              required: true,
              unique: false,
              validations: [{ type: "minLength", value: 8 }]
            }
          ],
          relationships: [],
          timestamps: true,
          softDeletes: false
        }
      ],
      entities: [],
      endpoints: [],
      relationships: [],
      name: projectName,
      authentication: 'JWT'
    };
    
    await generateBackend(input);
  };
  
  const handleCopyCode = () => {
    if (!generatedOutput) return;
    
    toast({ 
      title: "Code copied to clipboard",
      description: "The generated code has been copied to your clipboard" 
    });
  };
  
  const codeFiles = generatedOutput?.files?.map(file => ({
    path: file.path,
    content: file.content,
    language: (file.language as 'javascript' | 'typescript' | 'python' | 'ruby' | 'java' | 'yaml' | 'json' | 'other') || 'other'
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-dark">Backend API Generator</h1>
        <p className="text-muted-foreground mt-1">Generate production-ready backend APIs using natural language</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-4 border-b border-border">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <span>Backend Architecture</span>
            </CardTitle>
            <CardDescription>
              Configure your backend stack
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="framework" className="text-sm font-medium">Framework</label>
              <Select 
                value={framework}
                onValueChange={(value) => setFramework(value as FrameworkType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="express">Express.js</SelectItem>
                  <SelectItem value="nestjs">NestJS</SelectItem>
                  <SelectItem value="fastapi">FastAPI (Python)</SelectItem>
                  <SelectItem value="django">Django REST (Python)</SelectItem>
                  <SelectItem value="rails">Ruby on Rails</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="database" className="text-sm font-medium">Database</label>
              <Select 
                value={database}
                onValueChange={(value) => setDatabase(value as DatabaseType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="architecture" className="text-sm font-medium">API Style</label>
              <Select 
                value={apiStyle}
                onValueChange={(value) => setApiStyle(value as APIStyle)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an API style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rest">REST API</SelectItem>
                  <SelectItem value="graphql">GraphQL</SelectItem>
                  <SelectItem value="grpc">gRPC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Project Name</label>
              <Input 
                id="name" 
                placeholder="my-backend-api" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Features</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="authentication" 
                    checked={features.includes('authentication')}
                    onChange={() => handleToggleFeature('authentication')}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="authentication" className="text-sm">Authentication</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="fileUpload"
                    checked={features.includes('fileUpload')}
                    onChange={() => handleToggleFeature('fileUpload')}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="fileUpload" className="text-sm">File Uploads</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="logging"
                    checked={features.includes('logging')}
                    onChange={() => handleToggleFeature('logging')}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="logging" className="text-sm">Logging</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="swagger"
                    checked={features.includes('swagger')}
                    onChange={() => handleToggleFeature('swagger')}
                    className="w-4 h-4" 
                  />
                  <label htmlFor="swagger" className="text-sm">Swagger Docs</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CodeXml className="h-5 w-5 text-primary" />
                  <span>Describe Your API</span>
                </CardTitle>
                <CardDescription>
                  Describe the API endpoints and functionality you need
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setPrompt("Create a REST API for a blog with posts and comments. Include authentication with JWT. Add endpoints for user registration and login. Posts should have title, content, author, and creation date. Comments should have content, author, and creation date.");
                  }}
                >
                  <FileJson className="h-4 w-4" />
                  <span>Template</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Textarea 
              placeholder="Describe your API requirements in natural language. For example: 'Create a REST API for a blog with posts and comments. Include user authentication and authorization.'"
              className="min-h-[200px] resize-none bg-secondary/50 font-mono text-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </CardContent>
          <CardFooter className="p-4 border-t border-border flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Auto-generates database models</span>
              </div>
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Creates API endpoints</span>
              </div>
            </div>
            <Button 
              onClick={handleGenerateCode}
              disabled={isGenerating || !prompt}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Generate Backend</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {isGenerating && (
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold">Generating API Code</div>
              <div className="text-sm">{Math.round(progress)}%</div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-sm text-muted-foreground space-y-1">
              {progress > 10 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Analyzing requirements</span>
                </div>
              )}
              {progress > 30 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Generating data models</span>
                </div>
              )}
              {progress > 50 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Creating API endpoints</span>
                </div>
              )}
              {progress > 70 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Implementing business logic</span>
                </div>
              )}
              {progress > 90 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Finalizing code structure</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="glass-dark">
          <TabsTrigger value="code" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Code Preview</TabsTrigger>
          <TabsTrigger value="endpoints" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Endpoints</TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Data Models</TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Documentation</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-4">
          <Card className="glass-dark overflow-hidden">
            <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-gradient-dark">Generated Backend Code</CardTitle>
                <CardDescription>Auto-generated code based on your requirements</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyCode}
                  disabled={!generatedOutput}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadCode}
                  disabled={!generatedOutput}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              {!generatedOutput ? (
                <div className="flex justify-center items-center h-[500px] text-muted-foreground">
                  Generate backend code first to see the preview
                </div>
              ) : (
                <CodePreview files={codeFiles} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="endpoints" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generatedOutput ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see API endpoints
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedOutput?.apiDocs?.endpoints?.map((endpoint, index) => (
                    <div key={index} className="rounded-md bg-secondary/40 p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`
                          px-2 py-1 rounded text-xs font-mono
                          ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-500' : 
                            endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-500' :
                            endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-500' :
                            endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-500' :
                            'bg-purple-500/20 text-purple-500'}
                        `}>
                          {endpoint.method}
                        </div>
                        <div className="font-mono text-sm text-white">{endpoint.path}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generatedOutput ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see data models
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {generatedOutput?.apiDocs?.models?.map((model, index) => (
                    <div key={index} className="rounded-md bg-secondary/40 p-4 border border-white/5">
                      <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                      <div className="space-y-2">
                        {model.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="flex items-start py-1 border-b border-white/5 last:border-0">
                            <div className="w-1/3 font-mono text-xs">{field.name}</div>
                            <div className="w-1/3 text-xs text-blue-400">{field.type}</div>
                            <div className="w-1/3 text-xs text-muted-foreground">{field.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="docs" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generatedOutput ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see API documentation
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Overview</h2>
                    <div className="bg-secondary/20 p-4 rounded-md border border-white/5">
                      <pre className="text-sm whitespace-pre-wrap">{generatedOutput?.apiDocs?.overview}</pre>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Setup Instructions</h2>
                    <div className="bg-secondary/20 p-4 rounded-md border border-white/5 font-mono">
                      <pre className="text-sm whitespace-pre-wrap">{generatedOutput?.setupInstructions?.join('\n')}</pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiBuilder;
