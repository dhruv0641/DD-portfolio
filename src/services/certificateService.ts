import { supabase } from '@/lib/supabase';

export interface CertificateData {
  id?: string;
  title: string;
  issuer: string;
  timeline?: string;
  score: number;
  suffix: string;
  description?: string;
  position: number;
}

export const certificateService = {
  async getCertificates(): Promise<CertificateData[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('status', 'active')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      issuer: row.issuer,
      timeline: row.timeline,
      score: row.score,
      suffix: row.suffix,
      description: row.description,
      position: row.position,
    }));
  },
};
