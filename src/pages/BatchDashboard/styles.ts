import styled from "styled-components";
export * from "../../styles";
export const TableSection=styled.section`min-height:0;padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--surface);overflow:auto;`;
export const DataTable=styled.div`display:grid;gap:8px;min-width:820px;`;
export const DataRow=styled.div`min-height:var(--row-height);display:grid;grid-template-columns:110px 90px 90px 110px 110px minmax(260px,1fr);gap:10px;align-items:center;padding:9px 10px;border:1px solid var(--border);border-radius:6px;background:rgba(255,255,255,.02);color:var(--text);font-size:var(--font-sm);&>*{min-width:0;}`;
export const HeaderRow=styled(DataRow)`background:var(--surface-muted);color:var(--muted);font-size:var(--font-xs);font-weight:800;text-transform:uppercase;`;
export const MonoValue=styled.span`font-family:var(--mono);overflow-wrap:anywhere;`;
export const StatusBadge=styled.span<{ $ok:boolean }>`display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 8px;border:1px solid ${({$ok})=>$ok?"#22c55e":"#ef4444"};border-radius:999px;background:${({$ok})=>$ok?"rgba(34,197,94,.14)":"rgba(239,68,68,.14)"};color:${({$ok})=>$ok?"#bbf7d0":"#fecaca"};font-size:var(--font-xs);font-weight:800;`;