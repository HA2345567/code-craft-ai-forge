
export interface Project {
  id: string;
  name: string;
  description?: string;
  framework: string;
  database: string;
  status: 'draft' | 'development' | 'deployed';
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  stars: number;
  tags: string[];
}
