import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminBlogEditorPage from "./pages/AdminBlogEditorPage";
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
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/admin/blog/novo" element={<AdminBlogEditorPage />} />
            <Route path="/admin/blog/editar/:id" element={<AdminBlogEditorPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
