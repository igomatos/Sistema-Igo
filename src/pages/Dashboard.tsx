import {
  FileText,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Users
} from 'lucide-react';

import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGraficos } from '@/hooks/useGraficos';
import type { Proposta } from '@/types';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const COLORS = ['#F47FA0', '#F7A8BE', '#FBC8D7', '#F9DDE6', '#EACDD6'];

export function Dashboard({ propostas, metricas }: DashboardProps) {
  const { dadosMensais, dadosPorRamo, dadosPorSeguradora } = useGraficos(propostas);

  const percentualRecebido =
    metricas.totalComissao > 0
      ? ((metricas.comissaoRecebida / metricas.totalComissao) * 100).toFixed(0)
      : '0';

  const maiorSeguradora =
    dadosPorSeguradora.length > 0 ? dadosPorSeguradora[0].valor : 1;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-5xl font-black text-[#111827] tracking-tight">
          Painel Financeiro
        </h2>

        <p className="text-xl text-slate-500 mt-3">
          Controle estratégico de previsibilidade e comissões
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Propostas"
          value={metricas.totalPropostas.toString()}
          subtitle={`${metricas.propostasNovas} novas • ${metricas.propostasRenovacao} renovações`}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend="+12%"
          trendUp
        />

        <MetricCard
          title="Prêmio Total"
          value={`R$ ${metricas.totalPremio.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}`}
          subtitle="Valor líquido das propostas"
          icon={<TrendingUp className="w-6 h-6" />}
          color="violet"
          trend="+18%"
          trendUp
        />

        <MetricCard
          title="Comissões Geradas"
          value={`R$ ${metricas.totalComissao.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}`}
          subtitle="Valor previsível"
          icon={<DollarSign className="w-6 h-6" />}
          color="amber"
          trend="+9%"
          trendUp
        />

        <MetricCard
          title="Comissão Recebida"
          value={`R$ ${metricas.comissaoRecebida.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}`}
          subtitle={`Falta: R$ ${metricas.comissaoPendente.toLocaleString('pt-BR', {
            minimumFractionDigits: 2
          })}`}
          icon={<Wallet className="w-6 h-6" />}
          color="emerald"
          trend={`${percentualRecebido}%`}
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border border-[#EADDE1] rounded-3xl shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-[#111827]">
              <TrendingUp className="w-6 h-6 text-[#F47FA0]" />
              Comissões por Período
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dadosMensais}
                  margin={{
                    top: 20,
                    right: 10,
                    left: -20,
                    bottom: 0
                  }}
                >
                  <defs>
                    <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F47FA0" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#F47FA0" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#F8E3E8"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    axisLine={false}
                    stroke="#94A3B8"
                    fontSize={13}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94A3B8"
                    fontSize={13}
                  />

                  <Tooltip
                    cursor={{
                      stroke: '#F47FA0',
                      strokeWidth: 1,
                      strokeDasharray: '5 5'
                    }}
                    contentStyle={{
                      borderRadius: '22px',
                      border: '1px solid #F1D7DE',
                      background: '#fff',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
                      padding: '12px 16px'
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="novo"
                    stroke="#F47FA0"
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#colorPink)"
                    activeDot={{
                      r: 8,
                      fill: '#fff',
                      stroke: '#F47FA0',
                      strokeWidth: 4
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#EADDE1] rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-[#111827]">
              <Users className="w-5 h-5 text-[#F47FA0]" />
              Comissões por Ramo
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPorRamo}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="valor"
                    nameKey="ramo"
                  >
                    {dadosPorRamo.map((_entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[#EADDE1] rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-[#111827]">
            <ArrowUpRight className="w-6 h-6 text-[#F47FA0]" />
            Top Seguradoras
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {dadosPorSeguradora.length === 0 ? (
            <p className="text-slate-500">
              Nenhuma seguradora encontrada para exibir no ranking.
            </p>
          ) : (
            dadosPorSeguradora.map((item, index) => (
              <div key={item.seguradora} className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-2xl bg-[#F6EAEA] text-[#F47FA0] flex items-center justify-center font-black">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <p className="font-bold text-[#111827]">{item.seguradora}</p>

                    <p className="font-bold text-[#111827]">
                      R$ {item.valor.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>

                  <div className="w-full h-3 rounded-full bg-[#F8E8ED] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F47FA0]"
                      style={{
                        width: `${(item.valor / maiorSeguradora) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}