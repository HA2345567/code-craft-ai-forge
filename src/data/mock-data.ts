
import { Project, Template } from '@/types/project';

export const recentProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce API',
    framework: 'Express.js',
    database: 'MongoDB',
    status: 'deployed',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-04-02T14:30:00Z',
  },
  {
    id: '2',
    name: 'Blog Backend',
    framework: 'NestJS',
    database: 'PostgreSQL',
    status: 'development',
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-04-01T11:20:00Z',
  },
  {
    id: '3',
    name: 'Task Manager API',
    framework: 'FastAPI',
    database: 'SQLite',
    status: 'development',
    createdAt: '2025-03-28T16:45:00Z',
    updatedAt: '2025-03-30T09:15:00Z',
  },
];

export const popularTemplates: Template[] = [
  {
    id: '1',
    name: 'REST API Starter',
    description: 'Complete REST API boilerplate with authentication, CRUD operations, and documentation.',
    category: 'Backend',
    stars: 4.8,
    tags: ['Express', 'MongoDB', 'JWT'],
  },
  {
    id: '2',
    name: 'GraphQL Server',
    description: 'Modern GraphQL server with schema definitions, resolvers, and database integration.',
    category: 'API',
    stars: 4.7,
    tags: ['GraphQL', 'Apollo', 'PostgreSQL'],
  },
  {
    id: '3',
    name: 'Microservice Template',
    description: 'Scalable microservice architecture with message queues and service discovery.',
    category: 'Architecture',
    stars: 4.5,
    tags: ['NestJS', 'RabbitMQ', 'Docker'],
  },
];
