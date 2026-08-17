import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Pin, Archive, Edit2, Plus, Check } from 'lucide-react';
import { useStoryStore } from '../../store';
const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useStoryStore();
  const [items, setItems] = useState(notes);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#fef3c7' });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', null
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    setItems(notes);
  }, [notes]);

  const colors = [
    '#fef3c7', // yellow
    '#dbeafe', // blue
    '#f8a5a5', // red
    '#c7d2fe', // indigo
    '#d1fae5', // emerald
    '#fce7f3', // pink
  ];

  // Auto-save effect for new note
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (newNote.title.trim() || newNote.content.trim()) {
      setSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(() => {
        if (editingNoteId) {
          // Update existing note
          const updatedItems = items.map(n =>
            n.id === editingNoteId
              ? { ...n, title: newNote.title, content: newNote.content, color: newNote.color }
              : n
          );
          setItems(updatedItems);
          updateNote(editingNoteId, { ...newNote });
        }
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 1500);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [newNote, editingNoteId]);

  const handleAddNote = () => {
  if (newNote.title.trim()) {
    addNote({ storyId: 1, ...newNote });
    setNewNote({ title: '', content: '', color: '#fef3c7' });
    setEditingNoteId(null);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 1500);
  }
};

  const handleDeleteNote = (id) => {
  deleteNote(id);
  if (editingNoteId === id) {
    setNewNote({ title: '', content: '', color: '#fef3c7' });
    setEditingNoteId(null);
  }
};

  const handleEditNote = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      color: note.color
    });
    setEditingNoteId(note.id);
  };

  const handlePinNote = (id) => {
    const note = items.find(n => n.id === id);
    setItems([
      note,
      ...items.filter(n => n.id !== id),
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">💡 Ghi Chú Nhanh</h1>
        <p className="text-gray-400">Lưu giữ ý tưởng sơ khai, khái niệm của bạn (tự động lưu)</p>
      </motion.div>

      {/* New Note Creator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-xl border-2 border-dashed border-purple-500/50 bg-gray-800/50"
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                {editingNoteId ? 'Chỉnh sửa ghi chú' : 'Ghi chú mới'}
              </label>
              {saveStatus && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs font-semibold flex items-center gap-1 ${saveStatus === 'saved'
                    ? 'text-green-400'
                    : 'text-blue-400'
                    }`}
                >
                  {saveStatus === 'saved' ? (
                    <>
                      <Check size={14} /> Đã lưu
                    </>
                  ) : (
                    <>Đang lưu...</>
                  )}
                </motion.span>
              )}
            </div>
            <input
              type="text"
              placeholder="Tiêu đề ghi chú..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-4 py-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <textarea
              placeholder="Viết nội dung ghi chú (tự động lưu)..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 h-24 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              {colors.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setNewNote({ ...newNote, color })}
                  className={`w-6 h-6 rounded-full border-2 ${newNote.color === color ? 'border-white' : 'border-gray-600'
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {editingNoteId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setNewNote({ title: '', content: '', color: '#fef3c7' });
                    setEditingNoteId(null);
                    setSaveStatus(null);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold whitespace-nowrap"
                >
                  Hủy
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleAddNote}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold whitespace-nowrap disabled:opacity-50"
                disabled={!newNote.title.trim()}
              >
                <Plus size={18} className="inline mr-2" />
                {editingNoteId ? 'Cập nhật' : 'Thêm'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notes Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, rotate: 1 }}
            className={`p-6 rounded-lg shadow-xl border group relative transition-all ${editingNoteId === item.id
              ? 'border-purple-500 ring-2 ring-purple-500/50'
              : 'border-gray-700'
              }`}
            style={{ backgroundColor: item.color }}
          >
            {/* Content */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-800 text-sm whitespace-pre-wrap">{item.content}</p>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-700 opacity-60">
              {new Date(item.createdAt).toLocaleDateString('vi-VN')}
            </p>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEditNote(item)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                title="Chỉnh sửa"
              >
                <Edit2 size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handlePinNote(item.id)}
                className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                title="Ghim"
              >
                <Pin size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDeleteNote(item.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                title="Xóa"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-20 text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700"
        >
          <p className="text-4xl mb-4">📝</p>
          <h2 className="text-2xl font-bold text-white mb-2">Không có ghi chú</h2>
          <p className="text-gray-400">Tạo ghi chú đầu tiên để lưu giữ ý tưởng</p>
        </motion.div>
      )}
    </div>
  );
};

export default Notes;
