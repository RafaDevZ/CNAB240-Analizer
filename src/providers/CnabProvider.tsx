import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CNAB_RECORD_BYTES,
  CnabContext,
  analisarRegistrosBytes,
  bancos,
  calcularHashSha256,
  comecaComBomUtf8,
  contarOcorrencias,
  decodificarRegistros,
  detectarLayout,
  resolverSegmento,
  textEncoder,
  type Banco,
  type CampoSelecionado,
  type CnabContextValue,
  type ResumoArquivo,
  type ResumoValidacao,
} from "../contexts/CnabContext";

export function CnabProvider({ children }: { children: ReactNode }) {
  const [texto, setTexto] = useState("");
  const [bytesArquivo, setBytesArquivo] = useState<Uint8Array>(new Uint8Array());
  const [origemBytes, setOrigemBytes] = useState<"paste" | "file">("paste");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [hashArquivo, setHashArquivo] = useState("");
  const [campoSelecionado, setCampoSelecionado] = useState<CampoSelecionado | null>(null);
  const [contentRevision, setContentRevision] = useState(0);
  const [banco, setBanco] = useState<Banco>("CAIXASIGCB");

  const registrosBytes = useMemo(() => analisarRegistrosBytes(bytesArquivo), [bytesArquivo]);
  const linhas = useMemo(() => decodificarRegistros(registrosBytes), [registrosBytes]);
  const layoutDetection = useMemo(() => detectarLayout(linhas), [linhas]);
  const temBomUtf8 = useMemo(() => comecaComBomUtf8(bytesArquivo), [bytesArquivo]);
  const resumoValidacao = useMemo<ResumoValidacao>(() => {
    const totalBytesConteudo = registrosBytes.reduce((total, registro) => total + registro.tamanhoConteudo, 0);
    const tamanhoInvalido = registrosBytes.find((registro) => registro.tamanhoConteudo !== CNAB_RECORD_BYTES);
    const linhasMultibyte = registrosBytes
      .map((registro, index) => (registro.temMultibyte ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);
    const linhasComCr = registrosBytes
      .map((registro, index) => (registro.quebra === "CR" ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);

    return {
      totalBytesConteudo,
      bytesInvalidos: Boolean(tamanhoInvalido),
      resumoBytes: registrosBytes.length === 0 ? 0 : tamanhoInvalido?.tamanhoConteudo ?? registrosBytes[0]?.tamanhoConteudo ?? CNAB_RECORD_BYTES,
      linhasMultibyte,
      linhasComCr,
      detalheTamanhoInvalido: tamanhoInvalido
        ? `Linha ${registrosBytes.indexOf(tamanhoInvalido) + 1}: ${tamanhoInvalido.tamanhoConteudo} bytes de conteudo, ${tamanhoInvalido.tamanhoBruto} bytes com ${tamanhoInvalido.quebra}`
        : `240 bytes de conteúdo por registro, ${registrosBytes[0]?.tamanhoBruto ?? CNAB_RECORD_BYTES} bytes com ${registrosBytes[0]?.quebra ?? "EOF"}`,
    };
  }, [registrosBytes]);
  const resumoArquivo = useMemo<ResumoArquivo>(() => {
    const linhasInvalidas = registrosBytes
      .map((registro, index) => (registro.tamanhoConteudo !== CNAB_RECORD_BYTES ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);
    const linhasMultibyte = registrosBytes
      .map((registro, index) => (registro.temMultibyte ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);
    const tiposRegistro = contarOcorrencias(linhas.map((linha) => linha[7] || "Nao identificado"));
    const segmentos = contarOcorrencias(linhas.map((linha) => resolverSegmento(linha, banco)));
    const quebrasLinha = contarOcorrencias(registrosBytes.map((registro) => registro.quebra));
    const bancoSelecionado = bancos.find((item) => item.value === banco)?.label ?? banco;

    return {
      origem: origemBytes === "file" ? "Arquivo aberto" : "Não informado",
      nome: nomeArquivo || "Não informado",
      bancoLayout: bancoSelecionado,
      codigoBanco: linhas[0]?.slice(0, 3) || "-",
      totalLinhas: linhas.length,
      totalBytesConteudo: resumoValidacao.totalBytesConteudo,
      linhasInvalidas,
      linhasMultibyte,
      tiposRegistro,
      segmentos,
      quebrasLinha,
    };
  }, [banco, linhas, nomeArquivo, origemBytes, registrosBytes, resumoValidacao.totalBytesConteudo]);

  useEffect(() => {
    let ativo = true;

    void calcularHashSha256(bytesArquivo).then((hash) => {
      if (ativo) setHashArquivo(hash);
    });

    return () => {
      ativo = false;
    };
  }, [bytesArquivo]);

  const atualizarTexto = useCallback((valor: string) => {
    setTexto(valor);
    setBytesArquivo(textEncoder.encode(valor));
    setOrigemBytes("paste");
    setNomeArquivo("");
    setContentRevision((revision) => revision + 1);
  }, []);

  const selecionarCampo = useCallback((selecao: CampoSelecionado) => {
    setCampoSelecionado(selecao);
  }, []);

  const carregarArquivo = useCallback(async (arquivo: File) => {
    const bytes = new Uint8Array(await arquivo.arrayBuffer());
    const registros = analisarRegistrosBytes(bytes);

    setBytesArquivo(bytes);
    setTexto(decodificarRegistros(registros).join("\n"));
    setOrigemBytes("file");
    setNomeArquivo(arquivo.name);
    setCampoSelecionado(null);
    setContentRevision((revision) => revision + 1);
  }, []);

  const value = useMemo<CnabContextValue>(
    () => ({
      banco,
      bancos,
      campoSelecionado,
      contentRevision,
      hashArquivo,
      linhas,
      layoutDetection,
      nomeArquivo,
      origemBytes,
      registrosBytes,
      resumoArquivo,
      resumoValidacao,
      temBomUtf8,
      texto,
      atualizarTexto,
      carregarArquivo,
      selecionarCampo,
      setBanco,
    }),
    [
      atualizarTexto,
      banco,
      campoSelecionado,
      carregarArquivo,
      contentRevision,
      hashArquivo,
      linhas,
      layoutDetection,
      nomeArquivo,
      origemBytes,
      registrosBytes,
      resumoArquivo,
      resumoValidacao,
      selecionarCampo,
      temBomUtf8,
      texto,
    ]
  );

  return <CnabContext.Provider value={value}>{children}</CnabContext.Provider>;
}
