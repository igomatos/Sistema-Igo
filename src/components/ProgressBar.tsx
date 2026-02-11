import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  total: number;
  percentual: number;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  value, 
  total, 
  percentual, 
  showValues = true,
  size = 'md'
}: ProgressBarProps) {
  const getColorClass = () => {
    if (percentual >= 100) return 'bg-emerald-500';
    if (percentual >= 50) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showValues && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-600">
            Pago: <span className="font-semibold">R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </span>
          <span className="text-slate-600">
            Total: <span className="font-semibold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </span>
        </div>
      )}
      <div className={cn("relative w-full bg-slate-200 rounded-full overflow-hidden", heightClass[size])}>
        <div 
          className={cn("absolute left-0 top-0 h-full transition-all duration-500 ease-out rounded-full", getColorClass())}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={cn(
          "text-xs font-medium",
          percentual >= 100 ? 'text-emerald-600' : 'text-slate-500'
        )}>
          {percentual.toFixed(1)}% pago
        </span>
        {percentual >= 100 && (
          <span className="text-xs font-medium text-emerald-600">
            ✓ Esgotado
          </span>
        )}
      </div>
    </div>
  );
}
