import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, type JSX, type UIEvent } from "react";
import Tippy from "@tippyjs/react/headless";
import caixasigcb from "./layouts/caixasigcb.json";
import sicredi from "./layouts/sicredi.json";
import sicrediRetorno from "./layouts/sicrediRetorno.json";
import itau from "./layouts/itau.json";
import * as S from "./styles";

type Campo = {
  inicio: number;
  fim: number;
  label: string;
  descricao?: string;
  tipo?: string;
  bgColor: string;
  conteudo?: string;
  textColor: string;
};

type CampoSelecionado = {
  campo: Campo;
  segmento: string;
  linhaIndex: number;
};

type QuebraLinha = "CRLF" | "LF" | "CR" | "EOF";

type RegistroBytes = {
  conteudoBytes: Uint8Array;
  tamanhoConteudo: number;
  tamanhoBruto: number;
  quebra: QuebraLinha;
  temMultibyte: boolean;
};

const caixaSigcbLayout: Campo[][] = caixasigcb;
/**
 * CORES PADRÃO POR SEGMENTO (posição 14)
 */

type Banco = "CAIXASIGCB" | "SICREDI" | "SICREDI - RETORNO" | "ITAU" | "BARRAS SICREDI" | "ITAU_NOVO";

const layoutsPorBanco: Partial<Record<Banco, Campo[][]>> = {
  CAIXASIGCB: caixaSigcbLayout,
  SICREDI: sicredi,
  "SICREDI - RETORNO": sicrediRetorno,
  ITAU: itau,
};

const bancos: { value: Banco; label: string }[] = [
  { value: "CAIXASIGCB", label: "Caixa SIGCB" },
  { value: "SICREDI", label: "Sicredi" },
  { value: "SICREDI - RETORNO", label: "Sicredi - Retorno" },
  { value: "ITAU", label: "Itau" },
];

const TOOLTIP_SHOW_DELAY = 160;
const TOOLTIP_HIDE_DELAY = 90;
const TOOLTIP_ANIMATION_MS = 240;
const CNAB_RECORD_BYTES = 240;
const VIRTUAL_LINE_HEIGHT = 22;
const VIRTUAL_OVERSCAN = 8;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: false });

function comecaComBomUtf8(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
}

function contemByteMultibyte(bytes: Uint8Array) {
  return bytes.some((byte) => byte > 0x7f);
}

function analisarRegistrosBytes(bytes: Uint8Array): RegistroBytes[] {
  const registros: RegistroBytes[] = [];
  let inicioRegistro = 0;
  let cursor = 0;

  while (cursor < bytes.length) {
    const byte = bytes[cursor];

    if (byte !== 0x0d && byte !== 0x0a) {
      cursor += 1;
      continue;
    }

    const conteudoBytes = bytes.slice(inicioRegistro, cursor);
    let quebra: QuebraLinha = "LF";
    let tamanhoQuebra = 1;

    if (byte === 0x0d && bytes[cursor + 1] === 0x0a) {
      quebra = "CRLF";
      tamanhoQuebra = 2;
    } else if (byte === 0x0d) {
      quebra = "CR";
    }

    registros.push({
      conteudoBytes,
      tamanhoConteudo: conteudoBytes.length,
      tamanhoBruto: conteudoBytes.length + tamanhoQuebra,
      quebra,
      temMultibyte: contemByteMultibyte(conteudoBytes),
    });

    cursor += tamanhoQuebra;
    inicioRegistro = cursor;
  }

  if (inicioRegistro < bytes.length) {
    const conteudoBytes = bytes.slice(inicioRegistro);

    registros.push({
      conteudoBytes,
      tamanhoConteudo: conteudoBytes.length,
      tamanhoBruto: conteudoBytes.length,
      quebra: "EOF",
      temMultibyte: contemByteMultibyte(conteudoBytes),
    });
  }

  return registros;
}

function decodificarRegistros(registros: RegistroBytes[]) {
  return registros.map((registro) => textDecoder.decode(registro.conteudoBytes));
}

const InfoBox = memo(function InfoBox({ selecao }: { selecao: CampoSelecionado | null }) {
  if (!selecao) {
    return (
      <S.DetailsPanel>
        <S.PanelTitle>Campo selecionado</S.PanelTitle>
        <S.EmptyDetailsText>Clique em um trecho colorido da linha para ver posicao, tipo e descricao.</S.EmptyDetailsText>
      </S.DetailsPanel>
    );
  }

  const { campo, segmento } = selecao;

  return (
    <S.DetailsPanel>
      <S.PanelTitle>Campo selecionado</S.PanelTitle>
      <S.SegmentLabel>{segmento}</S.SegmentLabel>
      <S.FieldChip $borderColor={campo.bgColor}>
        <S.FieldColorSwatch $bgColor={campo.bgColor} />
        {campo.label}
      </S.FieldChip>

      <S.FieldDetails>
        <S.FieldDetail>
          <S.FieldTerm>Posicao</S.FieldTerm>
          <S.FieldDescription>{campo.inicio}-{campo.fim}</S.FieldDescription>
        </S.FieldDetail>
        {campo.descricao && (
          <S.FieldDetail>
            <S.FieldTerm>Descricao</S.FieldTerm>
            <S.FieldDescription>{campo.descricao}</S.FieldDescription>
          </S.FieldDetail>
        )}
        {campo.tipo && (
          <S.FieldDetail>
            <S.FieldTerm>Tipo</S.FieldTerm>
            <S.FieldDescription>{campo.tipo}</S.FieldDescription>
          </S.FieldDetail>
        )}
        {campo.conteudo && (
          <S.FieldDetail>
            <S.FieldTerm>Conteudo</S.FieldTerm>
            <S.FieldDescription>{campo.conteudo}</S.FieldDescription>
          </S.FieldDetail>
        )}
      </S.FieldDetails>
    </S.DetailsPanel>
  );
});


function resolverLayout(
  linha: string,
  banco: Banco
): Campo[] | null {
  const layouts = layoutsPorBanco[banco];
  if (!layouts || linha.length < 14) return null;

  const tipoRegistro = linha[7];
  const segmento = linha[13];

  if (tipoRegistro === "0") return layouts[0];
  if (tipoRegistro === "1") return layouts[1];

  if (tipoRegistro === "3") {
    if (segmento === "P") return layouts[2];
    if (segmento === "Q") return layouts[3];
    if (segmento === "R") return layouts[4];
  }

  if (tipoRegistro === "5") return layouts[5];
  if (tipoRegistro === "9") return layouts[6];

  return null;
}

function resolverSegmento(linha: string, banco: Banco): string {
  if (banco === "BARRAS SICREDI") return "Linha digitavel / codigo de barras";
  if (linha.length < 8) return "Registro nao identificado";

  const tipoRegistro = linha[7];
  const segmento = linha[13];

  if (tipoRegistro === "0") return "Header de arquivo";
  if (tipoRegistro === "1") return "Header de lote";
  if (tipoRegistro === "5") return "Trailer de lote";
  if (tipoRegistro === "9") return "Trailer de arquivo";

  if (tipoRegistro === "3") {
    if (segmento) return `Segmento ${segmento}`;
    return "Segmento de detalhe";
  }

  return "Registro nao identificado";
}

const CampoTooltip = memo(function CampoTooltip({ campo, segmento, open }: { campo: Campo; segmento: string; open: boolean }) {
  return (
    <S.TooltipBox
      initial={false}
      animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: TOOLTIP_ANIMATION_MS / 1000, ease: "easeOut" }}
    >
      <S.TooltipTitle>{campo.label}</S.TooltipTitle>
      <S.TooltipGrid>
        <S.TooltipRow>
          <S.TooltipTerm>Segmento</S.TooltipTerm>
          <S.TooltipValue>{segmento}</S.TooltipValue>
        </S.TooltipRow>
        <S.TooltipRow>
          <S.TooltipTerm>Posicao</S.TooltipTerm>
          <S.TooltipValue>{campo.inicio}-{campo.fim}</S.TooltipValue>
        </S.TooltipRow>
        {campo.descricao && (
          <S.TooltipRow>
            <S.TooltipTerm>Descricao</S.TooltipTerm>
            <S.TooltipValue>{campo.descricao}</S.TooltipValue>
          </S.TooltipRow>
        )}
        {campo.tipo && (
          <S.TooltipRow>
            <S.TooltipTerm>Tipo</S.TooltipTerm>
            <S.TooltipValue>{campo.tipo}</S.TooltipValue>
          </S.TooltipRow>
        )}
        {campo.conteudo && (
          <S.TooltipRow>
            <S.TooltipTerm>Conteudo</S.TooltipTerm>
            <S.TooltipValue>{campo.conteudo}</S.TooltipValue>
          </S.TooltipRow>
        )}
      </S.TooltipGrid>
    </S.TooltipBox>
  );
});

const CampoComTooltip = memo(function CampoComTooltip({
  campo,
  segmento,
  linhaIndex,
  texto,
  onSelect,
}: {
  campo: Campo;
  segmento: string;
  linhaIndex: number;
  texto: string;
  onSelect: (selecao: CampoSelecionado) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const showTooltip = () => {
    clearTimers();
    showTimer.current = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setOpen(true));
    }, TOOLTIP_SHOW_DELAY);
  };

  const hideTooltip = () => {
    clearTimers();
    hideTimer.current = setTimeout(() => {
      setOpen(false);
      hideTimer.current = setTimeout(() => setMounted(false), TOOLTIP_ANIMATION_MS);
    }, TOOLTIP_HIDE_DELAY);
  };

  return (
    <Tippy
      visible={mounted}
      placement="bottom"
      offset={[0, 8]}
      duration={0}
      render={(attrs) => (
        <div tabIndex={-1} {...attrs}>
          <CampoTooltip campo={campo} segmento={segmento} open={open} />
        </div>
      )}
    >
      <S.CnabField
        onClick={() => onSelect({ campo, segmento, linhaIndex })}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        $bgColor={campo.bgColor}
        $textColor={campo.textColor}
      >
        {texto}
      </S.CnabField>
    </Tippy>
  );
});


/**
 * RENDERIZA UMA LINHA
 */
function renderLinha(
  linha: string,
  banco: Banco,
  linhaIndex: number,
  onSelect: (selecao: CampoSelecionado) => void
) {
  let layout: Campo[] | null = null;
  const segmento = resolverSegmento(linha, banco);

  if (banco === "BARRAS SICREDI") {
    layout = layoutsPorBanco["BARRAS SICREDI"]?.[0] ?? null;
  } else {
    layout = resolverLayout(linha, banco);
  }

  if (!layout) return linha;

  let cursor = 0;
  const spans: JSX.Element[] = [];

  layout.forEach((campo, idx) => {
    const ini = campo.inicio - 1;
    const fim = campo.fim;

    if (cursor < ini) {
      spans.push(
        <S.PlainText key={`t-${idx}`}>
          {linha.slice(cursor, ini)}
        </S.PlainText>
      );
    }

    spans.push(
      <CampoComTooltip
        key={`c-${idx}`}
        campo={campo}
        segmento={segmento}
        linhaIndex={linhaIndex}
        texto={linha.slice(ini, fim)}
        onSelect={onSelect}
      />
    );

    cursor = fim;
  });

  return spans;
}

const CnabViewerLine = memo(function CnabViewerLine({
  linha,
  banco,
  linhaIndex,
  onSelect,
  top,
}: {
  linha: string;
  banco: Banco;
  linhaIndex: number;
  onSelect: (selecao: CampoSelecionado) => void;
  top: number;
}) {
  return (
    <S.CnabLine $top={top}>
      <S.LineNumber>{String(linhaIndex + 1).padStart(3, "0")}</S.LineNumber>
      <S.CnabCode>{renderLinha(linha, banco, linhaIndex, onSelect)}</S.CnabCode>
    </S.CnabLine>
  );
});

function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(360);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateHeight = () => setHeight(element.clientHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, height };
}

const VirtualizedCnabOutput = memo(function VirtualizedCnabOutput({
  linhas,
  banco,
  onSelect,
}: {
  linhas: string[];
  banco: Banco;
  onSelect: (selecao: CampoSelecionado) => void;
}) {
  const { ref, height } = useElementHeight<HTMLDivElement>();
  const [scrollTop, setScrollTop] = useState(0);
  const totalHeight = linhas.length * VIRTUAL_LINE_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_LINE_HEIGHT) - VIRTUAL_OVERSCAN);
  const endIndex = Math.min(
    linhas.length,
    Math.ceil((scrollTop + height) / VIRTUAL_LINE_HEIGHT) + VIRTUAL_OVERSCAN
  );
  const linhasVisiveis = linhas.slice(startIndex, endIndex);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  if (linhas.length === 0) {
    return (
      <S.CnabOutput ref={ref} aria-live="polite">
        <S.EmptyOutput>Cole um arquivo CNAB para visualizar os segmentos.</S.EmptyOutput>
      </S.CnabOutput>
    );
  }

  return (
    <S.CnabOutput ref={ref} aria-live="polite" onScroll={handleScroll}>
      <S.VirtualCnabScroller $height={totalHeight}>
        {linhasVisiveis.map((linha, index) => {
          const linhaIndex = startIndex + index;

          return (
            <CnabViewerLine
              key={linhaIndex}
              linha={linha}
              banco={banco}
              linhaIndex={linhaIndex}
              onSelect={onSelect}
              top={linhaIndex * VIRTUAL_LINE_HEIGHT}
            />
          );
        })}
      </S.VirtualCnabScroller>
    </S.CnabOutput>
  );
});

function obterIndiceVisualPorByte(linha: string, byteLimite: number) {
  let bytes = 0;

  for (let index = 0; index < linha.length;) {
    const codePoint = linha.codePointAt(index);
    const char = codePoint === undefined ? linha[index] : String.fromCodePoint(codePoint);
    const charBytes = textEncoder.encode(char).length;

    if (bytes + charBytes > byteLimite) return index;
    bytes += charBytes;
    index += char.length;
  }

  return linha.length;
}

function renderInputOverlay(linhasInput: string[], registrosBytes: RegistroBytes[], selecao: CampoSelecionado | null) {
  if (linhasInput.length === 0) return null;

  const renderVisibleSpaces = (text: string, keyPrefix: string) => {
    const parts = text.match(/ +|[^ ]+/g) ?? [];

    return parts.map((part, index) => {
      if (!part.startsWith(" ")) return part;

      return (
        <S.SpaceDot key={`${keyPrefix}-space-${index}`}>
          {"·".repeat(part.length)}
        </S.SpaceDot>
      );
    });
  };

  const renderLineText = (linha: string, idx: number) => {
    const tamanhoBytes = registrosBytes[idx]?.tamanhoConteudo ?? textEncoder.encode(linha).length;
    const overflowStart = obterIndiceVisualPorByte(linha, CNAB_RECORD_BYTES);
    const hasOverflow = tamanhoBytes > CNAB_RECORD_BYTES;
    const selectedCampo = selecao?.linhaIndex === idx ? selecao.campo : null;
    const selectedStart = selectedCampo ? selectedCampo.inicio - 1 : -1;
    const selectedEnd = selectedCampo ? selectedCampo.fim : -1;

    const breakpoints = new Set([0, linha.length, overflowStart]);

    if (selectedCampo) {
      breakpoints.add(Math.max(0, Math.min(linha.length, selectedStart)));
      breakpoints.add(Math.max(0, Math.min(linha.length, selectedEnd)));
    }

    const sortedBreakpoints = [...breakpoints].sort((a, b) => a - b);

    return sortedBreakpoints.slice(0, -1).map((start, index) => {
      const end = sortedBreakpoints[index + 1];
      const text = linha.slice(start, end);
      const selected = selectedCampo && start >= selectedStart && end <= selectedEnd;
      const overflow = hasOverflow && start >= overflowStart;
      const key = `${idx}-${start}-${end}`;

      if (selected) {
        return (
          <S.CnabInputHighlight
            key={key}
            $bgColor={selectedCampo.bgColor}
            $textColor={selectedCampo.textColor}
          >
            {renderVisibleSpaces(text, key)}
          </S.CnabInputHighlight>
        );
      }

      if (overflow) {
        return <S.OverflowInputText key={key}>{renderVisibleSpaces(text, key)}</S.OverflowInputText>;
      }

      return <S.PlainText key={key}>{renderVisibleSpaces(text, key)}</S.PlainText>;
    });
  };

  return linhasInput.map((linha, idx) => {
    const invalidLine = registrosBytes[idx]?.tamanhoConteudo !== CNAB_RECORD_BYTES;
    const lineBreak = idx < linhasInput.length - 1 ? "\n" : "";
    const content = (
      <S.PlainText>
        {renderLineText(linha, idx)}
      </S.PlainText>
    );

    return (
      <Fragment key={idx}>
        {invalidLine ? <S.InvalidInputLine>{content}</S.InvalidInputLine> : content}
        {lineBreak}
      </Fragment>
    );
  });
}

/**
 * COMPONENTE PRINCIPAL
 */
export default function CnabViewer() {
  const overlayRef = useRef<HTMLPreElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState("");
  const [bytesArquivo, setBytesArquivo] = useState<Uint8Array>(new Uint8Array());
  const [origemBytes, setOrigemBytes] = useState<"paste" | "file">("paste");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [campoSelecionado, setCampoSelecionado] = useState<CampoSelecionado | null>(null);
  const [banco, setBanco] = useState<Banco>("CAIXASIGCB");

  const registrosBytes = useMemo(() => analisarRegistrosBytes(bytesArquivo), [bytesArquivo]);
  const linhas = useMemo(() => decodificarRegistros(registrosBytes), [registrosBytes]);
  const temBomUtf8 = useMemo(() => comecaComBomUtf8(bytesArquivo), [bytesArquivo]);
  const resumoValidacao = useMemo(() => {
    const totalBytesConteudo = registrosBytes.reduce((total, registro) => total + registro.tamanhoConteudo, 0);
    const tamanhoInvalido = registrosBytes.find((registro) => registro.tamanhoConteudo !== CNAB_RECORD_BYTES);
    const linhasMultibyte = registrosBytes
      .map((registro, index) => (registro.temMultibyte ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);
    const linhasComCr = registrosBytes
      .map((registro, index) => (registro.quebra === "CR" ? index + 1 : null))
      .filter((linha): linha is number => linha !== null);

    return {
      totalBytesConteudo,
      bytesInvalidos: Boolean(tamanhoInvalido),
      resumoBytes: registrosBytes.length === 0 ? 0 : tamanhoInvalido?.tamanhoConteudo ?? CNAB_RECORD_BYTES,
      linhasMultibyte,
      linhasComCr,
      detalheTamanhoInvalido: tamanhoInvalido
        ? `Linha ${registrosBytes.indexOf(tamanhoInvalido) + 1}: ${tamanhoInvalido.tamanhoConteudo} bytes de conteudo, ${tamanhoInvalido.tamanhoBruto} bytes com ${tamanhoInvalido.quebra}`
        : "240 bytes por registro",
    };
  }, [registrosBytes]);
  const overlayContent = useMemo(
    () => renderInputOverlay(linhas, registrosBytes, campoSelecionado),
    [campoSelecionado, linhas, registrosBytes]
  );

  const atualizarTexto = useCallback((valor: string) => {
    setTexto(valor);
    setBytesArquivo(textEncoder.encode(valor));
    setOrigemBytes("paste");
    setNomeArquivo("");
  }, []);

  const selecionarCampo = useCallback((selecao: CampoSelecionado) => {
    setCampoSelecionado(selecao);
  }, []);

  const carregarArquivo = useCallback(async (arquivo: File) => {
    const bytes = new Uint8Array(await arquivo.arrayBuffer());
    const registros = analisarRegistrosBytes(bytes);

    setBytesArquivo(bytes);
    setTexto(decodificarRegistros(registros).join("\n"));
    setOrigemBytes("file");
    setNomeArquivo(arquivo.name);
    setCampoSelecionado(null);
  }, []);

  return (
    <>
      <S.GlobalStyle />
      <S.AppShell>
      <S.Titlebar>
        <S.WindowControls aria-hidden="true">
          <S.WindowControlDot $tone="red" />
          <S.WindowControlDot $tone="yellow" />
          <S.WindowControlDot $tone="green" />
        </S.WindowControls>
        <S.TitlebarCopy>
          <S.Eyebrow>CNAB240</S.Eyebrow>
          <S.Title>Visualizador de Remessa e Retorno</S.Title>
        </S.TitlebarCopy>
        <S.TitlebarStatus>
          <S.Pill>{linhas.length} linhas</S.Pill>
          <S.Pill $invalid={linhas.length > 0 && resumoValidacao.bytesInvalidos} $valid={linhas.length > 0 && !resumoValidacao.bytesInvalidos}>
            {resumoValidacao.resumoBytes} bytes
          </S.Pill>
        </S.TitlebarStatus>
      </S.Titlebar>

      <S.Workspace>
        <S.EditorPanel>
          <S.Toolbar>
            <S.ControlGroup>
              <S.PlainText>Layout</S.PlainText>
              <S.Select value={banco} onChange={e => setBanco(e.target.value as Banco)}>
                {bancos.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </S.Select>
            </S.ControlGroup>

            <S.Metrics>
              <S.HiddenFileInput
                ref={fileInputRef}
                type="file"
                onChange={(event) => {
                  const arquivo = event.target.files?.[0];
                  if (arquivo) void carregarArquivo(arquivo);
                  event.target.value = "";
                }}
              />
              <S.ActionButton type="button" onClick={() => fileInputRef.current?.click()}>
                Abrir arquivo
              </S.ActionButton>
              <S.Pill>{resumoValidacao.totalBytesConteudo} bytes conteudo</S.Pill>
              <S.Pill>{campoSelecionado?.campo.label ?? "Nenhum campo ativo"}</S.Pill>
            </S.Metrics>
          </S.Toolbar>

          <S.CnabInputShell>
            <S.CnabInputOverlay ref={overlayRef} aria-hidden="true">
              {overlayContent}
            </S.CnabInputOverlay>
            <S.CnabInput
              rows={7}
              wrap="off"
              spellCheck={false}
              placeholder="Cole o conteudo CNAB aqui..."
              value={texto}
              onScroll={(event) => {
                if (!overlayRef.current) return;
                overlayRef.current.scrollTop = event.currentTarget.scrollTop;
                overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }}
              onChange={(e) => atualizarTexto(e.target.value)}
            />
          </S.CnabInputShell>

          {(resumoValidacao.bytesInvalidos || temBomUtf8 || resumoValidacao.linhasMultibyte.length > 0 || resumoValidacao.linhasComCr.length > 0 || origemBytes === "paste") && (
            <S.ValidationSummary>
              {resumoValidacao.bytesInvalidos && <S.ValidationItem $tone="error">{resumoValidacao.detalheTamanhoInvalido}</S.ValidationItem>}
              {temBomUtf8 && <S.ValidationItem $tone="warning">Arquivo inicia com BOM UTF-8 (EF BB BF).</S.ValidationItem>}
              {resumoValidacao.linhasMultibyte.length > 0 && (
                <S.ValidationItem $tone="warning">
                  Caracteres multibyte nas linhas {resumoValidacao.linhasMultibyte.join(", ")}; uma posicao visual pode ocupar mais de 1 byte.
                </S.ValidationItem>
              )}
              {resumoValidacao.linhasComCr.length > 0 && (
                <S.ValidationItem $tone="warning">Quebra CR isolada nas linhas {resumoValidacao.linhasComCr.join(", ")}.</S.ValidationItem>
              )}
              {origemBytes === "paste" && texto && (
                <S.ValidationItem $tone="info">Conteudo colado validado pelos bytes UTF-8 gerados no navegador. Para validar o arquivo bruto, use Abrir arquivo.</S.ValidationItem>
              )}
            </S.ValidationSummary>
          )}

          <S.Legend>
            <S.LegendItem><S.LegendShortcut>X</S.LegendShortcut> Alfanumerico</S.LegendItem>
            <S.LegendItem><S.LegendShortcut>N</S.LegendShortcut> Numerico</S.LegendItem>
            <S.LegendItem><S.LegendShortcut>B</S.LegendShortcut> Branco</S.LegendItem>
          </S.Legend>
        </S.EditorPanel>

        <InfoBox selecao={campoSelecionado} />

        <S.ViewerPanel>
          <S.PanelHeader>
            <S.PlainText>Arquivo interpretado: {nomeArquivo || "conteudo colado"}</S.PlainText>
            <S.PlainText>{bancos.find((item) => item.value === banco)?.label}</S.PlainText>
          </S.PanelHeader>

          <VirtualizedCnabOutput linhas={linhas} banco={banco} onSelect={selecionarCampo} />
        </S.ViewerPanel>
      </S.Workspace>
      <S.Statusbar>
        <S.PlainText>Pronto</S.PlainText>
        <S.PlainText>Selecione trechos coloridos para inspecionar o layout</S.PlainText>
      </S.Statusbar>
    </S.AppShell>
    </>
  );
}
