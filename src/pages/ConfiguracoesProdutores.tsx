import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, RotateCcw, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  carregarProdutores,
  salvarProdutores,
  PRODUTORES_PADRAO,
} from '@/data/produtores';

export function ConfiguracoesProdutores() {
  const [itens, setItens] = useState<string[]>([]);
  const [novo, setNovo] = useState('');

  useEffect(() => {
    setItens(carregarProdutores());
  }, []);

  const lista = useMemo(
    () => itens.map((p) => p.trim()).filter((p) => p.length > 0),
    [itens]
  );

  const adicionar = () => {
    const valor = novo.trim();
    if (!valor) return;

    const jaExiste = lista.some((p) => p.toLowerCase() === valor.toLowerCase());
    if (jaExiste) {
      setNovo('');
      return;
    }

    setItens([...lista, valor]);
    setNovo('');
  };

  const remover = (idx: number) => {
    setItens(lista.filter((_, i) => i !== idx));
  };

  const salvar = () => {
    salvarProdutores(lista);
    alert('Produtores salvos ✅');
  };

  const restaurarPadrao = () => {
    const padrao = [...PRODUTORES_PADRAO];
    setItens(padrao);
    salvarProdutores(padrao);
    alert('Lista padrão restaurada ✅');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Configurações: Produtores
          </h2>
          <p className="text-slate-500">Adicione ou remova produtores sem mexer no código</p>
        </div>
        <Badge variant="secondary">{lista.length} produtores</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Adicionar produtor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="novoProdutor">Nome</Label>
            <div className="flex gap-2">
              <Input
                id="novoProdutor"
                value={novo}
                onChange={(e) => setNovo(e.target.value)}
                placeholder="Ex: PROD.04"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionar();
                  }
                }}
              />
              <Button type="button" onClick={adicionar} className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" onClick={salvar} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={restaurarPadrao}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar padrão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista atual</CardTitle>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-slate-500">Nenhum produtor cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {lista.map((p, idx) => (
                <li
                  key={`${p}-${idx}`}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="font-medium text-slate-800">{p}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remover(idx)}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
