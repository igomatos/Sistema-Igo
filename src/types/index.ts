export type TipoProposta = 'NOVO' | 'RENOVACAO';

export type StatusComissao = 'PENDENTE' | 'PARCIAL' | 'PAGO';

export type StatusProposta = 'EMITIDA' | 'PAGA' | 'CANCELADA';

export interface Proposta {
  id: string;
  dataCadastro: string;
  segurado: string;
  cpfCnpj: string;
  seguradora: string;
  tipo: TipoProposta;
  ramo: string;
  apolice: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  premioLiquido: number;
  comissaoPercentual: number;
  comissaoValor: number;
  status: StatusProposta;
  observacoes?: string;
}

export interface PagamentoComissao {
  id: string;
  propostaId: string;
  dataPagamento: string;
  valorPago: number;
  referencia: string; // Ex: "05/01/2025" ou "20/01/2025"
}

export interface ComissaoProposta {
  proposta: Proposta;
  pagamentos: PagamentoComissao[];
  totalPago: number;
  saldoDevedor: number;
  percentualPago: number;
  status: StatusComissao;
}

export interface MetricasDashboard {
  totalPropostas: number;
  totalPremio: number;
  totalComissao: number;
  comissaoRecebida: number;
  comissaoPendente: number;
  propostasNovas: number;
  propostasRenovacao: number;
}

export interface DadosGrafico {
  mes: string;
  novo: number;
  renovacao: number;
  total: number;
}
