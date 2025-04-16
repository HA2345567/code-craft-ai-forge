import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Code2Icon, 
  DatabaseIcon, 
  FolderIcon, 
  PlusIcon, 
  SearchIcon, 
  StarIcon,
  TagIcon,
  FilterIcon,
  RefreshCwIcon,
  DownloadIcon,
  ShareIcon,
  ClipboardCopyIcon
} from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { Project, CreateProjectParams } from "@/lib/projects/types";
import { formatDistanceToNow } from "date-fns";
import NewProjectModal from "@/components/projects/NewProjectModal";
import { Separator } from "@/components/ui/separator";
import { Empty } from "@/components/Empty";
import ProjectFilterPanel from "@/components/projects/ProjectFilterPanel";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ProjectActionMenu from "@/components/projects/ProjectActionMenu";
import { Skeleton } from "@/components/ui/skeleton";

const Projects = () => {
  const { 
    projects, 
    isLoading, 
    filter, 
    setFilter, 
    refreshProjects, 
    setCurrentProject,
    createProject,
    updateProject
  } = useProjects();
  
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>(undefined);
  const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  useEffect(() => {
    const storedFavorites = localStorage.getItem('project-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Error loading favorites:", e);
        localStorage.removeItem('project-favorites');
      }
    }
  }, []);
  
  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const tags = new Set<string>();
      projects.forEach(project => {
        project.tags?.forEach(tag => {
          if (tag) tags.add(tag);
        });
      });
      setAvailableTags(Array.from(tags));
    }
  }, [projects, isLoading]);
  
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
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    setFilter({
      ...filter,
      search: query || undefined
    });
  };
  
  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split("-");
    setFilter({
      ...filter,
      sortBy: sortBy as "name" | "created_at" | "updated_at",
      sortDirection: sortDirection as "asc" | "desc"
    });
  };
  
  const handleFrameworkChange = (value: string) => {
    const framework = value === "all" ? undefined : value;
    setSelectedFramework(framework);
    setFilter({
      ...filter,
      framework
    });
  };
  
  const handleDatabaseChange = (value: string) => {
    const database = value === "all" ? undefined : value;
    setSelectedDatabase(database);
    setFilter({
      ...filter,
      database
    });
  };
  
  const handleTagChange = (tags: string[]) => {
    setSelectedTags(tags);
    setFilter({
      ...filter,
      tags: tags.length > 0 ? tags : undefined
    });
  };
  
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  const handleProjectClick = (project: Project) => {
    setCurrentProject(project);
  };
  
  const toggleFavorite = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newFavorites = favorites.includes(projectId)
      ? favorites.filter(id => id !== projectId)
      : [...favorites, projectId];
    
    setFavorites(newFavorites);
    localStorage.setItem('project-favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(projectId) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(projectId) 
        ? "Project has been removed from your favorites" 
        : "Project has been added to your favorites",
      duration: 2000
    });
  };
  
  const copyProjectId = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(projectId);
    
    toast({
      title: "Project ID copied",
      description: "Project ID has been copied to clipboard",
      duration: 2000
    });
  };
  
  const shareProject = (project: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    
    toast({
      title: "Share Project",
      description: `Sharing options for "${project.name}" will be available soon`,
      duration: 2000
    });
  };
  
  const handleRefresh = () => {
    refreshProjects();
    toast({
      title: "Refreshed",
      description: "Project list has been refreshed",
      duration: 2000
    });
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFramework(undefined);
    setSelectedDatabase(undefined);
    setSelectedTags([]);
    setFilter({
      sortBy: "updated_at",
      sortDirection: "desc"
    });
    
    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
      duration: 2000
    });
  };
  
  const activeFiltersCount = [
    searchQuery, 
    selectedFramework, 
    selectedDatabase, 
    ...(selectedTags || [])
  ].filter(Boolean).length;
  
  const favoriteProjects = projects.filter(project => favorites.includes(project.id));
  
  const recentProjects = projects
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your backend API projects</p>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh} className="animate-in fade-in">
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh projects</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={() => setIsModalOpen(true)} className="animate-in fade-in">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="recent" className="relative">
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="relative">
              Favorites
              {favorites.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {favorites.length}
                </Badge>
              )}
            </TabsTrigger>
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
            
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <FilterIcon className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Filters</h4>
                    <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeFiltersCount === 0}>
                      Clear filters
                    </Button>
                  </div>
                  
                  <ProjectFilterPanel 
                    selectedFramework={selectedFramework}
                    selectedDatabase={selectedDatabase}
                    selectedTags={selectedTags}
                    availableTags={availableTags}
                    onFrameworkChange={handleFrameworkChange}
                    onDatabaseChange={handleDatabaseChange}
                    onTagChange={handleTagChange}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            <Select defaultValue="updated_at-desc" onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at-desc">Last Updated</SelectItem>
                <SelectItem value="created_at-desc">Newest</SelectItem>
                <SelectItem value="created_at-asc">Oldest</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3">
                    <Skeleton className="h-4 w-32" />
                  </CardFooter>
                </Card>
              ))
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover:shadow-md transition-shadow border-opacity-80 hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="truncate group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        {project.isPublic ? (
                          <Badge variant="outline" className="animate-in fade-in">Public</Badge>
                        ) : (
                          <Badge variant="outline" className="animate-in fade-in">Private</Badge>
                        )}
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => toggleFavorite(project.id, e)}
                              >
                                <StarIcon 
                                  className={cn(
                                    "h-4 w-4", 
                                    favorites.includes(project.id) 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-muted-foreground"
                                  )} 
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {favorites.includes(project.id) ? "Remove from favorites" : "Add to favorites"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs group-hover:bg-secondary/70 transition-colors">
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
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ProjectActionMenu project={project} />
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3">
                <Empty
                  icon={FolderIcon}
                  title="No projects found"
                  description="Create a new project to get started or adjust your filters"
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
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <Skeleton className="h-4 w-32" />
                  </CardFooter>
                </Card>
              ))
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover:shadow-md transition-shadow border-opacity-80 hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="truncate group-hover:text-primary transition-colors">{project.name}</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <Skeleton className="h-4 w-32" />
                  </CardFooter>
                </Card>
              ))
            ) : favoriteProjects.length > 0 ? (
              favoriteProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover:shadow-md transition-shadow border-opacity-80 hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="truncate group-hover:text-primary transition-colors">{project.name}</CardTitle>
                        <CardDescription className="truncate">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => toggleFavorite(project.id, e)}
                      >
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
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
                  icon={StarIcon}
                  title="No favorite projects"
                  description="Mark projects as favorites to see them here"
                />
              </div>
            )}
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
