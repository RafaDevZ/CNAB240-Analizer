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

export const ToolGrid = styled.section`
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.label`
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 6px;
`;

export const FieldLabel = styled.span`
  grid-column: 1 / -1;
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const FieldHint = styled.span`
  grid-column: 1 / -1;
  color: var(--line-number);
  font-size: var(--font-xs);
  font-weight: 700;
`;

export const InlineSmallButton = styled.button`
  width: 44px;
  height: var(--control-height);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text);
  cursor: pointer;
  font-size: var(--font-sm);
  font-weight: 800;

  &:hover {
    border-color: var(--accent);
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
  }
`;

export const TextInput = styled.input`
  width: 100%;
  height: var(--control-height);
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text-strong);
  outline: none;
  font-family: var(--mono);
  font-size: var(--font-md);

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }

  &:disabled {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.035);
    color: var(--line-number);
    cursor: not-allowed;
  }
`;

export const CodeValue = styled.code`
  min-width: 0;
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-sm);
  overflow-wrap: anywhere;
  text-align: right;
`;

export const OutputRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const OutputCode = styled.code`
  min-height: var(--control-height);
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text-strong);
  font-family: var(--mono);
  font-size: var(--font-md);
  overflow: auto;
  white-space: nowrap;
`;

export const BarcodePreview = styled.div`
  margin-top: 12px;
  padding: 14px;
  display: flex;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #ffffff;
  overflow: auto;

  img {
    display: block;
    width: min(100%, 760px);
    height: 96px;
    object-fit: contain;
    image-rendering: pixelated;
  }
`;

export const CompareGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.32fr);
  gap: 12px;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageDropZone = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px dashed rgba(79, 193, 255, 0.42);
  border-radius: 8px;
  background: rgba(79, 193, 255, 0.06);
`;

export const UploadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const FileInput = styled.input`
  width: min(100%, 420px);
  min-height: var(--control-height);
  color: var(--text);
  font-size: var(--font-sm);

  &::file-selector-button {
    height: var(--control-height);
    margin-right: 10px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--input);
    color: var(--text);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  &::file-selector-button:hover {
    border-color: var(--accent);
    color: var(--text-strong);
  }
`;

export const TextAreaInput = styled.textarea`
  width: 100%;
  min-height: 82px;
  height: 92px;
  padding: 10px;
  resize: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text-strong);
  outline: none;
  font-family: var(--mono);
  font-size: var(--font-md);
  line-height: 1.45;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }
`;

export const CompareResult = styled.div<{ $empty?: boolean; $match?: boolean }>`
  height: 92px;
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid ${({ $empty, $match }) => ($empty ? "var(--border)" : $match ? "#22c55e" : "#ef4444")};
  border-radius: 8px;
  background: ${({ $empty, $match }) => ($empty ? "var(--input)" : $match ? "rgba(34, 197, 94, 0.14)" : "rgba(239, 68, 68, 0.14)")};
  color: ${({ $empty, $match }) => ($empty ? "var(--muted)" : $match ? "#bbf7d0" : "#fecaca")};
  font-size: var(--font-md);
  font-weight: 800;
  text-align: center;
`;

export const DifferenceList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;

export const CompareDivider = styled.div`
  height: 1px;
  margin: 14px 0;
  background: var(--border);
`;

export const DifferenceRow = styled.div`
  min-height: var(--row-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid rgba(239, 68, 68, 0.42);
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.08);
  color: var(--text);
  font-size: var(--font-md);
`;
