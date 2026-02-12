import type { Proposta, PagamentoComissao } from '@/types';

export const seguradoras = [
  'Porto Seguro',
  'Bradesco Seguros',
  'SulAmérica',
  'Tokio Marine',
  'Mapfre',
  'Liberty Seguros',
  'HDI Seguros',
  'Azul Seguros',
  'Sompo Seguros',
  'Mitsui Sumitomo'
];

export const ramos = [
  'Automóvel',
  'Residencial',
  'Empresarial',
  'Vida',
  'Saúde',
  'Transporte',
  'Riscos Diversos',
  'Responsabilidade Civil'
];

export const propostasMock: Proposta[] = [
  {
    id: '1',
    dataCadastro: '2025-01-10',
    segurado: 'João Silva',
    cpfCnpj: '123.456.789-00',
    produtor: 'IGO MATOS',
    seguradora: 'Porto Seguro',
    tipo: 'NOVO',
    ramo: 'Automóvel',
    propostaNumero: '123456789',
    dataTransmissao: '2025-01-10',
    premioLiquido: 3500,
    comissaoPercentual: 20,
    comissaoValor: 700,
    status: 'EMITIDA',
    observacoes: 'Cliente indicado pelo Carlos'
  },
  {
    id: '2',
    dataCadastro: '2025-01-12',
    segurado: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    produtor: 'IGO MATOS',
    seguradora: 'Bradesco Seguros',
    tipo: 'RENOVACAO',
    ramo: 'Residencial',
    propostaNumero: '987654321',
    dataTransmissao: '2025-01-12',
    premioLiquido: 1800,
    comissaoPercentual: 18,
    comissaoValor: 324,
    status: 'EMITIDA'
  },
  {
    id: '3',
    dataCadastro: '2025-01-15',
    segurado: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    produtor: 'IGO MATOS',
    seguradora: 'SulAmérica',
    tipo: 'NOVO',
    ramo: 'Empresarial',
    propostaNumero: '456789123',
    dataTransmissao: '2025-01-15',
    premioLiquido: 12500,
    comissaoPercentual: 15,
    comissaoValor: 1875,
    status: 'EMITIDA',
    observacoes: 'Seguro empresarial completo'
  },
  {
    id: '4',
    dataCadastro: '2025-01-18',
    segurado: 'Pedro Oliveira',
    cpfCnpj: '456.789.123-00',
    produtor: 'IGO MATOS',
    seguradora: 'Tokio Marine',
    tipo: 'NOVO',
    ramo: 'Vida',
    propostaNumero: '789123456',
    dataTransmissao: '2025-01-18',
    premioLiquido: 2400,
    comissaoPercentual: 25,
    comissaoValor: 600,
    status: 'EMITIDA'
  },
  {
    id: '5',
    dataCadastro: '2025-01-20',
    segurado: 'Ana Costa',
    cpfCnpj: '789.123.456-00',
    produtor: 'IGO MATOS',
    seguradora: 'Mapfre',
    tipo: 'RENOVACAO',
    ramo: 'Automóvel',
    propostaNumero: '321654987',
    dataTransmissao: '2025-01-20',
    premioLiquido: 4200,
    comissaoPercentual: 20,
    comissaoValor: 840,
    status: 'EMITIDA'
  },
  {
    id: '6',
    dataCadastro: '2025-01-22',
    segurado: 'Carlos Ferreira',
    cpfCnpj: '321.654.987-00',
    produtor: 'IGO MATOS',
    seguradora: 'Liberty Seguros',
    tipo: 'NOVO',
    ramo: 'Saúde',
    propostaNumero: '654987321',
    dataTransmissao: '2025-01-22',
    premioLiquido: 8900,
    comissaoPercentual: 12,
    comissaoValor: 1068,
    status: 'EMITIDA'
  },
  {
    id: '7',
    dataCadastro: '2025-01-25',
    segurado: 'Construtora XYZ',
    cpfCnpj: '98.765.432/0001-10',
    produtor: 'IGO MATOS',
    seguradora: 'HDI Seguros',
    tipo: 'RENOVACAO',
    ramo: 'Riscos Diversos',
    propostaNumero: '147258369',
    dataTransmissao: '2025-01-25',
    premioLiquido: 15800,
    comissaoPercentual: 14,
    comissaoValor: 2212,
    status: 'EMITIDA'
  },
  {
    id: '8',
    dataCadastro: '2025-01-28',
    segurado: 'Fernanda Lima',
    cpfCnpj: '147.258.369-00',
    produtor: 'IGO MATOS',
    seguradora: 'Azul Seguros',
    tipo: 'NOVO',
    ramo: 'Automóvel',
    propostaNumero: '369258147',
    dataTransmissao: '2025-01-28',
    premioLiquido: 2800,
    comissaoPercentual: 22,
    comissaoValor: 616,
    status: 'EMITIDA'
  }
];

export const pagamentosMock: PagamentoComissao[] = [
  { id: 'p1', propostaId: '1', dataPagamento: '2025-01-20', valorPago: 350, referencia: '20/01/2025' },
  { id: 'p2', propostaId: '2', dataPagamento: '2025-01-20', valorPago: 324, referencia: '20/01/2025' },
  { id: 'p3', propostaId: '3', dataPagamento: '2025-01-20', valorPago: 937.5, referencia: '20/01/2025' },
  { id: 'p4', propostaId: '3', dataPagamento: '2025-02-05', valorPago: 500, referencia: '05/02/2025' },
  { id: 'p5', propostaId: '5', dataPagamento: '2025-01-20', valorPago: 400, referencia: '20/01/2025' },
  { id: 'p6', propostaId: '6', dataPagamento: '2025-01-20', valorPago: 500, referencia: '20/01/2025' },
  { id: 'p7', propostaId: '7', dataPagamento: '2025-01-20', valorPago: 1106, referencia: '20/01/2025' },
  { id: 'p8', propostaId: '7', dataPagamento: '2025-02-05', valorPago: 1106, referencia: '05/02/2025' }
];
