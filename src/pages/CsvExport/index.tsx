import { memo, useMemo } from "react";
import { resolverLayout, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type CsvRow = {
  linha: number;
  segmento: string;
  campo: string;
  inicio: number;
  fim: number;
  tipo: string;
  valor: string;
  descricao: string;
};

function escapeCsv(value: string | number) {
  const text = String(value ?? "");
  if (/[";\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadText(content: string, filename: string, type: string) {
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

function sanitizeFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "cnab";
}

const CsvExportPage = memo(function CsvExportPage() {
  const { banco, linhas, nomeArquivo, resumoArquivo } = useCnab();

  const rows = useMemo<CsvRow[]>(() => {
    return linhas.flatMap((linha, lineIndex) => {
      const layout = resolverLayout(linha, banco) ?? [];
      const segmento = resolverSegmento(linha, banco);

      if (layout.length === 0) {
        return [{
          linha: lineIndex + 1,
          segmento,
          campo: "Linha bruta",
          inicio: 1,
          fim: linha.length,
          tipo: "Não identificado",
          valor: linha,
          descricao: "Layout não reconhecido",
        }];
      }

      return layout.map((campo) => ({
        linha: lineIndex + 1,
        segmento,
        campo: campo.label,
        inicio: campo.inicio,
        fim: campo.fim,
        tipo: campo.tipo || "-",
        valor: linha.slice(campo.inicio - 1, campo.fim),
        descricao: campo.descricao || campo.conteudo || "-",
      }));
    });
  }, [banco, linhas]);

  const csv = useMemo(() => {
    const header = ["linha", "segmento", "campo", "inicio", "fim", "tipo", "valor", "descricao"];
    const body = rows.map((row) => [
      row.linha,
      row.segmento,
      row.campo,
      row.inicio,
      row.fim,
      row.tipo,
      row.valor,
      row.descricao,
    ].map(escapeCsv).join(";"));

    return [header.join(";"), ...body].join("\r\n");
  }, [rows]);

  const previewRows = rows.slice(0, 80);
  const filename = `campos-${sanitizeFilename(nomeArquivo || resumoArquivo.nome)}.csv`;

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Converter para CSV</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ActionButton
          type="button"
          disabled={rows.length === 0}
          onClick={() => downloadText(csv, filename, "text/csv;charset=utf-8")}
        >
          Baixar CSV
        </S.ActionButton>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para exportar CSV.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linhas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{linhas.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Campos exportados</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{rows.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Separador</S.SummaryMetricLabel>
              <S.SummaryMetricValue>;</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.TableSection>
            <S.CsvTable>
              <S.CsvHeaderRow>
                <S.PlainText>Linha</S.PlainText>
                <S.PlainText>Segmento</S.PlainText>
                <S.PlainText>Campo</S.PlainText>
                <S.PlainText>Posição</S.PlainText>
                <S.PlainText>Tipo</S.PlainText>
                <S.PlainText>Valor</S.PlainText>
              </S.CsvHeaderRow>
              {previewRows.map((row, index) => (
                <S.CsvRow key={`${row.linha}-${row.campo}-${index}`}>
                  <S.MonoValue>{row.linha}</S.MonoValue>
                  <S.PlainText>{row.segmento}</S.PlainText>
                  <S.PlainText>{row.campo}</S.PlainText>
                  <S.MonoValue>{row.inicio}-{row.fim}</S.MonoValue>
                  <S.PlainText>{row.tipo}</S.PlainText>
                  <S.FieldValue>{row.valor || "-"}</S.FieldValue>
                </S.CsvRow>
              ))}
            </S.CsvTable>
          </S.TableSection>
        </>
      )}
    </S.PageShell>
  );
});

export default CsvExportPage;