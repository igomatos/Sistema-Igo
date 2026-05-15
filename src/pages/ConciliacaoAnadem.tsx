import { useRef, useState } from 'react';
import {
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { lerPdfAnadem } from '@/lib/pdfAnadem';
import { supabase } from '@/lib/supabase';

function numeroSeguro(valor: unknown) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}

function textoSeguro(valor: unknown) {
  return String(valor ?? '').trim();
}

function limparDocumento(valor: unknown) {
  return textoSeguro(valor).replace(/\D/g, '');
}

export function ConciliacaoAnadem() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState('');

  const [itensLidos, setItensLidos] = useState(() => {
    const salvo = localStorage.getItem('anadem_itens_lidos');
    return salvo ? Number(salvo) : 0;
  });

  const [itensSalvos, setItensSalvos] = useState(() => {
    const salvo = localStorage.getItem('anadem_itens_salvos');
    return salvo ? Number(salvo) : 0;
  });

  const [erro, setErro] = useState('');

  const handleSelecionarPdf = () => {
    inputRef.current?.click();
  };

  const handleArquivoSelecionado = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const arquivos = Array.from(event.target.files || []);

if (arquivos.length === 0) return;

const arquivo = arquivos[0];

    setErro('');
    setCarregando(true);
    setNomeArquivo(
  arquivos.length === 1
    ? arquivos[0].name
    : `${arquivos.length} PDFs selecionados`
);
    try {
      const registros = [];

for (const arquivoAtual of arquivos) {
  const registrosArquivo = await lerPdfAnadem(arquivoAtual);
  registros.push(...registrosArquivo);
}

      setItensLidos(registros.length);

      localStorage.setItem(
        'anadem_itens_lidos',
        registros.length.toString()
      );

      console.log('REGISTROS EXTRAÍDOS DO PDF:', registros);

      const documentosImportados = new Set<string>();
      let salvos = 0;

      for (const [index, registro] of registros.entries()) {
        const idRepasse = `${textoSeguro(registro.id)}-${textoSeguro(
          registro.competencia
        )}-${textoSeguro(registro.dataPagamento)}-${index}`;

        const repasse = {
          id: idRepasse,
          segurado: textoSeguro(registro.segurado),
          cpf_cnpj: textoSeguro(registro.cpfCnpj),
          associado_desde: textoSeguro(registro.associadoDesde),
          comissao: numeroSeguro(registro.comissao),
          base_calculo: numeroSeguro(registro.baseCalculo),
          porcentagem: textoSeguro(registro.porcentagem),
          competencia: textoSeguro(registro.competencia),
          data_pagamento: textoSeguro(registro.dataPagamento),
          arquivo_origem: arquivo.name,
          data_importacao: new Date().toISOString(),
        };

        const { error: errorRepasse } = await supabase
          .from('repasses_anadem')
          .upsert(repasse, {
            onConflict: 'id',
          });

        if (errorRepasse) {
          console.error('ERRO AO SALVAR REPASSE:', repasse, errorRepasse);
          continue;
        }

        const valorParcela = numeroSeguro(registro.baseCalculo);
        const premioLiquido = valorParcela * 12;

        const comissaoParcela = numeroSeguro(registro.comissao);
        const comissaoTotal = comissaoParcela * 12;

        const documentoLimpo = limparDocumento(registro.cpfCnpj);
        documentosImportados.add(documentoLimpo);

        const proposta = {
          id: `PROP-${documentoLimpo}`,

          segurado: textoSeguro(registro.segurado),
          cpf_cnpj: textoSeguro(registro.cpfCnpj),

          produtor: 'RAQUEL',
          seguradora: 'Anadem',
          tipo: 'NOVO',
          ramo: 'RC Médico',

          premio_liquido: premioLiquido,
          comissao_percentual: 15,
          comissao_valor: comissaoTotal,

          status: 'EMITIDA',
          status_segurado: 'ATIVO',

          observacoes: `Importado automaticamente do PDF ${arquivo.name}. ID Anadem: ${textoSeguro(
            registro.id
          )}. Competência: ${textoSeguro(registro.competencia)}.`,

          data_cadastro: new Date().toISOString().split('T')[0],

          quantidade_parcelas: 12,
          valor_parcela_seguro: valorParcela,
          comissao_parcela: comissaoParcela,
        };

        const { error: errorProposta } = await supabase
  .from('propostas')
  .upsert(proposta, {
    onConflict: 'id',
  });

if (errorProposta) {
  console.error('ERRO AO SALVAR SEGURADO:', proposta, errorProposta);
  continue;
}

/*
========================================
REGISTRA PAGAMENTO AUTOMÁTICO
========================================
*/

const idPagamento = `PAG-${idRepasse}`;

const pagamento = {
  id: idPagamento,

  proposta_id: proposta.id,

  data_pagamento: textoSeguro(registro.dataPagamento),

  valor_pago: comissaoParcela,

  referencia: textoSeguro(registro.competencia),
};

const { error: errorPagamento } = await supabase
  .from('pagamentos')
  .upsert(pagamento, {
    onConflict: 'id',
  });

if (errorPagamento) {
  console.error(
    'ERRO AO REGISTRAR PAGAMENTO:',
    pagamento,
    errorPagamento
  );
} else {
  console.log(
    'PAGAMENTO REGISTRADO AUTOMATICAMENTE:',
    pagamento
  );
}

salvos += 1;
      }
/*
========================================
MARCA SEGURADOS AUSENTES COMO
EM OBSERVAÇÃO
========================================
*/

const { data: seguradosBanco } = await supabase
  .from('propostas')
  .select('id, cpf_cnpj, seguradora, produtor');

for (const segurado of seguradosBanco || []) {
  const documentoBanco = limparDocumento(
    segurado.cpf_cnpj
  );

  const ehAnadem =
    textoSeguro(segurado.seguradora).toLowerCase() ===
    'anadem';

  if (!ehAnadem) continue;

  const apareceuNoPdf =
    documentosImportados.has(documentoBanco);

  const novoStatus = apareceuNoPdf
    ? 'ATIVO'
    : 'EM_OBSERVACAO';

  const { error: errorStatus } = await supabase
    .from('propostas')
    .update({
      status_segurado: novoStatus,
    })
    .eq('id', segurado.id);

  if (errorStatus) {
    console.error(
      'ERRO AO ATUALIZAR STATUS:',
      segurado,
      errorStatus
    );
  }
}

      setItensSalvos(salvos);

      localStorage.setItem(
        'anadem_itens_salvos',
        salvos.toString()
      );

     if (salvos === 0) {
  setErro('Nenhum segurado foi salvo. Veja o console para identificar o motivo.');
} else {
  setErro('');
  console.log(`${salvos} segurados salvos com sucesso.`);


}
    } catch (error) {
      console.error('Erro ao processar PDF da Anadem:', error);

      setErro('Não foi possível processar este PDF. Veja o console.');
    } finally {
      setCarregando(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black text-[#111827] tracking-tight">
          Conciliação Anadem
        </h2>

        <p className="text-slate-500 mt-2">
          Importe o PDF mensal de comissões para identificar segurados e baixar parcelas automaticamente.
        </p>
      </div>

      <Card className="border border-[#EADDE1] rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-[#F47FA0]" />
            Importar relatório mensal
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <input
           
  ref={inputRef}
  type="file"
  multiple
  accept="application/pdf"
  className="hidden"
  onChange={handleArquivoSelecionado}
/>

          <div className="border-2 border-dashed border-[#EADDE1] rounded-3xl p-10 text-center bg-[#FFF8FA]">
            <FileCheck className="w-14 h-14 mx-auto text-[#F47FA0]" />

            <p className="font-bold text-[#111827] mt-4">
              PDF de comissão da Anadem
            </p>

            <p className="text-slate-500 mt-2">
              Selecione o relatório mensal para importar os repasses e cadastrar os segurados.
            </p>

            {nomeArquivo && (
              <p className="text-sm text-slate-600 mt-3">
                Arquivo selecionado:{' '}
                <strong>{nomeArquivo}</strong>
              </p>
            )}

            {erro && (
              <p className="text-sm text-red-600 mt-3 font-semibold">
                {erro}
              </p>
            )}

            <Button
              onClick={handleSelecionarPdf}
              disabled={carregando}
              className="mt-6 bg-[#F47FA0] hover:bg-[#ec6f94] text-white"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando PDF...
                </>
              ) : (
                'Selecionar PDF'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-[#EADDE1]">
          <CardContent className="p-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <p className="text-sm text-slate-500 mt-4">
              Segurados salvos
            </p>
            <p className="text-3xl font-black text-[#111827] mt-1">
              {itensSalvos}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#EADDE1]">
          <CardContent className="p-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <p className="text-sm text-slate-500 mt-4">
              Divergências
            </p>
            <p className="text-3xl font-black text-[#111827] mt-1">0</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#EADDE1]">
          <CardContent className="p-6">
            <FileCheck className="w-8 h-8 text-[#F47FA0]" />
            <p className="text-sm text-slate-500 mt-4">
              Itens lidos no PDF
            </p>
            <p className="text-3xl font-black text-[#111827] mt-1">
              {itensLidos}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}