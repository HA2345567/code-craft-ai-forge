/**
 * Mock data for AIForge
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  database: string;
  apiStyle: string;
  deploymentStatus: 'deployed' | 'development' | 'draft';
  lastModified: string;
  createdAt: string;
  stats?: {
    endpoints: number;
    models: number;
    linesOfCode: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  stars: number;
  framework: string;
  database: string;
  apiStyle: string;
}

// Sample recent projects
export const recentProjects: Project[] = [
  {
    id: 'p1',
    name: 'E-commerce API',
    description: 'Backend API for an e-commerce platform with products, users, and orders',
    framework: 'Express.js',
    database: 'MongoDB',
    apiStyle: 'REST',
    deploymentStatus: 'deployed',
    lastModified: '2023-08-15T10:30:00Z',
    createdAt: '2023-08-01T14:22:00Z',
    stats: {
      endpoints: 24,
      models: 8,
      linesOfCode: 3250
    }
  },
  {
    id: 'p2',
    name: 'Task Manager',
    description: 'Project management API with tasks, projects, and user assignments',
    framework: 'NestJS',
    database: 'PostgreSQL',
    apiStyle: 'GraphQL',
    deploymentStatus: 'development',
    lastModified: '2023-08-18T09:15:00Z',
    createdAt: '2023-08-10T11:45:00Z',
    stats: {
      endpoints: 18,
      models: 6,
      linesOfCode: 2800
    }
  },
  {
    id: 'p3',
    name: 'Blog API',
    description: 'Content management system with posts, comments, and users',
    framework: 'Express.js',
    database: 'MongoDB',
    apiStyle: 'REST',
    deploymentStatus: 'draft',
    lastModified: '2023-08-20T16:45:00Z',
    createdAt: '2023-08-19T13:30:00Z',
    stats: {
      endpoints: 12,
      models: 4,
      linesOfCode: 1650
    }
  }
];

// Sample popular templates
export const popularTemplates: Template[] = [
  {
    id: 't1',
    name: 'RESTful CRUD API',
    description: 'Standard REST API with complete CRUD operations',
    category: 'API',
    tags: ['REST', 'CRUD', 'Authentication'],
    stars: 487,
    framework: 'Express.js',
    database: 'MongoDB',
    apiStyle: 'REST'
  },
  {
    id: 't2',
    name: 'E-commerce Backend',
    description: 'Fully featured e-commerce API with products, cart, and checkout',
    category: 'E-commerce',
    tags: ['Products', 'Orders', 'Payments', 'Users'],
    stars: 352,
    framework: 'NestJS',
    database: 'PostgreSQL',
    apiStyle: 'GraphQL'
  },
  {
    id: 't3',
    name: 'Authentication Starter',
    description: 'Complete authentication system with JWT, social login, and role-based access',
    category: 'Authentication',
    tags: ['JWT', 'OAuth', 'Roles', 'Permissions'],
    stars: 289,
    framework: 'Express.js',
    database: 'MongoDB',
    apiStyle: 'REST'
  },
  {
    id: 't4',
    name: 'Content API',
    description: 'CMS backend with content types, media management, and versioning',
    category: 'Content',
    tags: ['CMS', 'Media', 'Content'],
    stars: 245,
    framework: 'FastAPI',
    database: 'PostgreSQL',
    apiStyle: 'REST'
  },
  {
    id: 't5',
    name: 'Real-time Chat Backend',
    description: 'Messaging API with WebSockets, user presence, and notifications',
    category: 'Communication',
    tags: ['WebSockets', 'Real-time', 'Notifications'],
    stars: 213,
    framework: 'NestJS',
    database: 'MongoDB',
    apiStyle: 'GraphQL'
  },
  {
    id: 't6',
    name: 'Task Management API',
    description: 'Project and task management system with assignments and tracking',
    category: 'Productivity',
    tags: ['Tasks', 'Projects', 'Teams'],
    stars: 178,
    framework: 'Django',
    database: 'PostgreSQL',
    apiStyle: 'REST'
  }
];
