import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Trash2, X } from "lucide-react";
import { useStoryStore } from "../../store";

const C = {
  bg: "#fdf6f0",
  grid: "#e8c8c8",
  red: "#9b2335",
  redLight: "#c9a0a8",
  redPale: "#f5e6e8",
  text: "#2d0a0a",
  textLight: "#7a4a4a",
  white: "#ffffff",
  shadow: "rgba(155,35,53,0.12)",
};

const EMOJIS = [
  "👤",
  "🧙",
  "🧝",
  "🧛",
  "🧜",
  "🧚",
  "👸",
  "🤴",
  "🦸",
  "🦹",
  "🧑",
  "👩",
  "👨",
  "🧓",
  "🐉",
  "🦊",
  "🐺",
  "🌙",
  "⭐",
  "🌹",
];

// ── DIALOG TẠO WORLD ──────────────────────────────────────────────
const CreateWorldDialog = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState("");
  const [coverType, setCoverType] = useState("emoji");
  const [emoji, setEmoji] = useState("🌍");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCover(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: desc.trim(),
      cover: coverType === "emoji" ? null : cover,
      emoji: coverType === "emoji" ? emoji : null,
      coverType,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          borderRadius: 24,
          padding: 32,
          width: 420,
          border: `2px solid ${C.grid}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.2)`,
        }}
      >
        <h2
          style={{
            color: C.red,
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          🌍 Tạo Thế Giới Mới
        </h2>

        {/* Cover */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["emoji", "upload", "url"].map((t) => (
              <button
                key={t}
                onClick={() => setCoverType(t)}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: 8,
                  border: `2px solid`,
                  borderColor: coverType === t ? C.red : C.grid,
                  background: coverType === t ? C.redPale : C.white,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.red,
                }}
              >
                {t === "emoji"
                  ? "😊 Emoji"
                  : t === "upload"
                    ? "📁 Upload"
                    : "🔗 URL"}
              </button>
            ))}
          </div>

          {coverType === "emoji" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `2px solid`,
                    borderColor: emoji === e ? C.red : C.grid,
                    background: emoji === e ? C.redPale : C.white,
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          {coverType === "upload" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: `1px solid ${C.grid}`,
              }}
            />
          )}
          {coverType === "url" && (
            <input
              placeholder="Dán link ảnh vào đây..."
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1.5px solid ${C.grid}`,
                fontSize: 13,
                outline: "none",
                color: C.text,
                background: C.white,
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Tên thế giới *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 14,
              outline: "none",
              color: C.text,
              background: C.white,
            }}
          />
          <textarea
            placeholder="Mô tả thế giới..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 13,
              outline: "none",
              resize: "none",
              color: C.text,
              background: C.white,
              fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: `1px solid ${C.grid}`,
                background: C.white,
                cursor: "pointer",
                fontWeight: 600,
                color: C.textLight,
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: "none",
                background: C.red,
                color: C.white,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Tạo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── DIALOG TẠO NHÂN VẬT ───────────────────────────────────────────
const CreateCharDialog = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Nhân vật chính");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState("");
  const [coverType, setCoverType] = useState("emoji");
  const [emoji, setEmoji] = useState("👤");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCover(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      role,
      description: desc.trim(),
      cover: coverType === "emoji" ? null : cover,
      emoji: coverType === "emoji" ? emoji : null,
      coverType,
      traits: [],
      secrets: "",
      age: "",
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          borderRadius: 24,
          padding: 32,
          width: 420,
          border: `2px solid ${C.grid}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.2)`,
        }}
      >
        <h2
          style={{
            color: C.red,
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          👤 Tạo Nhân Vật Mới
        </h2>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["emoji", "upload", "url"].map((t) => (
              <button
                key={t}
                onClick={() => setCoverType(t)}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: 8,
                  border: `2px solid`,
                  borderColor: coverType === t ? C.red : C.grid,
                  background: coverType === t ? C.redPale : C.white,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.red,
                }}
              >
                {t === "emoji"
                  ? "😊 Emoji"
                  : t === "upload"
                    ? "📁 Upload"
                    : "🔗 URL"}
              </button>
            ))}
          </div>
          {coverType === "emoji" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: `2px solid`,
                    borderColor: emoji === e ? C.red : C.grid,
                    background: emoji === e ? C.redPale : C.white,
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          {coverType === "upload" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: `1px solid ${C.grid}`,
              }}
            />
          )}
          {coverType === "url" && (
            <input
              placeholder="Dán link ảnh vào đây..."
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1.5px solid ${C.grid}`,
                fontSize: 13,
                outline: "none",
                color: C.text,
                background: C.white,
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Tên nhân vật *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 14,
              outline: "none",
              color: C.text,
              background: C.white,
            }}
          />
          <input
            placeholder="Vai trò (VD: Nữ chính, Phản diện...)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 13,
              outline: "none",
              color: C.text,
              background: C.white,
            }}
          />
          <textarea
            placeholder="Mô tả nhân vật..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 13,
              outline: "none",
              resize: "none",
              color: C.text,
              background: C.white,
              fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: `1px solid ${C.grid}`,
                background: C.white,
                cursor: "pointer",
                fontWeight: 600,
                color: C.textLight,
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: "none",
                background: C.red,
                color: C.white,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Tạo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── DIALOG CHỈNH SỬA WORLD ────────────────────────────────────────
const EditWorldDialog = ({ world, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(world.name);
  const [desc, setDesc] = useState(world.description || "");
  const [cover, setCover] = useState(world.cover || "");
  const [coverType, setCoverType] = useState(world.coverType || "emoji");
  const [emoji, setEmoji] = useState(world.emoji || "🌍");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCover(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: C.bg, borderRadius: 24, padding: 32, width: 420, border: `2px solid ${C.grid}`, boxShadow: `0 20px 60px rgba(0,0,0,0.2)` }}
      >
        {/* Ảnh bìa */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 8 }}>Ảnh bìa</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["emoji", "upload", "url"].map((t) => (
              <button key={t} onClick={() => setCoverType(t)}
                style={{ flex: 1, padding: "6px", borderRadius: 8, border: `2px solid`, borderColor: coverType === t ? C.red : C.grid, background: coverType === t ? C.redPale : C.white, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.red }}>
                {t === "emoji" ? "😊 Emoji" : t === "upload" ? "📁 Upload" : "🔗 URL"}
              </button>
            ))}
          </div>
          {coverType === "emoji" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid`, borderColor: emoji === e ? C.red : C.grid, background: emoji === e ? C.redPale : C.white, cursor: "pointer", fontSize: 18 }}>
                  {e}
                </button>
              ))}
            </div>
          )}
          {coverType === "upload" && (
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => setCover(ev.target.result); r.readAsDataURL(f); }}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${C.grid}` }} />
          )}
          {coverType === "url" && (
            <input placeholder="Dán link ảnh..." value={cover} onChange={(e) => setCover(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.grid}`, fontSize: 13, outline: "none", color: C.text, background: C.white, boxSizing: "border-box" }} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 6 }}>Tên thế giới *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên thế giới..."
            style={{ padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.grid}`, fontSize: 14, outline: "none", color: C.text, background: C.white, width: "100%", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 6 }}>Mô tả thế giới</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Nhập mô tả..." rows={3}
            style={{ padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.grid}`, fontSize: 13, outline: "none", resize: "none", color: C.text, background: C.white, fontFamily: "inherit", width: "100%", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose}
              style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${C.grid}`, background: C.white, cursor: "pointer", fontWeight: 600, color: C.textLight }}>
              Hủy
            </button>
            <button onClick={() => { onSave({ name: name.trim(), description: desc.trim(), cover: coverType === "emoji" ? null : cover, emoji: coverType === "emoji" ? emoji : null, coverType }); onClose(); }}
              style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: C.red, color: C.white, cursor: "pointer", fontWeight: 700 }}>
              Lưu
            </button>
          </div>

          {/* Nút xóa */}
          <button
            onClick={() => {
              if (window.confirm("Bạn chắc chưa? Xóa thế giới này sẽ mất vĩnh viễn và không thể khôi phục!")) {
                onDelete();
                onClose();
              }
            }}
            style={{ width: "100%", padding: "11px", borderRadius: 12, border: `1.5px solid ${C.red}`, background: "transparent", color: C.red, cursor: "pointer", fontWeight: 700, marginTop: 4 }}
          >
            🗑️ Xóa thế giới này
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── DIALOG CHỈNH SỬA NHÂN VẬT ─────────────────────────────────────
const EditCharDialog = ({ char, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(char.name);
  const [role, setRole] = useState(char.role || "");
  const [desc, setDesc] = useState(char.description || "");
  const [cover, setCover] = useState(char.cover || "");
  const [coverType, setCoverType] = useState(char.coverType || "emoji");
  const [emoji, setEmoji] = useState(char.emoji || "👤");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          borderRadius: 24,
          padding: 32,
          width: 420,
          border: `2px solid ${C.grid}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.2)`,
        }}
      >
        <h2 style={{ color: C.red, fontWeight: 800, fontSize: 20, marginBottom: 20 }}>
          ✏️ Chỉnh Sửa Nhân Vật
        </h2>

        {/* Ảnh bìa */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 8 }}>Ảnh bìa</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["emoji", "upload", "url"].map((t) => (
              <button key={t} onClick={() => setCoverType(t)}
                style={{ flex: 1, padding: "6px", borderRadius: 8, border: `2px solid`, borderColor: coverType === t ? C.red : C.grid, background: coverType === t ? C.redPale : C.white, cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.red }}>
                {t === "emoji" ? "😊 Emoji" : t === "upload" ? "📁 Upload" : "🔗 URL"}
              </button>
            ))}
          </div>
          {coverType === "emoji" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid`, borderColor: emoji === e ? C.red : C.grid, background: emoji === e ? C.redPale : C.white, cursor: "pointer", fontSize: 18 }}>
                  {e}
                </button>
              ))}
            </div>
          )}
          {coverType === "upload" && (
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => setCover(ev.target.result); r.readAsDataURL(f); }}
              style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${C.grid}` }} />
          )}
          {coverType === "url" && (
            <input placeholder="Dán link ảnh..." value={cover} onChange={(e) => setCover(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.grid}`, fontSize: 13, outline: "none", color: C.text, background: C.white, boxSizing: "border-box" }} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 6 }}>Tên nhân vật *</label>
            <input value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên nhân vật *"
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 14,
              outline: "none",
              color: C.text,
              background: C.white,
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 6 }}>Vai trò</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Vai trò..."
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 13,
              outline: "none",
              color: C.text, background: C.white, width: "100%", boxSizing: "border-box"
            }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: C.textLight, display: "block", marginBottom: 6 }}>Mô tả nhân vật</label>
            <textarea value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Mô tả nhân vật..."
            rows={3}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: `1.5px solid ${C.grid}`,
              fontSize: 13,
              outline: "none",
              resize: "none",
              color: C.text,
              background: C.white,
              fontFamily: "inherit", width: "100%", boxSizing: "border-box"
            }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: `1px solid ${C.grid}`,
                background: C.white,
                cursor: "pointer",
                fontWeight: 600,
                color: C.textLight,
              }}
            >
              Hủy
            </button>
            <button
              onClick={() => {
                onSave({
                  name: name.trim(),
                  role: role.trim(),
                  description: desc.trim(),
                });
                onClose();
              }}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 12,
                border: "none",
                background: C.red,
                color: C.white,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Lưu
            </button>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Bạn chắc chưa? Xóa nhân vật này sẽ mất vĩnh viễn!")) {
                onDelete && onDelete();
                onClose();
              }
            }}
            style={{ width: "100%", padding: "11px", borderRadius: 12, border: `1.5px solid ${C.red}`, background: "transparent", color: C.red, cursor: "pointer", fontWeight: 700, marginTop: 4 }}
          >
            🗑️ Xóa nhân vật này
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── CARD NETFLIX ───────────────────────────────────────────────────
const NetflixCard = ({ item, onClick, onDelete, onEdit }) => {
  const hasCover = item.cover && item.coverType !== "emoji";
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 0 3px ${C.white}, 0 0 0 5px ${C.redLight}`,
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 14,
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      {/* Poster */}
      <div
        style={{
          width: "100%",
          paddingTop: "150%",
          position: "relative",
          background: hasCover ? `url(${item.cover}) center/cover` : C.redPale,
          borderRadius: 14,
          border: `2px solid ${C.grid}`,
        }}
      >
        {!hasCover && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
            }}
          >
            {item.emoji || "👤"}
          </div>
        )}
        {/* Edit button — không có nút xóa nữa */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: 20,
            width: 28,
            height: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
          }}
        >
          ✏️
        </button>
      </div>
      {/* Info */}
      <div style={{ padding: "8px 4px 4px" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 2 }}>
          {item.name}
        </div>
        {item.role && (
          <div style={{ fontSize: 11, color: C.textLight }}>{item.role}</div>
        )}
        {item.description && !item.role && (
          <div style={{ fontSize: 11, color: C.textLight }}>
            {item.description.slice(0, 40)}{item.description.length > 40 ? "..." : ""}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── TRANG NHÂN VẬT BÊN TRONG WORLD ────────────────────────────────
const WorldDetail = ({ world, onBack }) => {
  const {
    addCharacterToWorld,
    deleteCharacterFromWorld,
    updateCharacterInWorld,
  } = useStoryStore();
  const [showCreate, setShowCreate] = useState(false);
  const [editingChar, setEditingChar] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 32px 60px",
        backgroundColor: C.bg,
      }}
    >
      {/* Back */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: `1px solid ${C.grid}`,
          borderRadius: 20,
          padding: "6px 14px",
          cursor: "pointer",
          color: C.textLight,
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> Quay lại
      </motion.button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {world.cover && world.coverType !== "emoji" ? (
            <img
              src={world.cover}
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                objectFit: "cover",
                border: `2px solid ${C.grid}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: C.redPale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                border: `2px solid ${C.grid}`,
              }}
            >
              {world.emoji || "🌍"}
            </div>
          )}
          <div>
            <h1
              style={{ fontSize: 28, fontWeight: 900, color: C.red, margin: 0 }}
            >
              {world.name}
            </h1>
            {world.description && (
              <p style={{ color: C.textLight, fontSize: 13, marginTop: 4 }}>
                {world.description}
              </p>
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.red,
            color: C.white,
            border: "none",
            borderRadius: 24,
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          <Plus size={16} /> Tạo Nhân Vật
        </motion.button>
      </div>

      {/* Characters grid */}
      {!world.characters || world.characters.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: C.textLight }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <p style={{ fontWeight: 600 }}>Chưa có nhân vật nào</p>
          <p style={{ fontSize: 13 }}>Bấm "Tạo Nhân Vật" để bắt đầu!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 20,
          }}
        >
          {world.characters.map((char, idx) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <NetflixCard
                item={char}
                onClick={() => {}}
                onDelete={() => deleteCharacterFromWorld(world.id, char.id)}
                onEdit={() => setEditingChar(char)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
  {showCreate && (
    <CreateCharDialog
      onClose={() => setShowCreate(false)}
      onSave={(char) => addCharacterToWorld(world.id, char)}
    />
  )}
  {editingChar && (
    <EditCharDialog
      char={editingChar}
      onClose={() => setEditingChar(null)}
      onSave={(updates) => { updateCharacterInWorld(world.id, editingChar.id, updates); setEditingChar(null); }}
      onDelete={() => deleteCharacterFromWorld(world.id, editingChar.id)}
    />
  )}
</AnimatePresence>
    </div>
  );
};

// ── TRANG CHÍNH ────────────────────────────────────────────────────
const Characters = () => {
  const { worlds, addWorld, deleteWorld, updateWorld } = useStoryStore();
  const [openWorld, setOpenWorld] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingWorld, setEditingWorld] = useState(null);

  if (openWorld) {
    const freshWorld = worlds.find((w) => w.id === openWorld.id) || openWorld;
    return <WorldDetail world={freshWorld} onBack={() => setOpenWorld(null)} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 32px 60px",
        backgroundColor: C.bg,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: C.red,
              fontFamily: "'Courier Prime', monospace",
              margin: 0,
            }}
          >
            🌍 THẾ GIỚI & NHÂN VẬT
          </h1>
          <p style={{ color: C.textLight, marginTop: 4, fontSize: 14 }}>
            Tạo thế giới · Xây dựng nhân vật bên trong
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: C.red,
            color: C.white,
            border: "none",
            borderRadius: 24,
            padding: "12px 22px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            boxShadow: `0 4px 14px ${C.shadow}`,
          }}
        >
          <Plus size={16} /> Tạo Thế Giới
        </motion.button>
      </motion.div>

      {/* Worlds grid */}
      {worlds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "80px 0", color: C.textLight }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>Chưa có thế giới nào</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Bấm "Tạo Thế Giới" để bắt đầu!
          </p>
        </motion.div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 20,
          }}
        >
          {worlds.map((world, idx) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <NetflixCard
                item={world}
                onClick={() => setOpenWorld(world)}
                onDelete={() => deleteWorld(world.id)}
                onEdit={() => setEditingWorld(world)}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateWorldDialog
            onClose={() => setShowCreate(false)}
            onSave={(world) => addWorld(world)}
          />
        )}
        {editingWorld && (
          <EditWorldDialog
            world={editingWorld}
            onClose={() => setEditingWorld(null)}
            onSave={(updates) => {
              updateWorld(editingWorld.id, updates);
              setEditingWorld(null);
            }}
            onDelete={() => deleteWorld(editingWorld.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Characters;
