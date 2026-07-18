'use client';

import React, { useState, useEffect } from 'react';
import { getBucketFiles, uploadMediaFile, deleteMediaFile } from '@/app/actions/media';
import Toast from './Toast';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultBucket?: string;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect, defaultBucket = 'projects' }: MediaLibraryModalProps) {
  const [bucket, setBucket] = useState(defaultBucket);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const bucketsList = [
    { id: 'projects', label: 'Projects' },
    { id: 'blog-images', label: 'Blog Images' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'resume', label: 'Resume' },
    { id: 'profile-images', label: 'Profile' },
    { id: 'site-assets', label: 'Site Assets' }
  ];

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await getBucketFiles(bucket);
      setFiles(data);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load media files.', type: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, bucket]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const res = await uploadMediaFile(bucket, fileName, base64Data, file.type);
        
        if (res.success && res.url) {
          setToast({ message: 'Asset uploaded successfully.', type: 'success' });
          fetchFiles();
        } else {
          setToast({ message: res.error || 'Upload failed.', type: 'error' });
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Upload error.', type: 'error' });
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      const res = await deleteMediaFile(bucket, fileName);
      if (res.success) {
        setToast({ message: 'Asset deleted successfully.', type: 'success' });
        fetchFiles();
      } else {
        setToast({ message: res.error || 'Deletion failed.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Deletion error.', type: 'error' });
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setToast({ message: 'Public URL copied to clipboard.', type: 'success' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-[900px] h-[80vh] bg-[#0d0d10] border border-[#1a1a22] rounded-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1a1a22] flex justify-between items-center bg-[#070708]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-wider text-gray-400">MEDIA MANAGER</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer font-mono text-xs">
            [ CLOSE ]
          </button>
        </div>

        {/* Action Panel */}
        <div className="p-6 border-b border-[#1a1a22] flex flex-wrap gap-4 items-center justify-between bg-[#0d0d10]">
          <div className="flex gap-2">
            {bucketsList.map(b => (
              <button
                key={b.id}
                onClick={() => setBucket(b.id)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  bucket === b.id 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'bg-[#16161e] border border-[#222] text-gray-400 hover:text-white'
                }`}
              >
                {b.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div>
            <label className="bg-white text-black px-4 py-2 rounded text-xs font-mono font-medium hover:bg-gray-200 transition-colors cursor-pointer select-none">
              {uploading ? 'UPLOADING...' : 'UPLOAD NEW FILE'}
              <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#070708]">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs font-mono text-gray-500">
              SCANNING REPOSITORY FILES...
            </div>
          ) : files.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-mono text-gray-500">
              NO FILES FOUND IN THIS STORAGE BUCKET
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {files.map(f => {
                // Get URL dynamically
                const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${f.name}`;
                const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name);
                
                return (
                  <div key={f.id || f.name} className="bg-[#0d0d10] border border-[#1a1a22] rounded-lg overflow-hidden group flex flex-col justify-between">
                    <div className="aspect-square w-full bg-[#111116] flex items-center justify-center relative overflow-hidden border-b border-[#1a1a22]">
                      {isImage ? (
                        <img src={publicUrl} alt={f.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="font-mono text-[10px] text-gray-500 uppercase">{f.name.split('.').pop()} FILE</span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-2">
                      <div className="text-[10px] font-mono text-gray-300 truncate" title={f.name}>{f.name}</div>
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleCopyUrl(publicUrl)}
                          className="bg-[#16161e] border border-[#222] hover:bg-gray-800 text-[9px] font-mono text-gray-400 hover:text-white px-2 py-1 rounded cursor-pointer"
                        >
                          COPY URL
                        </button>
                        <button
                          onClick={() => onSelect(publicUrl)}
                          className="bg-[var(--accent)] text-white text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
                        >
                          SELECT
                        </button>
                        <button
                          onClick={() => handleDelete(f.name)}
                          className="bg-red-950/20 text-red-400 hover:bg-red-900/40 text-[9px] font-mono px-2 py-1 rounded cursor-pointer"
                        >
                          DEL
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
