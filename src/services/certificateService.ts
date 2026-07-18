import { supabase, getSupabaseAdmin } from '@/lib/supabase';

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

  async saveCertificate(cert: Partial<CertificateData>): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        title: cert.title,
        issuer: cert.issuer,
        timeline: cert.timeline,
        score: cert.score || 0,
        suffix: cert.suffix || '%',
        description: cert.description,
        position: cert.position || 0,
        updated_at: new Date().toISOString(),
      };

      const admin = getSupabaseAdmin();
      let res;
      if (cert.id) {
        res = await admin.from('certificates').update(payload).eq('id', cert.id);
      } else {
        res = await admin.from('certificates').insert([payload]);
      }

      if (res.error) {
        return { success: false, error: res.error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save certificate.' };
    }
  },

  async deleteCertificate(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from('certificates').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete certificate.' };
    }
  },
};
