'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

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

export async function saveSettingsAction(settingsList: { key: string; value: string }[]) {
  try {
    const admin = getAdminClient();
    for (const item of settingsList) {
      const { error } = await admin
        .from('site_settings')
        .update({ value: item.value, updated_at: new Date().toISOString() })
        .eq('key', item.key);
      if (error) throw error;
    }
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveSettingsAction error:', err);
    return { success: false, error: err.message || 'Failed to update settings.' };
  }
}

export async function saveProfileAction(profile: any) {
  try {
    const admin = getAdminClient();
    const payload = {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      bio: profile.bio,
      contact_email: profile.contactEmail,
      location: profile.location,
      resume_url: profile.resumeUrl,
      updated_at: new Date().toISOString(),
    };

    let res;
    if (profile.id && profile.id !== 'default-profile') {
      res = await admin.from('profiles').update(payload).eq('id', profile.id);
    } else {
      res = await admin.from('profiles').insert([payload]);
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveProfileAction error:', err);
    return { success: false, error: err.message || 'Failed to save profile.' };
  }
}

export async function saveProjectAction(project: any) {
  try {
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
      updated_at: new Date().toISOString(),
    };

    let res;
    if (project.id && !project.id.startsWith('project-')) {
      res = await admin.from('projects').update(payload).eq('id', project.id);
    } else {
      res = await admin.from('projects').insert([payload]);
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveProjectAction error:', err);
    return { success: false, error: err.message || 'Failed to save project.' };
  }
}

export async function deleteProjectAction(id: string) {
  try {
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
    const admin = getAdminClient();
    const payload = {
      title: post.title,
      slug: post.slug,
      content_markdown: post.contentMarkdown,
      categories: Array.isArray(post.categories) ? post.categories : JSON.parse(post.categories || '[]'),
      tags: Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]'),
      is_draft: post.isDraft === true || post.isDraft === 1,
      excerpt: post.excerpt,
      reading_time: parseInt(post.readingTime || '5', 10),
      published_at: post.isDraft ? null : (post.publishedAt || new Date().toISOString()),
      updated_at: new Date().toISOString(),
    };

    let res;
    if (post.id && !post.id.startsWith('blog-')) {
      res = await admin.from('blogs').update(payload).eq('id', post.id);
    } else {
      res = await admin.from('blogs').insert([payload]);
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return { success: true };
  } catch (err: any) {
    console.error('saveBlogAction error:', err);
    return { success: false, error: err.message || 'Failed to save blog post.' };
  }
}

export async function deleteBlogAction(id: string) {
  try {
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
      res = await admin.from('skills').update(payload).eq('id', skill.id);
    } else {
      res = await admin.from('skills').insert([payload]);
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveSkillAction error:', err);
    return { success: false, error: err.message || 'Failed to save skill.' };
  }
}

export async function deleteSkillAction(id: string) {
  try {
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
      res = await admin.from('testimonials').update(payload).eq('id', testimonial.id);
    } else {
      res = await admin.from('testimonials').insert([payload]);
    }

    if (res.error) throw res.error;
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('saveTestimonialAction error:', err);
    return { success: false, error: err.message || 'Failed to save testimonial.' };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
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
