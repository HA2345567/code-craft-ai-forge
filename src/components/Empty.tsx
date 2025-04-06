import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed gap-2',
      className
    )}>
      {Icon && (
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      
      <h3 className="font-semibold text-lg mt-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm">{description}</p>
      )}
      
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}; 