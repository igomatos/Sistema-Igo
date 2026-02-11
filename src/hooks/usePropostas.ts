import { useEffect, useMemo, useCallback, useState } from 'react';
import type { Proposta, PagamentoComissao, ComissaoProposta, StatusComissao } from '@/types';
import { propostasMock, pagamentosMock } from '@/data/mockData';
import { loadPagamentos, loadPropostas, savePagamentos, savePropostas } from '@/lib/storage';

export function usePropostas() {
  // Carrega do navegador (localStorage). Se ainda não existir nada, usa os dados de exemplo.
  const [propostas, setPropostas] = useState<Proposta[]>(() => loadPropostas(propostasMock));
  const [pagamentos, setPagamentos] = useState<PagamentoComissao[]>(() => loadPagamentos(pagamentosMock));

  // Sempre que mudar, salva automaticamente.
  useEffect(() => {
    savePropostas(propostas);
  }, [propostas]);

  useEffect(() => {
    savePagamentos(pagamentos);
  }, [pagamentos]);

  // Calcular comissões com status
  const comissoes = useMemo((): ComissaoProposta[] => {
    return propostas.map(proposta => {
      const pagamentosProposta = pagamentos.filter(p => p.propostaId === proposta.id);
      const totalPago = pagamentosProposta.reduce((sum, p) => sum + p.valorPago, 0);
      const saldoDevedor = proposta.comissaoValor - totalPago;
      const percentualPago = proposta.comissaoValor > 0 
        ? (totalPago / proposta.comissaoValor) * 100 
        : 0;

      let status: StatusComissao;
      if (totalPago === 0) {
        status = 'PENDENTE';
      } else if (totalPago >= proposta.comissaoValor) {
        status = 'PAGO';
      } else {
        status = 'PARCIAL';
      }

      return {
        proposta,
        pagamentos: pagamentosProposta,
        totalPago,
        saldoDevedor,
        percentualPago,
        status
      };
    });
  }, [propostas, pagamentos]);

  // Métricas do dashboard
  const metricas = useMemo(() => {
    const totalPropostas = propostas.length;
    const totalPremio = propostas.reduce((sum, p) => sum + p.premioLiquido, 0);
    const totalComissao = propostas.reduce((sum, p) => sum + p.comissaoValor, 0);
    const comissaoRecebida = comissoes.reduce((sum, c) => sum + c.totalPago, 0);
    const comissaoPendente = totalComissao - comissaoRecebida;
    const propostasNovas = propostas.filter(p => p.tipo === 'NOVO').length;
    const propostasRenovacao = propostas.filter(p => p.tipo === 'RENOVACAO').length;

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

  // Adicionar nova proposta
  const adicionarProposta = useCallback((novaProposta: Omit<Proposta, 'id' | 'dataCadastro'>) => {
    const proposta: Proposta = {
      ...novaProposta,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    setPropostas(prev => [proposta, ...prev]);
    return proposta;
  }, []);

  // Adicionar pagamento
  const adicionarPagamento = useCallback((propostaId: string, valor: number, data: string) => {
    const proposta = propostas.find(p => p.id === propostaId);
    if (!proposta) return null;

    const pagamentosExistentes = pagamentos.filter(p => p.propostaId === propostaId);
    const totalPago = pagamentosExistentes.reduce((sum, p) => sum + p.valorPago, 0);
    
    if (totalPago + valor > proposta.comissaoValor) {
      throw new Error('Valor do pagamento excede a comissão total');
    }

    const dataObj = new Date(data);
    const dia = dataObj.getDate();
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const referencia = `${dia <= 15 ? '05' : '20'}/${mes}/${ano}`;

    const pagamento: PagamentoComissao = {
      id: Date.now().toString(),
      propostaId,
      dataPagamento: data,
      valorPago: valor,
      referencia
    };

    setPagamentos(prev => [...prev, pagamento]);
    return pagamento;
  }, [propostas, pagamentos]);

  // Excluir proposta
  const excluirProposta = useCallback((id: string) => {
    setPropostas(prev => prev.filter(p => p.id !== id));
    setPagamentos(prev => prev.filter(p => p.propostaId !== id));
  }, []);

  // Excluir pagamento
  const excluirPagamento = useCallback((id: string) => {
    setPagamentos(prev => prev.filter(p => p.id !== id));
  }, []);

  // Editar proposta
  const editarProposta = useCallback((id: string, dados: Partial<Proposta>) => {
    setPropostas(prev => prev.map(p => 
      p.id === id ? { ...p, ...dados } : p
    ));
  }, []);

  return {
    propostas,
    pagamentos,
    comissoes,
    metricas,
    adicionarProposta,
    adicionarPagamento,
    excluirProposta,
    excluirPagamento,
    editarProposta
  };
}
