import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Code2Icon, DatabaseIcon, FolderIcon, PlusIcon, SearchIcon, TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { Project, CreateProjectParams } from "@/lib/projects/types";
import { formatDistanceToNow } from "date-fns";
import NewProjectModal from "@/components/projects/NewProjectModal";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Empty } from "@/components/Empty";

const Projects = () => {
  const { 
    projects, 
    isLoading, 
    filter, 
    setFilter, 
    refreshProjects, 
    setCurrentProject, 
    createProject 
  } = useProjects();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Handle project creation
  const handleCreateProject = async (params: CreateProjectParams) => {
    try {
      await createProject(params);
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Error creating project:", error);
      return false;
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Update filter with search query
    setFilter({
      ...filter,
      search: query || undefined
    });
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split("-");
    setFilter({
      ...filter,
      sortBy: sortBy as "name" | "createdAt" | "updatedAt",
      sortDirection: sortDirection as "asc" | "desc"
    });
  };
  
  // Handle framework filter change
  const handleFrameworkChange = (value: string) => {
    setFilter({
      ...filter,
      framework: value === "all" ? undefined : value
    });
  };
  
  // Handle database filter change
  const handleDatabaseChange = (value: string) => {
    setFilter({
      ...filter,
      database: value === "all" ? undefined : value
    });
  };
  
  // Format the date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  // Handle click on a project
  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
    // Navigate to project details or API builder with this project
    // We'll implement this navigation in a future update
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your backend API projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-[250px] pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select defaultValue="updatedAt-desc" onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt-desc">Last Updated</SelectItem>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="createdAt-asc">Oldest</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-3 py-8 flex justify-center">
                <div className="animate-pulse flex flex-col gap-4 w-full max-w-md">
                  <div className="h-12 bg-muted rounded-md" />
                  <div className="h-32 bg-muted rounded-md" />
                  <div className="h-12 bg-muted rounded-md" />
                </div>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="truncate">{project.name}</CardTitle>
                        <CardDescription className="truncate">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <div>
                        {project.isPublic ? (
                          <Badge variant="outline">Public</Badge>
                        ) : (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(!project.tags || project.tags.length === 0) && (
                        <span className="text-muted-foreground text-sm">No tags</span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{project.specification?.database || "Not set"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Code2Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{project.specification?.framework || "Not set"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Updated {formatDate(new Date(project.updatedAt))}</span>
                    </div>
                    <div>
                      {project.version > 1 && (
                        <span>v{project.version}</span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <Empty
                  icon={FolderIcon}
                  title="No projects found"
                  description="Create a new project to get started"
                  action={
                    <Button onClick={() => setIsModalOpen(true)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-3 py-8 flex justify-center">
                <div className="animate-pulse flex flex-col gap-4 w-full max-w-md">
                  <div className="h-12 bg-muted rounded-md" />
                  <div className="h-32 bg-muted rounded-md" />
                  <div className="h-12 bg-muted rounded-md" />
                </div>
              </div>
            ) : projects.length > 0 ? (
              projects
                .slice()
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 6)
                .map((project) => (
                  <Card 
                    key={project.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleProjectClick(project)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="truncate">{project.name}</CardTitle>
                          <CardDescription className="truncate">
                            {project.description || "No description"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>Updated {formatDate(new Date(project.updatedAt))}</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-3">
                <Empty
                  icon={FolderIcon}
                  title="No recent projects"
                  description="Your recently updated projects will appear here"
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-0">
          <div className="col-span-3">
            <Empty
              icon={FolderIcon}
              title="No favorite projects"
              description="Mark projects as favorites to see them here"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateProject} 
      />
    </div>
  );
};

export default Projects; 