import { z } from 'zod';
import type { Json } from '@/integrations/supabase/types';

// Lead form validation schema
export const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres" }),
  phone: z.string()
    .trim()
    .max(20, { message: "Telefone deve ter no máximo 20 caracteres" })
    .optional()
    .nullable()
    .transform(val => val || null),
  company: z.string()
    .trim()
    .min(2, { message: "Empresa deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Empresa deve ter no máximo 100 caracteres" }),
  role: z.string()
    .trim()
    .max(100, { message: "Cargo deve ter no máximo 100 caracteres" })
    .optional()
    .nullable()
    .transform(val => val || null),
  interest: z.string()
    .trim()
    .min(2, { message: "Interesse é obrigatório" })
    .max(200, { message: "Interesse deve ter no máximo 200 caracteres" }),
  challenge: z.string()
    .trim()
    .max(1000, { message: "Desafio deve ter no máximo 1000 caracteres" })
    .optional()
    .nullable()
    .transform(val => val || null),
  source: z.string().max(100).optional().default('website'),
  page_url: z.string().max(2000).optional().nullable(),
  calculator_data: z.unknown().optional().nullable(),
});

// Type that matches Supabase insert requirements
export interface ValidatedLeadData {
  name: string;
  email: string;
  phone?: string | null;
  company: string;
  role?: string | null;
  interest: string;
  challenge?: string | null;
  source?: string;
  page_url?: string | null;
  calculator_data?: Json | null;
}

// Validate lead data and return result with errors
export function validateLeadData(data: unknown): { 
  success: boolean; 
  data?: ValidatedLeadData; 
  errors?: string[] 
} {
  const result = leadSchema.safeParse(data);
  
  if (result.success) {
    return { 
      success: true, 
      data: result.data as ValidatedLeadData 
    };
  }
  
  const errors = result.error.errors.map(err => err.message);
  return { success: false, errors };
}
