export const PRODUTORES_PADRAO: readonly string[] = [
  'RAQUEL',
  'IGO',
  'PROD.01',
  'PROD.02',
];

export const PRODUTORES_STORAGE_KEY = 'igo.produtores.v1';

export function carregarProdutores(): string[] {
  try {
    const raw = localStorage.getItem(PRODUTORES_STORAGE_KEY);
    if (!raw) return [...PRODUTORES_PADRAO];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...PRODUTORES_PADRAO];

    return parsed;
  } catch {
    return [...PRODUTORES_PADRAO];
  }
}

export function salvarProdutores(produtores: string[]) {
  localStorage.setItem(PRODUTORES_STORAGE_KEY, JSON.stringify(produtores));
}
