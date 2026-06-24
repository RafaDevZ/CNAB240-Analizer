import styled from "styled-components";
export * from "../../styles";

export const ValidationStatus = styled.div<{ $tone: "ok" | "warning" | "error" | "neutral" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: 110px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => {
    if ($tone === "ok") return "#22c55e";
    if ($tone === "warning") return "#f59e0b";
    if ($tone === "error") return "#ef4444";
    return "var(--border)";
  }};
  border-radius: 999px;
  background: ${({ $tone }) => {
    if ($tone === "ok") return "rgba(34, 197, 94, 0.14)";
    if ($tone === "warning") return "rgba(245, 158, 11, 0.14)";
    if ($tone === "error") return "rgba(239, 68, 68, 0.14)";
    return "var(--surface-raised)";
  }};
  color: ${({ $tone }) => {
    if ($tone === "ok") return "#bbf7d0";
    if ($tone === "warning") return "#fde68a";
    if ($tone === "error") return "#fecaca";
    return "var(--muted)";
  }};
  font-size: var(--font-sm);
  line-height: 1.35;
  font-weight: 800;
  text-align: center;
`;

export const ValidationTable = styled.div`
  display: grid;
  gap: 8px;
`;

export const ValidationRow = styled.div`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 90px minmax(140px, 1fr) 120px 120px 110px;
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-size: var(--font-sm);
  line-height: 1.35;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

export const ValidationTableHeader = styled(ValidationRow)`
  background: var(--surface-muted);
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const MonoValue = styled.span`
  min-width: 0;
  text-align: center;
  font-family: var(--mono);
  overflow-wrap: anywhere;
`;

export const EmptyState = styled.div`
  display: grid;
  min-height: 240px;
  place-items: center;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: var(--font-md);
`;
