import React from 'react';
import { useStoryStore } from '../../store';
import ShelfRow from '../ShelfRow';

const LibraryFull = () => {
  const { stories, setCurrentTab, setCurrentStory, updateStory, deleteStory } = useStoryStore();
  const [hoveredBook, setHoveredBook] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingStory, setEditingStory] = React.useState(null);
  const [editData, setEditData] = React.useState({ title: '', description: '', category: '', cover: null, coverPreview: null });

  const handleWriteStory = (story) => {
    setCurrentStory(story);
    setCurrentTab('write');
  };

  const handleOpenEdit = (story) => {
    setEditingStory(story);
    setEditData({ title: story.title, description: story.description || '', category: story.category || '', cover: null, coverPreview: story.coverImage || null });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen p-8 pt-6" style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #f5ece4 60%, #ede0d8 100%)' }}>
      <style>{`
        .sortable-ghost { opacity: 0.3 !important; }
        .sortable-chosen { cursor: grabbing !important; }
        .sortable-drag { opacity: 0.9 !important; filter: drop-shadow(0 8px 24px rgba(100,40,40,0.25)); }
      `}</style>
      <button
        onClick={() => setCurrentTab('library')}
        style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#DD7E83', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: 14, position: 'relative', zIndex: 50 }}>
        ← Quay lại
      </button>
      <div className="mt-10">
        {Array.from({ length: Math.ceil(stories.length / 6) }, (_, i) => (
          <ShelfRow
            key={i}
            label={i === 0 ? 'Tất Cả Truyện' : ''}
            storyList={stories.slice(i * 6, i * 6 + 6)}
            hoveredBook={hoveredBook}
            setHoveredBook={setHoveredBook}
            handleWriteStory={handleWriteStory}
            handleOpenEdit={handleOpenEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default LibraryFull;