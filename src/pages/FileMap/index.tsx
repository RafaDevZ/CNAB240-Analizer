import { memo, useMemo } from "react";
import AppTooltip from "../../components/AppTooltip";
import { CNAB_RECORD_BYTES, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type LineTone = "file" | "batch" | "detail" | "trailer" | "invalid" | "unknown";

type MapGroup = {
  key: string;
  label: string;
  detail: string;
  tone: LineTone;
  count: number;
  percent: number;
};

type TreemapBlock = MapGroup & {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getLineTone(linha: string, tamanho: number): LineTone {
  if (tamanho !== CNAB_RECORD_BYTES) return "invalid";

  const tipo = linha[7];
  if (tipo === "0") return "file";
  if (tipo === "1") return "batch";
  if (tipo === "3") return "detail";
  if (tipo === "5" || tipo === "9") return "trailer";
  return "unknown";
}

function getGroupLabel(linha: string, tone: LineTone, segmento: string) {
  if (tone === "invalid") return "Inválidas";
  if (tone === "file") return "Header arquivo";
  if (tone === "batch") return "Header lote";
  if (tone === "trailer") return linha[7] === "9" ? "Trailer arquivo" : "Trailer lote";
  if (tone === "detail") return segmento || "Detalhe";
  return "Não identificadas";
}

function splitTreemap(groups: MapGroup[], x = 0, y = 0, width = 100, height = 100): TreemapBlock[] {
  if (groups.length === 0) return [];
  if (groups.length === 1) return [{ ...groups[0], x, y, width, height }];

  const total = groups.reduce((sum, group) => sum + group.count, 0);
  const half = total / 2;
  let pivot = 0;
  let running = 0;

  for (let index = 0; index < groups.length - 1; index += 1) {
    const next = running + groups[index].count;
    if (Math.abs(half - next) <= Math.abs(half - running) || running === 0) {
      running = next;
      pivot = index + 1;
    } else {
      break;
    }
  }

  const first = groups.slice(0, pivot);
  const second = groups.slice(pivot);
  const firstTotal = first.reduce((sum, group) => sum + group.count, 0);
  const ratio = total === 0 ? 0 : firstTotal / total;

  if (width >= height) {
    const firstWidth = width * ratio;
    return [
      ...splitTreemap(first, x, y, firstWidth, height),
      ...splitTreemap(second, x + firstWidth, y, width - firstWidth, height),
    ];
  }

  const firstHeight = height * ratio;
  return [
    ...splitTreemap(first, x, y, width, firstHeight),
    ...splitTreemap(second, x, y + firstHeight, width, height - firstHeight),
  ];
}

const FileMapPage = memo(function FileMapPage() {
  const { banco, linhas, registrosBytes, resumoArquivo } = useCnab();

  const items = useMemo(() => {
    return linhas.map((linha, index) => {
      const registro = registrosBytes[index];
      const segmento = resolverSegmento(linha, banco);
      const tone = getLineTone(linha, registro?.tamanhoConteudo ?? linha.length);

      return {
        segmento,
        tone,
        tipo: linha[7] || "-",
        groupLabel: getGroupLabel(linha, tone, segmento),
      };
    });
  }, [banco, linhas, registrosBytes]);

  const groups = useMemo<MapGroup[]>(() => {
    const grouped = new Map<string, Omit<MapGroup, "percent">>();

    items.forEach((item) => {
      const key = `${item.tone}-${item.groupLabel}`;
      const current = grouped.get(key);

      if (current) {
        current.count += 1;
        return;
      }

      grouped.set(key, {
        key,
        label: item.groupLabel,
        detail: item.tone === "detail" ? "Registro detalhe" : `Tipo ${item.tipo}`,
        tone: item.tone,
        count: 1,
      });
    });

    return Array.from(grouped.values())
      .map((group) => ({
        ...group,
        percent: items.length === 0 ? 0 : (group.count / items.length) * 100,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [items]);

  const blocks = useMemo(() => splitTreemap(groups), [groups]);

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
        <S.MapSection>
          <S.TreemapCanvas aria-label="Mapa proporcional do arquivo">
            {blocks.map((block) => (
              <AppTooltip key={block.key} content={`${block.label} | ${block.count} linhas | ${block.percent.toFixed(2)}%`}>
                <S.TreemapBlock
                  $tone={block.tone}
                  $x={block.x}
                  $y={block.y}
                  $width={block.width}
                  $height={block.height}
                >
                  <S.BlockLabel>{block.label}</S.BlockLabel>
                  <S.BlockMeta>{block.detail}</S.BlockMeta>
                  <S.BlockStats>
                    <strong>{block.count}</strong>
                    <span>{block.percent.toFixed(1)}%</span>
                  </S.BlockStats>
                </S.TreemapBlock>
              </AppTooltip>
            ))}
          </S.TreemapCanvas>
        </S.MapSection>
      )}
    </S.PageShell>
  );
});

export default FileMapPage;