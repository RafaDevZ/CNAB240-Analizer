import Tippy from "@tippyjs/react/headless";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, type JSX, type UIEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  CNAB_RECORD_BYTES,
  getBankBrand,
  resolverLayout,
  resolverSegmento,
  textEncoder,
  useCnab,
  type Banco,
  type Campo,
  type CampoSelecionado,
  type RegistroBytes,
} from "./contexts/CnabContext";
import { CnabProvider } from "./providers/CnabProvider";
import AppRoutes from "./routes";
import * as S from "./styles";

const TOOLTIP_SHOW_DELAY = 160;
const TOOLTIP_HIDE_DELAY = 90;
const TOOLTIP_ANIMATION_MS = 240;
const VIRTUAL_LINE_HEIGHT = 22;
const VIRTUAL_OVERSCAN = 8;

export const InfoBox = memo(function InfoBox({ selecao }: { selecao: CampoSelecionado | null }) {
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

  layout = resolverLayout(linha, banco);

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

export const VirtualizedCnabOutput = memo(function VirtualizedCnabOutput({
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
    const registro = registrosBytes[idx];
    const invalidLine = registro?.tamanhoConteudo !== CNAB_RECORD_BYTES;
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
function CnabShell() {
  const {
    banco,
    bancos,
    campoSelecionado,
    contentRevision,
    hashArquivo,
    layoutDetection,
    linhas,
    nomeArquivo,
    origemBytes,
    registrosBytes,
    resumoValidacao,
    temBomUtf8,
    texto,
    atualizarTexto,
    carregarArquivo,
    selecionarCampo,
    setBanco,
  } = useCnab();
  const overlayRef = useRef<HTMLPreElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputScrollTop, setInputScrollTop] = useState(0);
  const [dismissedLayoutSuggestion, setDismissedLayoutSuggestion] = useState("");
  const overlayContent = useMemo(
    () => renderInputOverlay(linhas, registrosBytes, campoSelecionado),
    [campoSelecionado, linhas, registrosBytes]
  );
  const suggestedLayout = layoutDetection.candidates[0];
  const currentBankBrand = getBankBrand(banco);
  const suggestedBankBrand = suggestedLayout ? getBankBrand(suggestedLayout.banco) : null;
  const layoutSuggestionKey = suggestedLayout
    ? `${contentRevision}-${suggestedLayout.banco}-${suggestedLayout.score}`
    : "";
  const showLayoutSuggestion =
    registrosBytes.length > 0 &&
    suggestedLayout &&
    suggestedLayout.score >= 50 &&
    dismissedLayoutSuggestion !== layoutSuggestionKey;
  const suggestedLayoutAlreadySelected = suggestedLayout?.banco === banco;

  const dismissLayoutSuggestion = () => {
    setDismissedLayoutSuggestion(layoutSuggestionKey);
  };

  const applySuggestedLayout = () => {
    if (!suggestedLayout) return;
    setBanco(suggestedLayout.banco);
    setDismissedLayoutSuggestion(layoutSuggestionKey);
  };

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
          <S.TitleLine>
            {currentBankBrand && (
              <S.BankLogo
                src={currentBankBrand.logoUrl}
                alt={`Logo ${currentBankBrand.nome}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            <S.Title>CNAB Studio</S.Title>
          </S.TitleLine>
        </S.TitlebarCopy>
        <S.TitlebarStatus>
          <S.Pill>{linhas.length} linhas</S.Pill>
          <S.Pill $invalid={linhas.length > 0 && resumoValidacao.bytesInvalidos} $valid={linhas.length > 0 && !resumoValidacao.bytesInvalidos}>
            {resumoValidacao.resumoBytes} bytes
          </S.Pill>
        </S.TitlebarStatus>
      </S.Titlebar>

      <S.AppBody>
        <S.Sidebar aria-label="Navegacao principal">
          <S.SidebarTitle>Ferramentas</S.SidebarTitle>
          <S.SidebarNav>
            <S.SidebarGroup>
              <S.SidebarGroupTitle>Principal</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/visualizer">
                Analisar arquivo
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/diagnostics">
                Diagnóstico
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/summary">
                Resumo
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/layout-detection">
                Detectar layout
              </S.SidebarLink>
            </S.SidebarGroup>

            <S.SidebarGroup>
              <S.SidebarGroupTitle>Validações</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/trailer-validation">
                Trailer
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/field-validation">
                Campos
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/sequence-validation">
                Sequência
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/date-validation">
                Datas
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/amount-validation">
                Valores
              </S.SidebarLink>
            </S.SidebarGroup>

            <S.SidebarGroup>
              <S.SidebarGroupTitle>Exploração</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/file-map">
                Mapa visual
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/line-details">
                Detalhes da linha
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/search">
                Busca
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/advanced-filter">
                Filtro avançado
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/batch-dashboard">
                Dashboard lote
              </S.SidebarLink>
            </S.SidebarGroup>

            <S.SidebarGroup>
              <S.SidebarGroupTitle>Comparação</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/compare">
                Arquivos
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/field-compare">
                Campos
              </S.SidebarLink>
            </S.SidebarGroup>

            <S.SidebarGroup>
              <S.SidebarGroupTitle>Exportação</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/csv-export">
                CSV
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/export-report">
                Relatório
              </S.SidebarLink>
            </S.SidebarGroup>

            <S.SidebarGroup>
              <S.SidebarGroupTitle>Apoio</S.SidebarGroupTitle>
              <S.SidebarLink as={NavLink} to="/field-dictionary">
                Dicionário
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/line-editor">
                Editor assistido
              </S.SidebarLink>
              <S.SidebarLink as={NavLink} to="/minimal-generator">
                Gerador mínimo
              </S.SidebarLink>
            </S.SidebarGroup>
          </S.SidebarNav>
        </S.Sidebar>

        <AppRoutes
          banco={banco}
          bancos={bancos}
          campoSelecionado={campoSelecionado}
          detailsPanel={<InfoBox selecao={campoSelecionado} />}
          fileInputRef={fileInputRef}
          hashArquivo={hashArquivo}
          inputScrollTop={inputScrollTop}
          nomeArquivo={nomeArquivo}
          overlayContent={overlayContent}
          overlayRef={overlayRef}
          origemBytes={origemBytes}
          registrosBytes={registrosBytes}
          resumoValidacao={resumoValidacao}
          setBanco={setBanco}
          setInputScrollTop={setInputScrollTop}
          temBomUtf8={temBomUtf8}
          texto={texto}
          atualizarTexto={atualizarTexto}
          carregarArquivo={carregarArquivo}
          viewerOutput={<VirtualizedCnabOutput linhas={linhas} banco={banco} onSelect={selecionarCampo} />}
        />
      </S.AppBody>
      <AnimatePresence>
        {showLayoutSuggestion && (
          <S.ModalBackdrop
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={dismissLayoutSuggestion}
          >
            <S.ModalCard
              as={motion.div}
              role="dialog"
              aria-modal="true"
              aria-labelledby="layout-suggestion-title"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <S.ModalHeader>
                {suggestedBankBrand && (
                  <S.ModalLogo
                    src={suggestedBankBrand.logoUrl}
                    alt={`Logo ${suggestedBankBrand.nome}`}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <S.ModalEyebrow>Layout sugerido</S.ModalEyebrow>
              </S.ModalHeader>
              <S.ModalTitle id="layout-suggestion-title">
                {suggestedLayoutAlreadySelected ? `${suggestedLayout.label} detectado` : `Trocar para ${suggestedLayout.label}?`}
              </S.ModalTitle>
              <S.ModalText>
                {suggestedLayoutAlreadySelected
                  ? `O arquivo parece combinar com o layout atual, ${suggestedLayout.label} (${suggestedLayout.score}% de confiança).`
                  : `O arquivo parece combinar melhor com ${suggestedLayout.label} (${suggestedLayout.score}% de confiança). Quer trocar o layout do visualizador agora?`}
              </S.ModalText>
              <S.ModalActions>
                <S.ActionButton type="button" onClick={applySuggestedLayout}>
                  {suggestedLayoutAlreadySelected ? "Manter layout" : "Trocar layout"}
                </S.ActionButton>
                <S.ActionButton type="button" onClick={dismissLayoutSuggestion}>
                  Agora não
                </S.ActionButton>
              </S.ModalActions>
            </S.ModalCard>
          </S.ModalBackdrop>
        )}
      </AnimatePresence>
      <S.Statusbar>
        <S.PlainText>CNAB Studio v1.1.0</S.PlainText>
        <S.PlainText>by: Kaneyo</S.PlainText>
      </S.Statusbar>
    </S.AppShell>
    </>
  );
}

export default function CnabViewer() {
  return (
    <CnabProvider>
      <CnabShell />
    </CnabProvider>
  );
}
