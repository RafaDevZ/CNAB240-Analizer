import type { BankFormat, BankFormatField } from "../bankFormats";

export type BoletoValues = Record<string, string>;

export type GeneratedBoleto = {
  barcode: string;
  barcodeSvg: string;
  barcodeImageUrl: string;
  campoLivre: string;
  linhaDigitavel: string;
  nossoNumero: string;
  nossoNumeroBase: string;
  nossoNumeroDv: string;
};

const startPattern = "1010";
const stopPattern = "1101";
const interleavedTwoOfFivePatterns: Record<string, string> = {
  "0": "00110",
  "1": "10001",
  "2": "01001",
  "3": "11000",
  "4": "00101",
  "5": "10100",
  "6": "01100",
  "7": "00011",
  "8": "10010",
  "9": "01010",
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeValue(value: string, field?: BankFormatField) {
  if (!field) return value;
  if (field.type === "date") return value;

  const cleanValue = field.type === "numeric" ? onlyDigits(value) : value;
  const truncated = cleanValue.slice(-field.length);

  if (field.type === "numeric") return truncated.padStart(field.length, "0");
  return truncated.padEnd(field.length, " ").slice(0, field.length);
}

export function getDefaultBoletoValues(format: BankFormat) {
  return format.fields.reduce<BoletoValues>((values, field) => {
    values[field.name] = normalizeValue(field.defaultValue ?? "", field);
    return values;
  }, {});
}

export function normalizeBoletoValues(format: BankFormat, values: BoletoValues) {
  const normalized = format.fields.reduce<BoletoValues>((currentValues, field) => {
    currentValues[field.name] = normalizeValue(values[field.name] ?? "", field);
    return currentValues;
  }, {});

  format.fields.forEach((field) => {
    if (field.derives === "dataVencimento") {
      normalized[field.name] = calculateDueFactor(format, normalized.dataVencimento).padStart(field.length, "0");
    }
  });

  return normalized;
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return Date.UTC(year, month - 1, day);
}

function daysBetween(startDate: string, endDate: string) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (start === null || end === null) return 0;

  return Math.round((end - start) / 86400000);
}

function calculateDueFactor(format: BankFormat, dueDate: string) {
  const rules = format.boleto.dueFactorRules ?? [];
  const selectedRule = rules.find((rule) => {
    if (dueDate < rule.startDate) return false;
    if (rule.endDate && dueDate > rule.endDate) return false;
    return true;
  });

  if (!selectedRule) return "0000";

  return String(selectedRule.baseFactor + daysBetween(selectedRule.baseDate, dueDate)).slice(-4);
}

export function getDueFactor(format: BankFormat, dueDate: string) {
  return calculateDueFactor(format, dueDate).padStart(4, "0");
}

function applyTemplate(template: string, values: BoletoValues) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => values[key] ?? "");
}

function modulo10(value: string) {
  let multiplier = 2;
  let total = 0;

  for (let index = value.length - 1; index >= 0; index -= 1) {
    const product = Number(value[index]) * multiplier;
    total += product > 9 ? Math.floor(product / 10) + (product % 10) : product;
    multiplier = multiplier === 2 ? 1 : 2;
  }

  const remainder = total % 10;
  return remainder === 0 ? "0" : String(10 - remainder);
}

function modulo11(value: string, weights: number[], direction: "rightToLeft" | "leftToRight") {
  let total = 0;

  for (let index = 0; index < value.length; index += 1) {
    const valueIndex = direction === "rightToLeft" ? value.length - 1 - index : index;
    total += Number(value[valueIndex]) * weights[index % weights.length];
  }

  const digit = 11 - (total % 11);
  return digit === 10 || digit === 11 ? "0" : String(digit);
}

function modulo11Boleto(value: string) {
  const digit = Number(modulo11(value, [2, 3, 4, 5, 6, 7, 8, 9], "rightToLeft"));
  return digit === 0 ? "1" : String(digit);
}

function buildLinhaDigitavel(barcode: string) {
  const bankCurrency = barcode.slice(0, 4);
  const generalDv = barcode.slice(4, 5);
  const dueAmount = barcode.slice(5, 19);
  const freeField = barcode.slice(19);
  const field1 = `${bankCurrency}${freeField.slice(0, 5)}`;
  const field2 = freeField.slice(5, 15);
  const field3 = freeField.slice(15, 25);

  return [
    `${field1.slice(0, 5)}.${field1.slice(5)}${modulo10(field1)}`,
    `${field2.slice(0, 5)}.${field2.slice(5)}${modulo10(field2)}`,
    `${field3.slice(0, 5)}.${field3.slice(5)}${modulo10(field3)}`,
    generalDv,
    dueAmount,
  ].join(" ");
}

function interleavedTwoOfFiveSequence(value: string) {
  const normalized = value.length % 2 === 0 ? value : `0${value}`;
  let sequence = startPattern;

  for (let index = 0; index < normalized.length; index += 2) {
    const first = interleavedTwoOfFivePatterns[normalized[index]];
    const second = interleavedTwoOfFivePatterns[normalized[index + 1]];

    for (let patternIndex = 0; patternIndex < 5; patternIndex += 1) {
      sequence += first[patternIndex] === "1" ? "111" : "1";
      sequence += second[patternIndex] === "1" ? "000" : "0";
    }
  }

  return `${sequence}${stopPattern}`;
}

function createBarcodeSvg(value: string) {
  const sequence = interleavedTwoOfFiveSequence(value);
  const width = sequence.length;
  const height = 96;
  let cursor = 0;
  const bars: string[] = [];

  for (let index = 0; index < sequence.length; index += 1) {
    if (sequence[index] === "1") bars.push(`<rect x="${cursor}" y="0" width="1" height="${height}" />`);
    cursor += 1;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><rect width="${width}" height="${height}" fill="#fff"/><g fill="#111827">${bars.join("")}</g></svg>`;
}

export function generateBoleto(format: BankFormat, rawValues: BoletoValues): GeneratedBoleto {
  const values = normalizeBoletoValues(format, rawValues);
  const rule = format.boleto.rule ?? "generic";

  if (rule === "itauCarteira109") {
    const codigoBanco = values.codigoBanco || format.codigoBanco;
    const nossoNumeroBase = applyTemplate(format.nossoNumero.template, values);
    const nossoNumeroDv = modulo10(`${values.agencia}${values.conta}${values.carteira}${nossoNumeroBase}`);
    const nossoNumero = applyTemplate(format.nossoNumero.displayTemplate, {
      ...values,
      nossoNumero: nossoNumeroBase,
      dv: nossoNumeroDv,
    });
    const campoLivre = applyTemplate(format.boleto.freeFieldTemplate, {
      ...values,
      nossoNumero: nossoNumeroBase,
      dv: nossoNumeroDv,
    });
    const barcodeWithoutDv = `${codigoBanco}${format.moeda}${values.fatorVencimento}${values.valor}${campoLivre}`;
    const dvGeral = modulo11Boleto(barcodeWithoutDv);
    const barcode = applyTemplate(format.boleto.barcodeTemplate, {
      ...values,
      codigoBanco,
      moeda: format.moeda,
      campoLivre,
      dvGeral,
    });
    const barcodeSvg = createBarcodeSvg(barcode);
    const barcodeImageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(barcodeSvg)}`;

    return {
      barcode,
      barcodeSvg,
      barcodeImageUrl,
      campoLivre,
      linhaDigitavel: buildLinhaDigitavel(barcode),
      nossoNumero,
      nossoNumeroBase,
      nossoNumeroDv,
    };
  }

  const nossoNumeroBase = applyTemplate(format.nossoNumero.template, values);
  const nossoNumeroDv = modulo11(
    nossoNumeroBase,
    format.nossoNumero.dv.weights,
    format.nossoNumero.dv.direction
  );
  const nossoNumero = applyTemplate(format.nossoNumero.displayTemplate, {
    ...values,
    dv: nossoNumeroDv,
  });
  const computedValues = {
    ...values,
    codigoBanco: values.codigoBanco || format.codigoBanco,
    moeda: format.moeda,
    nossoNumero: `${nossoNumeroBase}${nossoNumeroDv}`,
  };
  const campoLivre = applyTemplate(format.boleto.freeFieldTemplate, computedValues).slice(0, 25).padEnd(25, "0");
  const barcodeWithoutDv = `${computedValues.codigoBanco}${format.moeda}${values.fatorVencimento}${values.valor}${campoLivre}`;
  const dvGeral = modulo11Boleto(barcodeWithoutDv);
  const barcode = applyTemplate(format.boleto.barcodeTemplate, {
    ...computedValues,
    campoLivre,
    dvGeral,
  });
  const barcodeSvg = createBarcodeSvg(barcode);
  const barcodeImageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(barcodeSvg)}`;

  return {
    barcode,
    barcodeSvg,
    barcodeImageUrl,
    campoLivre,
    linhaDigitavel: buildLinhaDigitavel(barcode),
    nossoNumero,
    nossoNumeroBase,
    nossoNumeroDv,
  };
}
