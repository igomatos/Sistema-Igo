import type { Proposta, PagamentoComissao } from '@/types';

// CHAVES
const KEY_PROPOSTAS = 'igo.propostas.v1';
const KEY_PAGAMENTOS = 'igo.pagamentos.v1';

// PARSE SEGURO
function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

// =========================
// PROPOSTAS
// =========================

export function loadPropostas(fallback: Proposta[]): Proposta[] {
  const data = safeParseJSON<Proposta[]>(
    localStorage.getItem(KEY_PROPOSTAS)
  );

  return Array.isArray(data) ? data : fallback;
}

export function savePropostas(propostas: Proposta[]) {
  localStorage.setItem(
    KEY_PROPOSTAS,
    JSON.stringify(propostas)
  );
}

// =========================
// PAGAMENTOS
// =========================

export function loadPagamentos(
  fallback: PagamentoComissao[]
): PagamentoComissao[] {

  const data = safeParseJSON<PagamentoComissao[]>(
    localStorage.getItem(KEY_PAGAMENTOS)
  );

  return Array.isArray(data) ? data : fallback;
}

export function savePagamentos(
  pagamentos: PagamentoComissao[]
) {
  localStorage.setItem(
    KEY_PAGAMENTOS,
    JSON.stringify(pagamentos)
  );
}

// =========================
// RESET
// =========================

export function resetDados() {
  localStorage.removeItem(KEY_PROPOSTAS);
  localStorage.removeItem(KEY_PAGAMENTOS);
}

// =========================
// EXPORTAR BACKUP
// =========================

export function exportarBackup() {

  const propostas =
    safeParseJSON<Proposta[]>(
      localStorage.getItem(KEY_PROPOSTAS)
    ) || [];

  const pagamentos =
    safeParseJSON<PagamentoComissao[]>(
      localStorage.getItem(KEY_PAGAMENTOS)
    ) || [];

  const backup = {
    dataExportacao: new Date().toISOString(),
    propostas,
    pagamentos
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download =
    `backup-raquel-lima-${new Date()
      .toISOString()
      .split('T')[0]}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}