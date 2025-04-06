
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Framework and database options
const frameworks = [
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

const databases = [
  'PostgreSQL', 
  'MySQL', 
  'MongoDB', 
  'SQLite', 
  'Redis', 
  'DynamoDB', 
  'Firestore',
  'Supabase'
];

interface ProjectFilterPanelProps {
  selectedFramework?: string;
  selectedDatabase?: string;
  selectedTags: string[];
  availableTags: string[];
  onFrameworkChange: (value: string) => void;
  onDatabaseChange: (value: string) => void;
  onTagChange: (tags: string[]) => void;
}

const ProjectFilterPanel = ({
  selectedFramework,
  selectedDatabase,
  selectedTags,
  availableTags,
  onFrameworkChange,
  onDatabaseChange,
  onTagChange
}: ProjectFilterPanelProps) => {
  
  // Toggle a tag in the selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };
  
  // Remove a tag from selection
  const removeTag = (tag: string) => {
    onTagChange(selectedTags.filter(t => t !== tag));
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="framework">Framework</Label>
        <Select 
          value={selectedFramework || "all"} 
          onValueChange={onFrameworkChange}
        >
          <SelectTrigger id="framework">
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All frameworks</SelectItem>
            {frameworks.map((fw) => (
              <SelectItem key={fw} value={fw}>{fw}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>
        <Select 
          value={selectedDatabase || "all"} 
          onValueChange={onDatabaseChange}
        >
          <SelectTrigger id="database">
            <SelectValue placeholder="Select database" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All databases</SelectItem>
            {databases.map((db) => (
              <SelectItem key={db} value={db}>{db}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label>Tags</Label>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <XIcon 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeTag(tag)} 
                />
              </Badge>
            ))}
          </div>
        )}
        
        {availableTags.length > 0 ? (
          <ScrollArea className="h-32 w-full rounded-md border">
            <div className="p-2 flex flex-wrap gap-1">
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={cn(
                    "cursor-pointer hover:bg-secondary/50",
                    selectedTags.includes(tag) && "bg-secondary"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-sm text-muted-foreground py-2">
            No tags available in projects
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilterPanel;
