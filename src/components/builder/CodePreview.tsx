import React, { useState } from 'react';
import { CodeFile } from '@/lib/ai-engine/types';

interface CodePreviewProps {
  files?: CodeFile[];
}

const CodePreview: React.FC<CodePreviewProps> = ({ files = [] }) => {
  const [selectedFile, setSelectedFile] = useState(files.length > 0 ? 0 : -1);
  
  // Display mock code if no files are provided
  if (!files || files.length === 0) {
    const mockCode = `// Example Express.js server code
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start server
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`;

    return (
      <div className="relative min-h-[500px]">
        <div className="absolute inset-0 overflow-auto p-4 bg-background font-mono text-sm text-foreground/80 whitespace-pre">
          {mockCode}
        </div>
      </div>
    );
  }
  
  // Function to highlight code based on language/extension
  const highlightCode = (content: string, language: string) => {
    // Basic syntax highlighting based on language
    // In a real app, you'd use a library like Prism.js or highlight.js
    return content;
  };
  
  // Function to get file extension
  const getFileExtension = (path: string) => {
    return path.split('.').pop() || '';
  };
  
  // Function to get a shorter file name
  const getShortFileName = (path: string) => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  
  return (
    <div className="grid grid-cols-12 h-[500px] text-sm">
      {/* File explorer sidebar */}
      <div className="col-span-3 md:col-span-2 border-r border-white/10 bg-secondary/20 overflow-y-auto">
        <div className="p-2 border-b border-white/10 text-xs font-medium">Files</div>
        <ul className="text-xs">
          {files.map((file, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedFile(index)}
                className={`w-full text-left px-2 py-1.5 truncate hover:bg-secondary/30 ${selectedFile === index ? 'bg-primary/20 text-primary' : ''}`}
              >
                {getShortFileName(file.path)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Code content */}
      <div className="col-span-9 md:col-span-10 relative bg-background">
        {selectedFile >= 0 && (
          <>
            <div className="sticky top-0 z-10 px-4 py-2 bg-secondary/20 border-b border-white/10 text-xs text-muted-foreground truncate">
              {files[selectedFile].path}
            </div>
            <div className="p-4 font-mono text-xs overflow-auto h-[calc(500px-36px)] whitespace-pre">
              {highlightCode(files[selectedFile].content, getFileExtension(files[selectedFile].path))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CodePreview;
