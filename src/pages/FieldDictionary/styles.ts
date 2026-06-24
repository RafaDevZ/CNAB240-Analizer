import styled from "styled-components";
export * from "../../styles";
export const HeaderActions = styled.div`display:flex;align-items:center;justify-content:flex-end;gap:10px;@media(max-width:760px){align-items:stretch;flex-direction:column;}`;
export const SearchInput = styled.input`height:var(--control-height);min-width:220px;padding:0 10px;border:1px solid var(--border);border-radius:6px;background:var(--input);color:var(--text);outline:none;&:focus{border-color:var(--accent);box-shadow:0 0 0 2px var(--focus);}`;
export const TableSection = styled.section`min-height:0;padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--surface);overflow:auto;`;
export const DataTable = styled.div`display:grid;gap:8px;min-width:980px;`;
export const DataRow = styled.div`min-height:var(--row-height);display:grid;grid-template-columns:150px 240px 110px 150px minmax(260px,1fr);gap:10px;align-items:center;padding:9px 10px;border:1px solid var(--border);border-radius:6px;background:rgba(255,255,255,.02);color:var(--text);font-size:var(--font-sm);&>*{min-width:0;}`;
export const HeaderRow = styled(DataRow)`background:var(--surface-muted);color:var(--muted);font-size:var(--font-xs);font-weight:800;text-transform:uppercase;`;
export const MonoValue = styled.span`min-width:0;font-family:var(--mono);overflow-wrap:anywhere;`;