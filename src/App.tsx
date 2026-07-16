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
import AuthConfirmPage from "./pages/AuthConfirmPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import { AdminAppShell } from "./components/admin/AdminAppShell";
import { PerformanceAppShell } from "./components/performance/PerformanceAppShell";
import { PortalEntryRedirect } from "./components/performance/PortalEntryRedirect";
import { ProtectedPerformanceRoute } from "./components/performance/ProtectedPerformanceRoute";
import AdminBlogHubPage from "./pages/admin/AdminBlogHubPage";
import AdminBlogEditorPortalPage from "./pages/admin/AdminBlogEditorPortalPage";
import AdminClientDetailPage from "./pages/admin/AdminClientDetailPage";
import AdminClientEditPage from "./pages/admin/AdminClientEditPage";
import AdminClientNewPage from "./pages/admin/AdminClientNewPage";
import AdminClientsPage from "./pages/admin/AdminClientsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import PerformanceExecutionPage from "./pages/performance/PerformanceExecutionPage";
import PerformanceOverviewPage from "./pages/performance/PerformanceOverviewPage";
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
            <Route path="/auth/confirm" element={<AuthConfirmPage />} />
            <Route path="/auth/set-password" element={<SetPasswordPage />} />
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
                <Route index element={<PerformanceOverviewPage />} />
                <Route path="pointers" element={<PerformancePointersPage />} />
                <Route path="initiatives" element={<PerformanceExecutionPage />} />
                <Route path="pdca" element={<Navigate to="/app/admin/initiatives" replace />} />
                <Route path="clients" element={<AdminClientsPage />} />
                <Route path="clients/new" element={<AdminClientNewPage />} />
                <Route path="clients/:companyId/edit" element={<AdminClientEditPage />} />
                <Route path="clients/company-bvbp" element={<Navigate to="/app/admin" replace />} />
                <Route path="clients/:companyId" element={<AdminClientDetailPage />} />
                <Route path="projects" element={<Navigate to="/app/admin/clients" replace />} />
                <Route path="blog" element={<Navigate to="/app/admin/content" replace />} />
                <Route path="content" element={<AdminBlogHubPage />} />
                <Route path="blog/new" element={<AdminBlogEditorPortalPage />} />
                <Route path="blog/edit/:draftId" element={<AdminBlogEditorPortalPage />} />
                <Route path="content/new" element={<AdminBlogEditorPortalPage />} />
                <Route path="content/edit/:draftId" element={<AdminBlogEditorPortalPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
              <Route path="performance" element={<PerformanceAppShell />}>
                <Route index element={<Navigate to="/app/performance/overview" replace />} />
                <Route path="overview" element={<PerformanceOverviewPage />} />
                <Route path="pointers" element={<PerformancePointersPage />} />
                <Route path="initiatives" element={<PerformanceExecutionPage />} />
                <Route path="pdca" element={<Navigate to="/app/performance/initiatives" replace />} />
                <Route path="funnel" element={<Navigate to="/app/performance/pointers?pillar=commercial" replace />} />
                <Route path="operations" element={<Navigate to="/app/performance/pointers?pillar=operation" replace />} />
                <Route path="execution" element={<Navigate to="/app/performance/initiatives" replace />} />
                <Route path="automations" element={<Navigate to="/app/performance/pointers?pillar=technology" replace />} />
                <Route path="projects" element={<Navigate to="/app/performance/overview" replace />} />
                <Route path="improvements" element={<Navigate to="/app/performance/initiatives" replace />} />
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
