import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPortalCompany } from "@/lib/clientPortalStore";

const AdminClientNewPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    segment: "",
    employees: "20",
    monthlyRevenue: "180000",
    recurringRevenue: "70000",
    monthlyOperationalCost: "120000",
    contactName: "",
    contactEmail: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const company = createPortalCompany({
      name: formData.name,
      segment: formData.segment,
      employees: Number(formData.employees),
      monthlyRevenue: Number(formData.monthlyRevenue),
      recurringRevenue: Number(formData.recurringRevenue),
      monthlyOperationalCost: Number(formData.monthlyOperationalCost),
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
    });

    navigate(`/app/admin/clients/${company.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Novo cliente | Portal BVBP</title>
      </Helmet>

      <div className="mx-auto max-w-3xl space-y-6">
        <section className="flex items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/app/admin/clients")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1B365D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Clientes
            </button>
            <h1 className="font-heading text-2xl font-bold text-[#1B365D]">Novo cliente</h1>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Empresa</Label>
              <Input id="name" value={formData.name} onChange={(event) => updateField("name", event.target.value)} required placeholder="Nome do cliente" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input id="segment" value={formData.segment} onChange={(event) => updateField("segment", event.target.value)} required placeholder="Serviços B2B" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Funcionários</Label>
              <Input id="employees" type="number" min="1" value={formData.employees} onChange={(event) => updateField("employees", event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Receita mensal</Label>
              <Input id="monthlyRevenue" type="number" min="0" value={formData.monthlyRevenue} onChange={(event) => updateField("monthlyRevenue", event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurringRevenue">Receita recorrente</Label>
              <Input id="recurringRevenue" type="number" min="0" value={formData.recurringRevenue} onChange={(event) => updateField("recurringRevenue", event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyOperationalCost">Custo operacional</Label>
              <Input id="monthlyOperationalCost" type="number" min="0" value={formData.monthlyOperationalCost} onChange={(event) => updateField("monthlyOperationalCost", event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contato</Label>
              <Input id="contactName" value={formData.contactName} onChange={(event) => updateField("contactName", event.target.value)} placeholder="Nome" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactEmail">E-mail do cliente</Label>
              <Input id="contactEmail" type="email" value={formData.contactEmail} onChange={(event) => updateField("contactEmail", event.target.value)} placeholder="cliente@empresa.com.br" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="corporate">
              <Save className="h-4 w-4" />
              Salvar cliente
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminClientNewPage;
