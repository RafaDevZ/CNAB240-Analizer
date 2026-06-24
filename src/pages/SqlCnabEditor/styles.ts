import styled from "styled-components";
export * from "../../styles";

export const SqlViewerWorkspace = styled.main`
  width: min(100%, 1520px);
  min-height: 0;
  height: 100%;
  margin: 0 auto;
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  grid-template-areas: "viewer details";
  gap: 14px;
  overflow: hidden;

  @media (max-width: 980px) {
    overflow: auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "details"
      "viewer";
  }

  @media (max-width: 680px) {
    padding: 10px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

export const DetailsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
`;

export const ToolbarGroup = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SqlCnabCode = styled.code`
  padding: 0 14px;
  font: inherit;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
`;

export const SqlCnabField = styled.span<{ $active?: boolean; $bgColor: string; $textColor: string }>`
  border-radius: 2px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  cursor: pointer;
  font-weight: 700;
  white-space: pre;
  outline: 1px solid ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.48)" : "rgba(255, 255, 255, 0.1)")};
  transition: filter 120ms ease, outline-color 120ms ease;

  &:hover,
  &:focus-visible {
    filter: brightness(1.2);
    outline-color: rgba(255, 255, 255, 0.45);
  }
`;

export const DetailsForm = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 14px;
`;

export const FieldEditor = styled.label`
  min-width: 0;
  display: grid;
  gap: 5px;
`;

export const FieldLabel = styled.span`
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const FieldInput = styled.input`
  width: 100%;
  height: var(--control-height);
  min-width: 0;
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

export const FieldTextarea = styled.textarea`
  width: 100%;
  min-height: 92px;
  min-width: 0;
  padding: 9px 10px;
  resize: vertical;
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

export const ToggleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const ToggleField = styled.label`
  min-height: var(--control-height);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-size: var(--font-sm);
  font-weight: 700;
`;

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

export const MetaItem = styled.div`
  min-width: 0;
  padding: 9px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
`;

export const MetaLabel = styled.div`
  margin-bottom: 3px;
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const MetaValue = styled.div`
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-sm);
  overflow-wrap: anywhere;
`;

export const SearchInput = styled.input`
  min-width: 220px;
  height: var(--control-height);
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text);
  outline: none;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }
`;
