
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CodeXml, Download, Copy, Play, FileJson, Server, Database, Webhook } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CodePreview from '@/components/builder/CodePreview';

const ApiBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = () => {
    if (!prompt) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast({
        title: "Backend Code Generated",
        description: "Your API code has been successfully generated",
      });
    }, 2000);
  };
  
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
              <label htmlFor="architecture" className="text-sm font-medium">API Style</label>
              <Select defaultValue="rest">
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
              <Input id="name" placeholder="my-backend-api" />
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
                  <span>Generate Backend</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
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
                <Button variant="outline" size="sm" onClick={() => {
                  toast({ 
                    title: "Code copied to clipboard",
                    description: "The generated code has been copied to your clipboard" 
                  });
                }}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({ 
                    title: "Code downloaded",
                    description: "The generated code has been downloaded as a zip file" 
                  });
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              {!generated ? (
                <div className="flex justify-center items-center h-[500px] text-muted-foreground">
                  Generate backend code first to see the preview
                </div>
              ) : (
                <CodePreview />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="endpoints" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generated ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see API endpoints
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs font-mono">GET</div>
                      <div className="font-mono text-sm text-white">/api/posts</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all blog posts</p>
                  </div>
                  
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs font-mono">POST</div>
                      <div className="font-mono text-sm text-white">/api/posts</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Create a new blog post</p>
                  </div>
                  
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs font-mono">GET</div>
                      <div className="font-mono text-sm text-white">/api/posts/:id</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Get a specific blog post</p>
                  </div>
                  
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-mono">PUT</div>
                      <div className="font-mono text-sm text-white">/api/posts/:id</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Update a blog post</p>
                  </div>
                  
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs font-mono">DELETE</div>
                      <div className="font-mono text-sm text-white">/api/posts/:id</div>
                    </div>
                    <p className="text-sm text-muted-foreground">Delete a blog post</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generated ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see data models
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <h3 className="text-lg font-medium mb-3">Post</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">id</div>
                        <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">ObjectID</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">title</div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">String</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">content</div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">String</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">author</div>
                        <div className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Ref: User</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">createdAt</div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Date</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">updatedAt</div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Date</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-secondary/40 p-4 border border-white/5">
                    <h3 className="text-lg font-medium mb-3">User</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">id</div>
                        <div className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">ObjectID</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">username</div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">String</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">email</div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">String</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">password</div>
                        <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">String (hashed)</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">createdAt</div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Date</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">updatedAt</div>
                        <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="docs" className="mt-4">
          <Card className="glass-dark">
            <CardContent className="p-6">
              {!generated ? (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  Generate backend code first to see API documentation
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <h2>API Documentation</h2>
                  <p>This documentation describes the endpoints available in your generated API.</p>
                  
                  <h3>Authentication</h3>
                  <p>This API uses JWT tokens for authentication. Include the token in the Authorization header:</p>
                  <pre className="bg-secondary/40 p-3 rounded-md overflow-x-auto"><code>Authorization: Bearer your-token-here</code></pre>
                  
                  <h3>Base URL</h3>
                  <p><code className="bg-secondary/40 px-1 py-0.5 rounded">http://localhost:3000/api</code></p>
                  
                  <h3>Endpoints</h3>
                  <h4>Authentication</h4>
                  <ul>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">POST /auth/register</code> - Register a new user</li>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">POST /auth/login</code> - Login and get JWT token</li>
                  </ul>
                  
                  <h4>Posts</h4>
                  <ul>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">GET /posts</code> - Get all posts</li>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">POST /posts</code> - Create a new post (requires authentication)</li>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">GET /posts/:id</code> - Get a specific post</li>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">PUT /posts/:id</code> - Update a post (requires authentication)</li>
                    <li><code className="bg-secondary/40 px-1 py-0.5 rounded">DELETE /posts/:id</code> - Delete a post (requires authentication)</li>
                  </ul>
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
