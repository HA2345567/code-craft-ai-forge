import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagInput } from '@/components/ui/tag-input';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateProjectParams } from '@/lib/projects/types';
import { FrameworkType, DatabaseType, AuthStrategy } from '@/lib/ai-engine/types';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (params: CreateProjectParams) => Promise<boolean>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [framework, setFramework] = useState<FrameworkType | ''>('');
  const [database, setDatabase] = useState<DatabaseType | ''>('');
  const [auth, setAuth] = useState<AuthStrategy | ''>('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Frameworks options
  const frameworks: FrameworkType[] = [
    'Express', 
    'NestJS', 
    'Fastify', 
    'Koa', 
    'Hapi', 
    'Django', 
    'Flask', 
    'FastAPI', 
    'Spring Boot', 
    'Laravel'
  ];
  
  // Database options
  const databases: DatabaseType[] = [
    'PostgreSQL', 
    'MySQL', 
    'MongoDB', 
    'SQLite', 
    'Redis', 
    'DynamoDB', 
    'Firestore',
    'Supabase'
  ];
  
  // Auth strategy options
  const authStrategies: AuthStrategy[] = [
    'JWT', 
    'OAuth2', 
    'Session', 
    'Basic', 
    'API Key', 
    'Passport', 
    'Auth0', 
    'Firebase Auth',
    'Clerk'
  ];
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    // Create an initial specification if framework or database is selected
    const specification = (framework || database || auth) ? {
      name,
      description,
      framework: framework as FrameworkType,
      database: database as DatabaseType,
      authentication: auth as AuthStrategy,
      entities: [],
      endpoints: [],
      relationships: []
    } : undefined;
    
    try {
      const success = await onCreate({
        name,
        description,
        tags,
        isPublic,
        specification
      });
      
      if (success) {
        // Reset form
        setName('');
        setDescription('');
        setTags([]);
        setIsPublic(false);
        setFramework('');
        setDatabase('');
        setAuth('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when modal closes
  const handleClose = () => {
    setName('');
    setDescription('');
    setTags([]);
    setIsPublic(false);
    setFramework('');
    setDatabase('');
    setAuth('');
    setError(null);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter the details for your new backend API project.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My API Project"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of your project"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <TagInput
                id="tags"
                placeholder="Add a tag..."
                tags={tags}
                setTags={setTags}
              />
              <p className="text-sm text-muted-foreground">
                Press enter to add a tag
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="framework" className="text-right">
                  Framework
                </Label>
                <Select value={framework} onValueChange={(value) => setFramework(value as FrameworkType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {frameworks.map((fw) => (
                      <SelectItem key={fw} value={fw}>
                        {fw}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database" className="text-right">
                  Database
                </Label>
                <Select value={database} onValueChange={(value) => setDatabase(value as DatabaseType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {databases.map((db) => (
                      <SelectItem key={db} value={db}>
                        {db}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="auth" className="text-right">
                Authentication
              </Label>
              <Select value={auth} onValueChange={(value) => setAuth(value as AuthStrategy)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select authentication strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {authStrategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label htmlFor="isPublic">Make this project public</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal; 