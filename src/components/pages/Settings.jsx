import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, Type, Palette } from 'lucide-react';
import { useStoryStore } from '../../store';
import { mockThemes } from '../../data/mockData';

const Settings = () => {
  const { isDarkMode, setDarkMode, currentTheme, setTheme, editorFont, setEditorFont, editorFontSize, setEditorFontSize } = useStoryStore();
  const [ambience, setAmbience] = useState('rain');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">⚙️ Cài Đặt</h1>
        <p className="text-gray-400">Tùy chỉnh không gian viết của bạn</p>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🎨 Hiển Thị</h2>

          {/* Dark Mode */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-white font-semibold">Chế Độ Tối</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setDarkMode(!isDarkMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-yellow-400 text-gray-900'
                }`}
              >
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </motion.button>
            </div>
            <p className="text-gray-400 text-sm">
              {isDarkMode ? 'Chế độ tối bảo vệ mắt' : 'Chế độ sáng cho ngày hôm nay'}
            </p>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-white font-semibold mb-4">Giao Diện</h3>
            <div className="space-y-2">
              {mockThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setTheme(theme.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    currentTheme === theme.id
                      ? 'bg-purple-600 border-purple-400'
                      : 'bg-gray-700 border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{theme.name}</p>
                      <p className="text-sm text-gray-300">{theme.icon}</p>
                    </div>
                    {currentTheme === theme.id && (
                      <span className="text-green-400 font-bold">✓</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Audio & Ambience */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🎵 Âm Thanh</h2>

          <div className="mb-8">
            <label className="text-white font-semibold block mb-4">Âm Thanh Nền</label>
            <div className="space-y-2">
              {['rain', 'cafe', 'forest', 'fireplace', 'piano'].map((sound) => (
                <motion.button
                  key={sound}
                  whileHover={{ x: 4 }}
                  onClick={() => setAmbience(sound)}
                  className={`w-full p-3 rounded-lg transition-all text-left flex items-center gap-3 ${
                    ambience === sound
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Volume2 size={18} />
                  {sound === 'rain' && 'Mưa rơi'}
                  {sound === 'cafe' && 'Quán Cà Phê'}
                  {sound === 'forest' && 'Rừng Đêm'}
                  {sound === 'fireplace' && 'Lò Sưởi'}
                  {sound === 'piano' && 'Piano Cổ Điển'}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div>
            <label className="text-white font-semibold block mb-2">Âm Lượng</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="40"
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Font Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Type size={24} /> Phông Chữ
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-3">Phông UI</label>
              <div className="grid grid-cols-2 gap-2">
                {['Sans', 'Display', 'Modern'].map((font) => (
                  <button
                    key={font}
                    className="px-3 py-2 bg-gray-700 hover:bg-purple-600 text-white rounded-lg text-sm transition-all"
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-3">Phông Editor (Văn Bản)</label>
              <select 
                value={editorFont}
                onChange={(e) => setEditorFont(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-400"
              >
                <option value="serif">Georgia (Serif cổ điển)</option>
                <option value="elegant">Palatino (Sang trọng)</option>
                <option value="classic">Times New Roman (Truyền thống)</option>
                <option value="sans">Segoe UI (Hiện đại)</option>
                <option value="display">Trebuchet (Nổi bật)</option>
                <option value="casual">Casual (Thoải mái)</option>
                <option value="mono">Monaco (Monospace)</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">
                {editorFont ? `Chọn: ${editorFont}` : 'Chọn phông chữ cho editor'}
              </p>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Kích Thước Chữ Editor</label>
              <input 
                type="range" 
                min="12" 
                max="24" 
                value={editorFontSize}
                onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                className="w-full mt-2" 
              />
              <p className="text-sm text-gray-300 mt-2 font-semibold">Kích thước: {editorFontSize}px</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mt-4 p-3 bg-gray-700 rounded-lg">
                💡 Sử dụng các phông chữ hệ thống để tối ưu hiệu suất. Tất cả phông đều hỗ trợ tiếng Việt.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Backup Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">💾 Sao Lưu</h2>

          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all">
              📥 Export Tất Cả Truyện
            </button>
            <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-all">
              📤 Import Truyện
            </button>
            <div className="p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
              <p className="font-semibold text-white mb-1">Lần sao lưu cuối:</p>
              <p>26/04/2024 lúc 14:30</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-red-900/20 rounded-xl p-8 border border-red-700/50"
      >
        <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Vùng Nguy Hiểm</h2>
        <p className="text-gray-400 mb-4">Những hành động này không thể hoàn tác</p>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all">
          Xóa Tất Cả Dữ Liệu
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
