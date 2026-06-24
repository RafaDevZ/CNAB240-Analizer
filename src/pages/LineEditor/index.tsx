import { memo, useEffect, useMemo, useState } from "react";
import { CNAB_RECORD_BYTES, resolverLayout, resolverSegmento, useCnab, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

function normalizarTipo(tipo?: string) {
  return (tipo ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ajustarValor(campo: Campo, valor: string) {
  const tamanho = campo.fim - campo.inicio + 1;
  const tipo = normalizarTipo(campo.tipo);
  const cortado = valor.slice(0, tamanho);

  if (tipo.includes("numeric") || tipo === "n") {
    return cortado.replace(/\D/g, "").padStart(tamanho, "0").slice(-tamanho);
  }

  if (tipo.includes("branco")) {
    return " ".repeat(tamanho);
  }

  return cortado.padEnd(tamanho, " ");
}

function montarLinha(base: string, campos: Campo[], valores: Record<string, string>) {
  const chars = base.padEnd(CNAB_RECORD_BYTES, " ").slice(0, CNAB_RECORD_BYTES).split("");

  campos.forEach((campo) => {
    const chave = `${campo.inicio}-${campo.fim}-${campo.label}`;
    const valor = ajustarValor(campo, valores[chave] ?? "");

    for (let index = 0; index < valor.length; index += 1) {
      chars[campo.inicio - 1 + index] = valor[index];
    }
  });

  return chars.join("");
}

const LineEditorPage = memo(function LineEditorPage() {
  const { banco, linhas, resumoArquivo, atualizarTexto } = useCnab();
  const [linhaSelecionada, setLinhaSelecionada] = useState(0);
  const linha = linhas[linhaSelecionada] ?? "";
  const segmento = linha ? resolverSegmento(linha, banco) : "-";

  const campos = useMemo(() => {
    if (!linha) return [];
    return resolverLayout(linha, banco) ?? [];
  }, [banco, linha]);

  const [valores, setValores] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextValues = Object.fromEntries(
      campos.map((campo) => {
        const chave = `${campo.inicio}-${campo.fim}-${campo.label}`;
        return [chave, linha.slice(campo.inicio - 1, campo.fim)];
      })
    );

    setValores(nextValues);
  }, [campos, linha]);

  const linhaPreview = useMemo(() => montarLinha(linha, campos, valores), [campos, linha, valores]);
  const mudou = linhaPreview !== linha.padEnd(CNAB_RECORD_BYTES, " ").slice(0, CNAB_RECORD_BYTES);

  const aplicar = () => {
    const novasLinhas = [...linhas];
    novasLinhas[linhaSelecionada] = linhaPreview;
    atualizarTexto(novasLinhas.join("\n"));
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Editor assistido</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.EditorActions>
          <S.Select
            value={linhaSelecionada}
            onChange={(event) => setLinhaSelecionada(Number(event.target.value))}
            disabled={linhas.length === 0}
          >
            {linhas.map((item, index) => (
              <option key={`${index}-${item.slice(0, 8)}`} value={index}>
                Linha {index + 1} - {resolverSegmento(item, banco)}
              </option>
            ))}
          </S.Select>
          <S.ActionButton type="button" onClick={aplicar} disabled={!mudou || campos.length === 0}>
            Aplicar
          </S.ActionButton>
        </S.EditorActions>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para editar uma linha.</S.EmptyOutput>
      ) : campos.length === 0 ? (
        <S.EmptyState>A linha selecionada não possui layout reconhecido para edição assistida.</S.EmptyState>
      ) : (
        <>
          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Linha</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{linhaSelecionada + 1}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Segmento</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{segmento}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Campos</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{campos.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Status</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{mudou ? "Alterado" : "Sem alteração"}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Preview da linha</S.SummarySectionTitle>
            <S.LinePreview>{linhaPreview}</S.LinePreview>
          </S.SummaryWideSection>

          <S.FormSection>
            <S.FieldForm>
              {campos.map((campo) => {
                const chave = `${campo.inicio}-${campo.fim}-${campo.label}`;
                const tamanho = campo.fim - campo.inicio + 1;

                return (
                  <S.FieldEditor key={chave}>
                    <S.FieldMeta>
                      <S.FieldName>{campo.label}</S.FieldName>
                      <S.FieldHint>{campo.inicio}-{campo.fim} | {campo.tipo || "Tipo não informado"}</S.FieldHint>
                    </S.FieldMeta>
                    <S.FieldInput
                      value={valores[chave] ?? ""}
                      maxLength={tamanho}
                      onChange={(event) => setValores((current) => ({ ...current, [chave]: event.target.value }))}
                    />
                  </S.FieldEditor>
                );
              })}
            </S.FieldForm>
          </S.FormSection>
        </>
      )}
    </S.PageShell>
  );
});

export default LineEditorPage;