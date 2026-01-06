-- Create leads table for storing contact form submissions
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Contact data
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  role TEXT,
  
  -- Interest and challenge
  interest TEXT NOT NULL,
  challenge TEXT,
  
  -- Lead source
  source TEXT DEFAULT 'website',
  page_url TEXT,
  
  -- Calculator data (if filled)
  calculator_data JSONB
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for contact forms)
CREATE POLICY "Allow public insert" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Allow authenticated read (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON public.leads
  FOR SELECT USING (auth.role() = 'authenticated');