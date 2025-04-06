import {
  AIEngineInput,
  AIEngineOutput,
  BackendFramework,
  CodeFile,
  DatabaseType,
  APIStyle,
  Feature,
  GeneratedFile,
  Dependency,
  APIDocumentation,
  EndpointDocumentation
} from './types';

/**
 * AI Engine Service - Responsible for generating backend code based on user requirements
 */
export class AIEngineService {
  private apiKey: string;
  private modelName: string;
  
  constructor(apiKey: string, modelName: string = 'gpt-4-turbo') {
    this.apiKey = apiKey;
    this.modelName = modelName;
  }
  
  /**
   * Generate code based on user specifications
   */
  async generateCode(input: AIEngineInput): Promise<AIEngineOutput> {
    try {
      // In a real implementation, this would call an LLM API
      // For now, we'll return mock data
      
      // Process the input and create a prompt
      const prompt = this.createPrompt(input);
      
      // Call the LLM API with the prompt
      const llmResponse = await this.mockLLMCall(prompt);
      
      // Parse and structure the response
      return this.parseResponse(llmResponse, input);
    } catch (error) {
      console.error('Error generating code:', error);
      throw new Error('Failed to generate code');
    }
  }
  
  /**
   * Create a prompt for the LLM based on user specifications
   */
  private createPrompt(input: AIEngineInput): string {
    return `
Generate a ${input.apiStyle.toUpperCase()} API using ${input.framework} framework with ${input.database} database for a project named "${input.projectName}".

Project Description:
${input.description}

Data Models:
${this.formatDataModels(input)}

Features to include:
${input.features.join(', ')}

Please provide the complete code for a working backend application.
    `;
  }

  /**
   * Format data models for the prompt
   */
  private formatDataModels(input: AIEngineInput): string {
    return input.dataModels.map(model => {
      const fields = model.fields.map(field => 
        `  - ${field.name}: ${field.type}${field.required ? ' (required)' : ''}`
      ).join('\n');
      
      return `- ${model.name}:\n${fields}`;
    }).join('\n\n');
  }
  
  /**
   * Mock LLM API call (in a real implementation, this would call an actual LLM API)
   */
  private async mockLLMCall(prompt: string): Promise<any> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock response
    return {
      project: prompt.match(/project named "([^"]+)"/)?.[1] || 'unnamed-project',
      framework: prompt.includes('express') ? 'express' : 
                prompt.includes('nestjs') ? 'nestjs' : 
                prompt.includes('fastapi') ? 'fastapi' : 'express',
      database: prompt.includes('mongodb') ? 'mongodb' : 
               prompt.includes('postgresql') ? 'postgresql' : 'mongodb',
      files: this.getMockFiles(
        prompt.includes('express') ? 'express' : 
        prompt.includes('nestjs') ? 'nestjs' : 
        prompt.includes('fastapi') ? 'fastapi' : 'express'
      )
    };
  }
  
  /**
   * Parse the LLM response and structure it as AIEngineOutput
   */
  private parseResponse(llmResponse: any, input: AIEngineInput): AIEngineOutput {
    // In a real implementation, this would parse the LLM's response
    // Here we'll return a structured mock output that matches the AIEngineOutput interface
    
    return {
      files: this.transformToGeneratedFiles(llmResponse.files, input),
      explanation: `Generated a ${input.apiStyle} API using ${input.framework} and ${input.database} for project "${input.projectName}".`,
      dependencies: this.getMockDependencies(input),
      setupInstructions: [
        "1. Clone the repository",
        "2. Run `npm install` to install dependencies",
        "3. Configure environment variables in .env file",
        "4. Run `npm start` to start the server"
      ],
      apiDocs: {
        title: `${input.projectName} API Documentation`,
        description: `API documentation for ${input.projectName} built with ${input.framework} and ${input.database}.`,
        version: "1.0.0",
        endpoints: this.getMockApiEndpoints(input).map(endpoint => ({
          path: endpoint.path,
          method: endpoint.method,
          description: endpoint.description,
          requestExample: JSON.stringify({ example: "request data" }, null, 2),
          responseExample: JSON.stringify({ example: "response data" }, null, 2),
        })),
        overview: '',
        models: undefined
      },
      generatedAt: new Date()
    };
  }
  
  /**
   * Transform the mock files to GeneratedFile format
   */
  private transformToGeneratedFiles(mockFiles: any[], input: AIEngineInput): GeneratedFile[] {
    return mockFiles.map(file => ({
      path: file.path,
      content: file.content,
      type: this.getFileType(file.path),
      language: this.getLanguageFromExtension(file.path),
      description: `${this.getFileDescription(file.path)} for ${input.projectName}`
    }));
  }
  
  /**
   * Determine the file type based on file path
   */
  private getFileType(filePath: string): 'code' | 'config' | 'documentation' {
    if (filePath.endsWith('.md') || filePath.includes('docs/')) {
      return 'documentation';
    } else if (
      filePath.endsWith('.json') || 
      filePath.endsWith('.env') || 
      filePath.endsWith('.yml') || 
      filePath.endsWith('.yaml') ||
      filePath.includes('config/')
    ) {
      return 'config';
    }
    return 'code';
  }
  
  /**
   * Get language from file extension
   */
  private getLanguageFromExtension(filePath: string): string {
    if (filePath.endsWith('.js')) return 'javascript';
    if (filePath.endsWith('.ts')) return 'typescript';
    if (filePath.endsWith('.py')) return 'python';
    if (filePath.endsWith('.json')) return 'json';
    if (filePath.endsWith('.md')) return 'markdown';
    if (filePath.endsWith('.html')) return 'html';
    if (filePath.endsWith('.css')) return 'css';
    if (filePath.endsWith('.java')) return 'java';
    return 'plaintext';
  }
  
  /**
   * Get a description for the file based on its path
   */
  private getFileDescription(filePath: string): string {
    if (filePath.includes('server.js') || filePath.includes('main.ts')) {
      return 'Server entry point';
    } else if (filePath.includes('routes') || filePath.includes('controllers')) {
      return 'API routes/controllers';
    } else if (filePath.includes('models') || filePath.includes('entities')) {
      return 'Data models';
    } else if (filePath.includes('package.json') || filePath.includes('requirements.txt')) {
      return 'Dependencies configuration';
    }
    return 'Application code';
  }
  
  /**
   * Get mock dependencies based on the framework
   */
  private getMockDependencies(input: AIEngineInput): Dependency[] {
    if (input.framework === 'express') {
      return [
        { name: 'express', version: '^4.18.2', type: 'production' },
        { name: 'mongoose', version: '^7.0.0', type: 'production' },
        { name: 'dotenv', version: '^16.0.3', type: 'production' },
        { name: 'cors', version: '^2.8.5', type: 'production' },
        { name: 'nodemon', version: '^2.0.22', type: 'development' }
      ];
    } else if (input.framework === 'nestjs') {
      return [
        { name: '@nestjs/common', version: '^9.0.0', type: 'production' },
        { name: '@nestjs/core', version: '^9.0.0', type: 'production' },
        { name: '@nestjs/platform-express', version: '^9.0.0', type: 'production' },
        { name: '@nestjs/mongoose', version: '^9.2.2', type: 'production' },
        { name: 'mongoose', version: '^7.0.0', type: 'production' },
        { name: '@nestjs/cli', version: '^9.0.0', type: 'development' }
      ];
    } else {
      // Default to Python packages for FastAPI
      return [
        { name: 'fastapi', version: '0.95.0', type: 'production' },
        { name: 'uvicorn', version: '0.21.1', type: 'production' },
        { name: 'pydantic', version: '1.10.7', type: 'production' },
        { name: 'pytest', version: '7.3.1', type: 'development' }
      ];
    }
  }
  
  /**
   * Get mock code files based on the specified framework
   */
  private getMockFiles(framework: string): any[] {
    if (framework === 'express') {
      return [
        {
          path: 'server.js',
          content: `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(express.json());\n\n// Routes\napp.use('/api', require('./routes'));\n\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
          language: 'javascript'
        },
        {
          path: 'routes/index.js',
          content: `const router = require('express').Router();\n\nrouter.get('/', (req, res) => {\n  res.json({ message: 'API is running' });\n});\n\nmodule.exports = router;`,
          language: 'javascript'
        },
        {
          path: 'package.json',
          content: `{\n  "name": "generated-express-api",\n  "version": "1.0.0",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  },\n  "dependencies": {\n    "express": "^4.18.2",\n    "mongoose": "^7.0.0"\n  }\n}`,
          language: 'json'
        }
      ];
    } else if (framework === 'nestjs') {
      return [
        {
          path: 'src/main.ts',
          content: `import { NestFactory } from '@nestjs/core';\nimport { AppModule } from './app.module';\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule);\n  await app.listen(3000);\n}\nbootstrap();`,
          language: 'typescript'
        },
        {
          path: 'src/app.module.ts',
          content: `import { Module } from '@nestjs/common';\nimport { AppController } from './app.controller';\nimport { AppService } from './app.service';\n\n@Module({\n  imports: [],\n  controllers: [AppController],\n  providers: [AppService],\n})\nexport class AppModule {}`,
          language: 'typescript'
        },
        {
          path: 'package.json',
          content: `{\n  "name": "generated-nestjs-api",\n  "version": "1.0.0",\n  "scripts": {\n    "build": "nest build",\n    "start": "nest start",\n    "start:dev": "nest start --watch"\n  },\n  "dependencies": {\n    "@nestjs/common": "^9.0.0",\n    "@nestjs/core": "^9.0.0",\n    "@nestjs/platform-express": "^9.0.0"\n  }\n}`,
          language: 'json'
        }
      ];
    } else {
      // Default to FastAPI if not express or nestjs
      return [
        {
          path: 'main.py',
          content: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "API is running"}`,
          language: 'python'
        },
        {
          path: 'requirements.txt',
          content: `fastapi==0.95.0\nuvicorn==0.21.1\npydantic==1.10.7`,
          language: 'other'
        }
      ];
    }
  }
  
  /**
   * Get entry point file based on framework
   */
  private getEntryPoint(framework: BackendFramework): string {
    const entryPoints: Record<BackendFramework, string> = {
      express: 'server.js',
      nestjs: 'src/main.ts',
      fastapi: 'main.py',
      django: 'manage.py',
      rails: 'config/application.rb',
      spring: 'src/main/java/com/example/Application.java',
    };
    
    return entryPoints[framework] || 'index.js';
  }
  
  /**
   * Get package.json for JavaScript/TypeScript frameworks
   */
  private getPackageJson(input: AIEngineInput): Record<string, any> | undefined {
    if (['express', 'nestjs'].includes(input.framework)) {
      return {
        name: input.projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: input.description,
        main: this.getEntryPoint(input.framework),
        scripts: {
          start: input.framework === 'express' ? 'node server.js' : 'nest start',
          dev: input.framework === 'express' ? 'nodemon server.js' : 'nest start --watch'
        },
        dependencies: {}
      };
    }
    
    return undefined;
  }
  
  /**
   * Get mock API endpoints based on the input
   */
  private getMockApiEndpoints(input: AIEngineInput) {
    const endpoints = [];
    
    // Generate endpoints for each data model
    for (const model of input.dataModels) {
      const pluralName = `${model.name.toLowerCase()}s`;
      
      endpoints.push({
        path: `/api/${pluralName}`,
        method: 'GET',
        description: `Get all ${pluralName}`,
        authenticated: false,
        responseBody: { type: 'array', items: { $ref: `#/components/schemas/${model.name}` } }
      });
      
      endpoints.push({
        path: `/api/${pluralName}/:id`,
        method: 'GET',
        description: `Get a specific ${model.name} by ID`,
        authenticated: false,
        pathParams: { id: { type: 'string' } },
        responseBody: { $ref: `#/components/schemas/${model.name}` }
      });
      
      endpoints.push({
        path: `/api/${pluralName}`,
        method: 'POST',
        description: `Create a new ${model.name}`,
        authenticated: input.features.includes('authentication'),
        requestBody: { $ref: `#/components/schemas/Create${model.name}` },
        responseBody: { $ref: `#/components/schemas/${model.name}` }
      });
      
      endpoints.push({
        path: `/api/${pluralName}/:id`,
        method: 'PUT',
        description: `Update an existing ${model.name}`,
        authenticated: input.features.includes('authentication'),
        pathParams: { id: { type: 'string' } },
        requestBody: { $ref: `#/components/schemas/Update${model.name}` },
        responseBody: { $ref: `#/components/schemas/${model.name}` }
      });
      
      endpoints.push({
        path: `/api/${pluralName}/:id`,
        method: 'DELETE',
        description: `Delete a ${model.name}`,
        authenticated: input.features.includes('authentication'),
        pathParams: { id: { type: 'string' } },
        responseBody: { type: 'object', properties: { success: { type: 'boolean' } } }
      });
    }
    
    // Add authentication endpoints if needed
    if (input.features.includes('authentication')) {
      endpoints.push({
        path: '/api/auth/register',
        method: 'POST',
        description: 'Register a new user',
        authenticated: false,
        requestBody: { $ref: '#/components/schemas/UserRegistration' },
        responseBody: { $ref: '#/components/schemas/AuthResponse' }
      });
      
      endpoints.push({
        path: '/api/auth/login',
        method: 'POST',
        description: 'Log in a user',
        authenticated: false,
        requestBody: { $ref: '#/components/schemas/UserLogin' },
        responseBody: { $ref: '#/components/schemas/AuthResponse' }
      });
    }
    
    return endpoints;
  }
} 