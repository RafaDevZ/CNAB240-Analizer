import { memo, useMemo } from "react";
import { CNAB_RECORD_BYTES, resolverLayout, resolverSegmento, textEncoder, useCnab, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

type FieldIssue = {
  linha: number;
  segmento: string;
  campo: Campo;
  valor: string;
  status: "ok" | "erro" | "aviso";
  detalhe: string;
};

function normalizarTipo(tipo?: string) {
  return (tipo ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tipoEhAlfanumerico(tipo: string) {
  return tipo === "x" || /(^|[^a-z])alfanumerico([^a-z]|$)/.test(tipo) || /(^|[^a-z])alfanumeric([^a-z]|$)/.test(tipo);
}

function tipoEhNumerico(tipo: string) {
  if (tipoEhAlfanumerico(tipo)) return false;
  return tipo === "n" || /(^|[^a-z])numerico([^a-z]|$)/.test(tipo) || /(^|[^a-z])numeric([^a-z]|$)/.test(tipo);
}

function tipoEhBranco(tipo: string) {
  return tipo.includes("branco") || tipo.includes("em branco");
}

function temCaractereControle(valor: string) {
  return [...valor].some((char) => {
    const code = char.charCodeAt(0);
    return code === 0x7f || code < 0x20;
  });
}

function validarCampo(linha: string, campo: Campo) {
  const valor = linha.slice(campo.inicio - 1, campo.fim);
  const tamanhoEsperado = campo.fim - campo.inicio + 1;
  const tamanhoBytes = textEncoder.encode(valor).length;
  const tipo = normalizarTipo(campo.tipo);
  const tipoNumerico = tipoEhNumerico(tipo);
  const tipoBranco = tipoEhBranco(tipo);
  const tipoAlfanumerico = tipoEhAlfanumerico(tipo);

  if (valor.length < tamanhoEsperado) {
    return { status: "erro" as const, detalhe: `Campo incompleto: ${valor.length}/${tamanhoEsperado} posições` };
  }

  if (tamanhoBytes !== tamanhoEsperado) {
    return { status: "aviso" as const, detalhe: `Campo possui caractere multibyte: ${tamanhoBytes}/${tamanhoEsperado} bytes` };
  }

  if (tipoBranco && !/^ *$/.test(valor)) {
    return { status: "aviso" as const, detalhe: "Campo previsto como branco está preenchido" };
  }

  if (tipoNumerico && valor.trim() && !/^[0-9]+$/.test(valor.trim())) {
    return { status: "aviso" as const, detalhe: "Campo numérico possui caractere não numérico" };
  }

  if (tipoAlfanumerico && temCaractereControle(valor)) {
    return { status: "aviso" as const, detalhe: "Campo alfanumérico possui caractere de controle" };
  }

  return { status: "ok" as const, detalhe: "ok" };
}

const FieldValidationPage = memo(function FieldValidationPage() {
  const { banco, linhas, resumoArquivo } = useCnab();

  const resultados = useMemo<FieldIssue[]>(() => {
    return linhas.flatMap((linha, linhaIndex) => {
      const layout = resolverLayout(linha, banco) ?? [];
      const segmento = resolverSegmento(linha, banco);

      if (layout.length === 0) {
        return [{
          linha: linhaIndex + 1,
          segmento,
          campo: { inicio: 1, fim: Math.max(1, linha.length), label: "Layout", bgColor: "", textColor: "" },
          valor: "-",
          status: "aviso" as const,
          detalhe: "Linha sem layout reconhecido",
        }];
      }

      return layout.map((campo) => {
        const validacao = validarCampo(linha, campo);

        return {
          linha: linhaIndex + 1,
          segmento,
          campo,
          valor: linha.slice(campo.inicio - 1, campo.fim),
          status: validacao.status,
          detalhe: validacao.detalhe,
        };
      });
    });
  }, [banco, linhas]);

  const erros = resultados.filter((item) => item.status === "erro");
  const avisos = resultados.filter((item) => item.status === "aviso");
  const validos = resultados.filter((item) => item.status === "ok");
  const exibidos = resultados.filter((item) => item.status !== "ok");

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Validador de campos</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ValidationStatus $tone={erros.length > 0 ? "error" : avisos.length > 0 ? "warning" : "ok"}>
          {erros.length > 0 ? `${erros.length} erros` : avisos.length > 0 ? `${avisos.length} avisos` : "ok"}
        </S.ValidationStatus>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para validar os campos.</S.EmptyOutput>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Registros</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{linhas.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Campos válidos</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{validos.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Erros</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{erros.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Avisos</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{avisos.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Tamanho esperado</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{CNAB_RECORD_BYTES}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          {exibidos.length === 0 ? (
            <S.EmptyState>Nenhuma inconsistência encontrada nos campos reconhecidos.</S.EmptyState>
          ) : (
            <S.TableSection>
              <S.FieldTable>
                <S.FieldHeaderRow>
                  <S.PlainText>Linha</S.PlainText>
                  <S.PlainText>Status</S.PlainText>
                  <S.PlainText>Segmento</S.PlainText>
                  <S.PlainText>Campo</S.PlainText>
                  <S.PlainText>Posição</S.PlainText>
                  <S.PlainText>Valor</S.PlainText>
                  <S.PlainText>Detalhe</S.PlainText>
                </S.FieldHeaderRow>
                {exibidos.map((item, index) => (
                  <S.FieldRow key={`${item.linha}-${item.campo.label}-${index}`}>
                    <S.MonoValue>{item.linha}</S.MonoValue>
                    <S.StatusBadge $status={item.status}>{item.status}</S.StatusBadge>
                    <S.PlainText>{item.segmento}</S.PlainText>
                    <S.PlainText>{item.campo.label}</S.PlainText>
                    <S.MonoValue>{item.campo.inicio}-{item.campo.fim}</S.MonoValue>
                    <S.FieldValue>{item.valor || "-"}</S.FieldValue>
                    <S.PlainText>{item.detalhe}</S.PlainText>
                  </S.FieldRow>
                ))}
              </S.FieldTable>
            </S.TableSection>
          )}
        </>
      )}
    </S.PageShell>
  );
});

export default FieldValidationPage;
