import React from 'react';
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldType } from '@/lib/ai-engine/types';

interface ModelTableProps {
  fields?: Array<{
    name: string;
    type: string;
    required: boolean;
    unique: boolean;
    default?: string;
  }>;
  onAddField?: () => void;
  onUpdateField?: (index: number, field: any) => void;
  onDeleteField?: (index: number) => void;
}

const ModelTable: React.FC<ModelTableProps> = ({ 
  fields = [], 
  onAddField,
  onUpdateField,
  onDeleteField 
}) => {
  // Sample fields for demonstration
  const sampleFields = [
    { name: 'id', type: 'id', required: true, unique: true, default: 'auto' },
    { name: 'name', type: 'string', required: true, unique: false, default: '' },
    { name: 'price', type: 'number', required: true, unique: false, default: '0' },
    { name: 'description', type: 'string', required: false, unique: false, default: '' },
    { name: 'category', type: 'string', required: false, unique: false, default: '' },
    { name: 'isAvailable', type: 'boolean', required: false, unique: false, default: 'true' },
    { name: 'images', type: 'array', required: false, unique: false, default: '[]' }
  ];

  const displayFields = fields.length > 0 ? fields : sampleFields;
  
  return (
    <div className="rounded-md border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40">
          <tr>
            <th className="text-left font-medium p-3 border-b border-white/10">Name</th>
            <th className="text-left font-medium p-3 border-b border-white/10">Type</th>
            <th className="text-center font-medium p-3 border-b border-white/10">Required</th>
            <th className="text-center font-medium p-3 border-b border-white/10">Unique</th>
            <th className="text-left font-medium p-3 border-b border-white/10">Default</th>
            <th className="text-right font-medium p-3 border-b border-white/10">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayFields.map((field, index) => (
            <tr key={index} className="border-b border-white/5 last:border-0">
              <td className="p-3">
                <div className="font-mono">{field.name}</div>
              </td>
              <td className="p-3">
                <div className={`
                  inline-block px-2 py-1 rounded text-xs
                  ${field.type === 'string' ? 'bg-blue-500/20 text-blue-400' : 
                    field.type === 'number' ? 'bg-green-500/20 text-green-400' :
                    field.type === 'boolean' ? 'bg-yellow-500/20 text-yellow-400' :
                    field.type === 'array' ? 'bg-purple-500/20 text-purple-400' :
                    field.type === 'id' ? 'bg-red-500/20 text-red-400' :
                    field.type === 'date' ? 'bg-teal-500/20 text-teal-400' :
                    'bg-gray-500/20 text-gray-400'}
                `}>
                  {field.type}
                </div>
              </td>
              <td className="p-3 text-center">
                {field.required ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="p-3 text-center">
                {field.unique ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mx-auto" />
                )}
              </td>
              <td className="p-3">
                <div className="font-mono text-muted-foreground text-xs">
                  {field.default !== undefined ? field.default : '-'}
                </div>
              </td>
              <td className="p-3 text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModelTable;
