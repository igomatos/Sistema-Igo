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
  emerald: 'bg-white text-[#111827] border-[#EADDE1]',
  blue: 'bg-white text-[#111827] border-[#EADDE1]',
  amber: 'bg-white text-[#111827] border-[#EADDE1]',
  rose: 'bg-white text-[#111827] border-[#EADDE1]',
  violet: 'bg-white text-[#111827] border-[#EADDE1]',
};

const iconBgClasses = {
  emerald: 'bg-[#F6EAEA] text-[#F47FA0]',
  blue: 'bg-[#F6EAEA] text-[#F47FA0]',
  amber: 'bg-[#F6EAEA] text-[#F47FA0]',
  rose: 'bg-[#F6EAEA] text-[#F47FA0]',
  violet: 'bg-[#F6EAEA] text-[#F47FA0]',
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
    <Card
      className={cn(
        "group border bg-white rounded-3xl shadow-sm overflow-hidden",
        "transition-all duration-500 ease-out",
        "hover:shadow-2xl hover:-translate-y-1 hover:border-[#F47FA0]/40",
        colorClasses[color]
      )}
    >
      <CardContent className="p-6 relative">
        <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#F6EAEA] opacity-0 group-hover:opacity-70 transition-all duration-500" />

        <div className="flex items-start justify-between relative z-10">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
              "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              iconBgClasses[color]
            )}
          >
            {icon}
          </div>

          {trend && (
            <span
              className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-500",
                trendUp
                  ? "bg-[#F6EAEA] text-[#F47FA0] group-hover:bg-[#F47FA0] group-hover:text-white"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {trend}
            </span>
          )}
        </div>

        <div className="mt-5 relative z-10">
          <p className="text-sm font-semibold text-slate-500">{title}</p>

          <p className="text-3xl font-black text-[#111827] mt-2 tracking-tight">
            {value}
          </p>

          {subtitle && (
            <p className="text-sm text-slate-500 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}