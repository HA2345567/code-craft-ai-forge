
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/projects/types";
import { useToast } from "@/hooks/use-toast";
import { 
  MoreHorizontalIcon, 
  ClipboardCopyIcon, 
  DownloadIcon, 
  ShareIcon, 
  TrashIcon, 
  FolderOpenIcon, 
  EditIcon, 
  GitBranchIcon 
} from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectActionMenuProps {
  project: Project;
}

const ProjectActionMenu = ({ project }: ProjectActionMenuProps) => {
  const { toast } = useToast();
  const { deleteProject } = useProjects();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Copy project ID to clipboard
  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.id);
    
    toast({
      title: "Project ID copied",
      description: "Project ID has been copied to clipboard",
      duration: 2000
    });
  };
  
  // Share project (mock functionality)
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "Share Project",
      description: `Sharing options for "${project.name}" will be available soon`,
      duration: 2000
    });
  };
  
  // Export project (mock functionality)
  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "Export Project",
      description: `Project "${project.name}" will be exported soon`,
      duration: 2000
    });
  };
  
  // Connect to GitHub (mock functionality)
  const handleGitHub = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "GitHub Integration",
      description: "GitHub integration will be available soon",
      duration: 2000
    });
  };
  
  // Open project editor (mock functionality)
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "Opening Project",
      description: `Opening "${project.name}" in editor`,
      duration: 2000
    });
  };
  
  // Delete project
  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Project deleted",
        description: `Project "${project.name}" has been deleted`,
        duration: 2000
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleOpen}>
            <FolderOpenIcon className="mr-2 h-4 w-4" />
            Open
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopyId}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleShare}>
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleGitHub}>
            <GitBranchIcon className="mr-2 h-4 w-4" />
            Connect to GitHub
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="text-destructive"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{project.name}" and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectActionMenu;
