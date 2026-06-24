import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import caixaLogo from "../assets/caixa.png";
import itauLogo from "../assets/itau.png";
import sicrediLogo from "../assets/sicredi.png";
import caixasigcb from "../layouts/caixasigcb.json";
import sicredi from "../layouts/sicredi.json";
import itau from "../layouts/itau.json";

export type Campo = {
  inicio: number;
  fim: number;
  label: string;
  descricao?: string;
  tipo?: string;
  bgColor: string;
  conteudo?: string;
  textColor: string;
};

export type CampoSelecionado = {
  campo: Campo;
  segmento: string;
  linhaIndex: number;
};

export type QuebraLinha = "CRLF" | "LF" | "CR" | "EOF";

export type RegistroBytes = {
  conteudoBytes: Uint8Array;
  tamanhoConteudo: number;
  tamanhoBruto: number;
  quebra: QuebraLinha;
  temMultibyte: boolean;
};

export type Banco = "CAIXASIGCB" | "SICREDI" | "ITAU" | "BARRAS SICREDI" | "ITAU_NOVO";

export type BankBrand = {
  banco: Banco;
  nome: string;
  logoUrl: string;
};

export type ResumoArquivo = {
  origem: string;
  nome: string;
  bancoLayout: string;
  codigoBanco: string;
  totalLinhas: number;
  totalBytesConteudo: number;
  linhasInvalidas: number[];
  linhasMultibyte: number[];
  tiposRegistro: Array<[string, number]>;
  segmentos: Array<[string, number]>;
  quebrasLinha: Array<[QuebraLinha, number]>;
};

export type ResumoValidacao = {
  totalBytesConteudo: number;
  bytesInvalidos: boolean;
  resumoBytes: number;
  linhasMultibyte: number[];
  linhasComCr: number[];
  detalheTamanhoInvalido: string;
};

export type LayoutCandidate = {
  banco: Banco;
  label: string;
  score: number;
  reasons: string[];
};

export type LayoutDetection = {
  candidates: LayoutCandidate[];
  codigoBanco: string;
  tipoArquivo: string;
};

export type CnabContextValue = {
  banco: Banco;
  bancos: Array<{ value: Banco; label: string }>;
  campoSelecionado: CampoSelecionado | null;
  contentRevision: number;
  hashArquivo: string;
  linhas: string[];
  layoutDetection: LayoutDetection;
  nomeArquivo: string;
  origemBytes: "paste" | "file";
  registrosBytes: RegistroBytes[];
  resumoArquivo: ResumoArquivo;
  resumoValidacao: ResumoValidacao;
  temBomUtf8: boolean;
  texto: string;
  atualizarTexto: (valor: string) => void;
  carregarArquivo: (arquivo: File) => Promise<void>;
  selecionarCampo: (selecao: CampoSelecionado) => void;
  setBanco: Dispatch<SetStateAction<Banco>>;
};

export const CNAB_RECORD_BYTES = 240;
export const textEncoder = new TextEncoder();

const textDecoder = new TextDecoder("utf-8", { fatal: false });
const caixaSigcbLayout: Campo[][] = caixasigcb;

const layoutsPorBanco: Partial<Record<Banco, Campo[][]>> = {
  CAIXASIGCB: caixaSigcbLayout,
  SICREDI: sicredi,
  ITAU: itau,
};

export const bancos: Array<{ value: Banco; label: string }> = [
  { value: "CAIXASIGCB", label: "Caixa SIGCB" },
  { value: "SICREDI", label: "Sicredi" },
  { value: "ITAU", label: "Itau" },
];


export const bankBrands: Partial<Record<Banco, BankBrand>> = {
  CAIXASIGCB: {
    banco: "CAIXASIGCB",
    nome: "Caixa",
    logoUrl: caixaLogo,
  },
  SICREDI: {
    banco: "SICREDI",
    nome: "Sicredi",
    logoUrl: sicrediLogo,
  },
  ITAU: {
    banco: "ITAU",
    nome: "Itau",
    logoUrl: itauLogo,
  },
};

export function getBankBrand(banco: Banco) {
  return bankBrands[banco];
}

export const CnabContext = createContext<CnabContextValue | null>(null);

const bankCodeScores: Partial<Record<Banco, string[]>> = {
  CAIXASIGCB: ["104"],
  SICREDI: ["748"],
  ITAU: ["341"],
};

export function comecaComBomUtf8(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

function contemByteMultibyte(bytes: Uint8Array) {
  return bytes.some((byte) => byte > 0x7f);
}

export function analisarRegistrosBytes(bytes: Uint8Array): RegistroBytes[] {
  const registros: RegistroBytes[] = [];
  let inicioRegistro = 0;
  let cursor = 0;

  while (cursor < bytes.length) {
    const byte = bytes[cursor];

    if (byte !== 0x0d && byte !== 0x0a) {
      cursor += 1;
      continue;
    }

    const conteudoBytes = bytes.slice(inicioRegistro, cursor);
    let quebra: QuebraLinha = "LF";
    let tamanhoQuebra = 1;

    if (byte === 0x0d && bytes[cursor + 1] === 0x0a) {
      quebra = "CRLF";
      tamanhoQuebra = 2;
    } else if (byte === 0x0d) {
      quebra = "CR";
    }

    registros.push({
      conteudoBytes,
      tamanhoConteudo: conteudoBytes.length,
      tamanhoBruto: conteudoBytes.length + tamanhoQuebra,
      quebra,
      temMultibyte: contemByteMultibyte(conteudoBytes),
    });

    cursor += tamanhoQuebra;
    inicioRegistro = cursor;
  }

  if (inicioRegistro < bytes.length) {
    const conteudoBytes = bytes.slice(inicioRegistro);

    registros.push({
      conteudoBytes,
      tamanhoConteudo: conteudoBytes.length,
      tamanhoBruto: conteudoBytes.length,
      quebra: "EOF",
      temMultibyte: contemByteMultibyte(conteudoBytes),
    });
  }

  return registros;
}

export function decodificarRegistros(registros: RegistroBytes[]) {
  return registros.map((registro) => textDecoder.decode(registro.conteudoBytes));
}

export function contarOcorrencias<T extends string>(valores: T[]) {
  return [
    ...valores
      .reduce((mapa, valor) => {
        mapa.set(valor, (mapa.get(valor) ?? 0) + 1);
        return mapa;
      }, new Map<T, number>())
      .entries(),
  ];
}

function contarMapa<T extends string>(valores: T[]) {
  return valores.reduce((map, value) => {
    map.set(value, (map.get(value) ?? 0) + 1);
    return map;
  }, new Map<T, number>());
}

function detectarTipoArquivo(linhas: string[]) {
  const headerArquivo = linhas.find((linha) => linha[7] === "0");
  const codigoRemessaRetorno = headerArquivo?.[142];

  if (codigoRemessaRetorno === "1") return "remessa";
  if (codigoRemessaRetorno === "2") return "retorno";
  return "nao identificado";
}

export async function calcularHashSha256(bytes: Uint8Array) {
  if (bytes.length === 0) return "";

  const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function resolverLayout(linha: string, banco: Banco): Campo[] | null {
  const layouts = layoutsPorBanco[banco];
  if (!layouts || linha.length < 14) return null;

  const tipoRegistro = linha[7];
  const segmento = linha[13];

  if (tipoRegistro === "0") return layouts[0];
  if (tipoRegistro === "1") return layouts[1];

  if (tipoRegistro === "3") {
    if (segmento === "P") return layouts[2];
    if (segmento === "Q") return layouts[3];
    if (segmento === "R") return layouts[4];
  }

  if (tipoRegistro === "5") return layouts[5];
  if (tipoRegistro === "9") return layouts[6];

  return null;
}

export function resolverSegmento(linha: string, banco: Banco): string {
  if (banco === "BARRAS SICREDI") return "Linha digitavel / codigo de barras";
  if (linha.length < 8) return "Registro nao identificado";

  const tipoRegistro = linha[7];
  const segmento = linha[13];

  if (tipoRegistro === "0") return "Header de arquivo";
  if (tipoRegistro === "1") return "Header de lote";
  if (tipoRegistro === "5") return "Trailer de lote";
  if (tipoRegistro === "9") return "Trailer de arquivo";

  if (tipoRegistro === "3") {
    if (segmento) return `Segmento ${segmento}`;
    return "Segmento de detalhe";
  }

  return "Registro nao identificado";
}

export function detectarLayout(linhas: string[]): LayoutDetection {
  const codigoBanco = linhas[0]?.slice(0, 3) || "";
  const tipoArquivo = detectarTipoArquivo(linhas);
  const tiposRegistro = contarMapa(linhas.map((linha) => linha[7] || "-"));
  const segmentos = contarMapa(linhas.filter((linha) => linha[7] === "3").map((linha) => linha[13] || "-"));

  const candidates = bancos.map<LayoutCandidate>((item) => {
    let score = 0;
    const reasons: string[] = [];
    const expectedCodes = bankCodeScores[item.value] ?? [];

    if (expectedCodes.includes(codigoBanco)) {
      score += 38;
      reasons.push(`Código do banco ${codigoBanco} compatível`);
    } else if (codigoBanco) {
      reasons.push(`Código do banco encontrado: ${codigoBanco}`);
    }

    const recognized = linhas.filter((linha) => Boolean(resolverLayout(linha, item.value))).length;
    const coverage = linhas.length === 0 ? 0 : recognized / linhas.length;
    const coverageScore = Math.round(coverage * 34);
    score += coverageScore;
    reasons.push(`${recognized}/${linhas.length} linhas reconhecidas pelo layout`);

    if (tiposRegistro.has("0") && tiposRegistro.has("9")) {
      score += 8;
      reasons.push("Header e trailer de arquivo encontrados");
    }

    if (tiposRegistro.has("1") && tiposRegistro.has("5")) {
      score += 8;
      reasons.push("Header e trailer de lote encontrados");
    }

    if (segmentos.has("P") && segmentos.has("Q")) {
      score += 6;
      reasons.push("Segmentos P e Q encontrados");
    }

    if (item.value === "SICREDI" && tipoArquivo === "remessa") {
      score += 4;
      reasons.push("Header indica arquivo de remessa");
    }

    return {
      banco: item.value,
      label: item.label,
      score: Math.min(100, score),
      reasons,
    };
  });

  return {
    candidates: candidates.sort((a, b) => b.score - a.score),
    codigoBanco: codigoBanco || "-",
    tipoArquivo,
  };
}

export function useCnab() {
  const context = useContext(CnabContext);

  if (!context) {
    throw new Error("useCnab deve ser usado dentro de CnabProvider.");
  }

  return context;
}
