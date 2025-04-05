
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Database, Trash2, FileJson, Code, CheckCircle, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ModelTable from '@/components/models/ModelTable';

const DataModels = () => {
  const [activeModel, setActiveModel] = useState('Product');
  const { toast } = useToast();
  
  const handleSaveChanges = () => {
    toast({
      title: "Schema saved",
      description: "Your data model has been saved successfully",
    });
  };
  
  const handleGenerateCode = () => {
    toast({
      title: "Code generated",
      description: "Database models code has been generated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-dark">Data Schema Designer</h1>
        <p className="text-muted-foreground mt-1">Design your database models visually</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-dark">
            <CardHeader className="p-4 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Models</span>
              </CardTitle>
              <CardDescription>
                Define your data schema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button 
                variant="outline" 
                className={`w-full justify-start ${activeModel === 'User' ? 'text-primary border-primary/50 bg-primary/10' : 'text-muted-foreground'}`}
                onClick={() => setActiveModel('User')}
              >
                User
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${activeModel === 'Post' ? 'text-primary border-primary/50 bg-primary/10' : 'text-muted-foreground'}`}
                onClick={() => setActiveModel('Post')}
              >
                Post
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${activeModel === 'Comment' ? 'text-primary border-primary/50 bg-primary/10' : 'text-muted-foreground'}`}
                onClick={() => setActiveModel('Comment')}
              >
                Comment
              </Button>
              <Button 
                variant="outline" 
                className={`w-full justify-start ${activeModel === 'Product' ? 'text-primary border-primary/50 bg-primary/10' : 'text-muted-foreground'}`}
                onClick={() => setActiveModel('Product')}
              >
                Product
              </Button>
              <Button className="w-full mt-4 gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Model</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="glass-dark">
            <CardHeader className="p-4 border-b border-white/10">
              <CardTitle className="text-lg">Properties</CardTitle>
              <CardDescription>Configure model settings</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Name</label>
                <Input defaultValue="Product" className="bg-secondary/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Database Table</label>
                <Input defaultValue="products" className="bg-secondary/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Backend Framework</label>
                <Select defaultValue="mongoose">
                  <SelectTrigger className="bg-secondary/50 border-white/10">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mongoose">Mongoose (MongoDB)</SelectItem>
                    <SelectItem value="sequelize">Sequelize (SQL)</SelectItem>
                    <SelectItem value="prisma">Prisma (Any)</SelectItem>
                    <SelectItem value="typeorm">TypeORM (SQL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timestamps</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="created" checked className="w-4 h-4" />
                  <label htmlFor="created" className="text-sm">createdAt</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="updated" checked className="w-4 h-4" />
                  <label htmlFor="updated" className="text-sm">updatedAt</label>
                </div>
              </div>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete Model</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="h-full glass-dark">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/10">
              <div>
                <CardTitle className="text-lg text-gradient-dark">Product Schema</CardTitle>
                <CardDescription>Define fields and relationships</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2" onClick={handleGenerateCode}>
                  <Code className="h-4 w-4" />
                  <span>Generate Code</span>
                </Button>
                <Button className="gap-2" onClick={handleSaveChanges}>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Tabs defaultValue="fields">
                <TabsList className="mb-4">
                  <TabsTrigger value="fields" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Fields</TabsTrigger>
                  <TabsTrigger value="relationships" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Relationships</TabsTrigger>
                  <TabsTrigger value="validation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Validation</TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Code Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fields">
                  <div className="space-y-4">
                    <div className="flex justify-end mb-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Field</span>
                      </Button>
                    </div>
                    <ModelTable />
                  </div>
                </TabsContent>
                
                <TabsContent value="relationships">
                  <div className="border rounded-md p-4 bg-secondary/20 border-white/10">
                    <h3 className="text-sm font-medium mb-4">Define Relationships</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Select defaultValue="hasmany">
                          <SelectTrigger className="w-[180px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hasmany">Has Many</SelectItem>
                            <SelectItem value="hasone">Has One</SelectItem>
                            <SelectItem value="belongsto">Belongs To</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="review">
                          <SelectTrigger className="w-[180px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="order">Order</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <Select defaultValue="belongsto">
                          <SelectTrigger className="w-[180px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hasmany">Has Many</SelectItem>
                            <SelectItem value="hasone">Has One</SelectItem>
                            <SelectItem value="belongsto">Belongs To</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="category">
                          <SelectTrigger className="w-[180px] bg-secondary/50 border-white/10">
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="order">Order</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2 mt-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Relationship</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="validation">
                  <div className="border rounded-md p-4 bg-secondary/20 border-white/10">
                    <h3 className="text-sm font-medium mb-4">Field Validation Rules</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-white/10 rounded-md bg-secondary/40">
                        <div className="font-medium">name</div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Min length: 3</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-white/10 rounded-md bg-secondary/40">
                        <div className="font-medium">price</div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Min value: 0</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-white/10 rounded-md bg-secondary/40">
                        <div className="font-medium">stock</div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Min value: 0</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="gap-2 mt-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Validation Rule</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview">
                  <Card className="overflow-hidden border border-white/10">
                    <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-sm">Generated Model Code</CardTitle>
                        <CardDescription>Mongoose Schema</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-secondary/30 font-mono text-sm p-4 overflow-x-auto">
                        <pre>
{`const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
});

// Define virtual for out-of-schema properties
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Add instance methods
ProductSchema.methods.isInStock = function() {
  return this.stock > 0;
};

module.exports = mongoose.model('Product', ProductSchema);`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataModels;
