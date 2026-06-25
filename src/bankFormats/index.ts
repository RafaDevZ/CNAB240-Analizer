import itau from "./itau.json";

export type BankFormatField = {
  disabled?: boolean;
  disabledReason?: string;
  derives?: string;
  name: string;
  label: string;
  length: number;
  type: "numeric" | "text" | "date";
  defaultValue?: string;
};

export type BankFormat = {
  id: string;
  label: string;
  codigoBanco: string;
  moeda: string;
  instructions: string;
  fields: BankFormatField[];
  nossoNumero: {
    label: string;
    template: string;
    displayTemplate: string;
    dv: {
      algorithm: "modulo11";
      weights: number[];
      direction: "rightToLeft" | "leftToRight";
      rule: "boleto";
    };
  };
  boleto: {
    rule?: "generic" | "itauCarteira109";
    dueFactorRules?: Array<{
      baseDate: string;
      baseFactor: number;
      endDate?: string;
      startDate: string;
    }>;
    freeFieldTemplate: string;
    barcodeTemplate: string;
    linhaDigitavel: {
      fieldDvAlgorithm: "modulo10";
      barcodeDvAlgorithm: "modulo11Boleto";
    };
  };
};

export const bankFormats = [itau as BankFormat];
