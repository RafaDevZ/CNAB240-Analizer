import { memo } from "react";
import { bancos, getBankBrand, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

const LayoutDetectionPage = memo(function LayoutDetectionPage() {
  const { banco, layoutDetection: detection, linhas, resumoArquivo, setBanco } = useCnab();

  const best = detection.candidates[0];

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Detecção automática</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ActionButton
          type="button"
          disabled={!best || best.score === 0 || best.banco === banco}
          onClick={() => best && setBanco(best.banco)}
        >
          Aplicar sugestão
        </S.ActionButton>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para detectar o layout.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Layout atual</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{bancos.find((item) => item.value === banco)?.label ?? banco}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Sugestão</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{best?.label ?? "-"}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Código do banco</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{detection.codigoBanco}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Tipo do arquivo</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{detection.tipoArquivo}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Candidatos</S.SummarySectionTitle>
            <S.CandidateList>
              <S.CandidateHeader>
                <S.PlainText>Layout</S.PlainText>
                <S.PlainText>Pontuação</S.PlainText>
                <S.PlainText>Evidências</S.PlainText>
                <S.PlainText>Confiança</S.PlainText>
              </S.CandidateHeader>
              {detection.candidates.map((candidate, index) => {
                const brand = getBankBrand(candidate.banco);

                return (
                  <S.CandidateRow key={candidate.banco} $best={index === 0}>
                    <S.CandidateBrand>
                      {brand && (
                        <S.BankLogo
                          src={brand.logoUrl}
                          alt={`Logo ${brand.nome}`}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <S.PlainText>{candidate.label}</S.PlainText>
                    </S.CandidateBrand>
                    <S.MonoValue>{candidate.score}%</S.MonoValue>
                    <S.ReasonList>
                      {candidate.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </S.ReasonList>
                    <S.ScoreBar>
                      <S.ScoreFill $score={candidate.score} />
                    </S.ScoreBar>
                  </S.CandidateRow>
                );
              })}
            </S.CandidateList>
          </S.SummaryWideSection>
        </>
      )}
    </S.PageShell>
  );
});

export default LayoutDetectionPage;
