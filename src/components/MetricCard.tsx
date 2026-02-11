import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'violet';
}

const colorClasses = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
};

const iconBgClasses = {
  emerald: 'bg-emerald-100',
  blue: 'bg-blue-100',
  amber: 'bg-amber-100',
  rose: 'bg-rose-100',
  violet: 'bg-violet-100',
};

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendUp,
  color 
}: MetricCardProps) {
  return (
    <Card className={cn("border-2 transition-all duration-200 hover:shadow-lg", colorClasses[color])}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgClasses[color])}>
            {icon}
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trendUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}>
              {trend}
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
