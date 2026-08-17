import { supabase } from '../lib/supabaseClient';

export async function getStories(userId) {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Lỗi khi lấy stories:', error);
    throw error;
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    coverImage: row.cover_image,
    content: row.content,
    chapterTitle: row.chapter_title,
    wordCount: row.word_count,
    chapters: row.chapters,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}