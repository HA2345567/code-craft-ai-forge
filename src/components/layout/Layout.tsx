
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'} overflow-auto`}>
          <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
            <div className="relative z-10 container mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-background/10 rounded-3xl blur-3xl -z-10"></div>
              <div className="relative backdrop-blur-sm bg-card/30 rounded-3xl border border-white/10 shadow-dark-lg p-6">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
