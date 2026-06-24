import styled from "styled-components";
export * from "../../styles";

export const ExportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ReportPreview = styled.pre`
  min-height: 340px;
  margin: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.5;
  overflow: auto;
  white-space: pre;
`;

export const ReportLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ReportAside = styled.aside`
  display: grid;
  gap: 14px;
  align-content: start;
`;
