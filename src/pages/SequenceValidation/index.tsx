import { memo, useMemo } from "react";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type CheckStatus = "ok" | "erro" | "aviso";

type CheckResult = {
  status: CheckStatus;
  item: string;
  esperado: string;
  encontrado: string;
  detalhe: string;
};

function parseNumber(value: string) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

const SequenceValidationPage = memo(function SequenceValidationPage() {
  const { linhas, resumoArquivo } = useCnab();

  const checks = useMemo<CheckResult[]>(() => {
    if (linhas.length === 0) return [];

    const results: CheckResult[] = [];
    const fileHeaderIndex = linhas.findIndex((linha) => linha[7] === "0");
    const fileTrailerIndex = linhas.findIndex((linha) => linha[7] === "9");
    const batchHeaderIndexes = linhas.map((linha, index) => linha[7] === "1" ? index : -1).filter((index) => index >= 0);
    const batchTrailerIndexes = linhas.map((linha, index) => linha[7] === "5" ? index : -1).filter((index) => index >= 0);
    const details = linhas.map((linha, index) => ({ linha, index })).filter((item) => item.linha[7] === "3");

    results.push({
      status: fileHeaderIndex === 0 ? "ok" : "erro",
      item: "Header de arquivo",
      esperado: "Linha 1",
      encontrado: fileHeaderIndex >= 0 ? `Linha ${fileHeaderIndex + 1}` : "Ausente",
      detalhe: "Registro tipo 0 deve abrir o arquivo.",
    });

    results.push({
      status: fileTrailerIndex === linhas.length - 1 ? "ok" : "erro",
      item: "Trailer de arquivo",
      esperado: `Linha ${linhas.length}`,
      encontrado: fileTrailerIndex >= 0 ? `Linha ${fileTrailerIndex + 1}` : "Ausente",
      detalhe: "Registro tipo 9 deve fechar o arquivo.",
    });

    results.push({
      status: batchHeaderIndexes.length === batchTrailerIndexes.length ? "ok" : "erro",
      item: "Headers e trailers de lote",
      esperado: `${batchHeaderIndexes.length} trailers`,
      encontrado: `${batchTrailerIndexes.length} trailers`,
      detalhe: "Cada header de lote deve possuir um trailer de lote correspondente.",
    });

    const sequenceProblems = details.filter((item, detailIndex) => {
      const sequence = parseNumber(item.linha.slice(8, 13));
      return sequence !== null && sequence !== detailIndex + 1;
    });

    results.push({
      status: sequenceProblems.length === 0 ? "ok" : "aviso",
      item: "Sequencial dos detalhes",
      esperado: "Crescente a partir de 1",
      encontrado: sequenceProblems.length === 0 ? "Sem divergências" : `${sequenceProblems.length} divergências`,
      detalhe: "Usa posições 9-13 dos registros tipo 3 quando preenchidas numericamente.",
    });

    const fileTrailer = fileTrailerIndex >= 0 ? linhas[fileTrailerIndex] : "";
    const declaredBatches = fileTrailer ? parseNumber(fileTrailer.slice(17, 23)) : null;
    const declaredRecords = fileTrailer ? parseNumber(fileTrailer.slice(23, 29)) : null;

    results.push({
      status: declaredBatches === null || declaredBatches === batchHeaderIndexes.length ? "ok" : "erro",
      item: "Quantidade de lotes",
      esperado: String(batchHeaderIndexes.length),
      encontrado: declaredBatches === null ? "Não identificado" : String(declaredBatches),
      detalhe: "Compara o trailer de arquivo com a quantidade de headers de lote.",
    });

    results.push({
      status: declaredRecords === null || declaredRecords === linhas.length ? "ok" : "erro",
      item: "Quantidade de registros",
      esperado: String(linhas.length),
      encontrado: declaredRecords === null ? "Não identificado" : String(declaredRecords),
      detalhe: "Compara o trailer de arquivo com o total de linhas do arquivo.",
    });

    batchTrailerIndexes.forEach((trailerIndex, batchIndex) => {
      const headerIndex = batchHeaderIndexes[batchIndex] ?? -1;
      const declaredLotRecords = parseNumber(linhas[trailerIndex].slice(17, 23));
      const expectedLotRecords = headerIndex >= 0 ? trailerIndex - headerIndex + 1 : null;

      results.push({
        status: expectedLotRecords === null || declaredLotRecords === null || declaredLotRecords === expectedLotRecords ? "ok" : "erro",
        item: `Registros do lote ${batchIndex + 1}`,
        esperado: expectedLotRecords === null ? "Não identificado" : String(expectedLotRecords),
        encontrado: declaredLotRecords === null ? "Não identificado" : String(declaredLotRecords),
        detalhe: "Compara o trailer de lote com o intervalo entre header e trailer do lote.",
      });
    });

    return results;
  }, [linhas]);

  const erros = checks.filter((item) => item.status === "erro").length;
  const avisos = checks.filter((item) => item.status === "aviso").length;

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Validador de sequência</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ValidationStatus $tone={erros > 0 ? "error" : avisos > 0 ? "warning" : "ok"}>
          {erros > 0 ? `${erros} erros` : avisos > 0 ? `${avisos} avisos` : "ok"}
        </S.ValidationStatus>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para validar sequência e totais.</S.EmptyOutput>
      ) : (
        <S.TableSection>
          <S.CheckTable>
            <S.CheckHeaderRow>
              <S.PlainText>Status</S.PlainText>
              <S.PlainText>Item</S.PlainText>
              <S.PlainText>Esperado</S.PlainText>
              <S.PlainText>Encontrado</S.PlainText>
              <S.PlainText>Detalhe</S.PlainText>
            </S.CheckHeaderRow>
            {checks.map((check) => (
              <S.CheckRow key={`${check.item}-${check.esperado}`}>
                <S.StatusBadge $status={check.status}>{check.status}</S.StatusBadge>
                <S.PlainText>{check.item}</S.PlainText>
                <S.MonoValue>{check.esperado}</S.MonoValue>
                <S.MonoValue>{check.encontrado}</S.MonoValue>
                <S.PlainText>{check.detalhe}</S.PlainText>
              </S.CheckRow>
            ))}
          </S.CheckTable>
        </S.TableSection>
      )}
    </S.PageShell>
  );
});

export default SequenceValidationPage;