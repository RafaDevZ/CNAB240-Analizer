import { memo, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import AppTooltip from "../../components/AppTooltip";
import { CNAB_RECORD_BYTES, type Campo } from "../../contexts/CnabContext";
import * as S from "./styles";

const FIELD_COLORS = [
  ["#315f7d", "#e0f2fe"],
  ["#5b4a91", "#ede9fe"],
  ["#1f6f5f", "#d1fae5"],
  ["#805f2c", "#fef3c7"],
  ["#743a54", "#fce7f3"],
  ["#6b5b2f", "#fef9c3"],
  ["#365a91", "#dbeafe"],
  ["#6f3f3f", "#fee2e2"],
] as const;

type SqlValue = string | number | boolean | null;

type SqlFieldName =
  | "tipo_registro"
  | "tipo_sub_registro"
  | "posicao_inicial"
  | "posicao_final"
  | "nome"
  | "tamanho"
  | "conteudo"
  | "tipo_dado"
  | "e_ativo"
  | "e_padrao"
  | "e_visivel"
  | "e_variavel"
  | "tabela"
  | "formato"
  | "observacao";

type SqlRecord = {
  id: string;
  values: Record<SqlFieldName, SqlValue>;
};

type SelectedField = {
  recordId: string;
  campo: Campo;
};

type SegmentGroup = {
  name: string;
  records: SqlRecord[];
  previewLine: string;
};

type SqlEditorMemory = {
  filename: string;
  records: SqlRecord[];
  selectedRecordId: string;
};

const sqlEditorMemory: SqlEditorMemory = {
  filename: "",
  records: [],
  selectedRecordId: "",
};

const FIELD_NAMES: SqlFieldName[] = [
  "tipo_registro",
  "tipo_sub_registro",
  "posicao_inicial",
  "posicao_final",
  "nome",
  "tamanho",
  "conteudo",
  "tipo_dado",
  "e_ativo",
  "e_padrao",
  "e_visivel",
  "e_variavel",
  "tabela",
  "formato",
  "observacao",
];

function readString(value: SqlValue) {
  return value === null ? "" : String(value);
}

function sqlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function formatSqlValue(value: SqlValue) {
  if (value === null) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  return sqlString(value);
}

function splitSqlValues(source: string) {
  const values: string[] = [];
  let current = "";
  let inString = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "'") {
      current += char;
      if (inString && next === "'") {
        current += next;
        index += 1;
      } else {
        inString = !inString;
      }
      continue;
    }

    if (char === "," && !inString) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) values.push(current.trim());
  return values;
}

function parseSqlValue(token: string): SqlValue {
  const trimmed = token.trim();
  const upper = trimmed.toUpperCase();

  if (upper === "NULL") return null;
  if (upper === "TRUE") return true;
  if (upper === "FALSE") return false;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replace(/''/g, "'");
  return trimmed;
}

function parseSqlRecords(sql: string): SqlRecord[] {
  const matches = [...sql.matchAll(/VALUES\s*\(([\s\S]*?)\);/gi)];

  return matches
    .map((match, index) => {
      const rawValues = splitSqlValues(match[1] ?? "");
      if (rawValues.length !== FIELD_NAMES.length) return null;

      const values = FIELD_NAMES.reduce((acc, fieldName, fieldIndex) => {
        acc[fieldName] = parseSqlValue(rawValues[fieldIndex] ?? "NULL");
        return acc;
      }, {} as Record<SqlFieldName, SqlValue>);

      return { id: `sql-${index}`, values };
    })
    .filter((record): record is SqlRecord => Boolean(record));
}

function buildSql(records: SqlRecord[]) {
  return records
    .map((record) => {
      const columns = FIELD_NAMES.join(", ");
      const values = FIELD_NAMES.map((fieldName) => formatSqlValue(record.values[fieldName])).join(", ");

      return `INSERT INTO public.cad_cobranca_padrao\n(${columns})\nVALUES(${values});`;
    })
    .join("\r\n");
}

function normalizeSegmentName(value: SqlValue) {
  return readString(value) || "Registro";
}

function recordToCampo(record: SqlRecord, index: number): Campo {
  const color = FIELD_COLORS[index % FIELD_COLORS.length];
  const inicio = Number(record.values.posicao_inicial) || 1;
  const fim = Number(record.values.posicao_final) || inicio;

  return {
    inicio,
    fim,
    label: readString(record.values.nome) || "CAMPO",
    descricao: readString(record.values.observacao),
    tipo: readString(record.values.tipo_dado),
    conteudo: readString(record.values.conteudo),
    bgColor: color[0],
    textColor: color[1],
  };
}

function valueForRecord(record: SqlRecord) {
  const size = Math.max(0, Number(record.values.tamanho) || 0);
  const type = readString(record.values.tipo_dado).toUpperCase();
  const content = readString(record.values.conteudo);

  if (type === "B") return " ".repeat(size);
  if (!content) return type === "N" ? "0".repeat(size) : " ".repeat(size);
  if (type === "N") return content.replace(/\D/g, "").padStart(size, "0").slice(-size);
  return content.slice(0, size).padEnd(size, " ");
}

function buildPreviewLine(records: SqlRecord[]) {
  const chars = " ".repeat(CNAB_RECORD_BYTES).split("");

  records.forEach((record) => {
    const start = Math.max(0, Number(record.values.posicao_inicial) - 1 || 0);
    const end = Math.min(CNAB_RECORD_BYTES, Number(record.values.posicao_final) || start + 1);
    const value = valueForRecord(record);

    for (let index = start; index < end; index += 1) {
      chars[index] = value[index - start] ?? " ";
    }
  });

  return chars.join("");
}

function sortRecordsByPosition(records: SqlRecord[]) {
  return [...records].sort((a, b) => Number(a.values.posicao_inicial) - Number(b.values.posicao_inicial));
}

function preservePreviewSpaces(value: string) {
  return value.replace(/ /g, "\u00a0");
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/sql;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function SqlFieldTooltip({ campo, record }: { campo: Campo; record: SqlRecord }) {
  return (
    <>
      <S.TooltipTitle>{campo.label}</S.TooltipTitle>
      <S.TooltipGrid>
        <S.TooltipRow>
          <S.TooltipTerm>Registro</S.TooltipTerm>
          <S.TooltipValue>{normalizeSegmentName(record.values.tipo_sub_registro)}</S.TooltipValue>
        </S.TooltipRow>
        <S.TooltipRow>
          <S.TooltipTerm>Posicao</S.TooltipTerm>
          <S.TooltipValue>{campo.inicio}-{campo.fim}</S.TooltipValue>
        </S.TooltipRow>
        <S.TooltipRow>
          <S.TooltipTerm>Tipo</S.TooltipTerm>
          <S.TooltipValue>{campo.tipo || "-"}</S.TooltipValue>
        </S.TooltipRow>
        <S.TooltipRow>
          <S.TooltipTerm>Conteudo</S.TooltipTerm>
          <S.TooltipValue>{campo.conteudo || "NULL"}</S.TooltipValue>
        </S.TooltipRow>
      </S.TooltipGrid>
    </>
  );
}

function renderSqlLine(
  line: string,
  records: SqlRecord[],
  selected: SelectedField | null,
  onSelect: (selection: SelectedField) => void
) {
  let cursor = 0;
  const spans: JSX.Element[] = [];

  records.forEach((record, index) => {
    const campo = recordToCampo(record, index);
    const ini = Math.max(0, campo.inicio - 1);
    const fim = Math.max(ini, campo.fim);
    const active = selected?.recordId === record.id;

    if (cursor < ini) {
      spans.push(<S.PlainText key={`plain-${record.id}`}>{preservePreviewSpaces(line.slice(cursor, ini))}</S.PlainText>);
    }

    spans.push(
      <AppTooltip key={record.id} content={<SqlFieldTooltip campo={campo} record={record} />}>
        <S.SqlCnabField
          role="button"
          tabIndex={0}
          $active={active}
          $bgColor={campo.bgColor}
          $textColor={campo.textColor}
          onClick={() => onSelect({ recordId: record.id, campo })}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect({ recordId: record.id, campo });
            }
          }}
        >
          {preservePreviewSpaces(line.slice(ini, fim))}
        </S.SqlCnabField>
      </AppTooltip>
    );

    cursor = fim;
  });

  if (cursor < line.length) {
    spans.push(<S.PlainText key="tail">{preservePreviewSpaces(line.slice(cursor))}</S.PlainText>);
  }

  return spans;
}

const SqlCnabEditorPage = memo(function SqlCnabEditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState(sqlEditorMemory.filename);
  const [records, setRecords] = useState<SqlRecord[]>(sqlEditorMemory.records);
  const [selected, setSelected] = useState<SelectedField | null>(() => {
    const record = sqlEditorMemory.records.find((item) => item.id === sqlEditorMemory.selectedRecordId);
    if (!record) return null;

    return { recordId: record.id, campo: recordToCampo(record, 0) };
  });

  const segments = useMemo(() => {
    return [...new Set(records.map((record) => normalizeSegmentName(record.values.tipo_sub_registro)))];
  }, [records]);

  const cnabLines = useMemo<SegmentGroup[]>(() => {
    return segments.map((segment) => {
      const segmentRecords = sortRecordsByPosition(
        records.filter((record) => normalizeSegmentName(record.values.tipo_sub_registro) === segment)
      );

      return {
        name: segment,
        records: segmentRecords,
        previewLine: buildPreviewLine(segmentRecords),
      };
    });
  }, [records, segments]);

  const selectedRecord = records.find((record) => record.id === selected?.recordId) ?? cnabLines[0]?.records[0] ?? null;
  const selectedGroup = selectedRecord
    ? cnabLines.find((group) => group.records.some((record) => record.id === selectedRecord.id))
    : null;
  const selectedCampo = selectedRecord
    ? recordToCampo(selectedRecord, selectedGroup?.records.findIndex((record) => record.id === selectedRecord.id) ?? 0)
    : null;
  const outputSql = useMemo(() => buildSql(records), [records]);
  const totalHeight = cnabLines.length * 20;

  const updateRecordValue = (fieldName: SqlFieldName, value: SqlValue) => {
    if (!selectedRecord) return;

    setRecords((current) =>
      {
        const nextRecords = current.map((record) => {
        if (record.id !== selectedRecord.id) return record;

        const nextValues = { ...record.values, [fieldName]: value };
        if (fieldName === "posicao_inicial" || fieldName === "posicao_final") {
          const start = Number(nextValues.posicao_inicial) || 0;
          const end = Number(nextValues.posicao_final) || 0;
          nextValues.tamanho = Math.max(0, end - start + 1);
        }

        return { ...record, values: nextValues };
        });

        sqlEditorMemory.records = nextRecords;
        return nextRecords;
      }
    );
  };

  const loadFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseSqlRecords(text);
    setFilename(file.name);
    setRecords(parsed);
    const nextSelected = parsed[0] ? { recordId: parsed[0].id, campo: recordToCampo(parsed[0], 0) } : null;
    setSelected(nextSelected);
    sqlEditorMemory.filename = file.name;
    sqlEditorMemory.records = parsed;
    sqlEditorMemory.selectedRecordId = nextSelected?.recordId ?? "";
  };

  return (
    <S.SqlViewerWorkspace>
      <S.DetailsPanel>
        <S.PanelTitle>Campo selecionado</S.PanelTitle>
        <S.DetailsActions>
          <S.HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".sql,text/sql,text/plain"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void loadFile(file);
              event.target.value = "";
            }}
          />
          <S.ActionButton type="button" onClick={() => fileInputRef.current?.click()}>
            Importar SQL
          </S.ActionButton>
          <S.ActionButton
            type="button"
            disabled={records.length === 0}
            onClick={() => downloadText(outputSql, filename ? `editado-${filename}` : "cnab-itau-editado.sql")}
          >
            Baixar SQL
          </S.ActionButton>
        </S.DetailsActions>
        {!selectedRecord || !selectedCampo ? (
          <S.EmptyDetailsText>Clique em um campo colorido do preview para editar o SQL correspondente.</S.EmptyDetailsText>
        ) : (
          <>
            <S.SegmentLabel>{normalizeSegmentName(selectedRecord.values.tipo_sub_registro)}</S.SegmentLabel>
            <S.FieldChip $borderColor={selectedCampo.bgColor}>
              <S.FieldColorSwatch $bgColor={selectedCampo.bgColor} />
              {readString(selectedRecord.values.nome)}
            </S.FieldChip>

            <S.MetaGrid>
              <S.MetaItem>
                <S.MetaLabel>Posicao</S.MetaLabel>
                <S.MetaValue>{readString(selectedRecord.values.posicao_inicial)}-{readString(selectedRecord.values.posicao_final)}</S.MetaValue>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaLabel>Tamanho</S.MetaLabel>
                <S.MetaValue>{readString(selectedRecord.values.tamanho)}</S.MetaValue>
              </S.MetaItem>
            </S.MetaGrid>

            <S.DetailsForm>
              <S.FieldEditor>
                <S.FieldLabel>Nome</S.FieldLabel>
                <S.FieldInput value={readString(selectedRecord.values.nome)} onChange={(event) => updateRecordValue("nome", event.target.value)} />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Conteudo</S.FieldLabel>
                <S.FieldInput
                  value={readString(selectedRecord.values.conteudo)}
                  placeholder="NULL"
                  onChange={(event) => updateRecordValue("conteudo", event.target.value || null)}
                />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Tabela</S.FieldLabel>
                <S.FieldInput value={readString(selectedRecord.values.tabela)} placeholder="NULL" onChange={(event) => updateRecordValue("tabela", event.target.value || null)} />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Formato</S.FieldLabel>
                <S.FieldInput value={readString(selectedRecord.values.formato)} onChange={(event) => updateRecordValue("formato", event.target.value)} />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Tipo dado</S.FieldLabel>
                <S.FieldInput value={readString(selectedRecord.values.tipo_dado)} onChange={(event) => updateRecordValue("tipo_dado", event.target.value)} />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Posicao inicial</S.FieldLabel>
                <S.FieldInput
                  type="number"
                  min={1}
                  max={CNAB_RECORD_BYTES}
                  value={readString(selectedRecord.values.posicao_inicial)}
                  onChange={(event) => updateRecordValue("posicao_inicial", Number(event.target.value))}
                />
              </S.FieldEditor>
              <S.FieldEditor>
                <S.FieldLabel>Posicao final</S.FieldLabel>
                <S.FieldInput
                  type="number"
                  min={1}
                  max={CNAB_RECORD_BYTES}
                  value={readString(selectedRecord.values.posicao_final)}
                  onChange={(event) => updateRecordValue("posicao_final", Number(event.target.value))}
                />
              </S.FieldEditor>
              <S.ToggleGrid>
                {(["e_ativo", "e_padrao", "e_visivel", "e_variavel"] as const).map((fieldName) => (
                  <S.ToggleField key={fieldName}>
                    <input
                      type="checkbox"
                      checked={Boolean(selectedRecord.values[fieldName])}
                      onChange={(event) => updateRecordValue(fieldName, event.target.checked)}
                    />
                    {fieldName.replace("e_", "")}
                  </S.ToggleField>
                ))}
              </S.ToggleGrid>
              <S.FieldEditor>
                <S.FieldLabel>Observacao</S.FieldLabel>
                <S.FieldTextarea value={readString(selectedRecord.values.observacao)} onChange={(event) => updateRecordValue("observacao", event.target.value || null)} />
              </S.FieldEditor>
            </S.DetailsForm>
          </>
        )}
      </S.DetailsPanel>

      <S.ViewerPanel>
        <S.PanelHeader>
          <S.FileInfo>
            <S.PlainText>Arquivo interpretado: {filename || "Nao informado"}</S.PlainText>
            <S.HashText>{records.length} campos SQL | {cnabLines.length} linhas CNAB</S.HashText>
          </S.FileInfo>
          <S.PanelBrand>
            <S.PlainText>SQL CNAB</S.PlainText>
          </S.PanelBrand>
        </S.PanelHeader>
        <S.CnabOutput aria-live="polite">
          {records.length === 0 ? (
            <S.EmptyOutput>Importe um arquivo SQL para visualizar e editar os campos em formato CNAB.</S.EmptyOutput>
          ) : cnabLines.length === 0 ? (
            <S.EmptyOutput>Nenhum registro encontrado para o filtro atual.</S.EmptyOutput>
          ) : (
            <S.VirtualCnabScroller $height={totalHeight}>
              {cnabLines.map((group, index) => (
                <S.CnabLine key={group.name} $top={index * 20}>
                  <S.LineNumber>{String(index + 1).padStart(3, "0")}</S.LineNumber>
                  <S.SqlCnabCode>{renderSqlLine(group.previewLine, group.records, selected, setSelected)}</S.SqlCnabCode>
                </S.CnabLine>
              ))}
            </S.VirtualCnabScroller>
          )}
        </S.CnabOutput>
      </S.ViewerPanel>
    </S.SqlViewerWorkspace>
  );
});

export default SqlCnabEditorPage;
