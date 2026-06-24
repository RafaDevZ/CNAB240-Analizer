import styled from "styled-components";
export * from "../../styles";

export const TableSection = styled.section`
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: auto;
`;

export const CsvTable = styled.div`
  display: grid;
  gap: 8px;
  min-width: 980px;
`;

export const CsvRow = styled.div`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 70px 170px 230px 110px 150px minmax(220px, 1fr);
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-size: var(--font-sm);

  & > * {
    min-width: 0;
  }
`;

export const CsvHeaderRow = styled(CsvRow)`
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