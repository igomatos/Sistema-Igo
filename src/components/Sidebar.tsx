import { LayoutDashboard, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoIgo from '@/assets/logo-igo.png';

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
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white z-50 flex flex-col">
      {/* TOPO / MARCA */}
      <div className="px-6 py-7 border-b border-slate-800">
        <div className="flex items-center gap-4">
          {/* Logo maior e com mais destaque */}
          <div className="w-20 h-20 rounded-2xl bg-white/95 p-2 flex items-center justify-center shadow-md">
            <img
              src={logoIgo}
              alt="IGO MATOS SEGUROS"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <h1 className="font-extrabold text-[16px] tracking-tight">
              IGO MATOS SEGUROS
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Sistema de Propostas
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
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
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* RODAPÉ */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-900 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Próximo pagamento</p>
          <p className="font-semibold text-blue-300">20/02/2025</p>
          <p className="text-xs text-slate-500 mt-1">Conferência mensal</p>
        </div>
      </div>
    </aside>
  );
}
