import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, X, ArrowLeft } from 'lucide-react';
import { useStoryStore } from '../../store';

const Moodboard = () => {
  const { moodboardCollections, setMoodboardCollections, addMoodboardCollection, updateMoodboardCollection, addImageToCollection, deleteMoodboardCollection } = useStoryStore();
  const [collections, setCollections] = useState(moodboardCollections || []);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasteMode, setShowPasteMode] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [pastedImages, setPastedImages] = useState([]);
  const fileInputRef = React.useRef(null);

  // Sync store collections with local state
  React.useEffect(() => {
    setCollections(moodboardCollections || []);
  }, [moodboardCollections]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      alert('Vui lòng nhập tên bộ sưu tập');
      return;
    }
    const newCollection = {
      name: newCollectionName,
      images: [],
      createdAt: new Date(),
      id: Date.now()
    };
    addMoodboardCollection(newCollection);
    setCollections([...collections, newCollection]);
    setShowCreateModal(false);
    setNewCollectionName('');
  };

  const handleDeleteCollection = (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa bộ sưu tập này?')) {
      deleteMoodboardCollection(id);
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: event.target.result,
          title: file.name,
          type: 'image'
        };
        if (selectedCollection) {
          const updatedCollection = {
            ...selectedCollection,
            images: [...(selectedCollection.images || []), newImage]
          };
          setSelectedCollection(updatedCollection);
          updateMoodboardCollection(selectedCollection.id, updatedCollection);
          const updatedCollections = collections.map(c =>
            c.id === selectedCollection.id ? updatedCollection : c
          );
          setCollections(updatedCollections);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePasteImage = (e) => {
    const items = (e.clipboardData || window.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            url: event.target.result,
            title: `Hình ảnh ${Date.now()}`,
            type: 'image'
          };
          setPastedImages([...pastedImages, newImage]);
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleConfirmPaste = () => {
    if (selectedCollection && pastedImages.length > 0) {
      const updatedCollection = {
        ...selectedCollection,
        images: [...(selectedCollection.images || []), ...pastedImages]
      };
      setSelectedCollection(updatedCollection);
      updateMoodboardCollection(selectedCollection.id, updatedCollection);
      const updatedCollections = collections.map(c =>
        c.id === selectedCollection.id ? updatedCollection : c
      );
      setCollections(updatedCollections);
      setPastedImages([]);
      setShowPasteMode(false);
    }
  };

  const handleDeleteImage = (imageId) => {
    if (selectedCollection) {
      const updatedCollection = {
        ...selectedCollection,
        images: (selectedCollection.images || []).filter(img => img.id !== imageId)
      };
      setSelectedCollection(updatedCollection);
      updateMoodboardCollection(selectedCollection.id, updatedCollection);
      const updatedCollections = collections.map(c =>
        c.id === selectedCollection.id ? updatedCollection : c
      );
      setCollections(updatedCollections);
    }
  };

  if (selectedCollection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <button
            onClick={() => setSelectedCollection(null)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all text-cyan-400"
            title="Quay lại"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">📚 {selectedCollection.name}</h1>
            <p className="text-gray-400">Quản lý hình ảnh bộ sưu tập</p>
          </div>
        </motion.div>

        {/* Paste Mode */}
        {showPasteMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg"
          >
            <p className="text-blue-300 mb-3">Nhấn Ctrl+V để dán hình ảnh từ clipboard</p>
            <div
              onPaste={handlePasteImage}
              className="w-full p-8 border-2 border-dashed border-blue-500 rounded-lg text-center bg-blue-900/20 focus:outline-none"
              tabIndex="0"
              autoFocus
            >
              <p className="text-gray-300 mb-4">Khu vực chờ dán hình ảnh</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowPasteMode(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Hủy
                </button>
                {pastedImages.length > 0 && (
                  <button
                    onClick={handleConfirmPaste}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    Hoàn Thành ({pastedImages.length})
                  </button>
                )}
              </div>
            </div>

            {/* Preview Pasted Images */}
            {pastedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {pastedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setPastedImages(pastedImages.filter(p => p.id !== img.id))}
                      className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Images Grid with Add Button */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Add Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="aspect-square rounded-lg bg-gray-800 border-2 border-dashed border-purple-500/50 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 hover:shadow-lg transition-all"
                title="Tải ảnh từ máy tính"
              >
                <Plus size={24} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* Paste Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowPasteMode(!showPasteMode)}
            className="aspect-square rounded-lg bg-gray-800 border-2 border-dashed border-blue-500/50 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-xs text-blue-400 font-semibold">Ctrl+V</p>
              <p className="text-xs text-gray-400">Dán hình</p>
            </div>
          </motion.div>

          {/* Images */}
          {(selectedCollection.images || []).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">🎨 Cảm Hứng Sáng Tác</h1>
          <p className="text-gray-400">Tập hợp ảnh, màu sắc, concept art từ Internet vào đây</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Thêm mới
        </motion.button>
      </motion.div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-20 text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700"
        >
          <p className="text-3xl mb-4">🎨</p>
          <h2 className="text-2xl font-bold text-white mb-2">Chưa có bộ sưu tập nào</h2>
          <p className="text-gray-400 mb-6">Tạo bộ sưu tập đầu tiên để bắt đầu lưu cảm hứng</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
          >
            Tạo Bộ Sưu Tập
          </motion.button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedCollection(collection)}
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer p-6 h-48 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5"></div>
              
              <div className="relative flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
                  {collection.name}
                </h3>
                <p className="text-gray-400 text-sm flex-1">
                  {(collection.images || []).length} hình ảnh
                </p>
                <p className="text-xs text-gray-500">
                  Tạo: {new Date(collection.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Image Preview */}
              {(collection.images || []).length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {(collection.images || []).slice(0, 3).map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={img.title}
                      className="w-full h-12 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4 pointer-events-none">
                <div className="w-full flex gap-2 pointer-events-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedCollection(collection); }}
                    className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-sm"
                  >
                    Xem Chi Tiết
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCollection(collection.id); }}
                    className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-8 w-96 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Tạo Bộ Sưu Tập Mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tên Bộ Sưu Tập</label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Nhập tên bộ sưu tập..."
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                autoFocus
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateCollection}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Tạo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Moodboard;
