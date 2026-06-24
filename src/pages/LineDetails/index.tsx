import { memo, useMemo } from "react";
import { resolverLayout, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

function renderVisibleSpaces(text: string) {
  const parts = text.match(/ +|[^ ]+/g) ?? [];

  return parts.map((part, index) => {
    if (!part.startsWith(" ")) return part;

    return (
      <S.SpaceDot key={`space-${index}`}>
        {"·".repeat(part.length)}
      </S.SpaceDot>
    );
  });
}

const LineDetailsPage = memo(function LineDetailsPage({
  onOpenViewer,
}: {
  onOpenViewer: () => void;
}) {
  const { banco, campoSelecionado, linhas } = useCnab();
  const linhaIndex = campoSelecionado?.linhaIndex ?? -1;
  const linha = linhaIndex >= 0 ? linhas[linhaIndex] : "";
  const segmento = linha ? resolverSegmento(linha, banco) : "";

  const campos = useMemo(() => {
    if (!linha) return [];

    return resolverLayout(linha, banco) ?? [];
  }, [banco, linha]);

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Detalhes da linha</S.PanelTitle>
          <S.PageTitle>
            {linha ? `Linha ${linhaIndex + 1} - ${segmento}` : "Nenhuma linha selecionada"}
          </S.PageTitle>
        </S.PageTitleGroup>
        <S.ActionButton type="button" onClick={onOpenViewer}>
          Ir ao visualizador
        </S.ActionButton>
      </S.PageHeader>

      {!linha ? (
        <S.EmptyState>
          Selecione um trecho colorido em Analisar arquivo para abrir a linha inteira em formato de tabela.
        </S.EmptyState>
      ) : (
        <>
          <S.SummaryWideSection>
            <S.SummarySectionTitle>Linha bruta</S.SummarySectionTitle>
            <S.LinePreview>{renderVisibleSpaces(linha)}</S.LinePreview>
          </S.SummaryWideSection>

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Campos do layout</S.SummarySectionTitle>
            {campos.length > 0 ? (
              <S.FieldTableShell>
                <S.FieldTable>
                  <S.FieldHeaderRow>
                    <S.PlainText>#</S.PlainText>
                    <S.PlainText>Campo</S.PlainText>
                    <S.PlainText>Posição</S.PlainText>
                    <S.PlainText>Tipo</S.PlainText>
                    <S.PlainText>Valor</S.PlainText>
                    <S.PlainText>Descrição</S.PlainText>
                  </S.FieldHeaderRow>
                  {campos.map((campo, index) => {
                    const valor = linha.slice(campo.inicio - 1, campo.fim);
                    const selected = campoSelecionado?.campo.label === campo.label;

                    return (
                      <S.FieldRow key={`${campo.inicio}-${campo.fim}-${campo.label}`} $selected={selected}>
                        <S.MonoValue>{index + 1}</S.MonoValue>
                        <S.PlainText>{campo.label}</S.PlainText>
                        <S.MonoValue>
                          {campo.inicio}-{campo.fim}
                        </S.MonoValue>
                        <S.PlainText>{campo.tipo || "-"}</S.PlainText>
                        <S.FieldValue>{valor || "-"}</S.FieldValue>
                        <S.PlainText>{campo.descricao || campo.conteudo || "-"}</S.PlainText>
                      </S.FieldRow>
                    );
                  })}
                </S.FieldTable>
              </S.FieldTableShell>
            ) : (
              <S.EmptyDetailsText>Não há layout reconhecido para esta linha com o banco selecionado.</S.EmptyDetailsText>
            )}
          </S.SummaryWideSection>
        </>
      )}
    </S.PageShell>
  );
});

export default LineDetailsPage;
