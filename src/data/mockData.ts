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
    seguradora: 'Porto Seguro',
    tipo: 'NOVO',
    ramo: 'Automóvel',
    apolice: '123456789',
    vigenciaInicio: '2025-01-15',
    vigenciaFim: '2026-01-15',
    premioLiquido: 3500.00,
    comissaoPercentual: 20,
    comissaoValor: 700.00,
    status: 'EMITIDA',
    observacoes: 'Cliente indicado pelo Carlos'
  },
  {
    id: '2',
    dataCadastro: '2025-01-12',
    segurado: 'Maria Santos',
    cpfCnpj: '987.654.321-00',
    seguradora: 'Bradesco Seguros',
    tipo: 'RENOVACAO',
    ramo: 'Residencial',
    apolice: '987654321',
    vigenciaInicio: '2025-01-20',
    vigenciaFim: '2026-01-20',
    premioLiquido: 1800.00,
    comissaoPercentual: 18,
    comissaoValor: 324.00,
    status: 'EMITIDA'
  },
  {
    id: '3',
    dataCadastro: '2025-01-15',
    segurado: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    seguradora: 'SulAmérica',
    tipo: 'NOVO',
    ramo: 'Empresarial',
    apolice: '456789123',
    vigenciaInicio: '2025-02-01',
    vigenciaFim: '2026-02-01',
    premioLiquido: 12500.00,
    comissaoPercentual: 15,
    comissaoValor: 1875.00,
    status: 'EMITIDA',
    observacoes: 'Seguro empresarial completo'
  },
  {
    id: '4',
    dataCadastro: '2025-01-18',
    segurado: 'Pedro Oliveira',
    cpfCnpj: '456.789.123-00',
    seguradora: 'Tokio Marine',
    tipo: 'NOVO',
    ramo: 'Vida',
    apolice: '789123456',
    vigenciaInicio: '2025-01-25',
    vigenciaFim: '2026-01-25',
    premioLiquido: 2400.00,
    comissaoPercentual: 25,
    comissaoValor: 600.00,
    status: 'EMITIDA'
  },
  {
    id: '5',
    dataCadastro: '2025-01-20',
    segurado: 'Ana Costa',
    cpfCnpj: '789.123.456-00',
    seguradora: 'Mapfre',
    tipo: 'RENOVACAO',
    ramo: 'Automóvel',
    apolice: '321654987',
    vigenciaInicio: '2025-01-22',
    vigenciaFim: '2026-01-22',
    premioLiquido: 4200.00,
    comissaoPercentual: 20,
    comissaoValor: 840.00,
    status: 'EMITIDA'
  },
  {
    id: '6',
    dataCadastro: '2025-01-22',
    segurado: 'Carlos Ferreira',
    cpfCnpj: '321.654.987-00',
    seguradora: 'Liberty Seguros',
    tipo: 'NOVO',
    ramo: 'Saúde',
    apolice: '654987321',
    vigenciaInicio: '2025-02-01',
    vigenciaFim: '2026-02-01',
    premioLiquido: 8900.00,
    comissaoPercentual: 12,
    comissaoValor: 1068.00,
    status: 'EMITIDA'
  },
  {
    id: '7',
    dataCadastro: '2025-01-25',
    segurado: 'Construtora XYZ',
    cpfCnpj: '98.765.432/0001-10',
    seguradora: 'HDI Seguros',
    tipo: 'RENOVACAO',
    ramo: 'Riscos Diversos',
    apolice: '147258369',
    vigenciaInicio: '2025-02-10',
    vigenciaFim: '2026-02-10',
    premioLiquido: 15800.00,
    comissaoPercentual: 14,
    comissaoValor: 2212.00,
    status: 'EMITIDA'
  },
  {
    id: '8',
    dataCadastro: '2025-01-28',
    segurado: 'Fernanda Lima',
    cpfCnpj: '147.258.369-00',
    seguradora: 'Azul Seguros',
    tipo: 'NOVO',
    ramo: 'Automóvel',
    apolice: '369258147',
    vigenciaInicio: '2025-02-05',
    vigenciaFim: '2026-02-05',
    premioLiquido: 2800.00,
    comissaoPercentual: 22,
    comissaoValor: 616.00,
    status: 'EMITIDA'
  }
];

export const pagamentosMock: PagamentoComissao[] = [
  // Proposta 1 - Pago parcialmente
  {
    id: 'p1',
    propostaId: '1',
    dataPagamento: '2025-01-20',
    valorPago: 350.00,
    referencia: '20/01/2025'
  },
  // Proposta 2 - Pago totalmente
  {
    id: 'p2',
    propostaId: '2',
    dataPagamento: '2025-01-20',
    valorPago: 324.00,
    referencia: '20/01/2025'
  },
  // Proposta 3 - Pago parcialmente (2 pagamentos)
  {
    id: 'p3',
    propostaId: '3',
    dataPagamento: '2025-01-20',
    valorPago: 937.50,
    referencia: '20/01/2025'
  },
  {
    id: 'p4',
    propostaId: '3',
    dataPagamento: '2025-02-05',
    valorPago: 500.00,
    referencia: '05/02/2025'
  },
  // Proposta 4 - Sem pagamento
  // Proposta 5 - Pago parcialmente
  {
    id: 'p5',
    propostaId: '5',
    dataPagamento: '2025-01-20',
    valorPago: 400.00,
    referencia: '20/01/2025'
  },
  // Proposta 6 - Pago parcialmente
  {
    id: 'p6',
    propostaId: '6',
    dataPagamento: '2025-01-20',
    valorPago: 500.00,
    referencia: '20/01/2025'
  },
  // Proposta 7 - Pago totalmente
  {
    id: 'p7',
    propostaId: '7',
    dataPagamento: '2025-01-20',
    valorPago: 1106.00,
    referencia: '20/01/2025'
  },
  {
    id: 'p8',
    propostaId: '7',
    dataPagamento: '2025-02-05',
    valorPago: 1106.00,
    referencia: '05/02/2025'
  },
  // Proposta 8 - Sem pagamento
];
