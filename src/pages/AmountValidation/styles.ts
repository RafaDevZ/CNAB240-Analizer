import styled from "styled-components";
export * from "../../styles";
export const TableSection = styled.section`min-height:0;padding:14px;border:1px solid var(--border);border-radius:8px;background:var(--surface);overflow:auto;`;
export const DataTable = styled.div`display:grid;gap:8px;min-width:1080px;`;
export const DataRow = styled.div`min-height:var(--row-height);display:grid;grid-template-columns:70px 100px 170px 220px 110px 160px minmax(160px,1fr);gap:10px;align-items:center;padding:9px 10px;border:1px solid var(--border);border-radius:6px;background:rgba(255,255,255,.02);color:var(--text);font-size:var(--font-sm);&>*{min-width:0;}`;
export const HeaderRow = styled(DataRow)`background:var(--surface-muted);color:var(--muted);font-size:var(--font-xs);font-weight:800;text-transform:uppercase;`;
export const StatusBadge = styled.span<{ $status:"ok"|"erro"|"aviso" }>`display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:0 8px;border:1px solid ${({$status})=>$status==="erro"?"#ef4444":$status==="aviso"?"#f59e0b":"#22c55e"};border-radius:999px;background:${({$status})=>$status==="erro"?"rgba(239,68,68,.14)":$status==="aviso"?"rgba(245,158,11,.14)":"rgba(34,197,94,.14)"};color:${({$status})=>$status==="erro"?"#fecaca":$status==="aviso"?"#fde68a":"#bbf7d0"};font-size:var(--font-xs);font-weight:800;`;
export const MonoValue = styled.span`min-width:0;font-family:var(--mono);overflow-wrap:anywhere;`;
export const FieldValue = styled(MonoValue)`color:var(--text-strong);`;