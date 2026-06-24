import { memo, useMemo } from "react";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type CheckTone = "ok" | "warning" | "error" | "neutral";

type CheckRow = {
  line: string;
  item: string;
  declared: string;
  actual: string;
  tone: CheckTone;
  status: string;
};

function campoNumerico(linha: string, inicio: number, fim: number) {
  const raw = linha.slice(inicio - 1, fim);
  const trimmed = raw.trim();

  if (!/^\d+$/.test(trimmed)) {
    return { raw: raw || "-", value: null };
  }

  return { raw, value: Number(trimmed) };
}

function statusComparacao(declarado: number | null, real: number) {
  if (declarado === null) return { tone: "error" as const, status: "Invalido" };
  if (declarado === real) return { tone: "ok" as const, status: "ok" };
  return { tone: "error" as const, status: "Divergente" };
}

function contarLinhasDoLote(linhas: string[], lote: string) {
  return linhas.filter((linha) => linha.slice(3, 7) === lote).length;
}

const TrailerValidationPage = memo(function TrailerValidationPage() {
  const { linhas, nomeArquivo, resumoArquivo } = useCnab();

  const validacao = useMemo(() => {
    const headersLote = linhas
      .map((linha, index) => ({ linha, index }))
      .filter(({ linha }) => linha[7] === "1");
    const trailersLote = linhas
      .map((linha, index) => ({ linha, index }))
      .filter(({ linha }) => linha[7] === "5");
    const trailersArquivo = linhas
      .map((linha, index) => ({ linha, index }))
      .filter(({ linha }) => linha[7] === "9");

    const arquivoRows: CheckRow[] = trailersArquivo.flatMap(({ linha, index }) => {
      const lotesDeclarados = campoNumerico(linha, 18, 23);
      const registrosDeclarados = campoNumerico(linha, 24, 29);
      const lotes = statusComparacao(lotesDeclarados.value, headersLote.length);
      const registros = statusComparacao(registrosDeclarados.value, linhas.length);

      return [
        {
          line: String(index + 1),
          item: "Quantidade de lotes",
          declared: lotesDeclarados.raw,
          actual: String(headersLote.length),
          tone: lotes.tone,
          status: lotes.status,
        },
        {
          line: String(index + 1),
          item: "Quantidade de registros",
          declared: registrosDeclarados.raw,
          actual: String(linhas.length),
          tone: registros.tone,
          status: registros.status,
        },
      ];
    });

    if (linhas.length > 0 && trailersArquivo.length === 0) {
      arquivoRows.push({
        line: "-",
        item: "Trailer de arquivo",
        declared: "Ausente",
        actual: "1 esperado",
        tone: "error",
        status: "Nao encontrado",
      });
    }

    if (trailersArquivo.length > 1) {
      arquivoRows.push({
        line: trailersArquivo.map(({ index }) => index + 1).join(", "),
        item: "Trailer de arquivo",
        declared: String(trailersArquivo.length),
        actual: "1 esperado",
        tone: "warning",
        status: "Multiplo",
      });
    }

    const loteRows: CheckRow[] = trailersLote.map(({ linha, index }) => {
      const lote = linha.slice(3, 7);
      const registrosDeclarados = campoNumerico(linha, 18, 23);
      const totalReal = contarLinhasDoLote(linhas, lote);
      const comparacao = statusComparacao(registrosDeclarados.value, totalReal);

      return {
        line: String(index + 1),
        item: `Lote ${lote}`,
        declared: registrosDeclarados.raw,
        actual: String(totalReal),
        tone: comparacao.tone,
        status: comparacao.status,
      };
    });

    const lotesComTrailer = new Set(trailersLote.map(({ linha }) => linha.slice(3, 7)));
    headersLote.forEach(({ linha, index }) => {
      const lote = linha.slice(3, 7);

      if (!lotesComTrailer.has(lote)) {
        loteRows.push({
          line: String(index + 1),
          item: `Lote ${lote}`,
          declared: "Ausente",
          actual: "Trailer esperado",
          tone: "error",
          status: "Sem trailer",
        });
      }
    });

    const todasAsLinhas = [...arquivoRows, ...loteRows];
    const geral: CheckTone =
      linhas.length === 0
        ? "neutral"
        : todasAsLinhas.some((row) => row.tone === "error")
          ? "error"
          : todasAsLinhas.some((row) => row.tone === "warning")
            ? "warning"
            : "ok";

    return {
      arquivoRows,
      geral,
      loteRows,
      totalHeadersLote: headersLote.length,
      totalTrailersArquivo: trailersArquivo.length,
      totalTrailersLote: trailersLote.length,
    };
  }, [linhas]);

  const statusTexto = {
    ok: "ok",
    warning: "Conferir avisos",
    error: "Ha divergencias",
    neutral: "Sem arquivo",
  }[validacao.geral];

  const renderRows = (rows: CheckRow[]) => {
    if (rows.length === 0) {
      return <S.EmptyDetailsText>Nenhum trailer encontrado para validar.</S.EmptyDetailsText>;
    }

    return (
      <S.ValidationTable>
        <S.ValidationTableHeader>
          <S.PlainText>Linha</S.PlainText>
          <S.PlainText>Item</S.PlainText>
          <S.PlainText>Declarado</S.PlainText>
          <S.PlainText>Real</S.PlainText>
          <S.PlainText>Status</S.PlainText>
        </S.ValidationTableHeader>
        {rows.map((row) => (
          <S.ValidationRow key={`${row.line}-${row.item}`}>
            <S.MonoValue>{row.line}</S.MonoValue>
            <S.PlainText>{row.item}</S.PlainText>
            <S.MonoValue>{row.declared}</S.MonoValue>
            <S.MonoValue>{row.actual}</S.MonoValue>
            <S.ValidationStatus $tone={row.tone}>{row.status}</S.ValidationStatus>
          </S.ValidationRow>
        ))}
      </S.ValidationTable>
    );
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Validação de trailer</S.PanelTitle>
          <S.PageTitle>{nomeArquivo || "Não informado"}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ValidationStatus $tone={validacao.geral}>{statusTexto}</S.ValidationStatus>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyState>Carregue ou cole um arquivo CNAB no visualizador para validar os trailers.</S.EmptyState>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linhas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.totalLinhas}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Headers de lote</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{validacao.totalHeadersLote}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Trailers de lote</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{validacao.totalTrailersLote}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Trailers de arquivo</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{validacao.totalTrailersArquivo}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Trailer de arquivo</S.SummarySectionTitle>
            {renderRows(validacao.arquivoRows)}
          </S.SummaryWideSection>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Trailers de lote</S.SummarySectionTitle>
            {renderRows(validacao.loteRows)}
          </S.SummaryWideSection>
        </>
      )}
    </S.PageShell>
  );
});

export default TrailerValidationPage;
