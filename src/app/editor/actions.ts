'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import path from 'path';
import { 
  fallbackSettings, 
  fallbackProfile, 
  fallbackProjects, 
  fallbackBlogs, 
  fallbackSkills, 
  fallbackExperience, 
  fallbackEducation, 
  fallbackCertificates, 
  fallbackTestimonials, 
  fallbackServices, 
  fallbackSeo 
} from '@/lib/fallbackData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables.');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
};

// --- AUTHENTICATION SHIELD SYSTEM ---

const getExpectedSessionToken = () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'dhruv_secure_admin_password_2026';
  return crypto.createHash('sha256').update(`${username}:${password}`).digest('hex');
};

export async function loginAction(usernameInput: string, passwordInput: string) {
  try {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'dhruv_secure_admin_password_2026';

    if (usernameInput === username && passwordInput === password) {
      const token = getExpectedSessionToken();
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password credentials.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error.' };
  }
}

export async function checkAuthAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;
    if (!sessionToken) return false;
    return sessionToken === getExpectedSessionToken();
  } catch (err) {
    return false;
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Logout error.' };
  }
}

// --- DATABASE CMS CRUDS ---

export async function saveSettingsAction(settingsList: { key: string; value: string }[]) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = settingsList.map(item => ({
      key: item.key,
      value: item.value,
      category: 'general',
      status: 'active',
      updated_at: new Date().toISOString()
    }));

    const { error } = await admin
      .from('site_settings')
      .upsert(payload, { onConflict: 'key' });

    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveSettingsAction error:', err);
    return { success: false, error: err.message || 'Failed to update settings.' };
  }
}

export async function saveProfileAction(profile: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      bio: profile.bio,
      contact_email: profile.contactEmail,
      location: profile.location,
      resume_url: profile.resumeUrl,
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (profile.id && profile.id !== 'default-profile') {
      res = await admin.from('profiles').update(payload).eq('id', profile.id).select();
    } else {
      res = await admin.from('profiles').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveProfileAction error:', err);
    return { success: false, error: err.message || 'Failed to save profile.' };
  }
}

export async function saveProjectAction(project: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      title: project.title,
      slug: project.slug,
      subtitle: project.subtitle,
      role: project.role,
      company: project.company,
      timeline: project.timeline,
      problem: project.problem,
      challenge: project.challenge,
      solution: project.solution,
      tech_stack: Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack || '[]'),
      metrics: Array.isArray(project.metrics) ? project.metrics : JSON.parse(project.metrics || '[]'),
      screenshots: Array.isArray(project.screenshots) ? project.screenshots : JSON.parse(project.screenshots || '[]'),
      github_url: project.githubUrl,
      demo_url: project.demoUrl,
      is_featured: project.isFeatured === true || project.isFeatured === 1,
      is_pinned: project.isPinned === true || project.isPinned === 1,
      is_draft: project.isDraft === true || project.isDraft === 1,
      position: parseInt(project.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (project.id && !project.id.startsWith('project-')) {
      res = await admin.from('projects').update(payload).eq('id', project.id).select();
    } else {
      res = await admin.from('projects').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveProjectAction error:', err);
    return { success: false, error: err.message || 'Failed to save project.' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('projects').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteProjectAction error:', err);
    return { success: false, error: err.message || 'Failed to delete project.' };
  }
}

export async function saveBlogAction(post: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      title: post.title,
      slug: post.slug,
      content_markdown: post.contentMarkdown,
      categories: Array.isArray(post.categories) ? post.categories : JSON.parse(post.categories || '[]'),
      tags: Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]'),
      is_draft: post.isDraft === true || post.isDraft === 1,
      reading_time: parseInt(post.readingTime || '5', 10),
      published_at: post.isDraft ? null : (post.publishedAt || new Date().toISOString()),
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (post.id && !post.id.startsWith('blog-')) {
      res = await admin.from('blogs').update(payload).eq('id', post.id).select();
    } else {
      res = await admin.from('blogs').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveBlogAction error:', err);
    return { success: false, error: err.message || 'Failed to save blog post.' };
  }
}

export async function deleteBlogAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('blogs').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    revalidatePath('/blog');
    return { success: true };
  } catch (err: any) {
    console.error('deleteBlogAction error:', err);
    return { success: false, error: err.message || 'Failed to delete blog post.' };
  }
}

export async function saveSkillAction(skill: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      category_id: skill.categoryId,
      name: skill.name,
      proficiency: parseInt(skill.proficiency || '80', 10),
      position: parseInt(skill.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (skill.id && !skill.id.startsWith('s-')) {
      res = await admin.from('skills').update(payload).eq('id', skill.id).select();
    } else {
      res = await admin.from('skills').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveSkillAction error:', err);
    return { success: false, error: err.message || 'Failed to save skill.' };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('skills').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteSkillAction error:', err);
    return { success: false, error: err.message || 'Failed to delete skill.' };
  }
}

export async function saveTestimonialAction(testimonial: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      client_name: testimonial.clientName,
      client_role: testimonial.clientRole,
      client_company: testimonial.clientCompany,
      text: testimonial.text,
      avatar_url: testimonial.avatarUrl || '/uploads/hero_visual.png',
      position: parseInt(testimonial.position || '0', 10),
      status: testimonial.status || 'active',
      updated_at: new Date().toISOString(),
    };

    let res;
    if (testimonial.id && !testimonial.id.startsWith('test-')) {
      res = await admin.from('testimonials').update(payload).eq('id', testimonial.id).select();
    } else {
      res = await admin.from('testimonials').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveTestimonialAction error:', err);
    return { success: false, error: err.message || 'Failed to save testimonial.' };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteTestimonialAction error:', err);
    return { success: false, error: err.message || 'Failed to delete testimonial.' };
  }
}

// --- NEW CRUD ACTIONS (SERVICES, EXPERIENCES, EDUCATION, CERTIFICATES, SEO) ---

export async function saveServiceAction(service: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      name: service.name,
      description: service.description,
      icon: service.icon || 'CodeXml',
      position: parseInt(service.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString()
    };

    let res;
    if (service.id && !service.id.startsWith('service-')) {
      res = await admin.from('services').update(payload).eq('id', service.id).select();
    } else {
      res = await admin.from('services').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveServiceAction error:', err);
    return { success: false, error: err.message || 'Failed to save service.' };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('services').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteServiceAction error:', err);
    return { success: false, error: err.message || 'Failed to delete service.' };
  }
}

export async function saveExperienceAction(exp: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      company: exp.company,
      role: exp.role,
      timeline: exp.timeline,
      location: exp.location,
      description: exp.description,
      position: parseInt(exp.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString()
    };

    let res;
    if (exp.id && !exp.id.startsWith('exp-')) {
      res = await admin.from('experience').update(payload).eq('id', exp.id).select();
    } else {
      res = await admin.from('experience').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveExperienceAction error:', err);
    return { success: false, error: err.message || 'Failed to save experience.' };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('experience').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteExperienceAction error:', err);
    return { success: false, error: err.message || 'Failed to delete experience.' };
  }
}

export async function saveEducationAction(edu: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      institution: edu.institution,
      degree: edu.degree,
      timeline: edu.period || edu.timeline || '',
      location: edu.location || null,
      description: edu.description,
      position: parseInt(edu.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString()
    };

    let res;
    if (edu.id && !edu.id.startsWith('edu-')) {
      res = await admin.from('education').update(payload).eq('id', edu.id).select();
    } else {
      res = await admin.from('education').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveEducationAction error:', err);
    return { success: false, error: err.message || 'Failed to save education record.' };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('education').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteEducationAction error:', err);
    return { success: false, error: err.message || 'Failed to delete education record.' };
  }
}

export async function saveCertificateAction(cert: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      title: cert.title,
      issuer: cert.issuer,
      timeline: cert.timeline || '',
      score: parseInt(cert.score || '0', 10),
      suffix: cert.suffix || '',
      description: cert.description || '',
      position: parseInt(cert.position || '0', 10),
      status: 'active',
      updated_at: new Date().toISOString()
    };

    let res;
    if (cert.id && !cert.id.startsWith('cert-')) {
      res = await admin.from('certificates').update(payload).eq('id', cert.id).select();
    } else {
      res = await admin.from('certificates').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveCertificateAction error:', err);
    return { success: false, error: err.message || 'Failed to save certificate.' };
  }
}

export async function deleteCertificateAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin.from('certificates').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteCertificateAction error:', err);
    return { success: false, error: err.message || 'Failed to delete certificate.' };
  }
}

export async function saveSeoAction(seo: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      meta_description: seo.metaDescription,
      og_image: seo.ogImage || null,
      twitter_card: seo.twitterCard || 'summary_large_image',
      status: 'active',
      updated_at: new Date().toISOString()
    };

    let res;
    if (seo.id && !seo.id.startsWith('seo-')) {
      res = await admin.from('seo').update(payload).eq('id', seo.id).select();
    } else {
      // Upsert/Insert
      res = await admin.from('seo').upsert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveSeoAction error:', err);
    return { success: false, error: err.message || 'Failed to save SEO metadata.' };
  }
}


export async function saveSkillCategoryAction(cat: any) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const payload = {
      name: cat.name,
      position: parseInt(cat.position || '0', 10),
      status: 'active',
    };

    let res;
    if (cat.id) {
      res = await admin.from('skill_categories').update(payload).eq('id', cat.id).select();
    } else {
      res = await admin.from('skill_categories').insert([payload]).select();
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true, data: res.data?.[0] };
  } catch (err: any) {
    console.error('saveSkillCategoryAction error:', err);
    return { success: false, error: err.message || 'Failed to save skill category.' };
  }
}

export async function deleteSkillCategoryAction(id: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    // Cascade delete any child skills first
    await admin.from('skills').delete().eq('category_id', id);
    const res = await admin.from('skill_categories').delete().eq('id', id);

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('deleteSkillCategoryAction error:', err);
    return { success: false, error: err.message || 'Failed to delete skill category.' };
  }
}

// --- MESSAGES INBOX ACTIONS ---

export async function getMessagesAction() {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { data, error } = await admin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('getMessagesAction error:', err);
    return { success: false, error: err.message || 'Failed to fetch messages.', data: [] };
  }
}

export async function updateMessageStatusAction(id: string | number, status: string) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin
      .from('messages')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/editor');
    return { success: true };
  } catch (err: any) {
    console.error('updateMessageStatusAction error:', err);
    return { success: false, error: err.message || 'Failed to update message status.' };
  }
}

export async function deleteMessageAction(id: string | number) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/editor');
    return { success: true };
  } catch (err: any) {
    console.error('deleteMessageAction error:', err);
    return { success: false, error: err.message || 'Failed to delete message.' };
  }
}

export async function clearAllMessagesAction() {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin
      .from('messages')
      .delete()
      .not('id', 'is', null);

    if (error) throw error;
    revalidatePath('/editor');
    return { success: true };
  } catch (err: any) {
    console.error('clearAllMessagesAction error:', err);
    return { success: false, error: err.message || 'Failed to clear messages.' };
  }
}

export async function emptyTrashAction() {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    const admin = getAdminClient();
    const { error } = await admin
      .from('messages')
      .delete()
      .eq('status', 'trash');

    if (error) throw error;
    revalidatePath('/editor');
    return { success: true };
  } catch (err: any) {
    console.error('emptyTrashAction error:', err);
    return { success: false, error: err.message || 'Failed to empty recycle bin.' };
  }
}

export async function uploadResumeAction(formData: FormData) {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');
    
    const file = (formData.get('file') as File) || (formData.get('resume') as File);
    if (!file || typeof file === 'string') {
      throw new Error('No valid resume file provided.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const admin = getAdminClient();

    // Build a unique filename for Supabase Storage
    const origName = file.name || 'resume.pdf';
    const ext = path.extname(origName) || '.pdf';
    const filename = `resume_${Date.now()}${ext}`;

    // Clean up old resume files in the bucket to avoid stale copies
    try {
      const { data: existingFiles } = await admin.storage.from('resume').list('', { limit: 100 });
      if (existingFiles && existingFiles.length > 0) {
        const oldPaths = existingFiles.map((f: { name: string }) => f.name);
        await admin.storage.from('resume').remove(oldPaths);
      }
    } catch (cleanupErr) {
      console.warn('Could not clean up old resume files:', cleanupErr);
    }

    // Upload to Supabase Storage 'resume' bucket
    const { error: uploadError } = await admin.storage
      .from('resume')
      .upload(filename, buffer, {
        contentType: file.type || 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
    }

    // Get the public URL from Supabase Storage
    const { data: urlData } = admin.storage.from('resume').getPublicUrl(filename);
    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      throw new Error('Failed to generate public URL for uploaded resume.');
    }

    // Update the resume URL in site_settings and profiles tables
    try {
      await admin.from('site_settings').upsert({
        key: 'resumeUrl',
        value: publicUrl,
        category: 'general',
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      const { data: profiles } = await admin.from('profiles').select('id').eq('status', 'active').limit(1);
      if (profiles && profiles.length > 0) {
        await admin.from('profiles').update({
          resume_url: publicUrl,
          updated_at: new Date().toISOString()
        }).eq('id', profiles[0].id);
      }
    } catch (dbErr) {
      console.warn('DB update failed during resume upload (file is in Supabase Storage):', dbErr);
    }

    revalidatePath('/');
    revalidatePath('/editor');

    return { success: true, resumeUrl: publicUrl };
  } catch (err: any) {
    console.error('uploadResumeAction error:', err);
    return { success: false, error: err.message || 'Failed to upload resume file.' };
  }
}

export async function deleteResumeAction() {
  try {
    if (!(await checkAuthAction())) throw new Error('Unauthorized access.');

    const admin = getAdminClient();

    // Remove all files from the 'resume' bucket
    try {
      const { data: existingFiles } = await admin.storage.from('resume').list('', { limit: 100 });
      if (existingFiles && existingFiles.length > 0) {
        const filePaths = existingFiles.map((f: { name: string }) => f.name);
        await admin.storage.from('resume').remove(filePaths);
      }
    } catch (storageErr) {
      console.warn('Could not remove resume files from Supabase Storage:', storageErr);
    }

    // Clear the resume URL in site_settings and profiles tables
    try {
      await admin.from('site_settings').upsert({
        key: 'resumeUrl',
        value: '',
        category: 'general',
        status: 'active',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

      const { data: profiles } = await admin.from('profiles').select('id').eq('status', 'active').limit(1);
      if (profiles && profiles.length > 0) {
        await admin.from('profiles').update({
          resume_url: '',
          updated_at: new Date().toISOString()
        }).eq('id', profiles[0].id);
      }
    } catch (dbErr) {
      console.warn('DB update failed during resume delete:', dbErr);
    }

    revalidatePath('/');
    revalidatePath('/editor');

    return { success: true };
  } catch (err: any) {
    console.error('deleteResumeAction error:', err);
    return { success: false, error: err.message || 'Failed to delete resume.' };
  }
}

