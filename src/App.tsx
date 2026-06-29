import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import CalculatorPage from "./pages/CalculatorPage";
import DiagnosticoOperacionalPage from "./pages/DiagnosticoOperacionalPage";
import SprintOtimizacaoPage from "./pages/SprintOtimizacaoPage";
import GestaoProjetosPage from "./pages/GestaoProjetosPage";
import RetainerGovernancaPage from "./pages/RetainerGovernancaPage";
import ProgramaCustomizadoPage from "./pages/ProgramaCustomizadoPage";
import ComparativoServicosPage from "./pages/ComparativoServicosPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import LoginPage from "./pages/LoginPage";
import { AdminAppShell } from "./components/admin/AdminAppShell";
import { PerformanceAppShell } from "./components/performance/PerformanceAppShell";
import { PortalEntryRedirect } from "./components/performance/PortalEntryRedirect";
import { ProtectedPerformanceRoute } from "./components/performance/ProtectedPerformanceRoute";
import AdminBlogHubPage from "./pages/admin/AdminBlogHubPage";
import AdminBlogEditorPortalPage from "./pages/admin/AdminBlogEditorPortalPage";
import AdminClientDetailPage from "./pages/admin/AdminClientDetailPage";
import AdminClientNewPage from "./pages/admin/AdminClientNewPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import PerformanceAutomationsPage from "./pages/performance/PerformanceAutomationsPage";
import PerformanceExecutionPage from "./pages/performance/PerformanceExecutionPage";
import PerformanceFunnelPage from "./pages/performance/PerformanceFunnelPage";
import PerformanceOverviewPage from "./pages/performance/PerformanceOverviewPage";
import PerformanceOperationsPage from "./pages/performance/PerformanceOperationsPage";
import PerformancePointersPage from "./pages/performance/PerformancePointersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculadora-roi" element={<CalculatorPage />} />
            <Route path="/diagnostico-operacional" element={<DiagnosticoOperacionalPage />} />
            <Route path="/sprint-otimizacao" element={<SprintOtimizacaoPage />} />
            <Route path="/gestao-projetos" element={<GestaoProjetosPage />} />
            <Route path="/retainer-governanca" element={<RetainerGovernancaPage />} />
            <Route path="/programa-customizado" element={<ProgramaCustomizadoPage />} />
            <Route path="/comparativo-servicos" element={<ComparativoServicosPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin/blog" element={<Navigate to="/app/admin/blog" replace />} />
            <Route path="/admin/blog/novo" element={<Navigate to="/app/admin/blog" replace />} />
            <Route path="/admin/blog/editar/:id" element={<Navigate to="/app/admin/blog" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/app"
              element={
                <ProtectedPerformanceRoute>
                  <Outlet />
                </ProtectedPerformanceRoute>
              }
            >
              <Route index element={<PortalEntryRedirect />} />
              <Route path="admin" element={<AdminAppShell />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="clients" element={<AdminClientsPage />} />
                <Route path="clients/new" element={<AdminClientNewPage />} />
                <Route path="clients/:companyId" element={<AdminClientDetailPage />} />
                <Route path="projects" element={<Navigate to="/app/admin/clients" replace />} />
                <Route path="blog" element={<Navigate to="/app/admin/content" replace />} />
                <Route path="content" element={<AdminBlogHubPage />} />
                <Route path="blog/new" element={<AdminBlogEditorPortalPage />} />
                <Route path="blog/edit/:draftId" element={<AdminBlogEditorPortalPage />} />
                <Route path="content/new" element={<AdminBlogEditorPortalPage />} />
                <Route path="content/edit/:draftId" element={<AdminBlogEditorPortalPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
              <Route path="performance" element={<PerformanceAppShell />}>
                <Route index element={<Navigate to="/app/performance/overview" replace />} />
                <Route path="overview" element={<PerformanceOverviewPage />} />
                <Route path="pointers" element={<PerformancePointersPage />} />
                <Route path="funnel" element={<PerformanceFunnelPage />} />
                <Route path="operations" element={<PerformanceOperationsPage />} />
                <Route path="execution" element={<PerformanceExecutionPage />} />
                <Route path="automations" element={<PerformanceAutomationsPage />} />
                <Route path="projects" element={<Navigate to="/app/performance/overview" replace />} />
                <Route path="improvements" element={<Navigate to="/app/performance/execution" replace />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
