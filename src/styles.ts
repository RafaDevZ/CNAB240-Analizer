import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { motion } from "framer-motion";

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap");

  :root {
    --bg: #15171e;
    --titlebar: #181b22;
    --surface: #1e222b;
    --surface-muted: #252a34;
    --surface-raised: #2a303b;
    --editor: #171a21;
    --input: #151922;
    --border: #323946;
    --text: #d4d4d4;
    --text-strong: #f3f4f6;
    --muted: #8f9bad;
    --line-number: #6b7280;
    --accent: #4fc1ff;
    --accent-dark: #007acc;
    --focus: rgba(79, 193, 255, 0.22);
    --mono: Consolas, "Courier New", monospace;
    font-family: "Montserrat", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--text);
    background: var(--bg);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  html {
    min-width: 320px;
    min-height: 100%;
    background: var(--bg);
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background: var(--bg);
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  #root {
    min-height: 100vh;
  }

  ::selection {
    background: rgba(79, 193, 255, 0.32);
  }

  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #11141a;
  }

  ::-webkit-scrollbar-thumb {
    border: 3px solid #11141a;
    border-radius: 999px;
    background: #4b5563;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`;

export const AppShell = styled.div`
  height: 100vh;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(0, 122, 204, 0.06), transparent 280px),
    var(--bg);
  color: var(--text);
`;

export const Titlebar = styled.header`
  min-height: 72px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border);
  background: var(--titlebar);

  @media (max-width: 980px) {
    grid-template-columns: auto 1fr;
  }

  @media (max-width: 680px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const WindowControls = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 680px) {
    display: none;
  }
`;

export const WindowControlDot = styled.span<{ $tone: "red" | "yellow" | "green" }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $tone }) =>
    $tone === "red" ? "#f87171" : $tone === "yellow" ? "#fbbf24" : "#34d399"};
`;

export const TitlebarCopy = styled.div`
  min-width: 0;
`;

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 2px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: var(--text-strong);
  font-size: 19px;
  font-weight: 650;
  line-height: 1.25;
`;

export const TitlebarStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;

  @media (max-width: 980px) {
    display: none;
  }
`;

export const Pill = styled.span<{ $invalid?: boolean; $valid?: boolean }>`
  padding: 4px 8px;
  border: 1px solid ${({ $invalid, $valid }) => {
    if ($invalid) return "#ef4444";
    if ($valid) return "#22c55e";
    return "var(--border)";
  }};
  border-radius: 999px;
  background: ${({ $invalid, $valid }) => {
    if ($invalid) return "rgba(239, 68, 68, 0.16)";
    if ($valid) return "rgba(34, 197, 94, 0.16)";
    return "var(--surface-raised)";
  }};
  color: ${({ $invalid, $valid }) => {
    if ($invalid) return "#fecaca";
    if ($valid) return "#bbf7d0";
    return "inherit";
  }};
`;

export const Workspace = styled.main`
  width: min(100%, 1520px);
  min-height: 0;
  margin: 0 auto;
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  grid-template-rows: auto minmax(0, 1fr);
  grid-template-areas:
    "editor details"
    "viewer details";
  gap: 14px;

  @media (max-width: 980px) {
    overflow: auto;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto minmax(320px, 1fr);
    grid-template-areas:
      "editor"
      "details"
      "viewer";
  }

  @media (max-width: 680px) {
    padding: 10px;
  }
`;

const PanelBase = styled.section`
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);
`;

export const EditorPanel = styled(PanelBase)`
  grid-area: editor;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 76px;
  align-items: stretch;
  border-bottom: 1px solid var(--border);
  background: var(--surface-muted);

  @media (max-width: 680px) {
    grid-template-columns: minmax(0, 1fr) 64px;
  }
`;

export const ToolbarMain = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ControlGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
    gap: 6px;
  }
`;

export const Select = styled.select`
  min-width: 190px;
  height: 34px;
  padding: 0 34px 0 10px;
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

  @media (max-width: 680px) {
    width: 100%;
  }
`;

export const Metrics = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  color: var(--muted);
  font-size: 12px;
  white-space: nowrap;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const ActionButton = styled.button`
  height: 30px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--input);
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  &:hover {
    border-color: var(--accent);
    color: var(--text-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
  }
`;

export const CnabInputShell = styled.div`
  --cnab-input-line-height: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 76px;
  background: var(--input);
  overflow: hidden;

  @media (max-width: 680px) {
    grid-template-columns: minmax(0, 1fr) 64px;
  }
`;

export const CnabInputEditor = styled.div`
  position: relative;
  min-width: 0;
`;

const InputLayerBase = styled.pre`
  width: 100%;
  min-height: 168px;
  margin: 0;
  padding: 14px;
  border: 0;
  border-bottom: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 13px;
  line-height: var(--cnab-input-line-height);
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
  tab-size: 2;
`;

export const CnabInputOverlay = styled(InputLayerBase)`
  position: absolute;
  inset: 0;
  overflow: hidden;
  color: var(--text);
  pointer-events: none;
`;

export const CnabInput = styled.textarea`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 168px;
  display: block;
  margin: 0;
  padding: 14px;
  resize: none;
  border: 0;
  border-bottom: 1px solid var(--border);
  border-radius: 0;
  background: transparent;
  color: transparent;
  caret-color: var(--text-strong);
  outline: none;
  font-family: var(--mono);
  font-size: 13px;
  line-height: var(--cnab-input-line-height);
  white-space: pre;
  overflow-wrap: normal;
  word-break: normal;
  tab-size: 2;

  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--focus);
  }

  &::placeholder {
    color: var(--muted);
    -webkit-text-fill-color: var(--muted);
  }
`;

export const CnabInputHighlight = styled.span<{ $bgColor: string; $textColor: string }>`
  border-radius: 2px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  font-weight: 400;
  outline: 1px solid rgba(255, 255, 255, 0.18);
`;

export const InvalidInputLine = styled.span`
  display: inline-block;
  min-width: 100%;
  background: rgba(239, 68, 68, 0.2);
  box-shadow: inset 3px 0 0 #ef4444;
`;

export const OverflowInputText = styled.span`
  border-radius: 2px;
  background: #ef233c;
  color: #ffffff;
  font-weight: 400;
`;

export const SpaceDot = styled.span`
  color: rgba(156, 163, 175, 0.3);
`;

export const LineBreakColumn = styled.div`
  min-height: 168px;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border);
  background: #11141a;
  overflow: hidden;
  pointer-events: none;
`;

export const LineBreakHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--border);
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
`;

export const LineBreakRows = styled.div`
  position: relative;
  height: 100%;
  padding-top: 14px;
  overflow: hidden;
`;

export const LineBreakMarkerTrack = styled.div<{ $scrollTop: number }>`
  position: relative;
  transform: translateY(-${({ $scrollTop }) => $scrollTop}px);
`;

export const LineBreakMarkerRow = styled.div`
  display: flex;
  height: var(--cnab-input-line-height);
  align-items: center;
  justify-content: center;
`;

export const LineBreakBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid rgba(79, 193, 255, 0.42);
  border-radius: 4px;
  background: rgba(79, 193, 255, 0.1);
  color: #7dd3fc;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.2;
  vertical-align: 1px;
`;

export const LineBreakEmpty = styled.span`
  color: var(--muted);
  font-family: var(--mono);
  font-size: 12px;
`;

export const ValidationSummary = styled.div`
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: #171a21;
`;

export const ValidationItem = styled.div<{ $tone: "error" | "warning" | "info" }>`
  padding: 7px 9px;
  border: 1px solid ${({ $tone }) => {
    if ($tone === "error") return "#ef4444";
    if ($tone === "warning") return "#f59e0b";
    return "#38bdf8";
  }};
  border-radius: 6px;
  background: ${({ $tone }) => {
    if ($tone === "error") return "rgba(239, 68, 68, 0.14)";
    if ($tone === "warning") return "rgba(245, 158, 11, 0.14)";
    return "rgba(56, 189, 248, 0.12)";
  }};
  color: ${({ $tone }) => {
    if ($tone === "error") return "#fecaca";
    if ($tone === "warning") return "#fde68a";
    return "#bae6fd";
  }};
  font-size: 12px;
  line-height: 1.4;
`;

export const TooltipBox = styled(motion.div)`
  max-width: 360px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #202530;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.34);
  color: var(--text);
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.45;
  transform-origin: top center;
`;

export const TooltipTitle = styled.div`
  margin-bottom: 8px;
  color: var(--text-strong);
  font-weight: 800;
`;

export const TooltipGrid = styled.div`
  display: grid;
  gap: 6px;
`;

export const TooltipRow = styled.div`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 8px;
`;

export const TooltipTerm = styled.span`
  color: var(--muted);
  font-weight: 700;
`;

export const TooltipValue = styled.span`
  min-width: 0;
  color: var(--text);
  overflow-wrap: anywhere;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  color: var(--muted);
  font-size: 12px;
  background: var(--surface-muted);
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-raised);
`;

export const LegendShortcut = styled.strong`
  color: var(--text-strong);
`;

export const DetailsPanel = styled.aside`
  grid-area: details;
  align-self: stretch;
  padding: 14px;
  position: sticky;
  top: 14px;
  max-height: calc(100vh - 112px);
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);

  @media (max-width: 980px) {
    position: static;
    max-height: none;
  }
`;

export const PanelTitle = styled.div`
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const EmptyDetailsText = styled.p`
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
`;

export const SegmentLabel = styled.div`
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--accent);
  background: rgba(79, 193, 255, 0.08);
  font-size: 12px;
  font-weight: 700;
`;

export const FieldChip = styled.div<{ $borderColor: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 16px;
  padding: 10px;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 6px;
  color: var(--text-strong);
  background: var(--surface-raised);
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 700;
  word-break: break-word;
`;

export const FieldColorSwatch = styled.span<{ $bgColor: string }>`
  width: 12px;
  height: 28px;
  flex: 0 0 auto;
  border-radius: 4px;
  background-color: ${({ $bgColor }) => $bgColor};
`;

export const FieldDetails = styled.dl`
  display: grid;
  gap: 12px;
  margin: 0;
`;

export const FieldDetail = styled.div`
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
`;

export const FieldTerm = styled.dt`
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const FieldDescription = styled.dd`
  margin: 0;
  color: var(--text);
  font-size: 13px;
  line-height: 1.45;
`;

export const ViewerPanel = styled(PanelBase)`
  grid-area: viewer;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-muted);
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;

  @media (max-width: 680px) {
    flex-direction: column;
    font-size: 11px;
  }
`;

export const FileInfo = styled.div`
  min-width: 0;
  display: grid;
  gap: 5px;
`;

export const HashText = styled.span`
  color: var(--text);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
  overflow-wrap: anywhere;
  text-transform: none;
`;

export const CnabOutput = styled.div`
  min-height: 0;
  flex: 1;
  overflow: auto;
  background: var(--editor);
`;

export const VirtualCnabScroller = styled.div<{ $height: number }>`
  position: relative;
  min-width: max-content;
  height: ${({ $height }) => $height}px;
`;

export const EmptyOutput = styled.div`
  display: grid;
  min-height: 280px;
  place-items: center;
  padding: 24px;
  color: var(--muted);
  font-size: 13px;
`;

export const CnabLine = styled.div<{ $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: 0;
  display: grid;
  grid-template-columns: 58px max-content;
  min-width: max-content;
  height: 22px;
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  line-height: 22px;

  &:hover {
    background: rgba(255, 255, 255, 0.045);
  }
`;

export const LineNumber = styled.span`
  padding: 0 12px;
  border-right: 1px solid var(--border);
  color: var(--line-number);
  text-align: right;
  user-select: none;
`;

export const CnabCode = styled.code`
  padding: 0 14px;
  white-space: pre;
  font: inherit;
`;

export const PlainText = styled.span``;

export const CnabField = styled.span<{ $bgColor: string; $textColor: string }>`
  border-radius: 2px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  cursor: pointer;
  font-weight: 700;
  outline: 1px solid rgba(255, 255, 255, 0.1);
  transition: filter 120ms ease, outline-color 120ms ease;

  &:hover {
    filter: brightness(1.2);
    outline-color: rgba(255, 255, 255, 0.45);
  }
`;

export const Statusbar = styled.div`
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  border-top: 1px solid var(--border);
  background: var(--titlebar);
  color: var(--muted);
  font-size: 12px;

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;
    font-size: 11px;
  }
`;
