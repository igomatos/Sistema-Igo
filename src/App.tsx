import { useState } from 'react';

import { Layout } from '@/components/Layout';

import { Dashboard } from '@/pages/Dashboard';
import { Propostas } from '@/pages/Propostas';
import { Comissoes } from '@/pages/Comissoes';
import { Relatorios } from '@/pages/Relatorios';
import { ConfiguracoesProdutores } from '@/pages/ConfiguracoesProdutores';
import { ConciliacaoAnadem } from '@/pages/ConciliacaoAnadem';
import { Login } from '@/pages/Login';

import { usePropostas } from '@/hooks/usePropostas';

import { Toaster } from '@/components/ui/sonner';

import { toast } from 'sonner';


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const {
    propostas,
    comissoes,
    metricas,
    adicionarProposta,
    adicionarPagamento,
    excluirProposta,
    excluirPagamento,
    editarProposta,
  } = usePropostas();

  const handleLogin = () => {
    setIsLoggedIn(true);

    toast.success('Bem-vindo ao sistema!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);

    setActiveTab('dashboard');

    toast.success('Você saiu do sistema.');
  };

  const handleAdicionarProposta = (
    proposta: Parameters<typeof adicionarProposta>[0]
  ) => {
    adicionarProposta(proposta);

    toast.success('Proposta cadastrada com sucesso!');
  };

  const handleExcluirProposta = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      excluirProposta(id);

      toast.success('Proposta excluída com sucesso!');
    }
  };

  const handleEditarProposta = (
    id: string,
    dados: Parameters<typeof editarProposta>[1]
  ) => {
    editarProposta(id, dados);

    toast.success('Proposta atualizada com sucesso!');
  };

  const handleAdicionarPagamento = (
    propostaId: string,
    valor: number,
    data: string
  ) => {
    try {
      adicionarPagamento(propostaId, valor, data);

      toast.success('Pagamento registrado com sucesso!');
    } catch (error) {
      toast.error((error as Error).message);

      throw error;
    }
  };

  const handleExcluirPagamento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pagamento?')) {
      excluirPagamento(id);

      toast.success('Pagamento excluído com sucesso!');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            propostas={propostas}
            metricas={metricas}
          />
        );

      case 'propostas':
        return (
          <Propostas
            propostas={propostas}
            onAdicionar={handleAdicionarProposta}
            onExcluir={handleExcluirProposta}
            onEditar={handleEditarProposta}
          />
        );

      case 'comissoes':
        return (
          <Comissoes
            comissoes={comissoes}
            onAdicionarPagamento={handleAdicionarPagamento}
            onExcluirPagamento={handleExcluirPagamento}
          />
        );

      case 'conciliacao_anadem':
        return <ConciliacaoAnadem />;

      case 'relatorios':
        return <Relatorios propostas={propostas} />;

      case 'config_produtores':
        return <ConfiguracoesProdutores />;

      default:
        return (
          <Dashboard
            propostas={propostas}
            metricas={metricas}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />

        <Toaster
          position="top-right"
          richColors
        />
      </>
    );
  }

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>

      <Toaster
        position="top-right"
        richColors
      />
    </>
  );
}

export default App;