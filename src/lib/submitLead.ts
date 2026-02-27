import { supabase } from "@/integrations/supabase/client";
import { validateLeadData } from "@/lib/leadValidation";

interface SubmitLeadParams {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    interest: string;
    challenge: string;
  };
  source: string;
  calculatorData?: Record<string, unknown> | null;
}

interface SubmitLeadResult {
  success: boolean;
  errors?: string[];
}

export async function submitLead({ formData, source, calculatorData }: SubmitLeadParams): Promise<SubmitLeadResult> {
  const dataToValidate = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
    company: formData.company,
    role: formData.role || null,
    interest: formData.interest,
    challenge: formData.challenge || null,
    source,
    page_url: window.location.href,
    calculator_data: calculatorData || null,
  };

  const validation = validateLeadData(dataToValidate);

  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  const { error } = await supabase.from('leads').insert(validation.data!);

  if (error) {
    console.error('Lead insert error:', error);
    return { success: false, errors: ['Erro ao salvar. Tente novamente.'] };
  }

  // Fire-and-forget notification
  supabase.functions.invoke('notify-new-lead', {
    body: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      role: formData.role,
      interest: formData.interest,
      challenge: formData.challenge,
      source,
    },
  }).catch((err) => console.error('Notification error:', err));

  return { success: true };
}
