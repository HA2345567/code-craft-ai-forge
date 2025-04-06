import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink, Code, Database, Settings } from 'lucide-react';
import { Project } from '@/data/mock-data';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {formatDate(project.lastModified)}</span>
            </div>
          </div>
          <Badge 
            variant={
              project.deploymentStatus === 'deployed' ? 'default' : 
              project.deploymentStatus === 'development' ? 'secondary' : 
              'outline'
            }
            className="text-xs"
          >
            {project.deploymentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Code className="h-3 w-3 text-blue-400" />
            <span>{project.framework}</span>
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3 text-green-400" />
            <span>{project.database}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-[10px] h-4">
              {project.apiStyle}
            </Badge>
          </div>
          {project.stats && (
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <span>
                {project.stats.endpoints} endpoints
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t border-border mt-auto flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Settings className="h-3.5 w-3.5 mr-1.5" />
          <span>Edit</span>
        </Button>
        {project.deploymentStatus === 'deployed' && (
          <Button size="sm" className="flex-1">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            <span>View</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
