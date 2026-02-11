import type { Proposta, PagamentoComissao } from '@/types';

// Chaves do armazenamento local do navegador (localStorage)
// Isso mantém seus dados salvos mesmo se você fechar o navegador.
const KEY_PROPOSTAS = 'igo.propostas.v1';
const KEY_PAGAMENTOS = 'igo.pagamentos.v1';

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadPropostas(fallback: Proposta[]): Proposta[] {
  const data = safeParseJSON<Proposta[]>(localStorage.getItem(KEY_PROPOSTAS));
  return Array.isArray(data) ? data : fallback;
}

export function savePropostas(propostas: Proposta[]) {
  localStorage.setItem(KEY_PROPOSTAS, JSON.stringify(propostas));
}

export function loadPagamentos(fallback: PagamentoComissao[]): PagamentoComissao[] {
  const data = safeParseJSON<PagamentoComissao[]>(localStorage.getItem(KEY_PAGAMENTOS));
  return Array.isArray(data) ? data : fallback;
}

export function savePagamentos(pagamentos: PagamentoComissao[]) {
  localStorage.setItem(KEY_PAGAMENTOS, JSON.stringify(pagamentos));
}

export function resetDados() {
  localStorage.removeItem(KEY_PROPOSTAS);
  localStorage.removeItem(KEY_PAGAMENTOS);
}
