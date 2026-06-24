import { memo, useMemo } from "react";
import { CNAB_RECORD_BYTES, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type LineTone = "file" | "batch" | "detail" | "trailer" | "invalid" | "unknown";

function getLineTone(linha: string, tamanho: number): LineTone {
  if (tamanho !== CNAB_RECORD_BYTES) return "invalid";

  const tipo = linha[7];
  if (tipo === "0") return "file";
  if (tipo === "1") return "batch";
  if (tipo === "3") return "detail";
  if (tipo === "5" || tipo === "9") return "trailer";
  return "unknown";
}

const FileMapPage = memo(function FileMapPage() {
  const { banco, linhas, registrosBytes, resumoArquivo } = useCnab();

  const items = useMemo(() => {
    return linhas.map((linha, index) => {
      const registro = registrosBytes[index];
      const segmento = resolverSegmento(linha, banco);
      const tone = getLineTone(linha, registro?.tamanhoConteudo ?? linha.length);

      return {
        linha: index + 1,
        segmento,
        tone,
        tamanho: registro?.tamanhoConteudo ?? linha.length,
        multibyte: Boolean(registro?.temMultibyte),
        tipo: linha[7] || "-",
      };
    });
  }, [banco, linhas, registrosBytes]);

  const invalidas = items.filter((item) => item.tone === "invalid").length;
  const detalhes = items.filter((item) => item.tone === "detail").length;
  const trailers = items.filter((item) => item.tone === "trailer").length;
  const multibyte = items.filter((item) => item.multibyte).length;

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Mapa visual</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.SummaryCount>{items.length} linhas</S.SummaryCount>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para gerar o mapa.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Detalhes</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{detalhes}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Trailers</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{trailers}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Inválidas</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{invalidas}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Multibyte</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{multibyte}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.LegendBar>
            <S.LegendChip $tone="file">Header arquivo</S.LegendChip>
            <S.LegendChip $tone="batch">Header lote</S.LegendChip>
            <S.LegendChip $tone="detail">Detalhe</S.LegendChip>
            <S.LegendChip $tone="trailer">Trailer</S.LegendChip>
            <S.LegendChip $tone="invalid">Inválida</S.LegendChip>
            <S.LegendChip $tone="unknown">Não identificada</S.LegendChip>
          </S.LegendBar>

          <S.MapSection>
            <S.MapGrid>
              {items.map((item) => (
                <S.MapCell
                  key={item.linha}
                  $tone={item.tone}
                  title={`Linha ${item.linha} | ${item.segmento} | ${item.tamanho} bytes${item.multibyte ? " | multibyte" : ""}`}
                >
                  <S.MapLine>{item.linha}</S.MapLine>
                  <S.MapType>{item.tipo}</S.MapType>
                </S.MapCell>
              ))}
            </S.MapGrid>
          </S.MapSection>
        </>
      )}
    </S.PageShell>
  );
});

export default FileMapPage;