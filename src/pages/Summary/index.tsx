import { memo } from "react";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

const SummaryMetric = memo(function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <S.SummaryMetric>
      <S.SummaryMetricLabel>{label}</S.SummaryMetricLabel>
      <S.SummaryMetricValue>{value}</S.SummaryMetricValue>
    </S.SummaryMetric>
  );
});

const SummaryList = memo(function SummaryList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: Array<[string, number]>;
  emptyText: string;
}) {
  return (
    <S.SummarySection>
      <S.SummarySectionTitle>{title}</S.SummarySectionTitle>
      {items.length > 0 ? (
        <S.SummaryList>
          {items.map(([label, total]) => (
            <S.SummaryListRow key={label}>
              <S.PlainText>{label}</S.PlainText>
              <S.SummaryCount>{total}</S.SummaryCount>
            </S.SummaryListRow>
          ))}
        </S.SummaryList>
      ) : (
        <S.EmptyDetailsText>{emptyText}</S.EmptyDetailsText>
      )}
    </S.SummarySection>
  );
});

const SummaryPage = memo(function SummaryPage({
  onOpenViewer,
}: {
  onOpenViewer: () => void;
}) {
  const { resumoArquivo: resumo, hashArquivo } = useCnab();
  const linhasInvalidasTexto = resumo.linhasInvalidas.length > 0 ? resumo.linhasInvalidas.join(", ") : "Nenhuma";
  const linhasMultibyteTexto = resumo.linhasMultibyte.length > 0 ? resumo.linhasMultibyte.join(", ") : "Nenhuma";

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Resumo do arquivo</S.PanelTitle>
          <S.PageTitle>{resumo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ActionButton type="button" onClick={onOpenViewer}>
          Voltar ao visualizador
        </S.ActionButton>
      </S.PageHeader>

      <S.SummaryGrid>
        <SummaryMetric label="Origem" value={resumo.origem} />
        <SummaryMetric label="Layout selecionado" value={resumo.bancoLayout} />
        <SummaryMetric label="Codigo do banco" value={resumo.codigoBanco} />
        <SummaryMetric label="Linhas" value={resumo.totalLinhas} />
        <SummaryMetric label="Bytes com quebra" value={resumo.totalBytesConteudo} />
        <SummaryMetric label="Linhas invalidas" value={resumo.linhasInvalidas.length} />
      </S.SummaryGrid>

      <S.SummaryWideSection>
        <S.SummarySectionTitle>Integridade</S.SummarySectionTitle>
        <S.SummaryDetailsGrid>
          <S.FieldDetail>
            <S.FieldTerm>SHA-256</S.FieldTerm>
            <S.HashText>{hashArquivo || "-"}</S.HashText>
          </S.FieldDetail>
          <S.FieldDetail>
            <S.FieldTerm>Linhas com tamanho invalido</S.FieldTerm>
            <S.FieldDescription>{linhasInvalidasTexto}</S.FieldDescription>
          </S.FieldDetail>
          <S.FieldDetail>
            <S.FieldTerm>Linhas com caracteres multibyte</S.FieldTerm>
            <S.FieldDescription>{linhasMultibyteTexto}</S.FieldDescription>
          </S.FieldDetail>
        </S.SummaryDetailsGrid>
      </S.SummaryWideSection>

      <S.SummaryColumns>
        <SummaryList title="Tipos de registro" items={resumo.tiposRegistro} emptyText="Nenhum tipo identificado." />
        <SummaryList title="Segmentos" items={resumo.segmentos} emptyText="Nenhum segmento identificado." />
        <SummaryList title="Quebras de linha" items={resumo.quebrasLinha} emptyText="Nenhuma quebra identificada." />
      </S.SummaryColumns>
    </S.PageShell>
  );
});

export default SummaryPage;
