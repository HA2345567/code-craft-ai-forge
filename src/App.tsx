import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DeploymentProvider } from "@/hooks/use-deployment";
import { ProjectProvider } from "@/hooks/use-projects";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ApiBuilder from "./pages/ApiBuilder";
import DataModels from "./pages/DataModels";
import Deployments from "./pages/Deployments";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProjectProvider>
        <DeploymentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="api-builder" element={<ApiBuilder />} />
                <Route path="data-models" element={<DataModels />} />
                <Route path="projects" element={<Projects />} />
                <Route path="deployments" element={<Deployments />} />
                <Route path="settings" element={<Dashboard />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DeploymentProvider>
      </ProjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
