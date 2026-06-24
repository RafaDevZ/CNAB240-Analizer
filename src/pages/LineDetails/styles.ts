import styled from "styled-components";
export * from "../../styles";

export const LinePreview = styled.pre`
  margin: 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input);
  color: var(--text);
  font-family: var(--mono);
  font-size: var(--font-sm);
  line-height: 1.45;
  overflow: auto;
  white-space: pre;
`;

export const FieldTable = styled.div`
  display: grid;
  gap: 8px;
  min-width: 860px;
`;

export const FieldTableShell = styled.div`
  overflow: auto;
`;

export const FieldRow = styled.div<{ $selected?: boolean }>`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 54px 210px 92px 110px minmax(160px, 1fr) minmax(220px, 1.2fr);
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border: 1px solid ${({ $selected }) => ($selected ? "rgba(79, 193, 255, 0.74)" : "var(--border)")};
  border-radius: 6px;
  background: ${({ $selected }) => ($selected ? "rgba(79, 193, 255, 0.12)" : "rgba(255, 255, 255, 0.02)")};
  color: var(--text);
  font-size: var(--font-sm);

  & > * {
    min-width: 0;
  }
`;

export const FieldHeaderRow = styled(FieldRow)`
  background: var(--surface-muted);
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const MonoValue = styled.span`
  min-width: 0;
  font-family: var(--mono);
  overflow-wrap: anywhere;
`;

export const FieldValue = styled(MonoValue)`
  color: var(--text-strong);
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
  text-align: center;
`;
