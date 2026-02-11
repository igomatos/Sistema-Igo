import { Bell, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-600">
        <Calendar className="w-4 h-4" />
        <span className="text-sm capitalize">{hoje}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
            3
          </Badge>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">Corretor</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
