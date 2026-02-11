import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  FileText,
  User,
  Building2,
  Tag,
  Upload
} from 'lucide-react';
import { PdfUploader } from '@/components/PdfUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
// Nota: o Select (Radix UI) pode apresentar instabilidade em alguns ambientes.
// Para evitar tela branca ao selecionar, usamos <select> nativo nos campos críticos.
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import type { Proposta, TipoProposta, StatusProposta } from '@/types';
import { seguradoras, ramos } from '@/data/mockData';

interface PropostasProps {
  propostas: Proposta[];
  onAdicionar: (proposta: Omit<Proposta, 'id' | 'dataCadastro'>) => void;
  onExcluir: (id: string) => void;
  onEditar: (id: string, dados: Partial<Proposta>) => void;
}

export function Propostas({ propostas, onAdicionar, onExcluir, onEditar }: PropostasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPdfUploaderOpen, setIsPdfUploaderOpen] = useState(false);
  const [propostaEditando, setPropostaEditando] = useState<Proposta | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    segurado: '',
    cpfCnpj: '',
    seguradora: '',
    tipo: 'NOVO' as TipoProposta,
    ramo: '',
    apolice: '',
    vigenciaInicio: '',
    vigenciaFim: '',
    premioLiquido: '',
    comissaoPercentual: '20',
    observacoes: '',
    status: 'EMITIDA' as StatusProposta
  });

  const propostasFiltradas = propostas.filter(p => {
    const matchSearch = 
      p.segurado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apolice.includes(searchTerm) ||
      p.seguradora.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchSearch && matchTipo && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const premio = parseFloat(formData.premioLiquido) || 0;
    const percentual = parseFloat(formData.comissaoPercentual) || 0;
    const comissao = (premio * percentual) / 100;

    const novaProposta = {
      ...formData,
      premioLiquido: premio,
      comissaoPercentual: percentual,
      comissaoValor: comissao
    };

    if (propostaEditando) {
      onEditar(propostaEditando.id, novaProposta);
    } else {
      onAdicionar(novaProposta);
    }

    resetForm();
    setIsDialogOpen(false);
    setPropostaEditando(null);
  };

  const resetForm = () => {
    setFormData({
      segurado: '',
      cpfCnpj: '',
      seguradora: '',
      tipo: 'NOVO',
      ramo: '',
      apolice: '',
      vigenciaInicio: '',
      vigenciaFim: '',
      premioLiquido: '',
      comissaoPercentual: '20',
      observacoes: '',
      status: 'EMITIDA'
    });
  };

  const handleEdit = (proposta: Proposta) => {
    setPropostaEditando(proposta);
    setFormData({
      segurado: proposta.segurado,
      cpfCnpj: proposta.cpfCnpj,
      seguradora: proposta.seguradora,
      tipo: proposta.tipo,
      ramo: proposta.ramo,
      apolice: proposta.apolice,
      vigenciaInicio: proposta.vigenciaInicio,
      vigenciaFim: proposta.vigenciaFim,
      premioLiquido: proposta.premioLiquido.toString(),
      comissaoPercentual: proposta.comissaoPercentual.toString(),
      observacoes: proposta.observacoes || '',
      status: proposta.status
    });
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setPropostaEditando(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleDadosPdfExtraidos = (dados: any) => {
    setFormData({
      segurado: dados.segurado || '',
      cpfCnpj: dados.cpfCnpj || '',
      seguradora: dados.seguradora || '',
      tipo: 'NOVO',
      ramo: dados.ramo || '',
      apolice: dados.apolice || '',
      vigenciaInicio: dados.vigenciaInicio || '',
      vigenciaFim: dados.vigenciaFim || '',
      premioLiquido: dados.premioLiquido ? dados.premioLiquido.toString() : '',
      comissaoPercentual: dados.comissaoPercentual ? dados.comissaoPercentual.toString() : '20',
      observacoes: '',
      status: 'EMITIDA'
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Propostas</h2>
          <p className="text-slate-500">Gerencie todas as suas propostas de seguro</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsPdfUploaderOpen(true)}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleNew}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Proposta
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                {propostaEditando ? 'Editar Proposta' : 'Nova Proposta'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="segurado">Nome do Segurado *</Label>
                  <Input
                    id="segurado"
                    value={formData.segurado}
                    onChange={(e) => setFormData({ ...formData, segurado: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                  <Input
                    id="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seguradora">Seguradora *</Label>
                  <select
                    id="seguradora"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formData.seguradora}
                    onChange={(e) => setFormData({ ...formData, seguradora: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {seguradoras.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <select
                    id="tipo"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoProposta })}
                    required
                  >
                    <option value="NOVO">Novo</option>
                    <option value="RENOVACAO">Renovação</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ramo">Ramo *</Label>
                  <select
                    id="ramo"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formData.ramo}
                    onChange={(e) => setFormData({ ...formData, ramo: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    {ramos.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apolice">Nº Apólice *</Label>
                  <Input
                    id="apolice"
                    value={formData.apolice}
                    onChange={(e) => setFormData({ ...formData, apolice: e.target.value })}
                    placeholder="000000000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vigenciaInicio">Início Vigência *</Label>
                  <Input
                    id="vigenciaInicio"
                    type="date"
                    value={formData.vigenciaInicio}
                    onChange={(e) => setFormData({ ...formData, vigenciaInicio: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vigenciaFim">Fim Vigência *</Label>
                  <Input
                    id="vigenciaFim"
                    type="date"
                    value={formData.vigenciaFim}
                    onChange={(e) => setFormData({ ...formData, vigenciaFim: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="premioLiquido">Prêmio Líquido (R$) *</Label>
                  <Input
                    id="premioLiquido"
                    type="number"
                    step="0.01"
                    value={formData.premioLiquido}
                    onChange={(e) => setFormData({ ...formData, premioLiquido: e.target.value })}
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comissaoPercentual">% Comissão *</Label>
                  <Input
                    id="comissaoPercentual"
                    type="number"
                    step="0.01"
                    value={formData.comissaoPercentual}
                    onChange={(e) => setFormData({ ...formData, comissaoPercentual: e.target.value })}
                    placeholder="20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm"
                  placeholder="Informações adicionais..."
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  {propostaEditando ? 'Salvar Alterações' : 'Cadastrar Proposta'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por segurado, apólice ou seguradora..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-[180px]">
              <label className="sr-only" htmlFor="filtroTipo">Tipo</label>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  id="filtroTipo"
                  className="w-full h-10 rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="todos">Todos os tipos</option>
                  <option value="NOVO">Novo</option>
                  <option value="RENOVACAO">Renovação</option>
                </select>
              </div>
            </div>

            <div className="w-[180px]">
              <label className="sr-only" htmlFor="filtroStatus">Status</label>
              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  id="filtroStatus"
                  className="w-full h-10 rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="EMITIDA">Emitida</option>
                  <option value="PAGA">Paga</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Propostas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Lista de Propostas</span>
            <Badge variant="secondary">{propostasFiltradas.length} propostas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Segurado</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Seguradora</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Ramo</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Prêmio</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Comissão</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {propostasFiltradas.map((proposta) => (
                  <tr 
                    key={proposta.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{proposta.segurado}</p>
                          <p className="text-xs text-slate-500">{proposta.cpfCnpj}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{proposta.seguradora}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={proposta.tipo} type="tipo" />
                    </td>
                    <td className="py-3 px-4 text-sm">{proposta.ramo}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      R$ {proposta.premioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div>
                        <p className="font-medium text-emerald-600">
                          R$ {proposta.comissaoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500">{proposta.comissaoPercentual}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={proposta.status} type="proposta" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(proposta)}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onExcluir(proposta.id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {propostasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhuma proposta encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDF Uploader */}
      <PdfUploader
        isOpen={isPdfUploaderOpen}
        onClose={() => setIsPdfUploaderOpen(false)}
        onDadosExtraidos={handleDadosPdfExtraidos}
      />
    </div>
  );
}
