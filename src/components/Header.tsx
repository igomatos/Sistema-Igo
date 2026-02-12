import logo from "../assets/logo-igo.png";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Faixa de destaque */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400" />

      <div className="h-24 px-6 flex items-center justify-between">
        {/* Marca */}
        <div className="flex items-center gap-4">
          {/* Logo como ícone (sem virar refém do branco do PNG) */}
          <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center p-2">
            <img
              src={logo}
              alt="IGO MATOS"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Nome com MUITO mais destaque */}
          <div className="leading-tight">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                IGO MATOS
              </p>
              <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-semibold">
                Sistema IGO
              </span>
            </div>

            <p className="text-lg font-bold tracking-tight text-slate-800 -mt-0.5">
              SEGUROS
            </p>

            <p className="text-sm text-slate-600 mt-1">
              Gestão de Propostas e Comissões
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-slate-700">
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium">
            Ambiente Local
          </span>
        </div>
      </div>
    </header>
  );
}
