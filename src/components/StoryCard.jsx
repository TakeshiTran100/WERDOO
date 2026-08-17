import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Calendar, BarChart3, Edit2, Trash2 } from 'lucide-react';

const StoryCard = ({ story, onWrite, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'from-cyan-500 to-blue-500';
      case 'draft':
        return 'from-orange-500 to-red-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      ongoing: 'Đang viết',
      draft: 'Bản nháp',
      completed: 'Hoàn thành',
      archived: 'Lưu trũ',
    };
    return labels[status] || status;
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px rgba(0,0,0,0.5)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all h-48 flex flex-col cursor-pointer"
      onClick={onWrite}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getStatusColor(
          story.status
        )} opacity-5`}
      ></div>

      {/* Content */}
      <div className="relative flex flex-col h-full p-6">
        {/* Status Badge */}
        <div className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 bg-gradient-to-r ${getStatusColor(story.status)}`}>
          {getStatusLabel(story.status)}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
          {story.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-auto line-clamp-2">
          {story.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span className="flex items-center gap-1">
            <BookOpen size={14} /> {story.chapters} chương
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 size={14} /> {(story.wordCount || 0).toLocaleString()} từ
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mt-3">
          {(story.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-6 pointer-events-none">
          <div className="w-full flex gap-2 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={(e) => { e.stopPropagation(); onWrite(); }}
              className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold"
            >
              <PenTool size={16} className="inline mr-2" /> Viết Tiếp
            </motion.button>
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                title="Chỉnh sửa"
              >
                <Edit2 size={16} />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                title="Xóa"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
        {new Date(story.updatedAt).toLocaleDateString('vi-VN')}
      </div>
    </motion.div>
  );
};

export default StoryCard;
