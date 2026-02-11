import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'propostas', label: 'Propostas', icon: FileText },
  { id: 'comissoes', label: 'Comissões', icon: DollarSign },
  { id: 'relatorios', label: 'Relatórios', icon: TrendingUp },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-50 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Seguradora Pro</h1>
            <p className="text-xs text-slate-400">Controle de Propostas</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Próximo pagamento</p>
          <p className="font-semibold text-emerald-400">20/02/2025</p>
          <p className="text-xs text-slate-500 mt-1">Conferência mensal</p>
        </div>
      </div>
    </aside>
  );
}
