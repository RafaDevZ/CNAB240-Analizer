import styled from "styled-components";
export * from "../../styles";

export const SearchPanel = styled.section`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 190px auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
  height: var(--control-height);
  font-size: var(--font-md);
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text);
  outline: none;
  font: inherit;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }

  &::placeholder {
    color: var(--muted);
  }
`;

export const CheckControl = styled.label`
  min-height: var(--control-height);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: var(--font-sm);
  font-weight: 700;
  white-space: nowrap;
`;

export const ResultsSection = styled.section`
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: auto;
`;

export const SearchTable = styled.div`
  display: grid;
  gap: 8px;
  min-width: 860px;
`;

export const SearchRow = styled.div`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 72px 180px 110px 220px minmax(220px, 1fr);
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

export const SearchHeaderRow = styled(SearchRow)`
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