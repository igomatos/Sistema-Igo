import type { Proposta, PagamentoComissao } from '@/types';

export const seguradoras = [
  'Anadem',
  'Porto Seguro',
  'FairFax',
  'Akad',
  'Tokio',
  'Mapfre',
  'Liberty Seguros',
  'HDI Seguros',
  'Azul Seguros',
  'Sompo Seguros',
  'Mitsui Sumitomo'
];

export const ramos = [
  'RC Médico',
  'RC Médico PJ',
  'RC Geral',
  'Saúde',
  'Vida',
  'Empresarial',
  'Automóvel',
  'Residencial',
  'Transporte',
  'Riscos Diversos'
];

export const propostasMock: Proposta[] = [
  {
    id: '1',
    dataCadastro: '2025-01-10',
    segurado: 'Dr. João Silva',
    cpfCnpj: '123.456.789-00',
    produtor: 'IGO MATOS',
    seguradora: 'ANADEM',
    tipo: 'NOVO',
    ramo: 'RC Médico',
    propostaNumero: 'ANAD-0001',
    dataTransmissao: '2025-01-10',
    premioLiquido: 3500,
    comissaoPercentual: 20,
    comissaoValor: 700,
    status: 'EMITIDA',
    observacoes: 'Exemplo ANADEM para testes do sistema'
  },
  {
    id: '2',
    dataCadastro: '2025-01-12',
    segurado: 'Dra. Maria Santos',
    cpfCnpj: '987.654.321-00',
    produtor: 'RAQUEL',
    seguradora: 'ANADEM',
    tipo: 'RENOVACAO',
    ramo: 'RC Médico',
    propostaNumero: 'ANAD-0002',
    dataTransmissao: '2025-01-12',
    premioLiquido: 4800,
    comissaoPercentual: 20,
    comissaoValor: 960,
    status: 'EMITIDA',
    observacoes: 'Renovação ANADEM'
  },
  {
    id: '3',
    dataCadastro: '2025-01-15',
    segurado: 'Clínica ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    produtor: 'IGO MATOS',
    seguradora: 'ANADEM',
    tipo: 'NOVO',
    ramo: 'RC Médico PJ',
    propostaNumero: 'ANAD-0003',
    dataTransmissao: '2025-01-15',
    premioLiquido: 12500,
    comissaoPercentual: 15,
    comissaoValor: 1875,
    status: 'EMITIDA',
    observacoes: 'PJ médica ANADEM'
  },
  {
    id: '4',
    dataCadastro: '2025-01-18',
    segurado: 'Pedro Oliveira',
    cpfCnpj: '456.789.123-00',
    produtor: 'IGO MATOS',
    seguradora: 'Porto Seguro',
    tipo: 'NOVO',
    ramo: 'Vida',
    propostaNumero: '789123456',
    dataTransmissao: '2025-01-18',
    premioLiquido: 2400,
    comissaoPercentual: 25,
    comissaoValor: 600,
    status: 'EMITIDA'
  }
];

export const pagamentosMock: PagamentoComissao[] = [
  {
    id: 'p1',
    propostaId: '1',
    dataPagamento: '2025-01-20',
    valorPago: 350,
    referencia: '20/01/2025'
  },
  {
    id: 'p2',
    propostaId: '2',
    dataPagamento: '2025-01-20',
    valorPago: 960,
    referencia: '20/01/2025'
  },
  {
    id: 'p3',
    propostaId: '3',
    dataPagamento: '2025-01-20',
    valorPago: 937.5,
    referencia: '20/01/2025'
  }
];