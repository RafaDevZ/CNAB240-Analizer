import { memo, useMemo, useState } from "react";
import { useCnab } from "../../contexts/CnabContext";
import * as S from "./styles";

type CnabEncoding = "latin1" | "windows1252" | "utf8";
type CnabExtension = "rem" | "ret" | "txt" | "000" | "original";
type LineEnding = "crlf" | "lf" | "original";

const windows1252Extra: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

const encodingLabels: Record<CnabEncoding, string> = {
  latin1: "Latin-1 / ISO-8859-1",
  windows1252: "Windows-1252",
  utf8: "UTF-8",
};

const extensionLabels: Record<CnabExtension, string> = {
  rem: ".rem - remessa",
  ret: ".ret - retorno",
  txt: ".txt - texto",
  "000": ".000 - arquivo CNAB",
  original: "Manter extensão original",
};

const lineEndingLabels: Record<LineEnding, string> = {
  crlf: "CRLF - Windows / bancos",
  lf: "LF - Unix",
  original: "Preservar padrão detectado",
};

function sanitizeFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "cnab";
}

function getOriginalExtension(filename: string) {
  const match = filename.match(/\.([a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase() ?? "txt";
}

function getOriginalLineEnding(texto: string) {
  if (texto.includes("\r\n")) return "\r\n";
  if (texto.includes("\n")) return "\n";
  return "\r\n";
}

function encodeLegacy(text: string, encoding: Exclude<CnabEncoding, "utf8">) {
  const bytes: number[] = [];
  const invalidChars = new Set<string>();

  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;

    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    if (encoding === "windows1252" && windows1252Extra[code] !== undefined) {
      bytes.push(windows1252Extra[code]);
      continue;
    }

    bytes.push(0x3f);
    invalidChars.add(char);
  }

  return { bytes: new Uint8Array(bytes), invalidChars: Array.from(invalidChars) };
}

function encodeCnab(text: string, encoding: CnabEncoding) {
  if (encoding === "utf8") {
    return { bytes: new TextEncoder().encode(text), invalidChars: [] as string[] };
  }

  return encodeLegacy(text, encoding);
}

function downloadBytes(bytes: Uint8Array, filename: string, type: string) {
  const output = new Uint8Array(bytes.byteLength);
  output.set(bytes);
  const blob = new Blob([output.buffer], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const CnabExportPage = memo(function CnabExportPage() {
  const { linhas, nomeArquivo, resumoArquivo, texto } = useCnab();
  const [encoding, setEncoding] = useState<CnabEncoding>("latin1");
  const [extension, setExtension] = useState<CnabExtension>("rem");
  const [lineEnding, setLineEnding] = useState<LineEnding>("crlf");

  const exportText = useMemo(() => {
    const ending = lineEnding === "original" ? getOriginalLineEnding(texto) : lineEnding === "lf" ? "\n" : "\r\n";
    return linhas.length > 0 ? `${linhas.join(ending)}${ending}` : "";
  }, [lineEnding, linhas, texto]);

  const encoded = useMemo(() => encodeCnab(exportText, encoding), [encoding, exportText]);
  const outputExtension = extension === "original" ? getOriginalExtension(nomeArquivo || resumoArquivo.nome) : extension;
  const filename = `${sanitizeFilename(nomeArquivo || resumoArquivo.nome)}.${outputExtension}`;
  const validRecords = linhas.filter((linha) => linha.length === 240).length;
  const invalidRecords = linhas.length - validRecords;

  const handleDownload = () => {
    downloadBytes(encoded.bytes, filename, "application/octet-stream");
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Exportar CNAB</S.PanelTitle>
          <S.PageTitle>{nomeArquivo || resumoArquivo.nome}</S.PageTitle>
        </S.PageTitleGroup>
        <S.ActionButton type="button" disabled={linhas.length === 0} onClick={handleDownload}>
          Baixar {filename}
        </S.ActionButton>
      </S.PageHeader>

      {linhas.length === 0 ? (
        <S.EmptyOutput>Carregue ou cole um arquivo CNAB no visualizador para exportar no formato bancário.</S.EmptyOutput>
      ) : (
        <>
          <S.OptionsPanel>
            <S.ControlGroup>
              <S.PlainText>Extensão</S.PlainText>
              <S.Select value={extension} onChange={(event) => setExtension(event.target.value as CnabExtension)}>
                {Object.entries(extensionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </S.Select>
            </S.ControlGroup>
            <S.ControlGroup>
              <S.PlainText>Codificação</S.PlainText>
              <S.Select value={encoding} onChange={(event) => setEncoding(event.target.value as CnabEncoding)}>
                {Object.entries(encodingLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </S.Select>
            </S.ControlGroup>
            <S.ControlGroup>
              <S.PlainText>Quebra de linha</S.PlainText>
              <S.Select value={lineEnding} onChange={(event) => setLineEnding(event.target.value as LineEnding)}>
                {Object.entries(lineEndingLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </S.Select>
            </S.ControlGroup>
          </S.OptionsPanel>

          <S.SummaryGrid>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Arquivo</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{filename}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Codificação</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{encodingLabels[encoding]}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Bytes exportados</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{encoded.bytes.length}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Registros 240 posições</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{validRecords}</S.SummaryMetricValue>
            </S.SummaryMetric>
            <S.SummaryMetric>
              <S.SummaryMetricLabel>Registros divergentes</S.SummaryMetricLabel>
              <S.SummaryMetricValue>{invalidRecords}</S.SummaryMetricValue>
            </S.SummaryMetric>
          </S.SummaryGrid>

          {encoded.invalidChars.length > 0 && (
            <S.ValidationSummary>
              <S.ValidationItem $tone="warning">
                {encoded.invalidChars.length} caractere(s) não existem em {encodingLabels[encoding]} e serão exportados como ?.
              </S.ValidationItem>
            </S.ValidationSummary>
          )}

          <S.SummaryWideSection>
            <S.SummarySectionTitle>Prévia do arquivo</S.SummarySectionTitle>
            <S.ExportPreview>{exportText.slice(0, 4000)}</S.ExportPreview>
          </S.SummaryWideSection>
        </>
      )}
    </S.PageShell>
  );
});

export default CnabExportPage;