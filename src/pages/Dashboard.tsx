import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Users
} from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGraficos } from '@/hooks/useGraficos';
import type { Proposta } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardProps {
  propostas: Proposta[];
  metricas: {
    totalPropostas: number;
    totalPremio: number;
    totalComissao: number;
    comissaoRecebida: number;
    comissaoPendente: number;
    propostasNovas: number;
    propostasRenovacao: number;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Dashboard({ propostas, metricas }: DashboardProps) {
  const { dadosMensais, dadosPorRamo, dadosPorSeguradora } = useGraficos(propostas);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Visão geral do seu controle de propostas</p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Propostas"
          value={metricas.totalPropostas.toString()}
          subtitle={`${metricas.propostasNovas} novas • ${metricas.propostasRenovacao} renovações`}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend="+12%"
          trendUp={true}
        />
        <MetricCard
          title="Prêmio Total"
          value={`R$ ${metricas.totalPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Valor líquido das propostas"
          icon={<TrendingUp className="w-6 h-6" />}
          color="violet"
        />
        <MetricCard
          title="Comissão Total"
          value={`R$ ${metricas.totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="A receber"
          icon={<DollarSign className="w-6 h-6" />}
          color="amber"
        />
        <MetricCard
          title="Comissão Recebida"
          value={`R$ ${metricas.comissaoRecebida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`Falta: R$ ${metricas.comissaoPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<Wallet className="w-6 h-6" />}
          color="emerald"
          trend={`${((metricas.comissaoRecebida / metricas.totalComissao) * 100).toFixed(0)}%`}
          trendUp={true}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Comissões por Mês */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Comissões por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosMensais}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="novo" name="Novos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="renovacao" name="Renovações" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico por Ramo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Comissões por Ramo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPorRamo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ ramo, percent }) => `${ramo}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="ramo"
                  >
                    {dadosPorRamo.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Seguradoras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-amber-500" />
              Top 5 Seguradoras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosPorSeguradora.map((item, index) => (
                <div key={item.seguradora} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.seguradora}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(item.valor / dadosPorSeguradora[0].valor) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <p className="font-semibold text-slate-700">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Rápido */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Taxa de Recebimento</p>
                <p className="text-2xl font-bold">
                  {((metricas.comissaoRecebida / metricas.totalComissao) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Média por Proposta</p>
                <p className="text-2xl font-bold">
                  R$ {(metricas.totalComissao / metricas.totalPropostas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pendente de Recebimento</p>
                <p className="text-2xl font-bold text-amber-400">
                  R$ {metricas.comissaoPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
