import { memo, useCallback, useEffect, useRef, type Dispatch, type ReactNode, type RefObject, type SetStateAction, type UIEvent } from "react";
import { getBankBrand, type Banco, type CampoSelecionado, type RegistroBytes, type ResumoValidacao } from "../../contexts/CnabContext";
import * as S from "./styles";

type VisualizerPageProps = {
  banco: Banco;
  bancos: Array<{ value: Banco; label: string }>;
  campoSelecionado: CampoSelecionado | null;
  detailsPanel: ReactNode;
  hashArquivo: string;
  inputScrollTop: number;
  nomeArquivo: string;
  overlayContent: ReactNode;
  overlayRef: RefObject<HTMLDivElement | null>;
  origemBytes: "paste" | "file";
  registrosBytes: RegistroBytes[];
  resumoValidacao: ResumoValidacao;
  setBanco: Dispatch<SetStateAction<Banco>>;
  setInputScrollTop: Dispatch<SetStateAction<number>>;
  temBomUtf8: boolean;
  texto: string;
  atualizarTexto: (valor: string) => void;
  viewerOutput: ReactNode;
};

const VisualizerPage = memo(function VisualizerPage({
  banco,
  bancos,
  campoSelecionado,
  detailsPanel,
  hashArquivo,
  inputScrollTop,
  nomeArquivo,
  overlayContent,
  overlayRef,
  origemBytes,
  registrosBytes,
  resumoValidacao,
  setBanco,
  setInputScrollTop,
  temBomUtf8,
  texto,
  atualizarTexto,
  viewerOutput,
}: VisualizerPageProps) {
  const bankBrand = getBankBrand(banco);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lineBreakTrackRef = useRef<HTMLDivElement>(null);
  const syncingFromStateRef = useRef(false);

  const syncInputLayers = useCallback((scrollTop: number, scrollLeft = inputRef.current?.scrollLeft ?? 0) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = scrollTop;
      overlayRef.current.scrollLeft = scrollLeft;
    }
    if (lineBreakTrackRef.current) {
      lineBreakTrackRef.current.style.transform = `translateY(-${scrollTop}px)`;
    }
  }, [overlayRef]);

  useEffect(() => {
    if (!inputRef.current || Math.abs(inputRef.current.scrollTop - inputScrollTop) <= 1) return;
    syncingFromStateRef.current = true;
    inputRef.current.scrollTop = inputScrollTop;
    syncInputLayers(inputScrollTop);
    requestAnimationFrame(() => {
      syncingFromStateRef.current = false;
    });
  }, [inputScrollTop, syncInputLayers]);

  const handleInputScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = event.currentTarget;
    syncInputLayers(scrollTop, scrollLeft);
    if (!syncingFromStateRef.current) setInputScrollTop(scrollTop);
  };

  return (
    <S.Workspace>
      <S.EditorPanel>
        <S.Toolbar>
          <S.ToolbarMain>
            <S.ControlGroup>
              <S.PlainText>Layout</S.PlainText>
              <S.Select value={banco} onChange={(event) => setBanco(event.target.value as Banco)}>
                {bancos.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </S.Select>
            </S.ControlGroup>

            <S.Metrics>
              <S.LegendItem>
                <S.LegendShortcut>X</S.LegendShortcut> Alfanumérico
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendShortcut>N</S.LegendShortcut> Numérico
              </S.LegendItem>
              <S.LegendItem>
                <S.LegendShortcut>B</S.LegendShortcut> Branco
              </S.LegendItem>
              <S.Pill>{resumoValidacao.totalBytesConteudo} bytes de conteúdo</S.Pill>
              <S.Pill>{campoSelecionado?.campo.label ?? "Nenhum campo ativo"}</S.Pill>
            </S.Metrics>
          </S.ToolbarMain>
          <S.LineBreakHeader>Quebra</S.LineBreakHeader>
        </S.Toolbar>

        <S.CnabInputShell>
          <S.CnabInputEditor>
            <S.CnabInputOverlay ref={overlayRef} aria-hidden="true">
              {overlayContent}
            </S.CnabInputOverlay>
            <S.CnabInput
              ref={inputRef}
              rows={7}
              wrap="off"
              spellCheck={false}
              placeholder="Cole o conteudo CNAB aqui..."
              value={texto}
              onScroll={handleInputScroll}
              onChange={(event) => atualizarTexto(event.target.value)}
            />
          </S.CnabInputEditor>
          <S.LineBreakColumn aria-hidden="true">
            <S.LineBreakRows>
              <S.LineBreakMarkerTrack ref={lineBreakTrackRef} $scrollTop={inputScrollTop}>
                {registrosBytes.length > 0 ? (
                  registrosBytes.map((registro, index) => (
                    <S.LineBreakMarkerRow key={`${index}-${registro.quebra}`}>
                      <S.LineBreakBadge>{registro.quebra}</S.LineBreakBadge>
                    </S.LineBreakMarkerRow>
                  ))
                ) : (
                  <S.LineBreakMarkerRow>
                    <S.LineBreakEmpty>-</S.LineBreakEmpty>
                  </S.LineBreakMarkerRow>
                )}
              </S.LineBreakMarkerTrack>
            </S.LineBreakRows>
          </S.LineBreakColumn>
          </S.CnabInputShell>

        {(resumoValidacao.bytesInvalidos ||
          temBomUtf8 ||
          resumoValidacao.linhasMultibyte.length > 0 ||
          resumoValidacao.linhasComCr.length > 0 ||
          origemBytes === "paste") && (
          <S.ValidationSummary>
            {resumoValidacao.bytesInvalidos && (
              <S.ValidationItem $tone="error">{resumoValidacao.detalheTamanhoInvalido}</S.ValidationItem>
            )}
            {temBomUtf8 && <S.ValidationItem $tone="warning">Arquivo inicia com BOM UTF-8 (EF BB BF).</S.ValidationItem>}
            {resumoValidacao.linhasMultibyte.length > 0 && (
              <S.ValidationItem $tone="warning">
                Caracteres multibyte nas linhas {resumoValidacao.linhasMultibyte.join(", ")}; uma posicao visual pode
                ocupar mais de 1 byte.
              </S.ValidationItem>
            )}
            {resumoValidacao.linhasComCr.length > 0 && (
              <S.ValidationItem $tone="warning">Quebra CR isolada nas linhas {resumoValidacao.linhasComCr.join(", ")}.</S.ValidationItem>
            )}
            {origemBytes === "paste" && texto && (
              <S.ValidationItem $tone="info">
                Entrada manual validada pelos bytes UTF-8 gerados no navegador. Para validar o arquivo bruto, use Abrir arquivo no topo.
              </S.ValidationItem>
            )}
          </S.ValidationSummary>
        )}
      </S.EditorPanel>

      {detailsPanel}

      <S.ViewerPanel>
        <S.PanelHeader>
          <S.FileInfo>
            <S.PlainText>Arquivo interpretado: {nomeArquivo || "Não informado"}</S.PlainText>
            {hashArquivo && <S.HashText>SHA-256: {hashArquivo}</S.HashText>}
          </S.FileInfo>
          <S.PanelBrand>
            {bankBrand && (
              <S.BankLogo
                src={bankBrand.logoUrl}
                alt={`Logo ${bankBrand.nome}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            <S.PlainText>{bancos.find((item) => item.value === banco)?.label}</S.PlainText>
          </S.PanelBrand>
        </S.PanelHeader>

        {viewerOutput}
      </S.ViewerPanel>
    </S.Workspace>
  );
});

export default VisualizerPage;
