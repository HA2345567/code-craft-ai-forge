
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const ModelTable = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Field Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input defaultValue="id" disabled />
            </TableCell>
            <TableCell>
              <Select disabled defaultValue="uuid">
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uuid">UUID</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-center">
              <input type="checkbox" checked disabled className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <Input disabled />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>
              <Input defaultValue="name" />
            </TableCell>
            <TableCell>
              <Select defaultValue="string">
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-center">
              <input type="checkbox" checked className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <Input />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>
              <Input defaultValue="description" />
            </TableCell>
            <TableCell>
              <Select defaultValue="string">
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-center">
              <input type="checkbox" className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <Input />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>
              <Input defaultValue="price" />
            </TableCell>
            <TableCell>
              <Select defaultValue="float">
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-center">
              <input type="checkbox" checked className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <Input defaultValue="0" />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>
              <Input defaultValue="stock" />
            </TableCell>
            <TableCell>
              <Select defaultValue="integer">
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-center">
              <input type="checkbox" className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <Input defaultValue="0" />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelTable;
