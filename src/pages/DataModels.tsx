
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, Database, Trash2 } from 'lucide-react';
import ModelTable from '@/components/models/ModelTable';

const DataModels = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Models</h1>
        <p className="text-muted-foreground mt-1">Design your data models visually</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-ai-primary" />
                <span>Models</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                User
              </Button>
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                Post
              </Button>
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                Comment
              </Button>
              <Button variant="outline" className="w-full justify-start text-primary">
                Product
              </Button>
              <Button className="w-full mt-4 gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Model</span>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Name</label>
                <Input defaultValue="Product" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Database Table</label>
                <Input defaultValue="products" />
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
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Product Schema</CardTitle>
                <CardDescription>Define fields and relationships</CardDescription>
              </div>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end mb-2">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Field</span>
                  </Button>
                </div>
                <ModelTable />
                
                <div className="border rounded-md p-4 mt-6">
                  <h3 className="text-sm font-medium mb-2">Relationships</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Select defaultValue="hasmany">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hasmany">Has Many</SelectItem>
                          <SelectItem value="hasone">Has One</SelectItem>
                          <SelectItem value="belongsto">Belongs To</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="review">
                        <SelectTrigger className="w-[180px]">
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
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hasmany">Has Many</SelectItem>
                          <SelectItem value="hasone">Has One</SelectItem>
                          <SelectItem value="belongsto">Belongs To</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="category">
                        <SelectTrigger className="w-[180px]">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataModels;
