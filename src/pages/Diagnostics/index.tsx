import { memo, useMemo } from "react";
import { CNAB_RECORD_BYTES, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type DiagnosticTone = "ok" | "warning" | "error" | "neutral";

type DiagnosticItem = {
  title: string;
  value: string;
  detail: string;
  tone: DiagnosticTone;
};

function parseNumber(value: string) {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;
  return Number(normalized);
}

function formatList(values: number[]) {
  return values.length > 0 ? values.join(", ") : "Nenhuma";
}

const DiagnosticsPage = memo(function DiagnosticsPage() {
  const {
    banco,
    bancos,
    hashArquivo,
    layoutDetection,
    linhas,
    registrosBytes,
    resumoArquivo,
    resumoValidacao,
    temBomUtf8,
  } = useCnab();

  const diagnostics = useMemo<DiagnosticItem[]>(() => {
    const bestLayout = layoutDetection.candidates[0];
    const selectedLabel = bancos.find((item) => item.value === banco)?.label ?? banco;
    const fileTrailer = linhas.find((linha) => linha[7] === "9") ?? "";
    const declaredRecords = fileTrailer ? parseNumber(fileTrailer.slice(23, 29)) : null;
    const declaredBatches = fileTrailer ? parseNumber(fileTrailer.slice(17, 23)) : null;
    const batchHeaders = linhas.filter((linha) => linha[7] === "1").length;
    const batchTrailers = linhas.filter((linha) => linha[7] === "5").length;
    const detailRecords = linhas.filter((linha) => linha[7] === "3").length;
    const invalidLines = registrosBytes
      .map((registro, index) => (registro.tamanhoConteudo !== CNAB_RECORD_BYTES ? index + 1 : null))
      .filter((line): line is number => line !== null);

    return [
      {
        title: "Layout selecionado",
        value: selectedLabel,
        detail: bestLayout ? `Melhor sugestão: ${bestLayout.label} (${bestLayout.score}%)` : "Sem sugestão calculada",
        tone: bestLayout && bestLayout.banco !== banco && bestLayout.score >= 50 ? "warning" : "ok",
      },
      {
        title: "Tamanho dos registros",
        value: invalidLines.length === 0 ? "240 bytes" : `${invalidLines.length} divergências`,
        detail: `Linhas com tamanho diferente: ${formatList(invalidLines)}`,
        tone: invalidLines.length === 0 ? "ok" : "error",
      },
      {
        title: "Trailer de arquivo",
        value: fileTrailer ? "Encontrado" : "Ausente",
        detail: declaredRecords === null ? "Total declarado não identificado" : `Registros declarados: ${declaredRecords} / encontrados: ${linhas.length}`,
        tone: !fileTrailer || (declaredRecords !== null && declaredRecords !== linhas.length) ? "error" : "ok",
      },
      {
        title: "Lotes",
        value: `${batchHeaders} headers / ${batchTrailers} trailers`,
        detail: declaredBatches === null ? "Total de lotes do trailer não identificado" : `Lotes declarados: ${declaredBatches}`,
        tone: batchHeaders === batchTrailers && (declaredBatches === null || declaredBatches === batchHeaders) ? "ok" : "error",
      },
      {
        title: "Detalhes",
        value: String(detailRecords),
        detail: "Registros tipo 3 encontrados no arquivo.",
        tone: detailRecords > 0 ? "ok" : "warning",
      },
      {
        title: "Codificação",
        value: temBomUtf8 ? "BOM UTF-8" : "Sem BOM",
        detail: `Multibyte: ${formatList(resumoArquivo.linhasMultibyte)} | CR isolado: ${formatList(resumoValidacao.linhasComCr)}`,
        tone: temBomUtf8 || resumoArquivo.linhasMultibyte.length > 0 || resumoValidacao.linhasComCr.length > 0 ? "warning" : "ok",
      },
    ];
  }, [banco, bancos, layoutDetection, linhas, registrosBytes, resumoArquivo, resumoValidacao, temBomUtf8]);

  const errorCount = diagnostics.filter((item) => item.tone === "error").length;
  const warningCount = diagnostics.filter((item) => item.tone === "warning").length;
  const overallTone: DiagnosticTone = errorCount > 0 ? "error" : warningCount > 0 ? "warning" : linhas.length > 0 ? "ok" : "neutral";
  const overallText = linhas.length === 0 ? "Sem arquivo" : errorCount > 0 ? `${errorCount} erros` : warningCount > 0 ? `${warningCount} avisos` : "ok";

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Diagnóstico consolidado</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.StatusBadge $tone={overallTone}>{overallText}</S.StatusBadge>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB para gerar o diagnóstico consolidado.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linhas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.totalLinhas}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Bytes com quebra</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.totalBytesConteudo}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Código banco</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.codigoBanco}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Layout</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.bancoLayout}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.DiagnosticGrid>
            {diagnostics.map((item) => (
              <S.DiagnosticCard key={item.title} $tone={item.tone}>
                <S.CardHeader>
                  <S.CardTitle>{item.title}</S.CardTitle>
                  <S.StatusDot $tone={item.tone} />
                </S.CardHeader>
                <S.CardValue>{item.value}</S.CardValue>
                <S.CardDetail>{item.detail}</S.CardDetail>
              </S.DiagnosticCard>
            ))}
          </S.DiagnosticGrid>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Integridade</S.SummarySectionTitle>
            <S.HashBlock>{hashArquivo || "SHA-256 não disponível"}</S.HashBlock>
          </S.SummaryWideSection>

          <S.SummaryColumns>
            <S.SummarySection>
              <S.SummarySectionTitle>Tipos de registro</S.SummarySectionTitle>
              <S.SummaryList>
                {resumoArquivo.tiposRegistro.map(([label, total]) => (
                  <S.SummaryListRow key={label}><S.PlainText>{label}</S.PlainText><S.SummaryCount>{total}</S.SummaryCount></S.SummaryListRow>
                ))}
              </S.SummaryList>
            </S.SummarySection>
            <S.SummarySection>
              <S.SummarySectionTitle>Segmentos</S.SummarySectionTitle>
              <S.SummaryList>
                {resumoArquivo.segmentos.map(([label, total]) => (
                  <S.SummaryListRow key={label}><S.PlainText>{label}</S.PlainText><S.SummaryCount>{total}</S.SummaryCount></S.SummaryListRow>
                ))}
              </S.SummaryList>
            </S.SummarySection>
            <S.SummarySection>
              <S.SummarySectionTitle>Quebras de linha</S.SummarySectionTitle>
              <S.SummaryList>
                {resumoArquivo.quebrasLinha.map(([label, total]) => (
                  <S.SummaryListRow key={label}><S.PlainText>{label}</S.PlainText><S.SummaryCount>{total}</S.SummaryCount></S.SummaryListRow>
                ))}
              </S.SummaryList>
            </S.SummarySection>
          </S.SummaryColumns>
        </>
      )}
    </S.PageShell>
  );
});

export default DiagnosticsPage;