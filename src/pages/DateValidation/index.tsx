import { memo, useMemo } from "react";
import { resolverLayout, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type Status = "ok" | "erro" | "aviso";

function parseDate(value: string) {
  const normalized = value.trim();

  if (/^0+$/.test(normalized)) return { status: "aviso" as Status, detail: "Data zerada" };
  if (!/^\d{8}$/.test(normalized)) return { status: "erro" as Status, detail: "Formato diferente de DDMMAAAA" };

  const day = Number(normalized.slice(0, 2));
  const month = Number(normalized.slice(2, 4));
  const year = Number(normalized.slice(4, 8));
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { status: "erro" as Status, detail: "Data inválida" };
  }

  return { status: "ok" as Status, detail: date.toLocaleDateString("pt-BR") };
}

const DateValidationPage = memo(function DateValidationPage() {
  const { banco, linhas, resumoArquivo } = useCnab();

  const rows = useMemo(() => {
    return linhas.flatMap((linha, index) => {
      const fields = resolverLayout(linha, banco) ?? [];

      return fields
        .filter((field) => `${field.label} ${field.descricao ?? ""}`.toLowerCase().includes("data"))
        .map((field) => {
          const value = linha.slice(field.inicio - 1, field.fim);
          const result = parseDate(value);

          return {
            linha: index + 1,
            segmento: resolverSegmento(linha, banco),
            campo: field.label,
            pos: `${field.inicio}-${field.fim}`,
            valor: value,
            status: result.status,
            detail: result.detail,
          };
        });
    });
  }, [banco, linhas]);

  const erros = rows.filter((row) => row.status === "erro").length;
  const avisos = rows.filter((row) => row.status === "aviso").length;
  const statusText = erros ? `${erros} erros` : avisos ? `${avisos} avisos` : "Datas ok";

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Validador de datas</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ValidationStatus $tone={erros ? "error" : avisos ? "warning" : "ok"}>{statusText}</S.ValidationStatus>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB para validar datas.</S.EmptyOutput>
      ) : (
        <S.TableSection>
          <S.DataTable>
            <S.HeaderRow>
              <S.PlainText>Linha</S.PlainText>
              <S.PlainText>Status</S.PlainText>
              <S.PlainText>Segmento</S.PlainText>
              <S.PlainText>Campo</S.PlainText>
              <S.PlainText>Posição</S.PlainText>
              <S.PlainText>Valor</S.PlainText>
              <S.PlainText>Detalhe</S.PlainText>
            </S.HeaderRow>
            {rows.map((row, index) => (
              <S.DataRow key={`${row.linha}-${row.campo}-${index}`}>
                <S.MonoValue>{row.linha}</S.MonoValue>
                <S.StatusBadge $status={row.status}>{row.status}</S.StatusBadge>
                <S.PlainText>{row.segmento}</S.PlainText>
                <S.PlainText>{row.campo}</S.PlainText>
                <S.MonoValue>{row.pos}</S.MonoValue>
                <S.MonoValue>{row.valor || "-"}</S.MonoValue>
                <S.PlainText>{row.detail}</S.PlainText>
              </S.DataRow>
            ))}
          </S.DataTable>
        </S.TableSection>
      )}
    </S.PageShell>
  );
});

export default DateValidationPage;