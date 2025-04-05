
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
  LucideIcon 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <CodeXml className="h-6 w-6 text-ai-primary" />
          <span className="font-bold text-lg">AIForge</span>
        </div>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start text-muted-foreground gap-2">
          <Settings className="h-4 w-4" />
          <span>Account Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
