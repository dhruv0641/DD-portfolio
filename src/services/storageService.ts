import { supabase, getSupabaseAdmin } from '@/lib/supabase';

export const storageService = {
  async getPublicUrl(bucketName: string, path: string): Promise<string> {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  },

  async uploadFile(bucketName: string, path: string, fileBody: any): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { data, error } = await admin.storage
        .from(bucketName)
        .upload(path, fileBody, {
          upsert: true,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const publicUrl = await this.getPublicUrl(bucketName, path);
      return { success: true, url: publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'File upload failed.' };
    }
  },

  async deleteFile(bucketName: string, path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.storage.from(bucketName).remove([path]);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'File deletion failed.' };
    }
  },

  async listFiles(bucketName: string, folderPath = ''): Promise<{ name: string; id: string; created_at: string; metadata: any }[]> {
    try {
      const admin = getSupabaseAdmin();
      const { data, error } = await admin.storage.from(bucketName).list(folderPath, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      });
      if (error) {
        console.error(`Error listing files in bucket ${bucketName}:`, error);
        return [];
      }
      return (data || []).map(item => ({
        name: item.name,
        id: item.id || '',
        created_at: item.created_at || '',
        metadata: item.metadata || null
      }));
    } catch (err) {
      console.error('List files error:', err);
      return [];
    }
  },
};
