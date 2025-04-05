
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Code, MoreVertical } from 'lucide-react';
import { Project } from '@/types/project';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col h-full gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Framework</p>
            <p className="text-sm">{project.framework}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Database</p>
            <p className="text-sm">{project.database}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${project.status === 'deployed' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              <p className="text-sm capitalize">{project.status}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1 gap-2">
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-2">
          <Code className="h-4 w-4" />
          <span>Code</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
