import { Badge } from '@/components/ui/badge';
import type { StatusComissao, StatusProposta, TipoProposta } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusComissao | StatusProposta | TipoProposta;
  type?: 'comissao' | 'proposta' | 'tipo';
}

export function StatusBadge({ status, type = 'comissao' }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === 'comissao') {
      switch (status) {
        case 'PENDENTE':
          return 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100';
        case 'PARCIAL':
          return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100';
        case 'PAGO':
          return 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    }
    
    if (type === 'proposta') {
      switch (status) {
        case 'EMITIDA':
          return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100';
        case 'PAGA':
          return 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100';
        case 'CANCELADA':
          return 'bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-100';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    }
    
    if (type === 'tipo') {
      switch (status) {
        case 'NOVO':
          return 'bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-100';
        case 'RENOVACAO':
          return 'bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-100';
        default:
          return 'bg-slate-100 text-slate-700';
      }
    }
    
    return 'bg-slate-100 text-slate-700';
  };

  const getLabel = () => {
    if (type === 'comissao') {
      switch (status) {
        case 'PENDENTE': return 'Pendente';
        case 'PARCIAL': return 'Parcial';
        case 'PAGO': return 'Pago';
      }
    }
    
    if (type === 'proposta') {
      switch (status) {
        case 'EMITIDA': return 'Emitida';
        case 'PAGA': return 'Paga';
        case 'CANCELADA': return 'Cancelada';
      }
    }
    
    if (type === 'tipo') {
      switch (status) {
        case 'NOVO': return 'Novo';
        case 'RENOVACAO': return 'Renovação';
      }
    }
    
    return status;
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium px-2.5 py-0.5 border-2",
        getStyles()
      )}
    >
      {getLabel()}
    </Badge>
  );
}
