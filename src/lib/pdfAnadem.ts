import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface RegistroPdfAnadem {
  id: string;
  segurado: string;
  cpfCnpj: string;
  associadoDesde: string;
  comissao: number;
  baseCalculo: number;
  porcentagem: string;
  competencia: string;
  dataPagamento: string;
}

function converterMoeda(valor: string) {
  return Number(
    valor
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  );
}

function descobrirCompetencia(texto: string, nomeArquivo: string) {
  const periodoMatch = texto.match(
    /Per[ií]odo de apura[cç][aã]o:\s*(\d{2})\/(\d{2})\/(\d{4})\s+at[eé]\s+(\d{2})\/(\d{2})\/(\d{4})/i
  );

  if (periodoMatch) {
    const mes = periodoMatch[2];
    const ano = periodoMatch[3];
    return `${mes}/${ano}`;
  }

  const arquivoMatch = nomeArquivo.match(/(\d{2})[_-](\d{4})/);

  if (arquivoMatch) {
    return `${arquivoMatch[1]}/${arquivoMatch[2]}`;
  }

  return '';
}

export async function lerPdfAnadem(file: File): Promise<RegistroPdfAnadem[]> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  }).promise;

  let textoCompleto = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const textoPagina = content.items
      .map((item: any) => item.str)
      .join(' ');

    textoCompleto += ' ' + textoPagina;
  }

  const texto = textoCompleto
    .replace(/\s+/g, ' ')
    .replace(/\/0001-\s+/g, '/0001-')
    .trim();

  console.log('TEXTO COMPLETO DO PDF ANADEM:', texto);

  const competenciaPadrao = descobrirCompetencia(texto, file.name);

  console.log('COMPETÊNCIA IDENTIFICADA:', competenciaPadrao);

  const registros: RegistroPdfAnadem[] = [];

  const regex =
    /(\d{3,6})\s*([A-Za-zÀ-ÿ0-9 .,&'()-]+?)\s+(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\s+(\d{2}\/\d{2}\/\d{4})\s+R\$\s?([\d.,]+)\s+R\$\s?([\d.,]+)\s+(\d+%)\s+(?:(\d{2}\/\d{4})\s+)?(\d{2}\/\d{2}\/\d{4})/g;

  let match;

  while ((match = regex.exec(texto)) !== null) {
    registros.push({
      id: match[1],
      segurado: match[2].trim(),
      cpfCnpj: match[3].trim(),
      associadoDesde: match[4],
      comissao: converterMoeda(match[5]),
      baseCalculo: converterMoeda(match[6]),
      porcentagem: match[7],
      competencia: match[8] || competenciaPadrao,
      dataPagamento: match[9],
    });
  }

  console.log('REGISTROS EXTRAÍDOS:', registros);

  return registros;
}