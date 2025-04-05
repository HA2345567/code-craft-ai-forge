
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  CodeXml, 
  Database, 
  Ship, 
  Settings, 
  LayoutDashboard, 
  LucideIcon,
  Sparkles,
  GitBranch,
  Star,
  Cpu,
  Terminal,
  Cloud
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutDashboard,
    badge: 4
  },
  {
    title: "API Builder",
    href: "/api-builder",
    icon: CodeXml,
  },
  {
    title: "Data Models",
    href: "/data-models",
    icon: Database,
  },
  {
    title: "Deployments",
    href: "/deployments",
    icon: Ship,
    badge: 2
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-white/10 bg-sidebar/80 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary/50 opacity-70 blur-sm"></div>
            <Sparkles className="relative h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">AIForge</span>
        </div>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2 space-y-6">
          <div>
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Main
            </h3>
            <div className="space-y-1">
              {sidebarNavItems.slice(0, 3).map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Development
            </h3>
            <div className="space-y-1">
              {sidebarNavItems.slice(3).map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t border-white/10">
        <div className="bg-card/30 rounded-lg border border-white/10 p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Credits</span>
            </div>
            <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">1,850</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{width: '65%'}}></div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground gap-2 hover:bg-white/5 hover:text-foreground">
          <Settings className="h-4 w-4" />
          <span>Account Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
