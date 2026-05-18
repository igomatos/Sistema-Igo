import { useEffect, useMemo, useCallback, useState } from 'react';
import type {
  Proposta,
  PagamentoComissao,
  ComissaoProposta,
  StatusComissao
} from '@/types';

import {
  loadPagamentos,
  loadPropostas,
  savePagamentos,
  savePropostas
} from '@/lib/storage';

import { supabase } from '@/lib/supabase';

function propostaParaBanco(proposta: Proposta) {
  return {
    id: proposta.id,
    segurado: proposta.segurado,
    cpf_cnpj: proposta.cpfCnpj,
    produtor: proposta.produtor,
    seguradora: proposta.seguradora,
    tipo: proposta.tipo,
    ramo: proposta.ramo,
    proposta_numero: proposta.propostaNumero,
    data_transmissao: proposta.dataTransmissao,
    premio_liquido: proposta.premioLiquido,
    quantidade_parcelas: proposta.quantidadeParcelas,
    valor_parcela_seguro: proposta.valorParcelaSeguro,
    comissao_percentual: proposta.comissaoPercentual,
    comissao_parcela: proposta.comissaoParcela,
    comissao_valor: proposta.comissaoValor,
    status: proposta.status,
    status_segurado: proposta.statusSegurado || 'ATIVO',
    gratuidade: proposta.gratuidade || false,
    observacoes: proposta.observacoes,
    data_cadastro: proposta.dataCadastro
  };
}

function propostaDoBanco(row: any): Proposta {
  return {
    id: row.id,
    segurado: row.segurado,
    cpfCnpj: row.cpf_cnpj,
    produtor: row.produtor,
    seguradora: row.seguradora,
    tipo: row.tipo,
    ramo: row.ramo,
    propostaNumero: row.proposta_numero || '',
    dataTransmissao: row.data_transmissao || '',
    premioLiquido: Number(row.premio_liquido || 0),
    quantidadeParcelas: Number(row.quantidade_parcelas || 1),
    valorParcelaSeguro: Number(row.valor_parcela_seguro || 0),
    comissaoPercentual: Number(row.comissao_percentual || 0),
    comissaoParcela: Number(row.comissao_parcela || row.comissao_valor || 0),
    comissaoValor: Number(row.comissao_valor || 0),
    status: row.status,
    statusSegurado: row.status_segurado || 'ATIVO',
    gratuidade: row.gratuidade || false,
    observacoes: row.observacoes,
    dataCadastro: row.data_cadastro
  };
}

function pagamentoParaBanco(pagamento: PagamentoComissao) {
  return {
    id: pagamento.id,
    proposta_id: pagamento.propostaId,
    data_pagamento: pagamento.dataPagamento,
    valor_pago: pagamento.valorPago,
    referencia: pagamento.referencia
  };
}

function pagamentoDoBanco(row: any): PagamentoComissao {
  return {
    id: row.id,
    propostaId: row.proposta_id,
    dataPagamento: row.data_pagamento,
    valorPago: Number(row.valor_pago || 0),
    referencia: row.referencia
  };
}

export function usePropostas() {
  const [propostas, setPropostas] = useState<Proposta[]>(() =>
    loadPropostas([])
  );

  const [pagamentos, setPagamentos] = useState<PagamentoComissao[]>(() =>
    loadPagamentos([])
  );

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDadosOnline() {
      try {
        const { data: propostasOnline, error: erroPropostas } = await supabase
          .from('propostas')
          .select('*')
          .order('data_cadastro', { ascending: false });

        if (erroPropostas) {
          console.error('Erro ao carregar propostas do Supabase:', erroPropostas.message);
          setPropostas([]);
          savePropostas([]);
          return;
        }

        let todosPagamentos: any[] = [];
let pagina = 0;
const tamanhoPagina = 1000;

while (true) {
  const inicio = pagina * tamanhoPagina;
  const fim = inicio + tamanhoPagina - 1;

  const { data, error } = await supabase
    .from('pagamentos')
    .select('*')
    .range(inicio, fim);

  if (error) {
    console.error('Erro ao carregar pagamentos do Supabase:', error.message);
    setPagamentos([]);
    savePagamentos([]);
    return;
  }

  todosPagamentos = [...todosPagamentos, ...(data || [])];

  if (!data || data.length < tamanhoPagina) {
    break;
  }

  pagina++;
}

const pagamentosOnline = todosPagamentos;
        
        const propostasConvertidas = (propostasOnline || []).map(propostaDoBanco);
        const pagamentosConvertidos = (pagamentosOnline || []).map(pagamentoDoBanco);

        setPropostas(propostasConvertidas);
        savePropostas(propostasConvertidas);

        setPagamentos(pagamentosConvertidos);
        savePagamentos(pagamentosConvertidos);
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosOnline();
  }, []);

  useEffect(() => {
    savePropostas(propostas);
  }, [propostas]);

  useEffect(() => {
    savePagamentos(pagamentos);
  }, [pagamentos]);

  const comissoes = useMemo((): ComissaoProposta[] => {
    return propostas.map((proposta) => {
      const pagamentosProposta = pagamentos.filter(
        (p) => p.propostaId === proposta.id
      );

      const pagamentosOrdenados = [...pagamentosProposta].sort((a, b) =>
  (a.referencia || '').localeCompare(b.referencia || '')
);

const primeiroPagamento = pagamentosOrdenados[0]?.referencia;
const ultimoPagamento = pagamentosOrdenados[pagamentosOrdenados.length - 1]?.referencia;
const inicioCiclo = proposta.dataInicioCiclo || primeiroPagamento;

const parcelasEsperadas = proposta.parcelasCiclo || 12;

const valorEsperadoParcela =
  parcelasEsperadas > 0
    ? proposta.comissaoValor / parcelasEsperadas
    : proposta.comissaoValor;

 const referenciasEsperadas: string[] = [];

 if (inicioCiclo) {
  const [mesInicio, anoInicio] = inicioCiclo.split('/').map(Number);

  for (let i = 0; i < parcelasEsperadas; i++) {
    const data = new Date(anoInicio, mesInicio - 1 + i);

    const mes = String(data.getMonth() + 1).padStart(2, '0');

    const ano = data.getFullYear();

    referenciasEsperadas.push(`${mes}/${ano}`);
  }
}   

const totalPago = pagamentosProposta.reduce(
  (sum, p) => sum + p.valorPago,
  0
);

const totalPagoCiclo = pagamentosProposta
  .filter((p) => {
    if (!primeiroPagamento || !ultimoPagamento || !p.referencia) return true;

    const [mesInicio, anoInicio] = primeiroPagamento.split('/').map(Number);
    const [mesAtual, anoAtual] = ultimoPagamento.split('/').map(Number);
    const [mesPgto, anoPgto] = p.referencia.split('/').map(Number);

    const inicioAbs = anoInicio * 12 + mesInicio;
    const atualAbs = anoAtual * 12 + mesAtual;
    const pgtoAbs = anoPgto * 12 + mesPgto;

    const cicloAtual = Math.floor((atualAbs - inicioAbs) / 12);
    const inicioCiclo = inicioAbs + cicloAtual * 12;
    const fimCiclo = inicioCiclo + 11;

    return pgtoAbs >= inicioCiclo && pgtoAbs <= fimCiclo;
  })
  .reduce((sum, p) => sum + p.valorPago, 0);

const saldoDevedor = proposta.comissaoValor - totalPagoCiclo;

const parcelasPagas = pagamentosProposta.length;

const parcelasPendentes =
  parcelasEsperadas - parcelasPagas > 0
    ? parcelasEsperadas - parcelasPagas
    : 0;

const cicloFinalizado =
  parcelasPagas >= parcelasEsperadas;

const percentualPago =
  proposta.comissaoValor > 0
    ? Math.min((totalPagoCiclo / proposta.comissaoValor) * 100, 100)
    : 0;

      let status: StatusComissao;

      if (proposta.gratuidade) {
        status = 'PAGO';
      } else if (cicloFinalizado && parcelasPendentes > 0) {
        status = 'RENOVAR';
      } else if (totalPago === 0) {
        status = 'PENDENTE';
      } else if (totalPago >= proposta.comissaoValor) {
        status = 'PAGO';
      } else {
        status = 'PARCIAL';
      }

      return {
        proposta,
        pagamentos: pagamentosProposta,
        totalPago: totalPagoCiclo,
        saldoDevedor,
        percentualPago,
        valorEsperadoParcela,
        referenciasEsperadas,
        parcelasPagas,
        parcelasEsperadas,
        parcelasPendentes,
        cicloFinalizado,
        status
      };
    });
  }, [propostas, pagamentos]);

  const metricas = useMemo(() => {
    const totalPropostas = propostas.length;
    const totalPremio = propostas.reduce((sum, p) => sum + p.premioLiquido, 0);
    const totalComissao = propostas.reduce((sum, p) => sum + p.comissaoValor, 0);
    const comissaoRecebida = comissoes.reduce((sum, c) => sum + c.totalPago, 0);
    const comissaoPendente = totalComissao - comissaoRecebida;
    const propostasNovas = propostas.filter((p) => p.tipo === 'NOVO').length;
    const propostasRenovacao = propostas.filter((p) => p.tipo === 'RENOVACAO').length;

    return {
      totalPropostas,
      totalPremio,
      totalComissao,
      comissaoRecebida,
      comissaoPendente,
      propostasNovas,
      propostasRenovacao
    };
  }, [propostas, comissoes]);

  const adicionarProposta = useCallback(
    async (novaProposta: Omit<Proposta, 'id' | 'dataCadastro'>) => {
      const proposta: Proposta = {
        ...novaProposta,
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString().split('T')[0],
        statusSegurado: 'ATIVO',
        gratuidade: novaProposta.gratuidade || false
      };

      setPropostas((prev) => [proposta, ...prev]);

      const { error } = await supabase
        .from('propostas')
        .insert(propostaParaBanco(proposta));

      if (error) {
        console.error('Erro ao salvar proposta no Supabase:', error.message);
      }

      return proposta;
    },
    []
  );

  const adicionarPagamento = useCallback(
    async (propostaId: string, valor: number, data: string) => {
      const proposta = propostas.find((p) => p.id === propostaId);

      if (!proposta) return null;

      const pagamentosExistentes = pagamentos.filter(
        (p) => p.propostaId === propostaId
      );

      const totalPago = pagamentosExistentes.reduce(
        (sum, p) => sum + p.valorPago,
        0
      );

      if (totalPago + valor > proposta.comissaoValor) {
        throw new Error('Valor do pagamento excede a comissão total');
      }

      const partes = data.split('-');
      const referencia =
        partes.length === 3
          ? `${partes[1]}/${partes[0]}`
          : data;

      const pagamento: PagamentoComissao = {
        id: Date.now().toString(),
        propostaId,
        dataPagamento: data,
        valorPago: valor,
        referencia
      };

      setPagamentos((prev) => [...prev, pagamento]);

      const { error } = await supabase
        .from('pagamentos')
        .insert(pagamentoParaBanco(pagamento));

      if (error) {
        console.error('Erro ao salvar pagamento no Supabase:', error.message);
      }

      return pagamento;
    },
    [propostas, pagamentos]
  );

  const excluirProposta = useCallback(async (id: string) => {
    setPropostas((prev) => prev.filter((p) => p.id !== id));
    setPagamentos((prev) => prev.filter((p) => p.propostaId !== id));

    await supabase.from('pagamentos').delete().eq('proposta_id', id);
    await supabase.from('propostas').delete().eq('id', id);
  }, []);

  const excluirPagamento = useCallback(async (id: string) => {
    setPagamentos((prev) => prev.filter((p) => p.id !== id));

    await supabase.from('pagamentos').delete().eq('id', id);
  }, []);

  const editarProposta = useCallback(
    async (id: string, dados: Partial<Proposta>) => {
      setPropostas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...dados } : p))
      );

      const propostaAtualizada = propostas.find((p) => p.id === id);

      if (!propostaAtualizada) return;

      const propostaFinal = {
        ...propostaAtualizada,
        ...dados
      };

      const { error } = await supabase
        .from('propostas')
        .update(propostaParaBanco(propostaFinal))
        .eq('id', id);

      if (error) {
        console.error('Erro ao editar proposta no Supabase:', error.message);
      }
    },
    [propostas]
  );

  return {
    propostas,
    pagamentos,
    comissoes,
    metricas,
    carregando,
    adicionarProposta,
    adicionarPagamento,
    excluirProposta,
    excluirPagamento,
    editarProposta
  };
}