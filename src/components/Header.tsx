import { Download } from 'lucide-react';
import { exportarBackup } from '@/lib/storage';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {

  const handleBackup = () => {
    exportarBackup();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EADDE1]">

      {/* Linha superior */}
      <div className="h-1.5 w-full bg-[#F47FA0]" />

      {/* Conteúdo */}
      <div className="h-24 px-10 flex items-center justify-between">

        <div />

        <div className="flex items-center gap-4">

          {/* Ambiente */}
          <span className="px-5 py-2 rounded-full bg-[#F6F4F5] text-slate-700 text-sm font-semibold border border-[#EADDE1]">
            Ambiente Local
          </span>

          {/* Backup */}
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#EADDE1] text-[#111827] text-sm font-bold hover:bg-[#F6EAEA] transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Backup
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-full bg-[#F47FA0] text-white text-sm font-bold shadow-lg shadow-pink-200 hover:bg-[#ec6f94] transition-all duration-300"
          >
            Sair
          </button>

        </div>

      </div>

    </header>
  );
}