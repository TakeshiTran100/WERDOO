import React from "react";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  BookOpen,
  PenTool,
  ImageIcon,
  Lightbulb,
  Users,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useStoryStore } from "../store";
import { supabase } from "../lib/supabaseClient";

const THEME_STYLES = {
  default: {
    sidebar: "bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 border-r border-purple-700",
    logo: "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400",
    logoSub: "text-purple-300",
    border: "border-purple-700",
    activeBtn: "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg",
    inactiveBtn: "text-purple-200 hover:bg-purple-800/50",
    bottomBtn: "bg-purple-800/50 hover:bg-purple-700/50 text-purple-200",
    subText: "text-purple-300",
    accentText: "text-cyan-400",
  },
  hellokitty: {
    sidebar: "bg-white border-r-2 border-red-400",
    logo: "text-red-500",
    logoSub: "text-red-300",
    border: "border-red-200",
    activeBtn: "bg-red-500 text-white shadow-lg",
    inactiveBtn: "text-red-400 hover:bg-red-50",
    bottomBtn: "bg-red-50 hover:bg-red-100 text-red-500",
    subText: "text-red-300",
    accentText: "text-red-500",
  },
};

const Sidebar = () => {
  const {
    currentTab,
    setCurrentTab,
    isDarkMode,
    setDarkMode,
    currentTheme,
  } = useStoryStore();

  const theme = THEME_STYLES[currentTheme] || THEME_STYLES.default;

  const menuItems = [
    { id: "home", label: "Trang Chủ", icon: HomeIcon },
    { id: "library", label: "Thư Viện", icon: BookOpen },
    { id: "notes", label: "Ghi Chú", icon: Lightbulb },
    { id: "workflow", label: "Workflow", icon: Users },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-64 flex flex-col overflow-y-auto ${theme.sidebar}`}
    >
      {/* Logo */}
      <div className={`p-6 border-b ${theme.border}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`text-3xl font-bold ${theme.logo}`}
        >
          {currentTheme === "hellokitty" ? "🎀 WERDOO" : "✨ WERDOO"}
        </motion.div>
        <p className={`text-sm mt-2 ${theme.logoSub}`}>
          Không gian sáng tác của bạn
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? theme.activeBtn : theme.inactiveBtn
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className={`p-4 border-t ${theme.border} space-y-3`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setDarkMode(!isDarkMode)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${theme.bottomBtn}`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="text-sm font-medium">
            {isDarkMode ? "Sáng" : "Tối"}
          </span>
        </motion.button>
        <div className="text-center py-2">
          <p className={`text-xs ${theme.subText}`}>Đang hoạt động</p>
          <p className={`text-sm font-semibold ${theme.accentText}`}>Nhà văn của tôi</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => supabase.auth.signOut()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${theme.bottomBtn}`}
        >
          <span className="text-sm font-medium">Đăng xuất</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;