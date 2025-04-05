
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Plus, Github, Menu, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden text-foreground">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary/50 opacity-70 blur-sm"></div>
              <Sparkles className="relative h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground hidden sm:inline-block">AIForge</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center bg-card/30 border border-white/10 rounded-full px-3 flex-1 mx-8 max-w-md">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">3</span>
          </Button>
          
          <Button variant="secondary" size="sm" className="hidden sm:flex gap-2 bg-white/5 hover:bg-white/10 text-foreground border border-white/10">
            <Github className="h-4 w-4" />
            <span>Connect</span>
          </Button>
          
          <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-secondary text-white border-none">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
          
          <Avatar className="h-8 w-8 border border-white/20">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-white">U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
