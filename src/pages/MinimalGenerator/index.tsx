import { memo, useMemo, useState } from "react";
import { bancos, resolverLayout, type Banco, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

const SAMPLE_TYPES = [
  { tipo: "0", segmento: " ", label: "Header arquivo" },
  { tipo: "1", segmento: " ", label: "Header lote" },
  { tipo: "3", segmento: "P", label: "Segmento P" },
  { tipo: "3", segmento: "Q", label: "Segmento Q" },
  { tipo: "3", segmento: "R", label: "Segmento R" },
  { tipo: "5", segmento: " ", label: "Trailer lote" },
  { tipo: "9", segmento: " ", label: "Trailer arquivo" },
];

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

function valueForField(campo: Campo, tipoRegistro: string, segmento: string, banco: Banco) {
  const size = campo.fim - campo.inicio + 1;
  const label = campo.label.toLowerCase();
  const tipo = normalizarTipo(campo.tipo);

  if (campo.inicio === 1 && campo.fim === 3) {
    if (banco === "CAIXASIGCB") return "104";
    if (banco === "SICREDI") return "748";
    if (banco === "ITAU") return "341";
    if (banco === "ITAU_BBA") return "184";
  }

  if (campo.inicio === 8 && campo.fim === 8) return tipoRegistro;
  if (campo.inicio === 14 && campo.fim === 14 && tipoRegistro === "3") return segmento;
  if (label.includes("lote")) return tipoRegistro === "9" ? "9999".slice(0, size).padStart(size, "0") : "1".padStart(size, "0");
  if (label.includes("layout")) return "081".slice(0, size).padStart(size, "0");
  if (label.includes("sequencial") || label.includes("num_registro")) return "1".padStart(size, "0");
  if (label.includes("qtde") || label.includes("quantidade")) return "1".padStart(size, "0");
  if (label.includes("data")) return "01012026".slice(0, size).padEnd(size, "0");
  if (label.includes("hora")) return "120000".slice(0, size).padEnd(size, "0");
  if (label.includes("nome")) return "EXEMPLO".padEnd(size, " ").slice(0, size);
  if (label.includes("banco") && tipo.includes("literal")) return bancos.find((item) => item.value === banco)?.label.toUpperCase().slice(0, size).padEnd(size, " ") ?? "".padEnd(size, " ");
  if (tipo.includes("branco") || label.includes("cnab") || label.includes("filler")) return " ".repeat(size);
  if (tipoEhNumerico(tipo)) return "0".repeat(size);

  return " ".repeat(size);
}

function buildLine(banco: Banco, tipoRegistro: string, segmento: string) {
  const seed = `${"0".repeat(7)}${tipoRegistro}${" ".repeat(5)}${segmento}${" ".repeat(226)}`.slice(0, 240);
  const layout = resolverLayout(seed, banco) ?? [];
  const chars = " ".repeat(240).split("");

  layout.forEach((campo) => {
    const value = valueForField(campo, tipoRegistro, segmento, banco);
    for (let index = 0; index < value.length; index += 1) {
      chars[campo.inicio - 1 + index] = value[index];
    }
  });

  return chars.join("");
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const MinimalGeneratorPage = memo(function MinimalGeneratorPage() {
  const [selectedBank, setSelectedBank] = useState<Banco>("CAIXASIGCB");
  const [includeSegmentR, setIncludeSegmentR] = useState(true);

  const content = useMemo(() => {
    const types = includeSegmentR ? SAMPLE_TYPES : SAMPLE_TYPES.filter((item) => item.segmento !== "R");
    return types.map((item) => buildLine(selectedBank, item.tipo, item.segmento)).join("\r\n");
  }, [includeSegmentR, selectedBank]);

  const lines = content.split("\r\n");

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Gerador mínimo</S.PanelTitle>
          <S.PageTitle>Arquivo CNAB de laboratório</S.PageTitle>
        </S.PageTitleGroup>
        <S.GeneratorActions>
          <S.Select value={selectedBank} onChange={(event) => setSelectedBank(event.target.value as Banco)}>
            {bancos.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </S.Select>
          <S.ActionButton type="button" onClick={() => downloadText(content, `cnab-minimo-${selectedBank.toLowerCase()}.txt`)}>
            Baixar TXT
          </S.ActionButton>
        </S.GeneratorActions>
      </S.PageHeader>

      <S.OptionsPanel>
        <S.CheckControl>
          <input type="checkbox" checked={includeSegmentR} onChange={(event) => setIncludeSegmentR(event.target.checked)} />
          Incluir segmento R
        </S.CheckControl>
        <S.SummaryCount>{lines.length} linhas</S.SummaryCount>
      </S.OptionsPanel>

      <S.SummaryWideSection>
        <S.SummarySectionTitle>Prévia</S.SummarySectionTitle>
        <S.Preview>{content}</S.Preview>
      </S.SummaryWideSection>
    </S.PageShell>
  );
});

export default MinimalGeneratorPage;
