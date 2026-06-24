import styled from "styled-components";
export * from "../../styles";

export const EditorActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 780px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const LinePreview = styled.pre`
  margin: 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--input);
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-sm);
  line-height: 1.45;
  overflow: auto;
  white-space: pre;
`;

export const FormSection = styled.section`
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: auto;
`;

export const FieldForm = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldEditor = styled.label`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(180px, 0.9fr) minmax(180px, 1fr);
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldMeta = styled.div`
  min-width: 0;
  display: grid;
  gap: 3px;
`;

export const FieldName = styled.span`
  color: var(--text-strong);
  font-size: var(--font-sm);
  font-weight: 800;
  overflow-wrap: anywhere;
`;

export const FieldHint = styled.span`
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 700;
`;

export const FieldInput = styled.input`
  min-width: 0;
  height: var(--control-height);
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text);
  font-family: var(--mono);
  font-size: var(--font-sm);
  outline: none;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }
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