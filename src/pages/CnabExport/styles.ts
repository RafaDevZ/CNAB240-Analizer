import styled from "styled-components";
export * from "../../styles";

export const OptionsPanel = styled.section`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ExportPreview = styled.pre`
  max-height: 360px;
  margin: 0;
  padding: 14px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input);
  color: var(--text);
  font-family: var(--mono);
  font-size: var(--font-sm);
  line-height: 1.55;
  white-space: pre;
`;