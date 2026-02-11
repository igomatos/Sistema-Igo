import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface DadosExtraidos {
  segurado?: string;
  cpfCnpj?: string;
  seguradora?: string;
  apolice?: string;
  ramo?: string;
  vigenciaInicio?: string;
  vigenciaFim?: string;
  premioLiquido?: number;
  comissaoPercentual?: number;
  [key: string]: any;
}

interface PdfUploaderProps {
  onDadosExtraidos: (dados: DadosExtraidos) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Mapeamento de seguradoras para reconhecimento
const SEGURADORAS_KEYWORDS: { [key: string]: string[] } = {
  'Porto Seguro': ['porto seguro', 'portoseguro'],
  'Bradesco Seguros': ['bradesco', 'bradesco seguros'],
  'SulAmérica': ['sulamerica', 'sul américa'],
  'Tokio Marine': ['tokio marine', 'tokiomarine'],
  'Mapfre': ['mapfre'],
  'Liberty Seguros': ['liberty', 'liberty seguros'],
  'HDI Seguros': ['hdi', 'hdi seguros'],
  'Azul Seguros': ['azul seguros', 'azulseguro'],
  'Sompo Seguros': ['sompo', 'sompo seguros'],
  'Mitsui Sumitomo': ['mitsui', 'sumitomo', 'mitsui sumitomo']
};

// Mapeamento de ramos
const RAMOS_KEYWORDS: { [key: string]: string[] } = {
  'Automóvel': ['auto', 'automóvel', 'automovel', 'veiculo', 'veículo'],
  'Residencial': ['residencial', 'casa', 'apartamento', 'imovel', 'imóvel'],
  'Empresarial': ['empresarial', 'empresa', 'comercial'],
  'Vida': ['vida', 'seguro de vida', 'vida individual'],
  'Saúde': ['saúde', 'saude', 'plano de saude', 'plano de saúde'],
  'Transporte': ['transporte', 'carga', 'rcm'],
  'Riscos Diversos': ['riscos diversos', 'rd', 'equipamento'],
  'Responsabilidade Civil': ['responsabilidade civil', 'rc', 'rc profissional']
};

export function PdfUploader({ onDadosExtraidos, isOpen, onClose }: PdfUploaderProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [dadosExtraidos, setDadosExtraidos] = useState<DadosExtraidos | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extrairTextoDoPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // Tenta extrair texto do PDF como string
          const uint8Array = new Uint8Array(arrayBuffer);
          let texto = '';
          
          // Procura por streams de texto no PDF
          for (let i = 0; i < uint8Array.length - 5; i++) {
            // Procura por BT (Begin Text) e ET (End Text)
            if (uint8Array[i] === 0x42 && uint8Array[i+1] === 0x54) { // BT
              let j = i + 2;
              while (j < uint8Array.length - 2) {
                if (uint8Array[j] === 0x45 && uint8Array[j+1] === 0x54) break; // ET
                
                // Procura por strings entre parênteses
                if (uint8Array[j] === 0x28) {
                  let str = '';
                  j++;
                  while (j < uint8Array.length && uint8Array[j] !== 0x29) {
                    if (uint8Array[j] >= 0x20 && uint8Array[j] <= 0x7E) {
                      str += String.fromCharCode(uint8Array[j]);
                    }
                    j++;
                  }
                  texto += str + ' ';
                }
                j++;
              }
            }
          }
          
          // Se não conseguiu extrair texto, tenta outra abordagem
          if (texto.length < 50) {
            // Converte para string e procura por padrões
            const fullText = new TextDecoder('utf-8').decode(uint8Array);
            texto = fullText;
          }
          
          resolve(texto);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extrairDados = (texto: string): DadosExtraidos => {
    const dados: DadosExtraidos = {};
    const textoLower = texto.toLowerCase();
    
    // Extrair CPF/CNPJ
    const cpfMatch = texto.match(/(\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2})/);
    const cnpjMatch = texto.match(/(\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2})/);
    if (cpfMatch) dados.cpfCnpj = cpfMatch[1].replace(/\s/g, '');
    else if (cnpjMatch) dados.cpfCnpj = cnpjMatch[1].replace(/\s/g, '');
    
    // Extrair número da apólice
    const apolicePatterns = [
      /ap[óo]lice[:\s]*(\d[\d\-\.\/]*)/i,
      /n[úu]mero[:\s]*(\d[\d\-\.\/]*)/i,
      /proposta[:\s]*(\d[\d\-\.\/]*)/i,
      /ap[óo]lice\s*n[°º]?[:\s]*(\d+)/i
    ];
    for (const pattern of apolicePatterns) {
      const match = texto.match(pattern);
      if (match) {
        dados.apolice = match[1].trim();
        break;
      }
    }
    
    // Identificar seguradora
    for (const [seguradora, keywords] of Object.entries(SEGURADORAS_KEYWORDS)) {
      for (const keyword of keywords) {
        if (textoLower.includes(keyword)) {
          dados.seguradora = seguradora;
          break;
        }
      }
      if (dados.seguradora) break;
    }
    
    // Identificar ramo
    for (const [ramo, keywords] of Object.entries(RAMOS_KEYWORDS)) {
      for (const keyword of keywords) {
        if (textoLower.includes(keyword)) {
          dados.ramo = ramo;
          break;
        }
      }
      if (dados.ramo) break;
    }
    
    // Extrair prêmio líquido
    const premioPatterns = [
      /pr[êe]mio\s*l[íi]quido[:\s]*R?\$?\s*([\d\.]+,?\d{0,2})/i,
      /pr[êe]mio[:\s]*R?\$?\s*([\d\.]+,?\d{0,2})/i,
      /valor[:\s]*R?\$?\s*([\d\.]+,?\d{0,2})/i,
      /total[:\s]*R?\$?\s*([\d\.]+,?\d{0,2})/i
    ];
    for (const pattern of premioPatterns) {
      const match = texto.match(pattern);
      if (match) {
        const valor = match[1].replace(/\./g, '').replace(',', '.');
        dados.premioLiquido = parseFloat(valor);
        break;
      }
    }
    
    // Extrair % de comissão
    const comissaoMatch = texto.match(/(\d{1,2}[,.]?\d{0,2})\s*%\s*(?:de\s*)?comiss[ãa]o/i) ||
                          texto.match(/comiss[ãa]o[:\s]*(\d{1,2}[,.]?\d{0,2})\s*%/i);
    if (comissaoMatch) {
      dados.comissaoPercentual = parseFloat(comissaoMatch[1].replace(',', '.'));
    }
    
    // Extrair datas de vigência
    const dataPatterns = [
      /(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/g,
      /(\d{4}[\/\.-]\d{2}[\/\.-]\d{2})/g
    ];
    const datasEncontradas: string[] = [];
    for (const pattern of dataPatterns) {
      const matches = texto.match(pattern);
      if (matches) {
        datasEncontradas.push(...matches);
      }
    }
    
    if (datasEncontradas.length >= 2) {
      // Converte para formato ISO (YYYY-MM-DD)
      const converterData = (data: string): string => {
        const partes = data.split(/[\/\.-]/);
        if (partes[2].length === 4) {
          return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        return data;
      };
      
      // Ordena as datas e pega a primeira como início e a segunda como fim
      const datasOrdenadas = datasEncontradas
        .map(converterData)
        .filter(d => !isNaN(new Date(d).getTime()))
        .sort();
      
      if (datasOrdenadas.length >= 2) {
        dados.vigenciaInicio = datasOrdenadas[0];
        dados.vigenciaFim = datasOrdenadas[datasOrdenadas.length - 1];
      }
    }
    
    // Extrair nome do segurado (procura por padrões comuns)
    const seguradoPatterns = [
      /segurado[:\s]*([^\n\r]{3,50})/i,
      /nome[:\s]*([^\n\r]{3,50})/i,
      /contratante[:\s]*([^\n\r]{3,50})/i,
      /tomador[:\s]*([^\n\r]{3,50})/i
    ];
    for (const pattern of seguradoPatterns) {
      const match = texto.match(pattern);
      if (match) {
        const nome = match[1].trim();
        // Filtra nomes que parecem válidos (mais de 2 palavras, sem caracteres estranhos)
        if (nome.split(' ').length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêôÂÊÔçÇ\s]+$/.test(nome)) {
          dados.segurado = nome;
          break;
        }
      }
    }
    
    return dados;
  };

  const processarPDF = async () => {
    if (!arquivo) return;
    
    setProcessando(true);
    setProgresso(0);
    
    try {
      // Simula progresso
      const interval = setInterval(() => {
        setProgresso(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const texto = await extrairTextoDoPDF(arquivo);
      clearInterval(interval);
      setProgresso(100);
      
      const dados = extrairDados(texto);
      setDadosExtraidos(dados);
      
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      alert('Erro ao processar o PDF. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setArquivo(file);
      setDadosExtraidos(null);
      setProgresso(0);
    } else {
      alert('Por favor, selecione um arquivo PDF válido.');
    }
  };

  const handleUsarDados = () => {
    if (dadosExtraidos) {
      onDadosExtraidos(dadosExtraidos);
      handleClose();
    }
  };

  const handleClose = () => {
    setArquivo(null);
    setDadosExtraidos(null);
    setProgresso(0);
    setProcessando(false);
    onClose();
  };

  const formatarValor = (valor: number | undefined): string => {
    if (valor === undefined) return '-';
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-500" />
            Importar Proposta de PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Área de Upload */}
          {!arquivo && (
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">
                Clique para selecionar o PDF da proposta
              </p>
              <p className="text-slate-400 text-sm mt-1">
                ou arraste e solte aqui
              </p>
            </div>
          )}

          {/* Arquivo Selecionado */}
          {arquivo && !dadosExtraidos && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-[200px]">
                        {arquivo.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {(arquivo.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setArquivo(null);
                      setProgresso(0);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {processando ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando PDF...
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={processarPDF}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Extrair Dados
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dados Extraídos */}
          {dadosExtraidos && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Dados extraídos com sucesso!</span>
              </div>

              <Card className="border-emerald-200 bg-emerald-50/30">
                <CardContent className="p-4 space-y-3">
                  {dadosExtraidos.segurado && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Segurado:</span>
                      <span className="font-medium">{dadosExtraidos.segurado}</span>
                    </div>
                  )}
                  {dadosExtraidos.cpfCnpj && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">CPF/CNPJ:</span>
                      <span className="font-medium">{dadosExtraidos.cpfCnpj}</span>
                    </div>
                  )}
                  {dadosExtraidos.seguradora && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Seguradora:</span>
                      <span className="font-medium">{dadosExtraidos.seguradora}</span>
                    </div>
                  )}
                  {dadosExtraidos.apolice && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Apólice:</span>
                      <span className="font-medium">{dadosExtraidos.apolice}</span>
                    </div>
                  )}
                  {dadosExtraidos.ramo && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ramo:</span>
                      <span className="font-medium">{dadosExtraidos.ramo}</span>
                    </div>
                  )}
                  {dadosExtraidos.premioLiquido && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prêmio Líquido:</span>
                      <span className="font-medium">
                        R$ {formatarValor(dadosExtraidos.premioLiquido)}
                      </span>
                    </div>
                  )}
                  {dadosExtraidos.comissaoPercentual && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">% Comissão:</span>
                      <span className="font-medium">{dadosExtraidos.comissaoPercentual}%</span>
                    </div>
                  )}
                  {dadosExtraidos.vigenciaInicio && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vigência:</span>
                      <span className="font-medium">
                        {new Date(dadosExtraidos.vigenciaInicio).toLocaleDateString('pt-BR')} 
                        {' até '}
                        {dadosExtraidos.vigenciaFim 
                          ? new Date(dadosExtraidos.vigenciaFim).toLocaleDateString('pt-BR')
                          : '...'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs text-slate-500">
                * Verifique os dados extraídos antes de confirmar. 
                Alguns campos podem precisar de ajustes manuais.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          {dadosExtraidos && (
            <Button 
              onClick={handleUsarDados}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Usar Estes Dados
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
