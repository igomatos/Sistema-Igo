import { useState, useMemo } from 'react';
import { 
  Download, 
  TrendingUp,
  PieChart,
  BarChart3,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Proposta } from '@/types';
import { Input } from '@/components/ui/input';
import { seguradoras, ramos } from '@/data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface RelatoriosProps {
  propostas: Proposta[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

export function Relatorios({ propostas }: RelatoriosProps) {
  const [mesInicio, setMesInicio] = useState('');
  const [mesFim, setMesFim] = useState('');
  const [seguradoraFiltro, setSeguradoraFiltro] = useState('todas');
  const [ramoFiltro, setRamoFiltro] = useState('todos');

  const propostasFiltradas = useMemo(() => {
    return propostas.filter(p => {
      const dataProposta = new Date(p.dataCadastro);
      const matchInicio = !mesInicio || dataProposta >= new Date(mesInicio + '-01');
      const matchFim = !mesFim || dataProposta <= new Date(mesFim + '-31');
      const matchSeguradora = seguradoraFiltro === 'todas' || p.seguradora === seguradoraFiltro;
      const matchRamo = ramoFiltro === 'todos' || p.ramo === ramoFiltro;
      return matchInicio && matchFim && matchSeguradora && matchRamo;
    });
  }, [propostas, mesInicio, mesFim, seguradoraFiltro, ramoFiltro]);

  const dadosPorMes = useMemo(() => {
    const meses: { [key: string]: { novo: number; renovacao: number; comissao: number } } = {};
    
    propostasFiltradas.forEach((p: Proposta) => {
      const data = new Date(p.dataCadastro);
      const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      
      if (!meses[chave]) {
        meses[chave] = { novo: 0, renovacao: 0, comissao: 0 };
      }
      
      if (p.tipo === 'NOVO') {
        meses[chave].novo += p.premioLiquido;
      } else {
        meses[chave].renovacao += p.premioLiquido;
      }
      meses[chave].comissao += p.comissaoValor;
    });

    return Object.entries(meses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([chave, valores]) => {
        const [ano, mes] = chave.split('-');
        const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          mes: `${nomesMeses[parseInt(mes) - 1]}/${ano}`,
          ...valores
        };
      });
  }, [propostasFiltradas]);

  const dadosPorRamo = useMemo(() => {
    const ramosData: { [key: string]: number } = {};
    propostasFiltradas.forEach((p: Proposta) => {
      ramosData[p.ramo] = (ramosData[p.ramo] || 0) + p.comissaoValor;
    });
    return Object.entries(ramosData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [propostasFiltradas]);

  const dadosPorSeguradora = useMemo(() => {
    const segData: { [key: string]: number } = {};
    propostasFiltradas.forEach((p: Proposta) => {
      segData[p.seguradora] = (segData[p.seguradora] || 0) + p.comissaoValor;
    });
    return Object.entries(segData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [propostasFiltradas]);

  const resumo = useMemo(() => {
    const totalPropostas = propostasFiltradas.length;
    const totalPremio = propostasFiltradas.reduce((sum, p) => sum + p.premioLiquido, 0);
    const totalComissao = propostasFiltradas.reduce((sum, p) => sum + p.comissaoValor, 0);
    const novos = propostasFiltradas.filter(p => p.tipo === 'NOVO').length;
    const renovacoes = propostasFiltradas.filter(p => p.tipo === 'RENOVACAO').length;
    
    return { totalPropostas, totalPremio, totalComissao, novos, renovacoes };
  }, [propostasFiltradas]);

  const exportarCSV = () => {
    const headers = ['Data', 'Segurado', 'Seguradora', 'Tipo', 'Ramo', 'Prêmio', 'Comissão', 'Status'];
    const rows = propostasFiltradas.map(p => [
      p.dataCadastro,
      p.segurado,
      p.seguradora,
      p.tipo,
      p.ramo,
      p.premioLiquido.toString(),
      p.comissaoValor.toString(),
      p.status
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-propostas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios</h2>
          <p className="text-slate-500">Análise detalhada da sua produção</p>
        </div>
        <Button 
          onClick={exportarCSV}
          variant="outline"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-500" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Mês Início</Label>
              <Input
                type="month"
                value={mesInicio}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMesInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Mês Fim</Label>
              <Input
                type="month"
                value={mesFim}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMesFim(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Seguradora</Label>
              <Select value={seguradoraFiltro} onValueChange={setSeguradoraFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {seguradoras.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ramo</Label>
              <Select value={ramoFiltro} onValueChange={setRamoFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ramos.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">Total Propostas</p>
            <p className="text-2xl font-bold text-blue-800">{resumo.totalPropostas}</p>
          </CardContent>
        </Card>
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="p-4">
            <p className="text-sm text-violet-700">Prêmio Total</p>
            <p className="text-2xl font-bold text-violet-800">
              R$ {resumo.totalPremio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <p className="text-sm text-emerald-700">Comissão Total</p>
            <p className="text-2xl font-bold text-emerald-800">
              R$ {resumo.totalComissao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-700">Novos</p>
            <p className="text-2xl font-bold text-amber-800">{resumo.novos}</p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <p className="text-sm text-cyan-700">Renovações</p>
            <p className="text-2xl font-bold text-cyan-800">{resumo.renovacoes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="evolucao">
        <TabsList>
          <TabsTrigger value="evolucao">
            <TrendingUp className="w-4 h-4 mr-2" />
            Evolução
          </TabsTrigger>
          <TabsTrigger value="ramos">
            <PieChart className="w-4 h-4 mr-2" />
            Por Ramo
          </TabsTrigger>
          <TabsTrigger value="seguradoras">
            <BarChart3 className="w-4 h-4 mr-2" />
            Por Seguradora
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evolucao" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="novo" name="Novos" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="renovacao" name="Renovações" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="comissao" name="Comissão" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ramos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Ramo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={dadosPorRamo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {dadosPorRamo.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguradoras" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comissões por Seguradora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosPorSeguradora} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Bar dataKey="value" name="Comissão" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
