import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import type { Banco, CampoSelecionado, RegistroBytes, ResumoValidacao } from "../contexts/CnabContext";
import AdvancedFilterPage from "../pages/AdvancedFilter";
import AmountValidationPage from "../pages/AmountValidation";
import BatchDashboardPage from "../pages/BatchDashboard";
import CnabExportPage from "../pages/CnabExport";
import CsvExportPage from "../pages/CsvExport";
import DateValidationPage from "../pages/DateValidation";
import DiagnosticsPage from "../pages/Diagnostics";
import ExportReportPage from "../pages/ExportReport";
import FieldComparePage from "../pages/FieldCompare";
import FieldDictionaryPage from "../pages/FieldDictionary";
import FieldValidationPage from "../pages/FieldValidation";
import FileComparePage from "../pages/FileCompare";
import FileMapPage from "../pages/FileMap";
import LayoutDetectionPage from "../pages/LayoutDetection";
import LineDetailsPage from "../pages/LineDetails";
import LineEditorPage from "../pages/LineEditor";
import MinimalGeneratorPage from "../pages/MinimalGenerator";
import SearchRecordsPage from "../pages/SearchRecords";
import SequenceValidationPage from "../pages/SequenceValidation";
import SqlCnabEditorPage from "../pages/SqlCnabEditor";
import SummaryPage from "../pages/Summary";
import TrailerValidationPage from "../pages/TrailerValidation";
import VisualizerPage from "../pages/Visualizer";

type AppRoutesProps = {
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

export default function AppRoutes(props: AppRoutesProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/visualizer" replace />} />
      <Route path="/visualizer" element={<VisualizerPage {...props} />} />
      <Route path="/diagnostics" element={<DiagnosticsPage />} />
      <Route path="/summary" element={<SummaryPage onOpenViewer={() => navigate("/visualizer")} />} />
      <Route path="/trailer-validation" element={<TrailerValidationPage />} />
      <Route path="/line-details" element={<LineDetailsPage onOpenViewer={() => navigate("/visualizer")} />} />
      <Route path="/field-validation" element={<FieldValidationPage />} />
      <Route path="/field-dictionary" element={<FieldDictionaryPage />} />
      <Route path="/field-compare" element={<FieldComparePage />} />
      <Route path="/date-validation" element={<DateValidationPage />} />
      <Route path="/amount-validation" element={<AmountValidationPage />} />
      <Route path="/advanced-filter" element={<AdvancedFilterPage />} />
      <Route path="/batch-dashboard" element={<BatchDashboardPage />} />
      <Route path="/file-map" element={<FileMapPage />} />
      <Route path="/line-editor" element={<LineEditorPage />} />
      <Route path="/search" element={<SearchRecordsPage />} />
      <Route path="/compare" element={<FileComparePage />} />
      <Route path="/sequence-validation" element={<SequenceValidationPage />} />
      <Route path="/csv-export" element={<CsvExportPage />} />
      <Route path="/cnab-export" element={<CnabExportPage />} />
      <Route path="/minimal-generator" element={<MinimalGeneratorPage />} />
      <Route path="/sql-cnab-editor" element={<SqlCnabEditorPage />} />
      <Route path="/export-report" element={<ExportReportPage />} />
      <Route path="/layout-detection" element={<LayoutDetectionPage />} />
      <Route path="*" element={<Navigate to="/visualizer" replace />} />
    </Routes>
  );
}
