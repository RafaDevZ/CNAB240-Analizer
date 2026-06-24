import styled from "styled-components";
export * from "../../styles";

export const GeneratorActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 760px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const OptionsPanel = styled.section`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
`;

export const CheckControl = styled.label`
  min-height: var(--control-height);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: var(--font-sm);
  font-weight: 700;
`;

export const Preview = styled.pre`
  margin: 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input);
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-sm);
  line-height: 1.5;
  overflow: auto;
  white-space: pre;
`;