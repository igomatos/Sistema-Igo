import {
  LayoutDashboard,
  FileText,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';

import { cn } from '@/lib/utils';
import logoRaquel from '@/assets/logo-raquel.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { id: 'propostas', label: 'Segurados', icon: FileText },
  { id: 'comissoes', label: 'Comissões', icon: DollarSign },
  { id: 'Leitor_PDF', label: 'Leitor PDF', icon: ClipboardCheck },
  { id: 'relatorios', label: 'Relatórios', icon: TrendingUp },
];

export function Sidebar({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#F6EAEA] text-[#111827] z-50 flex flex-col transition-all duration-300',
        isCollapsed ? 'w-24' : 'w-64'
      )}
    >
      <button
        onClick={onToggleCollapse}
        className="absolute -right-4 top-8 w-8 h-8 rounded-full bg-white border border-[#EADDE1] shadow-md flex items-center justify-center text-[#F47FA0] hover:bg-[#F6EAEA] transition"
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      <div
        className={cn(
          'border-b border-[#d9c7cc] transition-all duration-300',
          isCollapsed ? 'px-3 pt-12 pb-8' : 'px-5 pt-12 pb-10'
        )}
      >
        <div
          className={cn(
            'bg-white shadow-lg flex items-center justify-center transition-all duration-300',
            isCollapsed
              ? 'w-full h-16 rounded-2xl px-2 py-2'
              : 'w-full h-28 rounded-[28px] px-6 py-4'
          )}
        >
          <img
            src={logoRaquel}
            alt="Raquel Lima Medical Protection"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <nav className={cn('flex-1 pt-6', isCollapsed ? 'px-3' : 'px-4')}>
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center rounded-xl transition-all duration-200 font-bold',
                    isCollapsed
                      ? 'justify-center px-0 py-4'
                      : 'gap-4 px-5 py-4 text-lg',
                    isActive
                      ? 'bg-[#F47FA0] text-white shadow-lg shadow-pink-300/50'
                      : 'text-[#18213A] hover:bg-[#F8D9E2]'
                  )}
                >
                  <Icon className="w-6 h-6 shrink-0" />

                  {!isCollapsed && <span>{item.label}</span>}

                  {!isCollapsed && isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="p-5">
          <div className="bg-white/55 rounded-2xl p-5">
            <p className="text-sm text-[#18213A] font-semibold">
              Próxima conferência
            </p>
            <p className="font-black text-[#F47FA0] text-2xl mt-2">
              Mensal
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PDF de comissão ANADEM
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}