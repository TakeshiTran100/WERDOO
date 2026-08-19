import React, { useCallback, useLayoutEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import { Extension, extensions } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BoldExt from "@tiptap/extension-bold";
import ItalicExt from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { motion } from "framer-motion";
import { useStoryStore } from "../../store";
import {
  updateStoryInSupabase,
  autosaveStoryInSupabase,
  getChapters,
  createChapter,
  updateChapter,
} from "../../services/storyService";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Eye,
  Maximize,
  Minimize,
  Type,
  X,
  ImageIcon as ImgIcon,
  Lightbulb,
} from "lucide-react";

// Font families and their available weights
const FONTS_CONFIG = {
  "Be Vietnam Pro": {
    label: "Be Vietnam Pro",
    weights: [
      { label: "Thin", value: "100" },
      { label: "Light", value: "300" },
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "SemiBold", value: "600" },
      { label: "Bold", value: "700" },
      { label: "ExtraBold", value: "800" },
      { label: "Black", value: "900" },
    ],
  },
  Montserrat: {
    label: "Montserrat",
    weights: [
      { label: "Thin", value: "100" },
      { label: "Light", value: "300" },
      { label: "Medium", value: "500" },
      { label: "Bold", value: "700" },
      { label: "ExtraBold", value: "800" },
      { label: "Black", value: "900" },
    ],
  },
  "Playfair Display": {
    label: "Playfair Display",
    weights: [
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "SemiBold", value: "600" },
      { label: "Bold", value: "700" },
      { label: "ExtraBold", value: "800" },
    ],
  },
  Lora: {
    label: "Lora",
    weights: [
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "SemiBold", value: "600" },
      { label: "Bold", value: "700" },
    ],
  },
  "Crimson Text": {
    label: "Crimson Text",
    weights: [
      { label: "Regular", value: "400" },
      { label: "SemiBold", value: "600" },
    ],
  },
  "EB Garamond": {
    label: "EB Garamond",
    weights: [
      { label: "Regular", value: "400" },
      { label: "Medium", value: "500" },
      { label: "SemiBold", value: "600" },
      { label: "Bold", value: "700" },
      { label: "ExtraBold", value: "800" },
    ],
  },
};

const Write = () => {
  const {
    editorFont,
    setEditorFont,
    editorFontWeight,
    setEditorFontWeight,
    editorFontSize,
    setEditorFontSize,
    isWriteFullscreen,
    setIsWriteFullscreen,
    addStory,
    updateStory,
    currentStory,
    currentChapter,
    setCurrentChapter,
    setCurrentTab,
    setCurrentStory,
    notes,
  } = useStoryStore();
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [chapters, setChapters] = React.useState([]);
  const [autosaveStatus, setAutosaveStatus] = React.useState("idle");
  const [lastSavedAt, setLastSavedAt] = React.useState(null);
  const [saveData, setSaveData] = React.useState({
    title: "",
    category: "",
    status: "ongoing",
  });

  const activeContent =
  currentChapter?.content || currentStory?.content || "";

const activeChapterTitle =
  currentChapter?.title || currentStory?.chapterTitle || "";

const [chapterTitle, setChapterTitle] =
  React.useState(activeChapterTitle);

const chapterTitleRef = React.useRef(chapterTitle);
const chapterTitleTextareaRef = React.useRef(null);
const titleEditedRef = React.useRef(false);

  const [showMoodboard, setShowMoodboard] = React.useState(false);
  const [showNotesSidebar, setShowNotesSidebar] = React.useState(false);
  const [bubbleMenu, setBubbleMenu] = React.useState({
    show: false,
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    chapterTitleRef.current = chapterTitle;
  }, [chapterTitle]);

  useLayoutEffect(() => {
    const el = chapterTitleTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [chapterTitle]);

  React.useEffect(() => {
    if (
      !titleEditedRef.current &&
      currentStory?.chapterTitle !== undefined &&
      currentStory.chapterTitle !== chapterTitle
    ) {
      setChapterTitle(currentStory.chapterTitle);
    }
  }, [currentStory?.chapterTitle]);
  const [chapSaveData, setChapSaveData] = React.useState({
    title: "",
    status: "ongoing",
  });
  const [sidebarNotes, setSidebarNotes] = React.useState([]);
  const [pageLayout, setPageLayout] = React.useState("A4");
  const [customWidth, setCustomWidth] = React.useState("");
  const [customHeight, setCustomHeight] = React.useState("");
  const [customUnit, setCustomUnit] = React.useState("px");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [lineHeight, setLineHeight] = React.useState("1.8");
  const [letterSpacing, setLetterSpacing] = React.useState("0");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const editorRef = React.useRef(null);
  const pageContainerRef = React.useRef(null);
  React.useEffect(() => {
    if (notes) setSidebarNotes(notes);
  }, [notes]);

  React.useEffect(() => {
    if (!currentStory?.id) {
      setChapters([]);
      return;
    }

    const loadChapters = async () => {
      try {
        const data = await getChapters(currentStory.id);
        setChapters((data || []).sort((a, b) => a.order_index - b.order_index));
      } catch (err) {
        console.error("Lỗi khi tải chapters:", err);
        setChapters([]);
      }
    };

    loadChapters();
  }, [currentStory?.id]);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      BoldExt,
      ItalicExt,
      Strike,
      Code,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      HardBreak,
      History,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: activeContent || "<p></p>",
    onUpdate: () => {
      scheduleAutosave();
    },
  });

  const [wordCount, setWordCount] = React.useState(0);
  const wordCountRef = React.useRef(0);
  React.useEffect(() => {
    wordCountRef.current = wordCount;
  }, [wordCount]);
  const [isFocus, setIsFocus] = React.useState(false);

  const calculateWordCount = useCallback(() => {
    if (editor) {
      const text = editor.getText();
      const count = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      setWordCount(count);
    }
  }, [editor]);

  React.useEffect(() => {
    if (editor) {
      editor.on("update", calculateWordCount);
      calculateWordCount();
    }
  }, [editor, calculateWordCount]);

  const scheduleAutosave = () => {
    clearTimeout(window._autoSaveTimer);
    window._autoSaveTimer = setTimeout(async () => {
      const latest = useStoryStore.getState().currentStory;
      const latestChapter = useStoryStore.getState().currentChapter;

      if (!latest?.id || !latestChapter?.id || !editor) return;
      setAutosaveStatus("saving");
      const freshContent = editor.getHTML();
      const freshChapterTitle = chapterTitleRef.current;
      setCurrentChapter({
        ...latestChapter,
        content: freshContent,
        title: freshChapterTitle,
        wordCount: wordCountRef.current,
      });
setChapters((prev) =>
  prev.map((chapter) =>
    chapter.id === latestChapter.id
      ? {
          ...chapter,
          content: freshContent,
          title: freshChapterTitle,
          wordCount: wordCountRef.current,
        }
      : chapter
  )
);
      try {
        await updateChapter(latestChapter.id, {
          content: freshContent,
          title: freshChapterTitle,
          wordCount: wordCountRef.current,
          status: latestChapter.status || "ongoing",
        });
        setAutosaveStatus("saved");
        setLastSavedAt(new Date());
      } catch (err) {
        console.error("Autosave lỗi:", err);
        setAutosaveStatus("error");
      }
    }, 1000);
  };

  const handleSelectChapter = (chapter) => {
  clearTimeout(window._autoSaveTimer);

  setCurrentChapter(chapter);

  if (editor) {
    editor.commands.setContent(chapter.content || "<p></p>");
  }

  setChapterTitle(chapter.title || "");
  chapterTitleRef.current = chapter.title || "";
  titleEditedRef.current = false;

  setWordCount(chapter.wordCount || 0);
};
  const handleSaveStory = async () => {
    if (!currentStory?.id || !currentChapter?.id) return;

    clearTimeout(window._autoSaveTimer);
    setIsSaving(true);

    try {
      const freshContent = editor.getHTML();
      const freshTitle = chapterTitle.trim() || "Phần mới";
      const freshWordCount = wordCount;

      const updated = await updateChapter(currentChapter.id, {
        title: freshTitle,
        content: freshContent,
        wordCount: freshWordCount,
        status: chapSaveData.status || currentChapter.status || "ongoing",
      });

      setCurrentChapter({
        ...currentChapter,
        ...updated,
      });

      const newChapter = await createChapter(
    currentStory.id,
    {
        title: "Phần mới",
        content: "",
        wordCount: 0,
        orderIndex: chapters.length + 1,
        status: "ongoing",
    },
);

      setCurrentChapter(newChapter);
setChapterTitle(newChapter.title);
chapterTitleRef.current = newChapter.title;

if (editor) {
  editor.commands.setContent("<p></p>");
}

setWordCount(0);

setChapters((prev) => [...prev, newChapter]);

      setShowSaveDialog(false);
      setChapSaveData({ title: "", status: "ongoing" });
    } catch (err) {
      console.error("Lỗi khi lưu chapter:", err);
      alert("Lưu phần viết thất bại, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const isSaveShortcut =
        (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";

      if (!isSaveShortcut) return;

      e.preventDefault();

      if (isSaving) return;

      handleSaveStory();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSaving]);

  const addHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleMark = (mark) => {
    if (mark === "bold") editor.chain().focus().toggleBold().run();
    else if (mark === "italic") editor.chain().focus().toggleItalic().run();
    else if (mark === "underline")
      editor.chain().focus().toggleUnderline().run();
    else if (mark === "strike") editor.chain().focus().toggleStrike().run();
  };

  const setAlignment = (align) => {
    editor.chain().focus().setTextAlign(align).run();
  };

  const PAGE_HEIGHT_PX = 1122;

  // Tính tổng trang dựa theo chiều cao thực của editor
  React.useEffect(() => {
    if (!editor) return;
    const updatePages = () => {
      if (pageContainerRef.current) {
        const h = pageContainerRef.current.scrollHeight;
        setTotalPages(Math.max(1, Math.ceil(h / PAGE_HEIGHT_PX)));
      }
    };
    const debouncedUpdatePages = () => {
      clearTimeout(window._updatePagesTimer);
      window._updatePagesTimer = setTimeout(updatePages, 250);
    };

    editor.on("update", debouncedUpdatePages);
    updatePages();
    return () => editor.off("update", debouncedUpdatePages);
  }, [editor]);

  // Tính trang hiện tại dựa theo vị trí scroll thực sự
  React.useEffect(() => {
    const findScrollParent = (el) => {
      if (!el) return window;
      const style = window.getComputedStyle(el);
      if (/(auto|scroll)/.test(style.overflow + style.overflowY)) return el;
      return findScrollParent(el.parentElement);
    };

    const getScrollTop = (container) => {
      if (container === window) return window.scrollY;
      return container.scrollTop;
    };

    let container = null;

    const attach = () => {
      if (!pageContainerRef.current) return;
      // Tìm đúng element có class flex-1 overflow-auto đang scroll
      container =
        document.querySelector(".overflow-auto") ||
        findScrollParent(pageContainerRef.current.parentElement);

      const onScroll = () => {
        const scrollTop = getScrollTop(container);
        const containerTop = pageContainerRef.current?.offsetTop || 0;
        const relative = Math.max(0, scrollTop - containerTop);
        const page = Math.max(1, Math.floor(relative / PAGE_HEIGHT_PX) + 1);
        setCurrentPage((prev) => Math.min(page, totalPages));
      };

      container.addEventListener("scroll", onScroll);
      return () => container.removeEventListener("scroll", onScroll);
    };

    const cleanup = attach();
    return cleanup;
  }, [totalPages]);

  if (!editor) return null;
  const getLayoutWidth = () => {
    const layouts = {
      A3: "1123px",
      A4: "794px",
      A5: "559px",
    };
    if (pageLayout === "Custom" && customWidth) {
      return `${customWidth}${customUnit}`;
    }
    return layouts[pageLayout] || "794px";
  };

  return (
    <div
      className={`min-h-screen transition-colors ${isWriteFullscreen ? "bg-black" : "bg-[#f5f0e8]"}`}
    >
      {/* Toolbar */}
      {!isWriteFullscreen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-64 right-0 bg-[#2d2520] border-b border-[#4a3f35] px-4 py-2 z-40"
        >
          <div className="flex items-center justify-between">
            {/* Góc trái: ảnh bìa + tên truyện + tên chương */}
            <div className="flex items-center gap-3">
              {currentStory?.coverImage && (
                <img
                  src={currentStory.coverImage}
                  alt="cover"
                  className="w-7 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex flex-col">
                {currentStory?.title && (
                  <span className="text-xs text-stone-400 leading-tight truncate max-w-[200px]">
                    {currentStory.title}
                  </span>
                )}
              </div>
            </div>

            {/* Góc phải: Ghi chú + Lưu */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNotesSidebar(!showNotesSidebar)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-yellow-400 hover:bg-yellow-400/10 ${showNotesSidebar ? "bg-yellow-400/20" : ""}`}
              >
                <Lightbulb size={16} />
                <span>Ghi chú</span>
              </button>
              <span className="text-xs text-stone-400 mr-2">
                {autosaveStatus === "saving" && "Đang tự động lưu..."}
                {autosaveStatus === "saved" &&
                  lastSavedAt &&
                  `Đã lưu ${lastSavedAt.toLocaleTimeString("vi-VN")}`}
                {autosaveStatus === "error" && "Lỗi tự động lưu"}
              </span>

              <button
                onClick={handleSaveStory}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-green-400 hover:bg-green-400/10 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? "Đang lưu..." : "Lưu"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor Area */}
      <div
        className={`${isWriteFullscreen ? "" : "pt-20"} ${isWriteFullscreen ? "h-screen" : "min-h-screen"} flex flex-col items-center overflow-y-auto`}
        ref={editorRef}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          ref={pageContainerRef}
          className="my-8"
          style={{
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "transparent",
            padding: "60px 80px",
            maxWidth: "780px",
            margin: "0 auto",
          }}
          onClick={() => {
            if (editor) {
              editor.chain().focus().run();
            }
          }}
        >
          {/* ✅ FIX: Inject font vào .tiptap trực tiếp qua style tag */}
          <style>{`
            .tiptap {
              outline: none;
              color: #1a1a2e;
              width: 100%;
              font-family: 'Lora', Georgia, serif;
              font-size: ${editorFontSize}px;
              font-weight: ${editorFontWeight};
              font-weight: ${editorFontWeight};
              line-height: ${lineHeight};
              letter-spacing: ${letterSpacing};
          }
            
            .tiptap h1 {
              font-size: 2.25rem;
              font-weight: bold;
              color: #111827;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }

            .tiptap h2 {
              font-size: 1.5rem;
              font-weight: bold;
              color: #4c1d95;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }

            .tiptap p {
              color: #374151;
              margin-bottom: 0;
              line-height: ${lineHeight};
              letter-spacing: ${letterSpacing};
            }

            .tiptap strong {
              color: #111827;
              font-weight: bold;
            }

            .tiptap em {
              font-style: italic;
              color: #374151;
            }

            .tiptap blockquote {
              border-left: 4px solid #a855f7;
              padding-left: 1rem;
              font-style: italic;
              color: #d8b4fe;
              margin: 1rem 0;
            }

            .tiptap ul, .tiptap ol {
              margin-left: 1.5rem;
              margin-top: 1rem;
              margin-bottom: 1rem;
              color: #374151;
            }

            .tiptap li {
              margin-bottom: 0.5rem;
            }

            .tiptap a {
              color: #60a5fa;
              text-decoration: underline;
            }
          `}</style>

          {/* ✅ FIX: Xóa style prop thừa, font đã được inject qua CSS ở trên */}

          {/* Tiêu đề chương */}
          <div
            className="mb-8 pb-6 border-b border-stone-300"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              ref={chapterTitleTextareaRef}
              value={chapterTitle}
              onChange={(e) => {
                setChapterTitle(e.target.value);
                scheduleAutosave();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  editor?.chain().focus().run();
                }
              }}
              rows={1}
              className="w-full bg-transparent text-center text-3xl font-bold text-stone-800 focus:outline-none placeholder-stone-400 resize-none overflow-hidden"
              style={{ height: "auto", minHeight: "2.5rem" }}
              placeholder="Đặt tiêu đề của bạn..."
            />
          </div>

          {/* Bubble Menu - hiện khi bôi text */}
          {editor &&
            (() => {
              return (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <div className="flex items-center gap-0.5 bg-[#2d2520] rounded-lg shadow-xl border border-[#4a3f35] px-1 py-1">
                    <button
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive("bold") ? "bg-purple-600" : ""}`}
                      title="Bold"
                    >
                      <Bold size={15} />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive("italic") ? "bg-purple-600" : ""}`}
                      title="Italic"
                    >
                      <Italic size={15} />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive("underline") ? "bg-purple-600" : ""}`}
                      title="Underline"
                    >
                      <UnderlineIcon size={15} />
                    </button>
                    <div className="w-px h-4 bg-stone-600 mx-0.5"></div>
                    <button
                      onClick={() =>
                        editor.chain().focus().setTextAlign("left").run()
                      }
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive({ textAlign: "left" }) ? "bg-purple-600" : ""}`}
                      title="Căn trái"
                    >
                      <AlignLeft size={15} />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().setTextAlign("center").run()
                      }
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive({ textAlign: "center" }) ? "bg-purple-600" : ""}`}
                      title="Căn giữa"
                    >
                      <AlignCenter size={15} />
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().setTextAlign("right").run()
                      }
                      className={`p-1.5 rounded text-stone-200 hover:bg-stone-600 transition-all ${editor.isActive({ textAlign: "right" }) ? "bg-purple-600" : ""}`}
                      title="Căn phải"
                    >
                      <AlignRight size={15} />
                    </button>
                  </div>
                </BubbleMenu>
              );
            })()}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              overflowX: "auto",
              padding: "6px 0",
            }}
          >
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleSelectChapter(chapter)}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 12,
                  fontWeight: currentChapter?.id === chapter.id ? 700 : 500,
                  color: currentChapter?.id === chapter.id ? "#fff" : "#9b2335",
                  background:
                    currentChapter?.id === chapter.id ? "#9b2335" : "#f3dddd",
                }}
              >
                {chapter.title || `Phần ${index + 1}`}
              </button>
            ))}
          </div>

          <EditorContent
            editor={editor}
            className="tiptap"
            spellCheck={false}
          />
        </motion.div>
      </div>

      {/* Notes Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: showNotesSidebar ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">💡 Ghi Chú Nhanh</h2>
          <button
            onClick={() => setShowNotesSidebar(false)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {sidebarNotes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="text-3xl mb-2">📝</p>
              <p>Chưa có ghi chú nào</p>
            </div>
          ) : (
            sidebarNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg border border-gray-600 cursor-pointer hover:border-purple-400 transition-all"
                style={{ backgroundColor: note.color }}
              >
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {note.title}
                </h3>
                <p className="text-gray-800 text-xs line-clamp-3">
                  {note.content}
                </p>
                <p className="text-xs text-gray-600 mt-2 opacity-60">
                  {new Date(note.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer - link qua trang Notes */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              setCurrentTab("notes");
              setShowNotesSidebar(false);
            }}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-semibold"
          >
            Xem tất cả ghi chú →
          </button>
        </div>
      </motion.div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl p-8 w-96 border"
            style={{ backgroundColor: "#fdf6f0", borderColor: "#e8c8c8" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: "#9b2335" }}>
                💾 Lưu Chương
              </h2>
              <button onClick={() => setShowSaveDialog(false)}>
                <X size={24} style={{ color: "#9b2335" }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#9b2335" }}
                >
                  Tên Chương *
                </label>
                <input
                  type="text"
                  value={chapSaveData.title}
                  onChange={(e) =>
                    setChapSaveData({ ...chapSaveData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e8c8c8",
                    color: "#2d0a0a",
                  }}
                  placeholder="VD: Chương 1 - Khởi đầu..."
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#9b2335" }}
                >
                  Trạng Thái
                </label>
                <select
                  value={chapSaveData.status}
                  onChange={(e) =>
                    setChapSaveData({ ...chapSaveData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e8c8c8",
                    color: "#2d0a0a",
                  }}
                >
                  <option value="ongoing">Đang Viết</option>
                  <option value="draft">Bản Nháp</option>
                  <option value="completed">Hoàn Thành</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 rounded-lg border font-medium"
                  style={{
                    borderColor: "#e8c8c8",
                    color: "#9b2335",
                    backgroundColor: "#fff",
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveStory}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#9b2335" }}
                >
                  {isSaving ? "Đang lưu..." : "Lưu & Viết Chap Mới ✨"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Write;
