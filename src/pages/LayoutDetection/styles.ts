import styled from "styled-components";
export * from "../../styles";

export const ScoreBar = styled.div`
  height: 8px;
  border-radius: 999px;
  background: var(--input);
  overflow: hidden;
`;

export const ScoreFill = styled.div<{ $score: number }>`
  width: ${({ $score }) => Math.max(0, Math.min(100, $score))}%;
  height: 100%;
  background: var(--accent);
`;

export const CandidateRow = styled.div<{ $best?: boolean }>`
  min-height: var(--row-height);
  display: grid;
  grid-template-columns: 180px 90px minmax(160px, 1fr) 130px;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border: 1px solid ${({ $best }) => ($best ? "rgba(79, 193, 255, 0.74)" : "var(--border)")};
  border-radius: 8px;
  background: ${({ $best }) => ($best ? "rgba(79, 193, 255, 0.12)" : "var(--surface)")};
  color: var(--text);
  font-size: var(--font-sm);
  line-height: 1.35;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const CandidateBrand = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CandidateHeader = styled(CandidateRow)`
  background: var(--surface-muted);
  color: var(--muted);
  font-size: var(--font-xs);
  font-weight: 800;
  text-transform: uppercase;
`;

export const ReasonList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: var(--text);
  line-height: 1.5;
`;

export const MonoValue = styled.span`
  min-width: 0;
  text-align: center;
  font-family: var(--mono);
  overflow-wrap: anywhere;
`;

export const CandidateList = styled.div`
  display: grid;
  gap: 8px;
`;
