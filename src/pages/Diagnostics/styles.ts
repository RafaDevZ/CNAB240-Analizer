import styled from "styled-components";
export * from "../../styles";

type Tone = "ok" | "warning" | "error" | "neutral";

function toneColor(tone: Tone) {
  if (tone === "ok") return "#22c55e";
  if (tone === "warning") return "#f59e0b";
  if (tone === "error") return "#ef4444";
  return "#64748b";
}

export const StatusBadge = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: 110px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => toneColor($tone)};
  border-radius: 999px;
  background: ${({ $tone }) => `${toneColor($tone)}24`};
  color: var(--text-strong);
  font-size: var(--font-sm);
  font-weight: 800;
`;

export const DiagnosticGrid = styled.section`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const DiagnosticCard = styled.article<{ $tone: Tone }>`
  min-width: 0;
  min-height: 124px;
  display: grid;
  align-content: start;
  gap: 9px;
  padding: 14px;
  border: 1px solid ${({ $tone }) => `${toneColor($tone)}88`};
  border-radius: 8px;
  background: ${({ $tone }) => `${toneColor($tone)}14`};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const CardTitle = styled.div`
  min-width: 0;
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const StatusDot = styled.span<{ $tone: Tone }>`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${({ $tone }) => toneColor($tone)};
`;

export const CardValue = styled.div`
  color: var(--text-strong);
  font-size: var(--font-lg);
  font-weight: 800;
  overflow-wrap: anywhere;
`;

export const CardDetail = styled.div`
  color: var(--text);
  font-size: var(--font-sm);
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

export const HashBlock = styled.div`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-sm);
  overflow-wrap: anywhere;
`;