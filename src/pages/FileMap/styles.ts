import styled from "styled-components";
export * from "../../styles";

type Tone = "file" | "batch" | "detail" | "trailer" | "invalid" | "unknown";

function toneColor(tone: Tone) {
  if (tone === "file") return "#38bdf8";
  if (tone === "batch") return "#a78bfa";
  if (tone === "detail") return "#22c55e";
  if (tone === "trailer") return "#f59e0b";
  if (tone === "invalid") return "#ef4444";
  return "#64748b";
}

export const MapSection = styled.section`
  flex: 1 1 auto;
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
`;

export const TreemapCanvas = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.28);
`;

export const TreemapBlock = styled.article<{
  $tone: Tone;
  $x: number;
  $y: number;
  $width: number;
  $height: number;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $width }) => $width}%;
  height: ${({ $height }) => $height}%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 6px;
  padding: clamp(8px, 1.2vw, 14px);
  overflow: hidden;
  border: 1px solid ${({ $tone }) => toneColor($tone)};
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ $tone }) => `${toneColor($tone)}34`}, ${({ $tone }) => `${toneColor($tone)}14`});
  color: var(--text-strong);
  box-shadow: inset 0 0 0 4px var(--surface);
`;

export const BlockLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-sm);
  font-weight: 900;
`;

export const BlockMeta = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 700;
`;

export const BlockStats = styled.div`
  align-self: end;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;

  strong {
    font-family: var(--mono);
    font-size: var(--font-lg);
    line-height: 1;
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text);
    font-family: var(--mono);
    font-size: var(--font-xs);
    font-weight: 800;
  }
`;