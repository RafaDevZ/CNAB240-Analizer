import { memo, useMemo, useState } from "react";
import { resolverLayout, resolverSegmento, useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type SearchMode = "linha" | "campo";

type ResultadoBusca = {
  linhaIndex: number;
  segmento: string;
  posicao: string;
  campo: string;
  valor: string;
};

function normalizar(valor: string, diferenciarMaiusculas: boolean) {
  return diferenciarMaiusculas ? valor : valor.toLowerCase();
}

const SearchRecordsPage = memo(function SearchRecordsPage() {
  const { banco, linhas, resumoArquivo } = useCnab();
  const [termo, setTermo] = useState("");
  const [modo, setModo] = useState<SearchMode>("linha");
  const [diferenciarMaiusculas, setDiferenciarMaiusculas] = useState(false);

  const resultados = useMemo<ResultadoBusca[]>(() => {
    const query = normalizar(termo.trim(), diferenciarMaiusculas);
    if (!query) return [];

    return linhas.flatMap((linha, linhaIndex) => {
      const segmento = resolverSegmento(linha, banco);

      if (modo === "linha") {
        const textoLinha = normalizar(linha, diferenciarMaiusculas);
        const posicoes: number[] = [];
        let cursor = textoLinha.indexOf(query);

        while (cursor >= 0) {
          posicoes.push(cursor + 1);
          cursor = textoLinha.indexOf(query, cursor + Math.max(query.length, 1));
        }

        return posicoes.map((posicao) => ({
          linhaIndex,
          segmento,
          posicao: String(posicao),
          campo: "Linha completa",
          valor: linha.slice(Math.max(0, posicao - 1), posicao - 1 + termo.trim().length),
        }));
      }

      const campos = resolverLayout(linha, banco) ?? [];

      return campos
        .map((campo) => {
          const valor = linha.slice(campo.inicio - 1, campo.fim);
          const textoCampo = normalizar(`${campo.label} ${campo.descricao ?? ""} ${campo.conteudo ?? ""} ${valor}`, diferenciarMaiusculas);

          if (!textoCampo.includes(query)) return null;

          return {
            linhaIndex,
            segmento,
            posicao: `${campo.inicio}-${campo.fim}`,
            campo: campo.label,
            valor: valor || "-",
          };
        })
        .filter((resultado): resultado is ResultadoBusca => resultado !== null);
    });
  }, [banco, diferenciarMaiusculas, linhas, modo, termo]);

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Busca</S.PanelTitle>
          <S.PageTitle>{resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.SummaryCount>{resultados.length} resultados</S.SummaryCount>
      </S.PageHeader>

      <S.SearchPanel>
        <S.SearchInput
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          placeholder="Buscar valor, campo ou trecho da linha"
          spellCheck={false}
        />
        <S.Select value={modo} onChange={(event) => setModo(event.target.value as SearchMode)}>
          <option value="linha">Linha completa</option>
          <option value="campo">Campos do layout</option>
        </S.Select>
        <S.CheckControl>
          <input
            type="checkbox"
            checked={diferenciarMaiusculas}
            onChange={(event) => setDiferenciarMaiusculas(event.target.checked)}
          />
          Diferenciar maiúsculas
        </S.CheckControl>
      </S.SearchPanel>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para usar a busca.</S.EmptyOutput>
      ) : termo.trim() === "" ? (
        <S.EmptyState>Informe um termo para procurar no arquivo atual.</S.EmptyState>
      ) : resultados.length === 0 ? (
        <S.EmptyState>Nenhum resultado encontrado para a busca atual.</S.EmptyState>
      ) : (
        <S.ResultsSection>
          <S.SearchTable>
            <S.SearchHeaderRow>
              <S.PlainText>Linha</S.PlainText>
              <S.PlainText>Segmento</S.PlainText>
              <S.PlainText>Posição</S.PlainText>
              <S.PlainText>Campo</S.PlainText>
              <S.PlainText>Valor</S.PlainText>
            </S.SearchHeaderRow>
            {resultados.map((resultado, index) => (
              <S.SearchRow key={`${resultado.linhaIndex}-${resultado.posicao}-${resultado.campo}-${index}`}>
                <S.MonoValue>{resultado.linhaIndex + 1}</S.MonoValue>
                <S.PlainText>{resultado.segmento}</S.PlainText>
                <S.MonoValue>{resultado.posicao}</S.MonoValue>
                <S.PlainText>{resultado.campo}</S.PlainText>
                <S.FieldValue>{resultado.valor}</S.FieldValue>
              </S.SearchRow>
            ))}
          </S.SearchTable>
        </S.ResultsSection>
      )}
    </S.PageShell>
  );
});

export default SearchRecordsPage;