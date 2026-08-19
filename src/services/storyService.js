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

export async function createStory(userId, story) {
    const { data, error } = await supabase
        .from('stories')
        .insert({
            user_id: userId,
            title: story.title,
            description: story.description,
            category: story.category,
            status: story.status,
            cover_image: story.coverImage,
            word_count: story.wordCount,
            chapters: story.chapters,
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        coverImage: data.cover_image,
        content: data.content,
        chapterTitle: data.chapter_title,
        wordCount: data.word_count,
        chapters: data.chapters,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export async function updateStoryMetadataInSupabase(storyId, metadata) {
    const payload = {
        title: metadata.title,
        description: metadata.description,
        category: metadata.category,
        cover_image: metadata.coverImage,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('stories')
        .update(payload)
        .eq('id', storyId)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        coverImage: data.cover_image,
        content: data.content,
        chapterTitle: data.chapter_title,
        wordCount: data.word_count,
        chapters: data.chapters,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export async function deleteStoryInSupabase(storyId) {
    const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

    if (error) throw error;

    return true;
}

export async function updateStoryInSupabase(storyId, updates) {
    const payload = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        status: updates.status,
        cover_image: updates.coverImage,
        content: updates.content,
        chapter_title: updates.chapterTitle,
        word_count: updates.wordCount,
        chapters: updates.chapters,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('stories')
        .update(payload)
        .eq('id', storyId)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        coverImage: data.cover_image,
        content: data.content,
        chapterTitle: data.chapter_title,
        wordCount: data.word_count,
        chapters: data.chapters,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export async function autosaveStoryInSupabase(storyId, draft) {
    const payload = {
        content: draft.content,
        chapter_title: draft.chapterTitle,
        word_count: draft.wordCount,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('stories')
        .update(payload)
        .eq('id', storyId)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        content: data.content,
        chapterTitle: data.chapter_title,
        wordCount: data.word_count,
        updatedAt: data.updated_at,
    };
}

export async function getChapters(storyId) {
    const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', storyId)
        .order('order_index', { ascending: true });

    if (error) throw error;

   return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
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

export async function createChapter(storyId, chapter = {}) {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!user) {
        throw new Error('Chưa đăng nhập.');
    }

    const { data, error } = await supabase
        .from('chapters')
        .insert({
            story_id: storyId,
            user_id: user.id,
            title: chapter.title || 'Phần mới',
            content: chapter.content || '',
            status: chapter.status || 'ongoing',
            word_count: chapter.wordCount || 0,
            order_index: chapter.orderIndex || 1,
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        storyId: data.story_id,
        userId: data.user_id,
        title: data.title,
        content: data.content || '',
        status: data.status,
        wordCount: data.word_count || 0,
        orderIndex: data.order_index,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export async function updateChapter(chapterId, updates) {
    const { data, error } = await supabase
        .from('chapters')
        .update({
            title: updates.title,
            content: updates.content,
            word_count: updates.wordCount,
            status: updates.status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId)
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        storyId: data.story_id,
        userId: data.user_id,
        title: data.title,
        content: data.content || '',
        status: data.status,
        wordCount: data.word_count || 0,
        orderIndex: data.order_index,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

export async function deleteChapterInSupabase(chapterId) {
    const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

    if (error) throw error;

    return true;
}