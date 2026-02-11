import { useMemo } from 'react';
import type { Proposta, DadosGrafico } from '@/types';

export function useGraficos(propostas: Proposta[]) {
  const dadosMensais = useMemo((): DadosGrafico[] => {
    const meses: { [key: string]: { novo: number; renovacao: number } } = {};
    
    propostas.forEach(proposta => {
      const data = new Date(proposta.dataCadastro);
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const chave = `${ano}-${mes}`;
      
      if (!meses[chave]) {
        meses[chave] = { novo: 0, renovacao: 0 };
      }
      
      if (proposta.tipo === 'NOVO') {
        meses[chave].novo += proposta.comissaoValor;
      } else {
        meses[chave].renovacao += proposta.comissaoValor;
      }
    });

    const nomesMeses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([chave, valores]) => {
        const [ano, mes] = chave.split('-');
        return {
          mes: `${nomesMeses[parseInt(mes) - 1]}/${ano.slice(2)}`,
          novo: valores.novo,
          renovacao: valores.renovacao,
          total: valores.novo + valores.renovacao
        };
      });
  }, [propostas]);

  const dadosPorRamo = useMemo(() => {
    const ramos: { [key: string]: number } = {};
    
    propostas.forEach(proposta => {
      if (!ramos[proposta.ramo]) {
        ramos[proposta.ramo] = 0;
      }
      ramos[proposta.ramo] += proposta.comissaoValor;
    });

    return Object.entries(ramos)
      .map(([ramo, valor]) => ({ ramo, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [propostas]);

  const dadosPorSeguradora = useMemo(() => {
    const seguradoras: { [key: string]: number } = {};
    
    propostas.forEach(proposta => {
      if (!seguradoras[proposta.seguradora]) {
        seguradoras[proposta.seguradora] = 0;
      }
      seguradoras[proposta.seguradora] += proposta.comissaoValor;
    });

    return Object.entries(seguradoras)
      .map(([seguradora, valor]) => ({ seguradora, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [propostas]);

  return {
    dadosMensais,
    dadosPorRamo,
    dadosPorSeguradora
  };
}
