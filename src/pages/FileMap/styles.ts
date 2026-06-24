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

export const LegendBar = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
`;

export const LegendChip = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => toneColor($tone)};
  border-radius: 999px;
  background: ${({ $tone }) => `${toneColor($tone)}22`};
  color: var(--text-strong);
  font-size: var(--font-xs);
  font-weight: 800;
`;

export const MapSection = styled.section`
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: auto;
`;

export const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));
  gap: 8px;
`;

export const MapCell = styled.div<{ $tone: Tone }>`
  min-width: 0;
  min-height: 46px;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 2px;
  padding: 6px;
  border: 1px solid ${({ $tone }) => toneColor($tone)};
  border-radius: 6px;
  background: ${({ $tone }) => `${toneColor($tone)}1f`};
  color: var(--text-strong);
`;

export const MapLine = styled.span`
  font-family: var(--mono);
  font-size: var(--font-xs);
  font-weight: 800;
`;

export const MapType = styled.span`
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
`;