export type TipoProposta = 'NOVO' | 'RENOVACAO';

export type StatusComissao = 'PENDENTE' | 'PARCIAL' | 'PAGO' | 'RENOVAR';

export type StatusProposta = 'EMITIDA' | 'PAGA' | 'CANCELADA';

export type StatusSegurado = 'ATIVO' | 'CANCELADO' | 'EM_OBSERVACAO';

export interface Proposta {
  id: string;
  dataCadastro: string;

  segurado: string;
  cpfCnpj: string;
  produtor: string;

  seguradora: string;
  tipo: TipoProposta;
  ramo: string;

  propostaNumero: string;
  dataTransmissao: string;

  dataInicioCiclo?: string;

  parcelasCiclo?: number;

  statusContrato?: 'ATIVO' | 'CANCELADO' | 'FINALIZADO' | 'GRATUIDADE' | 'EM_ANALISE';

  dataCancelamento?: string;

  premioLiquido: number;

  quantidadeParcelas: number;

  valorParcelaSeguro: number;

  comissaoPercentual: number;

  comissaoParcela: number;

  comissaoValor: number;

  status: StatusProposta;

  statusSegurado?: StatusSegurado;

  gratuidade?: boolean;

  observacoes?: string;
}

export interface PagamentoComissao {
  id: string;
  propostaId: string;
  dataPagamento: string;
  valorPago: number;
  referencia: string;
}

export interface ComissaoProposta {
  proposta: Proposta;
  pagamentos: PagamentoComissao[];
  totalPago: number;
  saldoDevedor: number;
  percentualPago: number;

  valorEsperadoParcela: number;
  referenciasEsperadas: string[];

  parcelasPagas: number;
  parcelasEsperadas: number;
  parcelasPendentes: number;

  cicloFinalizado: boolean;

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