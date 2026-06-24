import { memo, useMemo, useState } from "react";
import { bancos, resolverLayout, type Banco, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

const samples = [
  { name: "Header arquivo", seed: "00000000" },
  { name: "Header lote", seed: "00000001" },
  { name: "Segmento P", seed: "0000000300000P" },
  { name: "Segmento Q", seed: "0000000300000Q" },
  { name: "Segmento R", seed: "0000000300000R" },
  { name: "Trailer lote", seed: "00000005" },
  { name: "Trailer arquivo", seed: "00000009" },
];

type Row = Campo & { registro: string };

const FieldDictionaryPage = memo(function FieldDictionaryPage() {
  const [selectedBank, setSelectedBank] = useState<Banco>("CAIXASIGCB");
  const [query, setQuery] = useState("");

  const rows = useMemo<Row[]>(() => {
    return samples.flatMap((sample) => {
      const line = sample.seed.padEnd(240, " ");
      return (resolverLayout(line, selectedBank) ?? []).map((field) => ({ ...field, registro: sample.name }));
    });
  }, [selectedBank]);

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => `${row.registro} ${row.label} ${row.tipo ?? ""} ${row.descricao ?? ""} ${row.conteudo ?? ""}`.toLowerCase().includes(term));
  }, [query, rows]);

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Dicionário de campos</S.PanelTitle>
          <S.PageTitle>{bancos.find((item) => item.value === selectedBank)?.label}</S.PageTitle>
        </S.PageTitleGroup>
        <S.HeaderActions>
          <S.Select value={selectedBank} onChange={(event) => setSelectedBank(event.target.value as Banco)}>
            {bancos.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </S.Select>
          <S.SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar campo" />
        </S.HeaderActions>
      </S.PageHeader>

      <S.TableSection>
        <S.DataTable>
          <S.HeaderRow><S.PlainText>Registro</S.PlainText><S.PlainText>Campo</S.PlainText><S.PlainText>Posição</S.PlainText><S.PlainText>Tipo</S.PlainText><S.PlainText>Descrição</S.PlainText></S.HeaderRow>
          {filteredRows.map((row, index) => (
            <S.DataRow key={`${row.registro}-${row.label}-${row.inicio}-${index}`}>
              <S.PlainText>{row.registro}</S.PlainText><S.PlainText>{row.label}</S.PlainText><S.MonoValue>{row.inicio}-{row.fim}</S.MonoValue><S.PlainText>{row.tipo || "-"}</S.PlainText><S.PlainText>{row.descricao || row.conteudo || "-"}</S.PlainText>
            </S.DataRow>
          ))}
        </S.DataTable>
      </S.TableSection>
    </S.PageShell>
  );
});

export default FieldDictionaryPage;