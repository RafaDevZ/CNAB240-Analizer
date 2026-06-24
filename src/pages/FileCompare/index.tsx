import { memo, useMemo, useState } from "react";
import {
  analisarRegistrosBytes,
  calcularHashSha256,
  decodificarRegistros,
  detectarLayout,
  resolverSegmento,
  type RegistroBytes,
} from "../../contexts/CnabContext";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type ComparedFile = {
  nome: string;
  hash: string;
  linhas: string[];
  registros: RegistroBytes[];
};

type Difference = {
  linha: number;
  segmentoAtual: string;
  segmentoComparado: string;
  status: "igual" | "alterada" | "ausente-atual" | "ausente-comparado";
  bytesAtual: string;
  bytesComparado: string;
  previaAtual: string;
  previaComparado: string;
};

function preview(linha: string) {
  if (!linha) return "-";
  return linha.length > 96 ? `${linha.slice(0, 96)}...` : linha;
}

const FileComparePage = memo(function FileComparePage() {
  const { banco, hashArquivo, linhas, nomeArquivo, registrosBytes, resumoArquivo } = useCnab();
  const [arquivoComparado, setArquivoComparado] = useState<ComparedFile | null>(null);
  const [carregando, setCarregando] = useState(false);

  const differences = useMemo<Difference[]>(() => {
    if (!arquivoComparado) return [];

    const total = Math.max(linhas.length, arquivoComparado.linhas.length);

    return Array.from({ length: total }, (_, index) => {
      const linhaAtual = linhas[index] ?? "";
      const linhaComparada = arquivoComparado.linhas[index] ?? "";
      const registroAtual = registrosBytes[index];
      const registroComparado = arquivoComparado.registros[index];
      const existeAtual = index < linhas.length;
      const existeComparado = index < arquivoComparado.linhas.length;
      const status: Difference["status"] = !existeAtual
        ? "ausente-atual"
        : !existeComparado
          ? "ausente-comparado"
          : linhaAtual === linhaComparada
            ? "igual"
            : "alterada";

      return {
        linha: index + 1,
        segmentoAtual: existeAtual ? resolverSegmento(linhaAtual, banco) : "-",
        segmentoComparado: existeComparado ? resolverSegmento(linhaComparada, banco) : "-",
        status,
        bytesAtual: registroAtual ? String(registroAtual.tamanhoConteudo) : "-",
        bytesComparado: registroComparado ? String(registroComparado.tamanhoConteudo) : "-",
        previaAtual: preview(linhaAtual),
        previaComparado: preview(linhaComparada),
      };
    }).filter((item) => item.status !== "igual");
  }, [arquivoComparado, banco, linhas, registrosBytes]);

  const comparadoDetection = useMemo(() => {
    if (!arquivoComparado) return null;
    return detectarLayout(arquivoComparado.linhas);
  }, [arquivoComparado]);

  const handleFile = async (arquivo: File) => {
    setCarregando(true);

    try {
      const bytes = new Uint8Array(await arquivo.arrayBuffer());
      const registros = analisarRegistrosBytes(bytes);
      const hash = await calcularHashSha256(bytes);

      setArquivoComparado({
        nome: arquivo.name,
        hash,
        linhas: decodificarRegistros(registros),
        registros,
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Comparar arquivos</S.PanelTitle>
          <S.PageTitle>{nomeArquivo || resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.FilePicker>
          <S.HiddenFileInput
            id="compare-file-input"
            type="file"
            onChange={(event) => {
              const arquivo = event.target.files?.[0];
              if (arquivo) void handleFile(arquivo);
              event.target.value = "";
            }}
          />
          <S.ActionButton as="label" htmlFor="compare-file-input">
            {carregando ? "Carregando..." : "Escolher arquivo"}
          </S.ActionButton>
        </S.FilePicker>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole o arquivo principal no visualizador antes de comparar.</S.EmptyOutput>
      ) : !arquivoComparado ? (
        <S.EmptyState>Escolha um segundo arquivo CNAB para comparar com o arquivo principal.</S.EmptyState>
      ) : (
        <>
          <S.CompareGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Arquivo principal</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{nomeArquivo || resumoArquivo.nome}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Arquivo comparado</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{arquivoComparado.nome}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Diferenças</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{differences.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Layout sugerido</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{comparadoDetection?.candidates[0]?.label ?? "-"}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.CompareGrid>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Integridade</S.SummarySectionTitle>
            <S.HashGrid>
              <S.FieldDetail>
                <S.FieldTerm>SHA-256 principal</S.FieldTerm>
                <S.HashText>{hashArquivo || "-"}</S.HashText>
              </S.FieldDetail>
              <S.FieldDetail>
                <S.FieldTerm>SHA-256 comparado</S.FieldTerm>
                <S.HashText>{arquivoComparado.hash || "-"}</S.HashText>
              </S.FieldDetail>
            </S.HashGrid>
          </S.SummaryWideSection>

          {differences.length === 0 ? (
            <S.EmptyState>Os arquivos possuem o mesmo conteúdo interpretado.</S.EmptyState>
          ) : (
            <S.DiffSection>
              <S.DiffTable>
                <S.DiffHeaderRow>
                  <S.PlainText>Linha</S.PlainText>
                  <S.PlainText>Status</S.PlainText>
                  <S.PlainText>Segmento atual</S.PlainText>
                  <S.PlainText>Segmento comparado</S.PlainText>
                  <S.PlainText>Bytes</S.PlainText>
                  <S.PlainText>Prévia atual</S.PlainText>
                  <S.PlainText>Prévia comparada</S.PlainText>
                </S.DiffHeaderRow>
                {differences.map((difference) => (
                  <S.DiffRow key={difference.linha}>
                    <S.MonoValue>{difference.linha}</S.MonoValue>
                    <S.StatusBadge $status={difference.status}>{difference.status}</S.StatusBadge>
                    <S.PlainText>{difference.segmentoAtual}</S.PlainText>
                    <S.PlainText>{difference.segmentoComparado}</S.PlainText>
                    <S.MonoValue>{difference.bytesAtual}/{difference.bytesComparado}</S.MonoValue>
                    <S.LinePreview>{difference.previaAtual}</S.LinePreview>
                    <S.LinePreview>{difference.previaComparado}</S.LinePreview>
                  </S.DiffRow>
                ))}
              </S.DiffTable>
            </S.DiffSection>
          )}
        </>
      )}
    </S.PageShell>
  );
});

export default FileComparePage;