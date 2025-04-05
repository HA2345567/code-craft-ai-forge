
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CodeXml, Download, Copy, Play, ChevronsUpDown } from 'lucide-react';
import CodePreview from '@/components/builder/CodePreview';

const ApiBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleGenerateCode = () => {
    if (!prompt) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Builder</h1>
        <p className="text-muted-foreground mt-1">Generate backend APIs using natural language</p>
      </div>
      
      <Card>
        <CardHeader className="p-4 border-b border-border">
          <CardTitle className="text-lg flex items-center gap-2">
            <CodeXml className="h-5 w-5 text-ai-primary" />
            <span>Generate API</span>
          </CardTitle>
          <CardDescription>
            Describe your API requirements and our AI will generate the code
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="framework" className="text-sm font-medium">Framework</label>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Compare Frameworks
                  </Button>
                </div>
                <Select defaultValue="express">
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
                <Select defaultValue="mongodb">
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
                <label htmlFor="name" className="text-sm font-medium">Project Name</label>
                <Input id="name" placeholder="My Backend API" />
              </div>
            </div>
            
            <div className="space-y-2 flex flex-col">
              <label htmlFor="prompt" className="text-sm font-medium">Describe Your API</label>
              <Textarea 
                id="prompt"
                placeholder="Describe your API requirements in natural language. For example: 'Create a REST API for a blog with posts and comments. Include user authentication and authorization.'"
                className="flex-1"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-border flex justify-end">
          <Button 
            onClick={handleGenerateCode}
            disabled={loading || !prompt}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Generate Code</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="code" className="w-full">
        <TabsList>
          <TabsTrigger value="code">Code Preview</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="models">Data Models</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Code</CardTitle>
                <CardDescription>Auto-generated based on your requirements</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CodePreview />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="endpoints" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                Generate code first to see API endpoints
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                Generate code first to see data models
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiBuilder;
