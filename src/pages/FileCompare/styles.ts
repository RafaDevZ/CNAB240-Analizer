import styled from "styled-components";
export * from "../../styles";

export const FilePicker = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const CompareGrid = styled.section`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const HashGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

export const DiffSection = styled.section`
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: auto;
`;

export const DiffTable = styled.div`
  display: grid;
  gap: 8px;
  min-width: 1160px;
`;

export const DiffRow = styled.div`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 72px 150px 170px 170px 90px minmax(220px, 1fr) minmax(220px, 1fr);
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

export const DiffHeaderRow = styled(DiffRow)`
  background: var(--surface-muted);
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const StatusBadge = styled.span<{ $status: "igual" | "alterada" | "ausente-atual" | "ausente-comparado" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid ${({ $status }) => ($status === "alterada" ? "#f59e0b" : "#ef4444")};
  border-radius: 999px;
  background: ${({ $status }) => ($status === "alterada" ? "rgba(245, 158, 11, 0.14)" : "rgba(239, 68, 68, 0.14)")};
  color: ${({ $status }) => ($status === "alterada" ? "#fde68a" : "#fecaca")};
  font-size: var(--font-xs);
  font-weight: 800;
`;

export const MonoValue = styled.span`
  min-width: 0;
  font-family: var(--mono);
  overflow-wrap: anywhere;
`;

export const LinePreview = styled(MonoValue)`
  color: var(--text-strong);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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