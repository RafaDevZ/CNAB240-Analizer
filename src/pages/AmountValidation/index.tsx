import { memo, useMemo } from "react";
import { resolverLayout, resolverSegmento, useCnab, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

type AmountStatus = "ok" | "erro" | "aviso";

type AmountRow = {
  linha: number;
  segmento: string;
  campo: string;
  pos: string;
  raw: string;
  amount: number;
  status: AmountStatus;
};

function money(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function fmt(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizar(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function isAmountField(campo: Campo) {
  const label = normalizar(campo.label);
  const descricao = normalizar(campo.descricao ?? "");
  const text = `${label} ${descricao}`;

  if (/^(COD|CODIGO|DATA|TIPO)_/.test(label) || /_(COD|CODIGO|DATA|TIPO)$/.test(label)) return false;
  if (/\b(CODIGO|DATA|TIPO)\b/.test(text) && !/\bVALOR\b/.test(text)) return false;

  return (
    label.includes("VALOR") ||
    label.includes("ABATIMENTO") ||
    label.includes("IOF") ||
    label === "MULTA" ||
    label.includes("VALOR_MULTA") ||
    label.includes("JUROS_UM_DIA") ||
    label.includes("VALOR_JUROS") ||
    label.includes("VALOR_DESCONTO")
  );
}

function isDetailTitleAmount(row: AmountRow) {
  return normalizar(row.campo) === "VALOR_TITULO";
}

function isTrailerTotalAmount(row: AmountRow) {
  const campo = normalizar(row.campo);
  const segmento = normalizar(row.segmento);

  return segmento.includes("TRAILER") && (
    campo.includes("COBRANCA_SIMPLES") ||
    campo.includes("TITULOS_SIMPLES") ||
    campo.includes("TOTAL_TITULOS_SIMPLES")
  );
}

const AmountValidationPage = memo(function AmountValidationPage() {
  const { banco, linhas, resumoArquivo } = useCnab();

  const rows = useMemo(() => {
    return linhas.flatMap((linha, index) => {
      return (resolverLayout(linha, banco) ?? [])
        .filter(isAmountField)
        .map((campo) => {
          const raw = linha.slice(campo.inicio - 1, campo.fim);
          const invalid = raw.trim() !== "" && !/^[0-9 ]+$/.test(raw);
          const amount = money(raw);

          return {
            linha: index + 1,
            segmento: resolverSegmento(linha, banco),
            campo: campo.label,
            pos: `${campo.inicio}-${campo.fim}`,
            raw,
            amount,
            status: (invalid ? "erro" : "ok") as AmountStatus,
          };
        });
    });
  }, [banco, linhas]);

  const titleRows = rows.filter(isDetailTitleAmount);
  const trailerRows = rows.filter(isTrailerTotalAmount);
  const totalRows = titleRows.length > 0 ? titleRows : trailerRows;
  const total = totalRows.reduce((sum, row) => sum + row.amount, 0);
  const erros = rows.filter((row) => row.status === "erro").length;
  const zeros = rows.filter((row) => row.amount === 0).length;

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Validador de valores</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.SummaryCount>{rows.length} valores</S.SummaryCount>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB para analisar valores.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Total interpretado</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{fmt(total)}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Campos zerados</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{zeros}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Inválidos</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{erros}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.TableSection>
            <S.DataTable>
              <S.HeaderRow>
                <S.PlainText>Linha</S.PlainText>
                <S.PlainText>Status</S.PlainText>
                <S.PlainText>Segmento</S.PlainText>
                <S.PlainText>Campo</S.PlainText>
                <S.PlainText>Posição</S.PlainText>
                <S.PlainText>Bruto</S.PlainText>
                <S.PlainText>Valor</S.PlainText>
              </S.HeaderRow>
              {rows.map((row, index) => (
                <S.DataRow key={`${row.linha}-${row.campo}-${index}`}>
                  <S.MonoValue>{row.linha}</S.MonoValue>
                  <S.StatusBadge $status={row.status}>{row.status}</S.StatusBadge>
                  <S.PlainText>{row.segmento}</S.PlainText>
                  <S.PlainText>{row.campo}</S.PlainText>
                  <S.MonoValue>{row.pos}</S.MonoValue>
                  <S.MonoValue>{row.raw || "-"}</S.MonoValue>
                  <S.FieldValue>{fmt(row.amount)}</S.FieldValue>
                </S.DataRow>
              ))}
            </S.DataTable>
          </S.TableSection>
        </>
      )}
    </S.PageShell>
  );
});

export default AmountValidationPage;
