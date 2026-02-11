import { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import type { ComissaoProposta } from '@/types';
import { cn } from '@/lib/utils';

interface ComissoesProps {
  comissoes: ComissaoProposta[];
  onAdicionarPagamento: (propostaId: string, valor: number, data: string) => void;
  onExcluirPagamento: (id: string) => void;
}

export function Comissoes({ comissoes, onAdicionarPagamento, onExcluirPagamento }: ComissoesProps) {
  const [activeTab, setActiveTab] = useState('todas');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<string>('');
  const [valorPagamento, setValorPagamento] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');

  const comissoesFiltradas = comissoes.filter(c => {
    if (activeTab === 'todas') return true;
    return c.status === activeTab.toUpperCase();
  });

  const comissoesPendentes = comissoes.filter(c => c.status === 'PENDENTE');
  const comissoesParciais = comissoes.filter(c => c.status === 'PARCIAL');
  const comissoesPagas = comissoes.filter(c => c.status === 'PAGO');

  const handleSubmitPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propostaSelecionada || !valorPagamento || !dataPagamento) return;

    try {
      onAdicionarPagamento(
        propostaSelecionada,
        parseFloat(valorPagamento),
        dataPagamento
      );
      
      setPropostaSelecionada('');
      setValorPagamento('');
      setDataPagamento('');
      setIsDialogOpen(false);
    } catch (error) {
      alert('Erro ao adicionar pagamento: ' + (error as Error).message);
    }
  };

  const getProximoPagamento = () => {
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();
    
    if (dia <= 15) {
      return new Date(ano, mes, 20);
    } else {
      return new Date(ano, mes + 1, 5);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Controle de Comissões</h2>
          <p className="text-slate-500">Acompanhe os pagamentos das suas comissões</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pagamento
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Registrar Novo Pagamento
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitPagamento} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposta">Proposta *</Label>
                <Select 
                  value={propostaSelecionada} 
                  onValueChange={setPropostaSelecionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a proposta..." />
                  </SelectTrigger>
                  <SelectContent>
                    {comissoes
                      .filter(c => c.status !== 'PAGO')
                      .map((c) => (
                        <SelectItem key={c.proposta.id} value={c.proposta.id}>
                          {c.proposta.segurado} - {c.proposta.seguradora} 
                          (Falta: R$ {c.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Pagamento (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={valorPagamento}
                  onChange={(e) => setValorPagamento(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data do Pagamento *</Label>
                <Input
                  id="data"
                  type="date"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                  required
                />
                <p className="text-xs text-slate-500">
                  Pagamentos até dia 15 referem-se ao dia 05 do mês. 
                  Após dia 15, referem-se ao dia 20.
                </p>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  Registrar Pagamento
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Pendentes</p>
                <p className="text-xl font-bold text-amber-800">{comissoesPendentes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Parciais</p>
                <p className="text-xl font-bold text-blue-800">{comissoesParciais.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Pagas (Esgotadas)</p>
                <p className="text-xl font-bold text-emerald-800">{comissoesPagas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-violet-700">Próximo Pagamento</p>
                <p className="text-xl font-bold text-violet-800">
                  {getProximoPagamento().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs e Lista */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="todas">
            Todas
            <Badge variant="secondary" className="ml-2">{comissoes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pendente">
            Pendentes
            <Badge variant="secondary" className="ml-2">{comissoesPendentes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="parcial">
            Parciais
            <Badge variant="secondary" className="ml-2">{comissoesParciais.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pago">
            Pagas
            <Badge variant="secondary" className="ml-2">{comissoesPagas.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {comissoesFiltradas.map((comissao) => (
              <Card 
                key={comissao.proposta.id}
                className={cn(
                  "overflow-hidden transition-all duration-200 hover:shadow-lg",
                  comissao.status === 'PAGO' && "border-emerald-300 bg-emerald-50/30",
                  comissao.status === 'PARCIAL' && "border-blue-300 bg-blue-50/30",
                  comissao.status === 'PENDENTE' && "border-amber-300 bg-amber-50/30"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{comissao.proposta.segurado}</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        {comissao.proposta.seguradora} • {comissao.proposta.ramo}
                      </p>
                    </div>
                    <StatusBadge status={comissao.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <ProgressBar
                    value={comissao.totalPago}
                    total={comissao.proposta.comissaoValor}
                    percentual={comissao.percentualPago}
                  />

                  {/* Detalhes */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Total Comissão</p>
                      <p className="font-semibold text-slate-900">
                        R$ {comissao.proposta.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Recebido</p>
                      <p className="font-semibold text-emerald-600">
                        R$ {comissao.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Saldo</p>
                      <p className={cn(
                        "font-semibold",
                        comissao.saldoDevedor > 0 ? "text-amber-600" : "text-emerald-600"
                      )}>
                        R$ {comissao.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Histórico de Pagamentos */}
                  {comissao.pagamentos.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs font-medium text-slate-600 mb-2">Histórico de Pagamentos</p>
                      <div className="space-y-1">
                        {comissao.pagamentos.map((pag) => (
                          <div 
                            key={pag.id}
                            className="flex items-center justify-between text-sm py-1 px-2 bg-slate-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{new Date(pag.dataPagamento).toLocaleDateString('pt-BR')}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {pag.referencia}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-emerald-600">
                                R$ {pag.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-rose-400 hover:text-rose-600"
                                onClick={() => onExcluirPagamento(pag.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {comissoesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Nenhuma comissão encontrada</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
