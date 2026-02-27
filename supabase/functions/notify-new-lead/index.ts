import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { name, email, company, interest, source, challenge, phone, role } = await req.json();

    const recipients = [
      'basso.vidal.bp@gmail.com',
      'conrado@bvbp.com.br',
      'cristiano@bvbp.com.br',
    ];

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #38a169; padding-bottom: 10px;">
          🎯 Novo Lead — BVBP
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568; width: 120px;">Nome</td>
            <td style="padding: 8px 12px; color: #2d3748;">${name || '—'}</td>
          </tr>
          <tr style="background: #f7fafc;">
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Email</td>
            <td style="padding: 8px 12px; color: #2d3748;"><a href="mailto:${email}">${email || '—'}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Telefone</td>
            <td style="padding: 8px 12px; color: #2d3748;">${phone || '—'}</td>
          </tr>
          <tr style="background: #f7fafc;">
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Empresa</td>
            <td style="padding: 8px 12px; color: #2d3748;">${company || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Cargo</td>
            <td style="padding: 8px 12px; color: #2d3748;">${role || '—'}</td>
          </tr>
          <tr style="background: #f7fafc;">
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Interesse</td>
            <td style="padding: 8px 12px; color: #2d3748; font-weight: bold;">${interest || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; color: #4a5568;">Origem</td>
            <td style="padding: 8px 12px; color: #2d3748;">${source || '—'}</td>
          </tr>
        </table>
        ${challenge ? `
        <div style="margin-top: 16px; padding: 12px; background: #f7fafc; border-left: 3px solid #38a169; border-radius: 4px;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #4a5568;">Desafio:</p>
          <p style="margin: 0; color: #2d3748;">${challenge}</p>
        </div>
        ` : ''}
        <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
          Enviado automaticamente pelo site BVBP
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'BVBP Leads <onboarding@resend.dev>',
        to: recipients,
        subject: `[BVBP Lead] ${name} — ${interest || 'Contato'}`,
        html: htmlBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      return new Response(JSON.stringify({ error: 'Failed to send email', details: data }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in notify-new-lead:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
