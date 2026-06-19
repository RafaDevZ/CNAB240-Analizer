import { Fragment, useRef, useState, type JSX } from "react";
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

function obterLinhasCnab(texto: string) {
  const normalizado = texto.replace(/\r/g, "");
  if (!normalizado) return [];

  return normalizado.split("\n");
}

function obterLinhasParaValidacao(linhas: string[]) {
  const linhasValidacao = [...linhas];

  while (linhasValidacao.length > 0 && linhasValidacao[linhasValidacao.length - 1] === "") {
    linhasValidacao.pop();
  }

  return linhasValidacao;
}

function InfoBox({ selecao }: { selecao: CampoSelecionado | null }) {
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
}


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

function CampoTooltip({ campo, segmento, open }: { campo: Campo; segmento: string; open: boolean }) {
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
}

function CampoComTooltip({
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
}


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

function renderInputOverlay(texto: string, selecao: CampoSelecionado | null) {
  if (!texto) return null;

  const linhasInput = texto.replace(/\r/g, "").split("\n");
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
    const overflowStart = Math.min(240, linha.length);
    const hasOverflow = linha.length > 240;
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
      const overflow = hasOverflow && start >= 240;
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
    const invalidLine = linha.length !== 240;
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
  const [texto, setTexto] = useState("");
  const [campoSelecionado, setCampoSelecionado] = useState<CampoSelecionado | null>(null);
  const [banco, setBanco] = useState<Banco>("CAIXASIGCB");

  const linhas = obterLinhasCnab(texto);
  const linhasValidacao = obterLinhasParaValidacao(linhas);
  const totalCaracteres = linhas.reduce((total, linha) => total + linha.length, 0);
  const tamanhosLinhas = linhasValidacao.map((linha) => linha.length);
  const colunasInvalidas = tamanhosLinhas.some((tamanho) => tamanho !== 240);
  const tamanhoInvalido = tamanhosLinhas.find((tamanho) => tamanho !== 240);
  const resumoColunas = tamanhosLinhas.length === 0 ? 0 : tamanhoInvalido ?? 240;

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
          <S.Pill $invalid={linhas.length > 0 && colunasInvalidas} $valid={linhas.length > 0 && !colunasInvalidas}>
            {resumoColunas} colunas
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
              <S.Pill>{totalCaracteres} caracteres</S.Pill>
              <S.Pill>{campoSelecionado?.campo.label ?? "Nenhum campo ativo"}</S.Pill>
            </S.Metrics>
          </S.Toolbar>

          <S.CnabInputShell>
            <S.CnabInputOverlay ref={overlayRef} aria-hidden="true">
              {renderInputOverlay(texto, campoSelecionado)}
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
              onChange={(e) => setTexto(e.target.value)}
            />
          </S.CnabInputShell>

          <S.Legend>
            <S.LegendItem><S.LegendShortcut>X</S.LegendShortcut> Alfanumerico</S.LegendItem>
            <S.LegendItem><S.LegendShortcut>N</S.LegendShortcut> Numerico</S.LegendItem>
            <S.LegendItem><S.LegendShortcut>B</S.LegendShortcut> Branco</S.LegendItem>
          </S.Legend>
        </S.EditorPanel>

        <InfoBox selecao={campoSelecionado} />

        <S.ViewerPanel>
          <S.PanelHeader>
            <S.PlainText>Arquivo interpretado</S.PlainText>
            <S.PlainText>{bancos.find((item) => item.value === banco)?.label}</S.PlainText>
          </S.PanelHeader>

          <S.CnabOutput aria-live="polite">
            {linhas.length === 0 ? (
              <S.EmptyOutput>Cole um arquivo CNAB para visualizar os segmentos.</S.EmptyOutput>
            ) : (
              linhas.map((linha, idx) => (
                <S.CnabLine key={idx}>
                  <S.LineNumber>{String(idx + 1).padStart(3, "0")}</S.LineNumber>
                  <S.CnabCode>{renderLinha(linha, banco, idx, setCampoSelecionado)}</S.CnabCode>
                </S.CnabLine>
              ))
            )}
          </S.CnabOutput>
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
