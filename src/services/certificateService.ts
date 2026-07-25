import { supabase } from '@/lib/supabase';
import { fallbackCertificates } from '@/lib/fallbackData';

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
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('status', 'active')
        .order('position', { ascending: true });

      if (error || !data) {
        console.warn('Error fetching certificates, using fallback data:', error);
        return fallbackCertificates;
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
    } catch (err) {
      console.warn('Network error in certificateService.getCertificates, using fallback:', err);
      return fallbackCertificates;
    }
  },
};
