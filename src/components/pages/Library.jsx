import React from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../store';
import { supabase } from '../../lib/supabaseClient';
import { createStory, updateStoryMetadataInSupabase, deleteStoryInSupabase } from '../../services/storyService';
import { X } from 'lucide-react';
import searchBar from '../../assets/Thanh Search.png';
import Cropper from 'react-easy-crop';


const createImage = (url) => new Promise((resolve, reject) => { const img = new Image(); img.addEventListener('load', () => resolve(img)); img.addEventListener('error', reject); img.src = url; });
const getCroppedImg = async (src, crop) => {
  const image = await createImage(src);
  const canvas = document.createElement('canvas');
  canvas.width = 160; canvas.height = 212;
  const ctx = canvas.getContext('2d');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, 160, 212);
  return canvas.toDataURL('image/jpeg', 0.92);
};
import createBtn from '../../assets/Nut Tao moi.png';
import shelfImg from '../../assets/cai ke_1.png';
import bookImg from '../../assets/Book_1.png';
import editIcon from '../../assets/edit icon.png';
import coverSlot from '../../assets/them hinh sach vao day.png';

const ShelfRow = ({ label, storyList, hoveredBook, setHoveredBook, handleWriteStory, handleOpenEdit }) => {
  const [tooltipData, setTooltipData] = React.useState(null); // { x, y, story }
  const SHELF_LIMIT = 6;
  const [expanded, setExpanded] = React.useState(false);
  const overflow = Math.max(0, storyList.length - SHELF_LIMIT);
  const visibleBooks = expanded ? storyList : storyList.slice(0, SHELF_LIMIT);
  const scrollRef = React.useRef(null);

  return (
    <div className="mb-10" style={{ marginTop: 'px', overflow: 'visible' }}>
      <div className="flex items-baseline gap-4 mb-4">
        <p className="text-2xl font-bold" style={{ color: '#DD7E83', letterSpacing: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label.toUpperCase()}</p>
        {(overflow > 0 || expanded) && (
          <span
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setExpanded(v => !v)}
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 13, color: '#DD7E83', opacity: 0.6, cursor: 'pointer', letterSpacing: 0.3, borderBottom: '1px solid transparent', transition: 'opacity 0.2s, border-color 0.2s', userSelect: 'none', zIndex: 50, position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderBottomColor = '#DD7E83'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
            {expanded ? 'Thu gọn ←' : `+${overflow} truyện khác →`}
          </span>
        )}
      </div>
      <div style={{ position: 'relative', overflow: 'visible', marginTop: -122 }}>
        <div
          ref={scrollRef}
          className="flex pb-2 items-end"
          style={{
            gap: 'clamp(42px, 4vw, 40px)',
            overflowX: 'hidden',
            overflowY: 'hidden',
            position: 'relative',
            zIndex: 20,
            paddingLeft: 160,
            paddingRight: 8,
            transition: 'opacity 0.3s ease',
            justifyContent: 'flex-start',
            minHeight: 340,
            alignItems: 'flex-end',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}

        >
          {storyList.length === 0 ? (
            <div className="flex items-center justify-center w-full h-32" style={{ color: '#DD7E83', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Chưa có truyện nào</div>
          ) : (
            visibleBooks.map((story, index) => {
              const isHovered = hoveredBook?.id === story.id;
              const isFaded = hoveredBook && !isHovered;
              return (
                <div key={story.id} className="flex-shrink-0 flex flex-col items-center"
                  style={{
                    width: 160, position: 'relative', overflow: 'visible',
                    transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1) 120ms',
                    opacity: isFaded ? 0.88 : 1,
                  }}
                  onMouseEnter={(e) => { setHoveredBook(story); const r = e.currentTarget.getBoundingClientRect(); setTooltipData({ story, x: r.left + r.width / 500, y: r.bottom + 0 }); }}
                  onMouseLeave={() => { setHoveredBook(null); setTooltipData(null); }}>
                  <div className="cursor-pointer"
                    style={{ width: 160, height: 212, marginBottom: '-25px', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', transform: isHovered ? 'translateY(-13px) rotate(-0.7deg) scale(1.02)' : 'translateY(0) rotate(0deg) scale(1)', position: 'relative', zIndex: 30 }}
                    onClick={() => handleWriteStory(story)}>
                    <svg viewBox="0 0 160 212"
                      style={{
                        position: 'absolute',
                        top: 16.5,
                        left: 22,
                        right: 9.5,
                        bottom: 5,
                        width: 'auto',
                        height: 'auto',
                        zIndex: 1
                      }}
                      xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="bookShadow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%">
                          <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.25)" />
                        </filter>
                      </defs>
                      <rect x="0" y="0" width="160" height="212" rx="2" ry="2" fill="#F2C975" filter="url(#bookShadow)" />
                    </svg>
                    {story.coverImage && (
                      <img src={story.coverImage} alt="cover" style={{ position: 'absolute', top: 17, left: 22, right: 0, bottom: 16, width: '80%', objectFit: 'cover', zIndex: 2, borderRadius: 0, opacity: 0.92 }} />
                    )}
                    <img src={editIcon} alt="edit"
                      onClick={e => { e.stopPropagation(); handleOpenEdit(story); }}
                      style={{ position: 'absolute', width: 22, height: 22, right: -20, top: 16, zIndex: 35, opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
        {tooltipData && (
          <div style={{ position: 'fixed', left: tooltipData.x - 255, top: tooltipData.y + -260, zIndex: 99999, whiteSpace: 'nowrap', background: 'rgba(253,246,240,0.97)', border: '1px solid #e8c8c8', borderRadius: 10, padding: '8px 14px', pointerEvents: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: '#9b2335', marginBottom: 2 }}>{tooltipData.story.title}</p>
            <p style={{ fontSize: 11, color: '#DD7E83' }}>Chap {tooltipData.story.chapters || 0} • {tooltipData.story.wordCount || 0} từ</p>
          </div>
        )}
        <img src={shelfImg} alt="shelf" className="w-full" style={{ marginTop: '-8px', position: 'relative', zIndex: 25, height: 45, objectFit: 'fill' }} />
      </div>

    </div>
  );
};

const Library = () => {
  const { stories, setStories, setCurrentStory, setCurrentTab, addStory, updateStory, deleteStory } = useStoryStore();
  const [search, setSearch] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newStoryData, setNewStoryData] = React.useState({ title: '', description: '', category: '' });
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingStory, setEditingStory] = React.useState(null);
  const [editData, setEditData] = React.useState({ title: '', description: '', category: '', cover: null, coverPreview: null });
  const [actionError, setActionError] = React.useState(null);

  const handleOpenEdit = (story) => {
    setEditingStory(story);
    setEditData({ title: story.title, description: story.description || '', category: story.category || '', cover: null, coverPreview: story.coverImage || null });
    setActionError(null);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) { alert('Vui lòng nhập tên truyện'); return; }
    const metadata = { title: editData.title, description: editData.description, category: editData.category, ...(editData.coverPreview && { coverImage: editData.coverPreview }) };
    try {
      const updated = await updateStoryMetadataInSupabase(editingStory.id, metadata);
      updateStory(editingStory.id, updated);
      setShowEditModal(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật truyện:', err);
      setActionError('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  const handleDeleteStory = async () => {
    if (window.confirm(`Xóa truyện "${editingStory.title}"?`)) {
      try {
        await deleteStoryInSupabase(editingStory.id);
        deleteStory(editingStory.id);
        setShowEditModal(false);
      } catch (err) {
        console.error('Lỗi khi xóa truyện:', err);
        setActionError('Xóa thất bại, vui lòng thử lại.');
      }
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditData(d => ({ ...d, cover: file, coverPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const ongoingStories = stories.filter(s => s.status === 'ongoing');

  const handleWriteStory = (story) => {
    setCurrentStory(story);
    setCurrentTab('write');
  };

  const handleCreateStory = async () => {
    if (!newStoryData.title.trim()) { alert('Vui lòng nhập tên truyện'); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'); return; }

    try {
      const created = await createStory(user.id, {
        title: newStoryData.title,
        description: newStoryData.description,
        category: newStoryData.category,
        status: 'ongoing',
        wordCount: 0,
        chapters: 0,
        coverImage: newStoryData.coverPreview || null,
      });
      setStories([...stories, created]);
      setShowCreateModal(false);
      setNewStoryData({ title: '', description: '', category: '', coverPreview: null });
    } catch (err) {
      console.error('Lỗi khi tạo truyện:', err);
      setActionError('Tạo truyện thất bại, vui lòng thử lại.');
    }
  };

  const [hoveredBook, setHoveredBook] = React.useState(null);
  const [cropSrc, setCropSrc] = React.useState(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);
  const onCropComplete = React.useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);
  const handleConfirmCrop = async () => {
    const cropped = await getCroppedImg(cropSrc, croppedAreaPixels);
    setNewStoryData(d => ({ ...d, coverPreview: cropped }));
    setCropSrc(null);
  };

  return (
    <div className="min-h-screen p-8 pt-6" style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #f5ece4 60%, #ede0d8 100%)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-10" style={{ display: 'flex' }}>
        <div className="relative flex-1">
          <img src={searchBar} alt="search" className="w-full" style={{ maxHeight: 56 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="NHẬP TÌM KIẾM VÀO ĐÂY...."
            className="absolute inset-0 bg-transparent focus:outline-none px-6 text-lg font-bold w-full"
            style={{ color: '#9b2335' }}
          />
        </div>
        <img
          src={createBtn}
          alt="tạo mới"
          className="cursor-pointer hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-150 drop-shadow-lg hover:drop-shadow-xl"
          style={{ height: 56 }}
          onClick={() => { setActionError(null); setShowCreateModal(true); }}
        />
      </div>

      {/* Shelves */}
      <style>{`
  @keyframes slideInRight { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInLeft  { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: translateX(0); } }
  .anim-slide-right { animation: slideInRight 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
  .anim-slide-left  { animation: slideInLeft  0.38s cubic-bezier(0.22,1,0.36,1) forwards; }

`}</style>
      <div className="mt-40 anim-slide-left">
        {Array.from({ length: Math.ceil(stories.length / 6) }, (_, i) => (
          <ShelfRow
            key={i}
            label={i === 0 ? 'Thư Viện' : ''}
            storyList={stories.slice(i * 6, i * 6 + 6)}
            hoveredBook={hoveredBook}
            setHoveredBook={setHoveredBook}
            handleWriteStory={handleWriteStory}
            handleOpenEdit={handleOpenEdit}
          />
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(40,20,20,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowCreateModal(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ width: 420, borderRadius: 24, padding: '36px 32px', background: 'linear-gradient(160deg,#fdf6f0,#f5ece4)', border: '1px solid #e8c8c8', boxShadow: '0 24px 64px rgba(100,40,40,0.18)', animation: 'riseUp 0.38s cubic-bezier(0.22,1,0.36,1) forwards', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <style>{`@keyframes riseUp{from{opacity:0;transform:translateY(16px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
            {/* Header */}
            <div className="flex justify-between items-center" style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#9b2335', letterSpacing: 1 }}>Tạo Truyện Mới</p>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c4a0a3', fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>
            {/* Hero cover area */}
            <div className="flex flex-col items-center" style={{ marginBottom: 24 }}>
              <div onClick={() => document.getElementById('new-cover-upload').click()}
                className="cursor-pointer"
                style={{ width: 150, height: 210, borderRadius: 10, border: '1.5px dashed #DD7E83', background: 'rgba(253,240,240,0.8)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {newStoryData.coverPreview
                  ? <img src={newStoryData.coverPreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <>
                    <img src={bookImg} alt="placeholder" style={{ position: 'absolute', width: '90%', opacity: 0.1 }} />
                    <div style={{ zIndex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                      <span style={{ fontSize: 11, color: '#DD7E83', fontWeight: 600, lineHeight: 1.6 }}>Thêm bìa truyện</span>
                    </div>
                  </>}
              </div>
              <input id="new-cover-upload" type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => { setCropSrc(ev.target.result); setCrop({ x: 0, y: 0 }); setZoom(1); };
                reader.readAsDataURL(file);
              }} />
              {newStoryData.coverPreview && (
                <button onClick={() => document.getElementById('new-cover-upload').click()}
                  style={{ marginTop: 8, fontSize: 11, color: '#DD7E83', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Đổi ảnh</button>
              )}
            </div>
            {/* Crop modal */}
            {cropSrc && (
              <div style={{ position: 'fixed', zIndex: 100, background: 'rgba(10,5,5,0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 360, borderRadius: 20, overflow: 'hidden', background: 'rgba(40,20,20,0.7)', border: '1px solid rgba(220,180,180,0.2)', padding: 24 }}>
                  <p style={{ color: '#f5ece4', fontWeight: 700, fontSize: 15, marginBottom: 16, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Căn chỉnh bìa sách</p>
                  <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 10, overflow: 'hidden', background: '#1a0a0a' }}>
                    <Cropper image={cropSrc} crop={crop} zoom={zoom} aspect={160 / 212}
                      onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                  </div>
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#c4a0a3', fontSize: 11 }}>Thu phóng</span>
                    <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={e => setZoom(Number(e.target.value))}
                      style={{ flex: 1, accentColor: '#DD7E83' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button onClick={() => setCropSrc(null)}
                      style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', background: 'transparent', color: '#c4a0a3', cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
                    <button onClick={handleConfirmCrop}
                      style={{ flex: 2, padding: '9px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#e8727a,#c0392b)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>✅ Dùng ảnh này</button>
                  </div>
                </div>
              </div>
            )}
            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ label: 'Tên truyện *', key: 'title', placeholder: 'Tên truyện của bạn...' }, { label: 'Mô tả', key: 'description', placeholder: 'Tóm tắt nội dung...' }, { label: 'Thể loại', key: 'category', placeholder: 'Tình cảm, hành động...' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#DD7E83', letterSpacing: 1, display: 'block', marginBottom: 5 }}>{f.label.toUpperCase()}</label>
                  <input type="text" value={newStoryData[f.key]} onChange={e => setNewStoryData({ ...newStoryData, [f.key]: e.target.value })} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '9px 14px', borderRadius: 10, border: '1px solid #ead4d4', background: 'rgba(255,255,255,0.7)', color: '#2d0a0a', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            {/* Buttons */}
            {actionError && <p style={{ color: '#c0392b', fontSize: 12, marginTop: 12 }}>{actionError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={() => setShowCreateModal(false)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: 'transparent', color: '#c4a0a3', fontSize: 13, cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hủy</button>
              <button onClick={handleCreateStory}
                style={{ flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#e8727a,#c0392b)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: 0.5 }}>✨ Tạo truyện</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editingStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="rounded-2xl p-8 w-96 border shadow-2xl" style={{ backgroundColor: '#fdf6f0', borderColor: '#e8c8c8' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#9b2335' }}>✏️ Chỉnh Sửa Truyện</h2>
              <button onClick={() => setShowEditModal(false)}><X size={22} style={{ color: '#9b2335' }} /></button>
            </div>

            {/* Cover upload */}
            <div className="mb-4 flex flex-col items-center">
              <div
                className="w-24 h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden mb-2"
                style={{ borderColor: '#9b2335', backgroundColor: '#fff' }}
                onClick={() => document.getElementById('cover-upload').click()}
              >
                {editData.coverPreview
                  ? <img src={editData.coverPreview} alt="cover" className="w-full h-full object-cover" />
                  : <span className="text-3xl">📷</span>}
              </div>
              <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              <span className="text-xs" style={{ color: '#9b2335' }}>Nhấn để đổi ảnh bìa</span>
            </div>

            <div className="flex flex-col gap-4">
              {[{ label: 'Tên truyện *', key: 'title', placeholder: 'Tên truyện...' }, { label: 'Thể loại', key: 'category', placeholder: 'Tình cảm, hành động...' }, { label: 'Mô tả', key: 'description', placeholder: 'Tóm tắt nội dung...' }].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#9b2335' }}>{f.label}</label>
                  <input type="text" value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg border focus:outline-none" style={{ backgroundColor: '#fff', borderColor: '#e8c8c8', color: '#2d0a0a' }} />
                </div>
              ))}
            </div>

            {actionError && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 8 }}>{actionError}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={handleDeleteStory} className="py-2 px-4 rounded-lg font-semibold text-white" style={{ backgroundColor: '#c0392b' }}>🗑 Xóa</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2 rounded-lg" style={{ backgroundColor: '#e8c8c8', color: '#9b2335' }}>Hủy</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2 rounded-lg font-semibold text-white" style={{ backgroundColor: '#9b2335' }}>Lưu ✨</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Library;