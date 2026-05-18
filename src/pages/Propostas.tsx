import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';

import type { Proposta, TipoProposta, StatusProposta } from '@/types';
import { seguradoras, ramos } from '@/data/mockData';
import { carregarProdutores } from '@/data/produtores';
import { supabase } from '@/lib/supabase';

interface PropostasProps {
  propostas: Proposta[];
  onAdicionar: (proposta: Omit<Proposta, 'id' | 'dataCadastro'>) => void;
  onExcluir: (id: string) => void;
  onEditar: (id: string, dados: Partial<Proposta>) => void;
}

type FormDataState = {
  segurado: string;
  cpfCnpj: string;
  produtor: string;
  seguradora: string;
  tipo: TipoProposta;
  ramo: string;
  propostaNumero: string;
  dataTransmissao: string;
  dataInicioCiclo: string;
  parcelasCiclo: string;
  statusContrato: 'ATIVO' | 'CANCELADO' | 'FINALIZADO' | 'GRATUIDADE' | 'EM_ANALISE';
  dataCancelamento: string;
  premioLiquido: string;
  quantidadeParcelas: string;
  comissaoPercentual: string;
  observacoes: string;
  status: StatusProposta;
  gratuidade: boolean;
};

const DEFAULT_FORM: FormDataState = {
  segurado: '',
  cpfCnpj: '',
  produtor: 'IGO',
  seguradora: '',
  tipo: 'NOVO',
  ramo: '',
  propostaNumero: '',
  dataTransmissao: '',
  dataInicioCiclo: '',
  parcelasCiclo: '12',
  statusContrato: 'ATIVO',
  dataCancelamento: '',
  premioLiquido: '',
  quantidadeParcelas: '1',
  comissaoPercentual: '20',
  observacoes: '',
  status: 'EMITIDA',
  gratuidade: false,
};

  function limparMoeda(valor: string | number | undefined | null, fallback = 0) {
  if (valor === undefined || valor === null || valor === '') return fallback;

  const texto = String(valor)
    .replace(/[^\d,.-]/g, '')
    .trim();

  if (!texto) return fallback;

  const temVirgula = texto.includes(',');
  const temPonto = texto.includes('.');

  let normalizado = texto;

  if (temVirgula && temPonto) {
    normalizado = texto.replace(/\./g, '').replace(',', '.');
  } else if (temVirgula) {
    normalizado = texto.replace(',', '.');
  } else {
    normalizado = texto;
  }

  const numero = Number.parseFloat(normalizado);

  return Number.isFinite(numero) ? numero : fallback;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarCampoMoeda(valor: string) {
  const somenteNumeros = valor.replace(/\D/g, '');

  if (!somenteNumeros) return '';

  const numero = Number(somenteNumeros) / 100;

  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatarPercentualDigitado(valor: string) {
  return valor.replace(/[^\d,.]/g, '');
}

export function Propostas({
  propostas,
  onAdicionar,
  onExcluir,
  onEditar,
}: PropostasProps) {
  const [produtores, setProdutores] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [propostaEditando, setPropostaEditando] = useState<Proposta | null>(null);
  const [formData, setFormData] = useState<FormDataState>(DEFAULT_FORM);
  const [propostasBanco, setPropostasBanco] = useState<Proposta[]>([]);

useEffect(() => {
  async function carregarPropostasBanco() {
    const { data, error } = await supabase
      .from('propostas')
      .select('*')
      .order('data_cadastro', { ascending: false });

    if (error) {
      console.error('Erro ao carregar segurados do Supabase:', error);
      return;
    }

    const convertidas: Proposta[] = (data || []).map((row: any) => ({
      id: row.id,
      segurado: row.segurado || '',
      cpfCnpj: row.cpf_cnpj || '',
      produtor: row.produtor || '',
      seguradora: row.seguradora || '',
      tipo: row.tipo || 'NOVO',
      ramo: row.ramo || '',
      propostaNumero: row.proposta_numero || '',
      dataTransmissao: row.data_transmissao || '',
      premioLiquido: Number(row.premio_liquido || 0),
      quantidadeParcelas: Number(row.quantidade_parcelas || 1),
      valorParcelaSeguro: Number(row.valor_parcela_seguro || 0),
      comissaoPercentual: Number(row.comissao_percentual || 0),
      comissaoParcela: Number(row.comissao_parcela || 0),
      comissaoValor: Number(row.comissao_valor || 0),
      status: row.status || 'EMITIDA',
      statusSegurado: row.status_segurado || 'ATIVO',
      gratuidade: row.gratuidade || false,
      observacoes: row.observacoes || '',
      dataCadastro: row.data_cadastro || '',
    }));

    setPropostasBanco(convertidas);
  }

  carregarPropostasBanco();
}, []);

  useEffect(() => {
    const lista = carregarProdutores();
    setProdutores(lista);

    if (
      lista.length &&
      !lista.some((p) => p.toLowerCase() === formData.produtor.toLowerCase())
    ) {
      setFormData((prev) => ({ ...prev, produtor: lista[0] }));
    }
  }, []);

  const premio = limparMoeda(formData.premioLiquido, 0);
  const percentual = limparMoeda(formData.comissaoPercentual, 0);
  const quantidadeParcelas = Math.max(
    1,
    limparMoeda(formData.quantidadeParcelas, 1)
  );

  const valorParcelaSeguro = premio / quantidadeParcelas;
  const comissaoTotal = (premio * percentual) / 100;
  const comissaoParcela = comissaoTotal / quantidadeParcelas;

  const searchLower = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  const listaPropostas = propostasBanco.length > 0 ? propostasBanco : propostas;

const propostasFiltradas = listaPropostas.filter((p) => {
    const produtor = (p.produtor ?? '').toString().toLowerCase();
    const propostaNumero = (p.propostaNumero ?? '').toString();
    const dataTransmissao = (p.dataTransmissao ?? '').toString();

    const matchSearch =
      p.segurado.toLowerCase().includes(searchLower) ||
      p.seguradora.toLowerCase().includes(searchLower) ||
      produtor.includes(searchLower) ||
      propostaNumero.includes(searchTerm) ||
      dataTransmissao.includes(searchTerm);

    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    
    return matchSearch && matchTipo;
}).sort((a, b) =>
  a.segurado.localeCompare(b.segurado, 'pt-BR')
);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id || propostasFiltradas.length === 0) return;

  const propostaEncontrada = propostasFiltradas.find(
    (p) => p.id === id
  );

  if (!propostaEncontrada) return;

  handleEdit(propostaEncontrada);

  window.history.replaceState(
    {},
    '',
    window.location.pathname
  );
}, [propostasFiltradas]);

  const resetForm = () => {
    setFormData({
      ...DEFAULT_FORM,
      produtor: produtores[0] ?? DEFAULT_FORM.produtor,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<Proposta, 'id' | 'dataCadastro'> = {
      segurado: formData.segurado,
      cpfCnpj: formData.cpfCnpj,
      produtor: formData.produtor,
      seguradora: formData.seguradora,
      tipo: formData.tipo,
      ramo: formData.ramo,
      propostaNumero: formData.propostaNumero,
      dataTransmissao: formData.dataTransmissao,
      dataInicioCiclo: formData.dataInicioCiclo,
      parcelasCiclo: Number(formData.parcelasCiclo || 12),
      statusContrato: formData.statusContrato,
      dataCancelamento: formData.dataCancelamento,
      premioLiquido: premio,
      quantidadeParcelas,
      valorParcelaSeguro,
      comissaoPercentual: percentual,
      comissaoParcela,
      comissaoValor: comissaoTotal,
      status: formData.status,
      statusSegurado: 'ATIVO',
      gratuidade: formData.gratuidade,
      observacoes: formData.observacoes || undefined,
    };

    if (propostaEditando) {
      onEditar(propostaEditando.id, payload);
    } else {
      onAdicionar(payload);
    }

    resetForm();
    setIsDialogOpen(false);
    setPropostaEditando(null);
  };

  const handleEdit = (proposta: Proposta) => {
    setPropostaEditando(proposta);

    setFormData({
  segurado: proposta.segurado,
  cpfCnpj: proposta.cpfCnpj,
  produtor: proposta.produtor || produtores[0] || 'IGO',
  seguradora: proposta.seguradora,
  tipo: proposta.tipo,
  ramo: proposta.ramo,
  propostaNumero: proposta.propostaNumero || '',
  dataTransmissao: proposta.dataTransmissao || '',
  dataInicioCiclo: proposta.dataInicioCiclo || '',
  parcelasCiclo: proposta.parcelasCiclo?.toString() || '12',
  statusContrato: proposta.statusContrato || 'ATIVO',
  dataCancelamento: proposta.dataCancelamento || '',
  premioLiquido: formatarMoeda(proposta.premioLiquido || 0),
  quantidadeParcelas: proposta.quantidadeParcelas?.toString() || '1',
  comissaoPercentual: proposta.comissaoPercentual?.toString() || '20',
  observacoes: proposta.observacoes || '',
  status: proposta.status,
  gratuidade: proposta.gratuidade || false,
});

    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setPropostaEditando(null);
    resetForm();
    setIsDialogOpen(true);
  };

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Segurados</h2>
          <p className="text-slate-500">
            Gerencie segurados Anadem, parcelas e previsões de comissão
          </p>
        </div>

        <div className="flex gap-2">
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleNew}
                className="bg-[#F47FA0] hover:bg-[#ec6f94] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Segurado
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F47FA0]" />
                  {propostaEditando ? 'Editar Segurado' : 'Novo Segurado'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="segurado">Nome do Segurado *</Label>
                    <Input
                      id="segurado"
                      value={formData.segurado}
                      onChange={(e) =>
                        setFormData({ ...formData, segurado: e.target.value })
                      }
                      placeholder="Nome completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                    <Input
                      id="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={(e) =>
                        setFormData({ ...formData, cpfCnpj: e.target.value })
                      }
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="produtor">Produtor *</Label>

                    <select
                      id="produtor"
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={formData.produtor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          produtor: e.target.value,
                        })
                      }
                    >
                      {produtores.map((produtor) => (
                        <option key={produtor} value={produtor}>
                          {produtor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seguradora">Seguradora *</Label>

                    <select
                      id="seguradora"
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={formData.seguradora}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seguradora: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione...</option>

                      {seguradoras.map((seguradora) => (
                        <option key={seguradora} value={seguradora}>
                          {seguradora}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>

                    <select
                      id="tipo"
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={formData.tipo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipo: e.target.value as TipoProposta,
                        })
                      }
                    >
                      <option value="NOVO">Novo</option>
                      <option value="RENOVACAO">Renovação</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ramo">Ramo *</Label>

                    <select
                      id="ramo"
                      className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={formData.ramo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ramo: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione...</option>

                      {ramos.map((ramo) => (
                        <option key={ramo} value={ramo}>
                          {ramo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="propostaNumero">Proposta *</Label>

                    <Input
                      id="propostaNumero"
                      value={formData.propostaNumero}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propostaNumero: e.target.value,
                        })
                      }
                      placeholder="Número da proposta"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataTransmissao">
                      Data de Transmissão *
                    </Label>

                    <Input
                      id="dataTransmissao"
                      type="date"
                      value={formData.dataTransmissao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataTransmissao: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="premioLiquido">
                      Prêmio Líquido (R$) *
                    </Label>

                    <Input
                      id="premioLiquido"
                      type="text"
                      value={formData.premioLiquido}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          premioLiquido: formatarCampoMoeda(e.target.value),
                        })
                      }
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantidadeParcelas">
                      Quantidade de Parcelas *
                    </Label>

                    <Input
                      id="quantidadeParcelas"
                      type="number"
                      min="1"
                      value={formData.quantidadeParcelas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantidadeParcelas: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="comissaoPercentual">
                      % Comissão *
                    </Label>

                    <Input
                      id="comissaoPercentual"
                      type="text"
                      value={formData.comissaoPercentual}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comissaoPercentual: formatarPercentualDigitado(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Resumo da Comissão</Label>

                    <div className="rounded-xl border bg-slate-50 p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Parcela Seguro:</span>

                        <strong>
                          R$ {formatarMoeda(valorParcelaSeguro)}
                        </strong>
                      </div>

                      <div className="flex justify-between">
                        <span>Comissão por Parcela:</span>

                        <strong className="text-emerald-600">
                          R$ {formatarMoeda(comissaoParcela)}
                        </strong>
                      </div>

                      <div className="flex justify-between border-t pt-2">
                        <span>Comissão Total:</span>

                        <strong className="text-blue-600">
                          R$ {formatarMoeda(comissaoTotal)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
  <Label htmlFor="gratuidade">Gratuidade</Label>

  <select
    id="gratuidade"
    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
    value={formData.gratuidade ? 'SIM' : 'NAO'}
    onChange={(e) =>
      setFormData({
        ...formData,
        gratuidade: e.target.value === 'SIM',
      })
    }
  >
    <option value="NAO">Não</option>
    <option value="SIM">Sim</option>
  </select>
</div>

<div className="space-y-2">

                  <Label htmlFor="status">Status *</Label>

                  <select
                    id="status"
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as StatusProposta,
                      })
                    }
                  >
                    <option value="EMITIDA">Emitida</option>
                    <option value="PAGA">Paga</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>

                  <textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observacoes: e.target.value,
                      })
                    }
                    className="w-full min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Informações adicionais..."
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    className="bg-[#F47FA0] hover:bg-[#ec6f94] text-white"
                  >
                    {propostaEditando
                      ? 'Salvar Alterações'
                      : 'Cadastrar Proposta'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
            
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#F47FA0]" />
            Segurados Cadastrados
            <Badge variant="secondary">
              {propostasFiltradas.length}
            </Badge>
          </CardTitle>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

              <Input
                placeholder="Buscar segurado, seguradora ou proposta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-md"
              >
                <option value="todos">Todos os tipos</option>
                <option value="NOVO">Novo</option>
                <option value="RENOVACAO">Renovação</option>
              </select>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-md"
              >
                <option value="todos">Todos status</option>
                <option value="EMITIDA">Emitida</option>
                <option value="PAGA">Paga</option>
                <option value="CANCELADA">Cancelada</option>
              </select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {propostasFiltradas.map((proposta, index) => (
              <div
                key={proposta.id || index}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {proposta.segurado}
                      </h3>

                      <StatusBadge status={proposta.status} />

                      <Badge
  className={
    proposta.statusSegurado === 'ATIVO'
      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
      : proposta.statusSegurado === 'EM_OBSERVACAO'
      ? 'bg-amber-100 text-amber-700 border border-amber-300'
      : 'bg-red-100 text-red-700 border border-red-300'
  }
>
  {proposta.statusSegurado === 'ATIVO'
    ? 'Ativo'
    : proposta.statusSegurado === 'EM_OBSERVACAO'
    ? 'Em Observação'
    : 'Cancelado'}
</Badge>

                      <Badge
                        variant={
                          proposta.tipo === 'NOVO'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {proposta.tipo === 'NOVO'
                          ? 'Novo'
                          : 'Renovação'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">

                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4" />
                        {proposta.seguradora}
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Tag className="w-4 h-4" />
                        {proposta.ramo}
                      </div>

                      <div className="text-slate-600">
                        <span className="font-medium">
                          Prêmio:
                        </span>{' '}
                        R$ {formatarMoeda(Number(proposta.premioLiquido || 0))}
                      </div>

                      <div className="text-emerald-600 font-medium">
                        Comissão:
                        {' '}
                        R$ {formatarMoeda(Number(proposta.comissaoValor || 0))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(proposta)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onExcluir(proposta.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}