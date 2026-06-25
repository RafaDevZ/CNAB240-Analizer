import { memo, useEffect, useMemo, useState } from "react";
import { BarcodeFormat, BrowserMultiFormatOneDReader } from "@zxing/browser";
import { bankFormats } from "../../bankFormats";
import { generateBoleto, getDefaultBoletoValues, normalizeBoletoValues, type BoletoValues } from "../../utils/boletoGenerator";
import * as S from "./styles";

const STORAGE_KEY = "cnab-studio:barcode-generator";

type StoredBarcodeGeneratorState = {
  externalBarcode?: string;
  externalLinhaDigitavel?: string;
  values?: BoletoValues;
};

function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function compareBarcode(expected: string, received: string) {
  const normalizedExpected = onlyDigits(expected);
  const normalized = onlyDigits(received);
  const maxLength = Math.max(normalizedExpected.length, normalized.length);
  const differences = Array.from({ length: maxLength }, (_, index) => {
    const expectedDigit = normalizedExpected[index] ?? "";
    const receivedDigit = normalized[index] ?? "";

    if (expectedDigit === receivedDigit) return null;

    return {
      position: index + 1,
      expectedDigit,
      receivedDigit,
    };
  }).filter((item): item is { expectedDigit: string; position: number; receivedDigit: string } => item !== null);

  return {
    differences,
    expected: normalizedExpected,
    isEqual: normalized.length > 0 && differences.length === 0,
    normalized,
  };
}

function loadStoredState(formatId: string): StoredBarcodeGeneratorState {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}:${formatId}`);
    if (!stored) return {};

    return JSON.parse(stored) as StoredBarcodeGeneratorState;
  } catch {
    return {};
  }
}

function incrementPaddedNumber(value: string, length: number) {
  const digits = onlyDigits(value);
  const nextValue = (Number(digits || "0") + 1) % 10 ** length;

  return String(nextValue).padStart(length, "0");
}

const BarcodeGeneratorPage = memo(function BarcodeGeneratorPage() {
  const format = bankFormats[0];
  const storedState = useMemo(() => loadStoredState(format.id), [format.id]);
  const [values, setValues] = useState<BoletoValues>(() => ({
    ...getDefaultBoletoValues(format),
    ...(storedState.values ?? {}),
  }));
  const [externalBarcode, setExternalBarcode] = useState(storedState.externalBarcode ?? "");
  const [externalLinhaDigitavel, setExternalLinhaDigitavel] = useState(storedState.externalLinhaDigitavel ?? "");
  const [imageReadStatus, setImageReadStatus] = useState("Nenhuma imagem analisada.");
  const normalizedValues = useMemo(() => normalizeBoletoValues(format, values), [format, values]);
  const generated = useMemo(() => generateBoleto(format, normalizedValues), [format, normalizedValues]);
  const comparison = useMemo(() => compareBarcode(generated.barcode, externalBarcode), [externalBarcode, generated.barcode]);
  const linhaDigitavelComparison = useMemo(
    () => compareBarcode(generated.linhaDigitavel, externalLinhaDigitavel),
    [externalLinhaDigitavel, generated.linhaDigitavel]
  );

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const incrementNossoNumero = () => {
    const field = format.fields.find((item) => item.name === "sequencialNossoNumero");
    if (!field) return;

    updateValue(field.name, incrementPaddedNumber(values[field.name] ?? "", field.length));
  };

  useEffect(() => {
    const state: StoredBarcodeGeneratorState = {
      externalBarcode,
      externalLinhaDigitavel,
      values,
    };

    localStorage.setItem(`${STORAGE_KEY}:${format.id}`, JSON.stringify(state));
  }, [externalBarcode, externalLinhaDigitavel, format.id, values]);

  const readBarcodeImage = async (file?: File) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    try {
      setImageReadStatus("Analisando imagem...");
      const reader = new BrowserMultiFormatOneDReader();
      reader.possibleFormats = [BarcodeFormat.ITF, BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.CODABAR];
      const result = await reader.decodeFromImageUrl(url);
      const barcode = result.getText();

      if (onlyDigits(barcode).length < 40) {
        setImageReadStatus("Nenhum código de barras compatível foi encontrado na imagem.");
        return;
      }

      setExternalBarcode(onlyDigits(barcode));
      setImageReadStatus("Código extraído da imagem e enviado para comparação.");
    } catch {
      setImageReadStatus("Não foi possível analisar essa imagem.");
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <S.PageShell>
      <S.PageHeader>
        <S.PageTitleGroup>
          <S.PanelTitle>Boletos</S.PanelTitle>
          <S.PageTitle>Nosso número, linha digitável e código de barras</S.PageTitle>
        </S.PageTitleGroup>
        <S.GeneratorActions>
          <S.ActionButton type="button" onClick={() => downloadText(generated.barcodeSvg, `codigo-barras-${format.id}.svg`, "image/svg+xml")}>
            Baixar SVG
          </S.ActionButton>
        </S.GeneratorActions>
      </S.PageHeader>

      <S.ToolGrid>
        <S.SummarySection>
          <S.SummarySectionTitle>Dados</S.SummarySectionTitle>
          <S.FormGrid>
            {format.fields.map((field) => (
              <S.InputGroup key={field.name}>
                <S.FieldLabel>{field.label}</S.FieldLabel>
                <S.TextInput
                  inputMode={field.type === "numeric" ? "numeric" : "text"}
                  maxLength={field.length}
                  type={field.type === "date" ? "date" : "text"}
                  disabled={field.disabled}
                  required={!field.disabled}
                  value={
                    field.name === "nossoNumero" && field.disabled
                      ? generated.nossoNumeroBase
                      : field.name === "fatorVencimento" && field.disabled
                        ? normalizedValues.fatorVencimento
                        : values[field.name] ?? ""
                  }
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
                {field.name === "sequencialNossoNumero" && (
                  <S.InlineSmallButton type="button" onClick={incrementNossoNumero}>
                    +1
                  </S.InlineSmallButton>
                )}
                <S.FieldHint>{field.disabled ? field.disabledReason : `${field.length} pos.`}</S.FieldHint>
              </S.InputGroup>
            ))}
          </S.FormGrid>
        </S.SummarySection>

        <S.SummarySection>
          <S.SummarySectionTitle>Formato</S.SummarySectionTitle>
          <S.SummaryList>
            <S.SummaryListRow>
              <span>Banco</span>
              <S.CodeValue>{normalizedValues.codigoBanco || format.codigoBanco}</S.CodeValue>
            </S.SummaryListRow>
            <S.SummaryListRow>
              <span>Moeda</span>
              <S.CodeValue>{format.moeda}</S.CodeValue>
            </S.SummaryListRow>
            <S.SummaryListRow>
              <span>Campo livre</span>
              <S.CodeValue>{generated.campoLivre}</S.CodeValue>
            </S.SummaryListRow>
            <S.SummaryListRow>
              <span>Base nosso número</span>
              <S.CodeValue>{generated.nossoNumeroBase}</S.CodeValue>
            </S.SummaryListRow>
          </S.SummaryList>
        </S.SummarySection>
      </S.ToolGrid>

      <S.SummaryGrid>
        <S.SummaryMetric>
          <S.SummaryMetricLabel>Nosso número</S.SummaryMetricLabel>
          <S.SummaryMetricValue>{generated.nossoNumero}</S.SummaryMetricValue>
        </S.SummaryMetric>
        <S.SummaryMetric>
          <S.SummaryMetricLabel>DV nosso número</S.SummaryMetricLabel>
          <S.SummaryMetricValue>{generated.nossoNumeroDv}</S.SummaryMetricValue>
        </S.SummaryMetric>
        <S.SummaryMetric>
          <S.SummaryMetricLabel>DV código de barras</S.SummaryMetricLabel>
          <S.SummaryMetricValue>{generated.barcode[4]}</S.SummaryMetricValue>
        </S.SummaryMetric>
      </S.SummaryGrid>

      <S.SummaryWideSection>
        <S.SummarySectionTitle>Linha digitável</S.SummarySectionTitle>
        <S.OutputRow>
          <S.OutputCode>{generated.linhaDigitavel}</S.OutputCode>
          <S.ActionButton type="button" onClick={() => navigator.clipboard.writeText(generated.linhaDigitavel)}>
            Copiar
          </S.ActionButton>
        </S.OutputRow>
        <S.CompareDivider />
        <S.CompareGrid>
          <S.InputGroup>
            <S.FieldLabel>Linha digitável gerada pelo sistema</S.FieldLabel>
            <S.TextAreaInput
              value={externalLinhaDigitavel}
              onChange={(event) => setExternalLinhaDigitavel(event.target.value)}
              placeholder="Cole aqui a linha digitável para comparar"
              spellCheck={false}
            />
            <S.FieldHint>{linhaDigitavelComparison.normalized.length || 0} dígitos informados</S.FieldHint>
          </S.InputGroup>
          <S.CompareResult $match={linhaDigitavelComparison.isEqual} $empty={linhaDigitavelComparison.normalized.length === 0}>
            {linhaDigitavelComparison.normalized.length === 0
              ? "Aguardando linha para comparação."
              : linhaDigitavelComparison.isEqual
                ? "Linha digitável igual à gerada."
                : `${linhaDigitavelComparison.differences.length} diferença(s) encontrada(s).`}
          </S.CompareResult>
        </S.CompareGrid>

        {linhaDigitavelComparison.normalized.length > 0 && !linhaDigitavelComparison.isEqual && (
          <S.DifferenceList>
            {linhaDigitavelComparison.normalized.length !== linhaDigitavelComparison.expected.length && (
              <S.DifferenceRow>
                <span>Tamanho</span>
                <S.CodeValue>
                  Gerado {linhaDigitavelComparison.expected.length} / Informado {linhaDigitavelComparison.normalized.length}
                </S.CodeValue>
              </S.DifferenceRow>
            )}
            {linhaDigitavelComparison.differences.slice(0, 80).map((difference) => (
              <S.DifferenceRow key={difference.position}>
                <span>Posição {difference.position}</span>
                <S.CodeValue>
                  {difference.expectedDigit || "-"} != {difference.receivedDigit || "-"}
                </S.CodeValue>
              </S.DifferenceRow>
            ))}
          </S.DifferenceList>
        )}
      </S.SummaryWideSection>

      <S.SummaryWideSection>
        <S.SummarySectionTitle>Código de barras</S.SummarySectionTitle>
        <S.OutputRow>
          <S.OutputCode>{generated.barcode}</S.OutputCode>
          <S.ActionButton type="button" onClick={() => navigator.clipboard.writeText(generated.barcode)}>
            Copiar
          </S.ActionButton>
        </S.OutputRow>
        <S.BarcodePreview>
          <img src={generated.barcodeImageUrl} alt="Código de barras gerado" />
        </S.BarcodePreview>
      </S.SummaryWideSection>

      <S.SummaryWideSection>
        <S.SummarySectionTitle>Comparar código de barras</S.SummarySectionTitle>
        <S.ImageDropZone
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void readBarcodeImage(event.dataTransfer.files[0]);
          }}
        >
          <S.FieldLabel>Print do código de barras</S.FieldLabel>
          <S.UploadRow>
            <S.FileInput
              type="file"
              accept="image/*"
              onChange={(event) => {
                void readBarcodeImage(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <S.FieldHint>{imageReadStatus}</S.FieldHint>
          </S.UploadRow>
        </S.ImageDropZone>
        <S.CompareGrid>
          <S.InputGroup>
            <S.FieldLabel>Código gerado pelo sistema</S.FieldLabel>
            <S.TextAreaInput
              value={externalBarcode}
              onChange={(event) => setExternalBarcode(event.target.value)}
              placeholder="Cole aqui o código de barras para comparar"
              spellCheck={false}
            />
            <S.FieldHint>{comparison.normalized.length || 0} dígitos informados</S.FieldHint>
          </S.InputGroup>
          <S.CompareResult $match={comparison.isEqual} $empty={comparison.normalized.length === 0}>
            {comparison.normalized.length === 0
              ? "Aguardando código para comparação."
              : comparison.isEqual
                ? "Código igual ao gerado."
                : `${comparison.differences.length} diferença(s) encontrada(s).`}
          </S.CompareResult>
        </S.CompareGrid>

        {comparison.normalized.length > 0 && !comparison.isEqual && (
          <S.DifferenceList>
            {comparison.normalized.length !== generated.barcode.length && (
              <S.DifferenceRow>
                <span>Tamanho</span>
                <S.CodeValue>Gerado {generated.barcode.length} / Informado {comparison.normalized.length}</S.CodeValue>
              </S.DifferenceRow>
            )}
            {comparison.differences.slice(0, 80).map((difference) => (
              <S.DifferenceRow key={difference.position}>
                <span>Posição {difference.position}</span>
                <S.CodeValue>
                  {difference.expectedDigit || "-"} != {difference.receivedDigit || "-"}
                </S.CodeValue>
              </S.DifferenceRow>
            ))}
          </S.DifferenceList>
        )}

      </S.SummaryWideSection>
    </S.PageShell>
  );
});

export default BarcodeGeneratorPage;
