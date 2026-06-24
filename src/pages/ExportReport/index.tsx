import { memo, useMemo } from "react";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type ReportFormat = "txt" | "json";

function sanitizeFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "cnab";
}

function formatList(values: number[]) {
  return values.length > 0 ? values.join(", ") : "Nenhuma";
}

function formatPairs(items: Array<[string, number]>) {
  if (items.length === 0) return "  - Nenhum";

  return items.map(([label, total]) => `  - ${label}: ${total}`).join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const ExportReportPage = memo(function ExportReportPage() {
  const { banco, hashArquivo, linhas, nomeArquivo, registrosBytes, resumoArquivo, resumoValidacao, temBomUtf8 } = useCnab();

  const reportObject = useMemo(() => {
    return {
      arquivo: {
        nome: resumoArquivo.nome,
        origem: resumoArquivo.origem,
        hashSha256: hashArquivo || null,
        layoutSelecionado: resumoArquivo.bancoLayout,
        banco,
        codigoBanco: resumoArquivo.codigoBanco,
      },
      totais: {
        linhas: resumoArquivo.totalLinhas,
        bytesConteudo: resumoArquivo.totalBytesConteudo,
      },
      validacao: {
        bytesInvalidos: resumoValidacao.bytesInvalidos,
        resumoBytes: resumoValidacao.resumoBytes,
        detalheTamanhoInvalido: resumoValidacao.detalheTamanhoInvalido,
        temBomUtf8,
        linhasInvalidas: resumoArquivo.linhasInvalidas,
        linhasMultibyte: resumoArquivo.linhasMultibyte,
        linhasComCr: resumoValidacao.linhasComCr,
      },
      distribuicao: {
        tiposRegistro: Object.fromEntries(resumoArquivo.tiposRegistro),
        segmentos: Object.fromEntries(resumoArquivo.segmentos),
        quebrasLinha: Object.fromEntries(resumoArquivo.quebrasLinha),
      },
      registros: registrosBytes.map((registro, index) => ({
        linha: index + 1,
        tamanhoConteudo: registro.tamanhoConteudo,
        tamanhoBruto: registro.tamanhoBruto,
        quebra: registro.quebra,
        temMultibyte: registro.temMultibyte,
      })),
      geradoEm: new Date().toISOString(),
    };
  }, [banco, hashArquivo, registrosBytes, resumoArquivo, resumoValidacao, temBomUtf8]);

  const textReport = useMemo(() => {
    return [
      "RELATORIO CNAB240",
      "",
      `Arquivo: ${reportObject.arquivo.nome}`,
      `Origem: ${reportObject.arquivo.origem}`,
      `Layout selecionado: ${reportObject.arquivo.layoutSelecionado}`,
      `Codigo do banco: ${reportObject.arquivo.codigoBanco}`,
      `SHA-256: ${reportObject.arquivo.hashSha256 ?? "-"}`,
      `Gerado em: ${reportObject.geradoEm}`,
      "",
      "TOTAIS",
      `Linhas: ${reportObject.totais.linhas}`,
      `Bytes com quebra: ${reportObject.totais.bytesConteudo}`,
      "",
      "VALIDACAO",
      `Bytes invalidos: ${reportObject.validacao.bytesInvalidos ? "Sim" : "Nao"}`,
      `Resumo bytes: ${reportObject.validacao.resumoBytes}`,
      `Detalhe tamanho: ${reportObject.validacao.detalheTamanhoInvalido}`,
      `BOM UTF-8: ${reportObject.validacao.temBomUtf8 ? "Sim" : "Nao"}`,
      `Linhas invalidas: ${formatList(reportObject.validacao.linhasInvalidas)}`,
      `Linhas multibyte: ${formatList(reportObject.validacao.linhasMultibyte)}`,
      `Linhas com CR isolado: ${formatList(reportObject.validacao.linhasComCr)}`,
      "",
      "TIPOS DE REGISTRO",
      formatPairs(resumoArquivo.tiposRegistro),
      "",
      "SEGMENTOS",
      formatPairs(resumoArquivo.segmentos),
      "",
      "QUEBRAS DE LINHA",
      formatPairs(resumoArquivo.quebrasLinha),
    ].join("\n");
  }, [reportObject, resumoArquivo]);

  const jsonReport = useMemo(() => JSON.stringify(reportObject, null, 2), [reportObject]);
  const baseFilename = `relatorio-${sanitizeFilename(nomeArquivo || resumoArquivo.nome)}`;

  const handleDownload = (format: ReportFormat) => {
    if (format === "json") {
      downloadFile(jsonReport, `${baseFilename}.json`, "application/json;charset=utf-8");
      return;
    }

    downloadFile(textReport, `${baseFilename}.txt`, "text/plain;charset=utf-8");
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Exportar relatório</S.PanelTitle>
          <S.PageTitle>{nomeArquivo || resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ExportActions>
          <S.ActionButton type="button" onClick={() => handleDownload("txt")} disabled={linhas.length === 0}>
            Baixar TXT
          </S.ActionButton>
          <S.ActionButton type="button" onClick={() => handleDownload("json")} disabled={linhas.length === 0}>
            Baixar JSON
          </S.ActionButton>
        </S.ExportActions>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para gerar o relatório.</S.EmptyOutput>
      ) : (
        <S.ReportLayout>
          <S.SummaryWideSection>
            <S.SummarySectionTitle>Prévia TXT</S.SummarySectionTitle>
            <S.ReportPreview>{textReport}</S.ReportPreview>
          </S.SummaryWideSection>

          <S.ReportAside>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linhas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.totalLinhas}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linhas inválidas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.linhasInvalidas.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Quebras</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{resumoArquivo.quebrasLinha.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.ReportAside>
        </S.ReportLayout>
      )}
    </S.PageShell>
  );
});

export default ExportReportPage;
