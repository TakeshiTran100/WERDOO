import React, { useState } from "react";
import { useStoryStore } from "../../store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  bg: "#fdf6f0",
  grid: "#e8c8c8",
  red: "#9b2335",
  redLight: "#c9a0a8",
  redPale: "#f5e6e8",
  blue: "#8fafc4",
  bluePale: "#e8f0f5",
  yellow: "#c9a96e",
  yellowPale: "#faf3e0",
  pink: "#d4b0b8",
  pinkPale: "#fdf0f2",
  text: "#2d0a0a",
  textLight: "#7a4a4a",
  white: "#ffffff",
  shadow: "rgba(155,35,53,0.12)",
};

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "mindmap", label: "🗺️ Sơ Đồ Cốt Truyện" },
  { id: "timeline", label: "⏳ Timeline Nhân Vật" },
  { id: "chapters", label: "📖 Kế Hoạch Chương" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MINDMAP TAB
// ═══════════════════════════════════════════════════════════════════════════════
const defaultNodes = [
  {
    id: "root",
    label: "Cốt Truyện Chính",
    x: 420,
    y: 220,
    type: "root",
    children: ["n1", "n2", "n3"],
  },
  {
    id: "n1",
    label: "Mở Đầu",
    x: 180,
    y: 100,
    type: "act",
    children: ["n1a", "n1b"],
  },
  {
    id: "n2",
    label: "Cao Trào",
    x: 420,
    y: 380,
    type: "act",
    children: ["n2a"],
  },
  {
    id: "n3",
    label: "Kết Thúc",
    x: 660,
    y: 100,
    type: "act",
    children: ["n3a"],
  },
  {
    id: "n1a",
    label: "Giới thiệu nhân vật",
    x: 60,
    y: 200,
    type: "scene",
    children: [],
  },
  {
    id: "n1b",
    label: "Sự kiện kích hoạt",
    x: 180,
    y: 300,
    type: "scene",
    children: [],
  },
  {
    id: "n2a",
    label: "Điểm ngoặt lớn",
    x: 420,
    y: 500,
    type: "scene",
    children: [],
  },
  {
    id: "n3a",
    label: "Giải quyết xung đột",
    x: 700,
    y: 220,
    type: "scene",
    children: [],
  },
];

const NODE_COLORS = {
  root: { bg: C.red, text: C.white, border: C.red },
  act: { bg: C.redPale, text: C.red, border: C.redLight },
  scene: { bg: C.white, text: C.text, border: C.grid },
};

const MindmapTab = () => {
  const [nodes, setNodes] = useState(defaultNodes);
  const [dragging, setDragging] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const svgRef = React.useRef();

  const getNode = (id) => nodes.find((n) => n.id === id);

  const getAllEdges = () => {
    const edges = [];
    nodes.forEach((node) => {
      (node.children || []).forEach((childId) => {
        const child = getNode(childId);
        if (child) edges.push({ from: node, to: child });
      });
    });
    return edges;
  };

  const handleMouseDown = (e, id) => {
    if (editing) return;
    e.preventDefault();
    const svg = svgRef.current.getBoundingClientRect();
    const node = getNode(id);
    setDragging(id);
    setOffset({
      x: e.clientX - svg.left - node.x,
      y: e.clientY - svg.top - node.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const svg = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svg.left - offset.x;
    const y = e.clientY - svg.top - offset.y;
    setNodes((ns) => ns.map((n) => (n.id === dragging ? { ...n, x, y } : n)));
  };

  const startEdit = (node) => {
    setEditing(node.id);
    setEditVal(node.label);
  };

  const saveEdit = () => {
    setNodes((ns) =>
      ns.map((n) => (n.id === editing ? { ...n, label: editVal } : n)),
    );
    setEditing(null);
  };

  const addChild = (parentId) => {
    const parent = getNode(parentId);
    const newId = "n" + Date.now();
    const newNode = {
      id: newId,
      label: "Nút mới",
      x: parent.x + (Math.random() - 0.5) * 200,
      y: parent.y + 120,
      type: parent.type === "root" ? "act" : "scene",
      children: [],
    };
    setNodes((ns) => [
      ...ns.map((n) =>
        n.id === parentId ? { ...n, children: [...n.children, newId] } : n,
      ),
      newNode,
    ]);
  };

  const deleteNode = (id) => {
    if (id === "root") return;
    setNodes((ns) =>
      ns
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          children: (n.children || []).filter((c) => c !== id),
        })),
    );
  };

  const edges = getAllEdges();

  return (
    <div style={{ position: "relative" }}>
      <p style={{ color: C.textLight, fontSize: 13, marginBottom: 12 }}>
        🖱️ Kéo nút để di chuyển · Double-click để sửa tên · Click{" "}
        <strong>+</strong> để thêm nhánh
      </p>
      <div
        style={{
          border: `1px solid ${C.grid}`,
          borderRadius: 16,
          overflow: "hidden",
          background: C.white,
          backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="580"
          viewBox="0 0 840 580"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(null)}
          style={{ cursor: dragging ? "grabbing" : "default" }}
        >
          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke={C.redLight}
              strokeWidth={2}
              strokeDasharray="6 3"
              opacity={0.6}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            const col = NODE_COLORS[node.type];
            const w =
              node.type === "root" ? 140 : node.type === "act" ? 120 : 110;
            const h = node.type === "root" ? 48 : 38;
            return (
              <g key={node.id}>
                {/* Shadow */}
                <rect
                  x={node.x - w / 2 + 3}
                  y={node.y - h / 2 + 4}
                  width={w}
                  height={h}
                  rx={h / 2}
                  fill={C.shadow}
                />
                {/* Node */}
                <rect
                  x={node.x - w / 2}
                  y={node.y - h / 2}
                  width={w}
                  height={h}
                  rx={h / 2}
                  fill={col.bg}
                  stroke={col.border}
                  strokeWidth={2}
                  style={{ cursor: "grab" }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onDoubleClick={() => startEdit(node)}
                />
                {editing === node.id ? (
                  <foreignObject
                    x={node.x - w / 2 + 8}
                    y={node.y - 14}
                    width={w - 16}
                    height={28}
                  >
                    <input
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        color: col.text,
                        outline: "none",
                      }}
                      value={editVal}
                      autoFocus
                      onChange={(e) => setEditVal(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    />
                  </foreignObject>
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontSize={node.type === "root" ? 13 : 11}
                    fontWeight={700}
                    fill={col.text}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {node.label.length > 14
                      ? node.label.slice(0, 13) + "…"
                      : node.label}
                  </text>
                )}

                {/* Add child button */}
                <circle
                  cx={node.x + w / 2 - 2}
                  cy={node.y - h / 2 + 2}
                  r={10}
                  fill={C.red}
                  style={{ cursor: "pointer" }}
                  onClick={() => addChild(node.id)}
                />
                <text
                  x={node.x + w / 2 - 2}
                  y={node.y - h / 2 + 7}
                  textAnchor="middle"
                  fontSize={14}
                  fill={C.white}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  +
                </text>

                {/* Delete button (not root) */}
                {node.id !== "root" && (
                  <>
                    <circle
                      cx={node.x - w / 2 + 2}
                      cy={node.y - h / 2 + 2}
                      r={10}
                      fill={C.redLight}
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteNode(node.id)}
                    />
                    <text
                      x={node.x - w / 2 + 2}
                      y={node.y - h / 2 + 7}
                      textAnchor="middle"
                      fontSize={13}
                      fill={C.white}
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      ×
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}
      >
        {[
          { type: "root", label: "Cốt truyện chính" },
          { type: "act", label: "Hồi / Arc" },
          { type: "scene", label: "Sự kiện / Cảnh" },
        ].map((l) => (
          <div
            key={l.type}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: NODE_COLORS[l.type].bg,
                border: `2px solid ${NODE_COLORS[l.type].border}`,
              }}
            />
            <span style={{ fontSize: 12, color: C.textLight }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════════════════════════
const defaultCharacters = [
  {
    id: 1,
    name: "Nhân vật chính",
    color: C.red,
    events: [
      { id: 1, chapter: 1, label: "Xuất hiện lần đầu", type: "intro" },
      { id: 2, chapter: 4, label: "Phát hiện bí mật", type: "twist" },
      { id: 3, chapter: 8, label: "Đối đầu phản diện", type: "conflict" },
      { id: 4, chapter: 12, label: "Kết thúc hành trình", type: "end" },
    ],
  },
  {
    id: 2,
    name: "Phản diện",
    color: C.blue,
    events: [
      { id: 5, chapter: 2, label: "Bóng tối xuất hiện", type: "intro" },
      { id: 6, chapter: 6, label: "Kế hoạch bị lộ", type: "twist" },
      { id: 7, chapter: 11, label: "Đụng độ cuối", type: "conflict" },
    ],
  },
  {
    id: 3,
    name: "Nhân vật phụ",
    color: C.yellow,
    events: [
      { id: 8, chapter: 3, label: "Gặp nhân vật chính", type: "intro" },
      { id: 9, chapter: 9, label: "Hi sinh", type: "end" },
    ],
  },
];

const EVENT_ICONS = { intro: "🌱", twist: "⚡", conflict: "🔥", end: "🌙" };
const TOTAL_CHAPTERS = 12;

const TimelineTab = () => {
  const [characters, setCharacters] = useState(defaultCharacters);
  const [addingEvent, setAddingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    chapter: 1,
    label: "",
    type: "intro",
  });

  const addCharacter = () => {
    const colors = [C.red, C.blue, C.yellow, C.pink, "#a8c9a0", "#c4a08f"];
    const newChar = {
      id: Date.now(),
      name: "Nhân vật mới",
      color: colors[characters.length % colors.length],
      events: [],
    };
    setCharacters([...characters, newChar]);
  };

  const deleteCharacter = (id) =>
    setCharacters(characters.filter((c) => c.id !== id));

  const saveEvent = (charId) => {
    if (!newEvent.label.trim()) return;
    setCharacters(
      characters.map((c) =>
        c.id === charId
          ? {
              ...c,
              events: [...c.events, { ...newEvent, id: Date.now() }].sort(
                (a, b) => a.chapter - b.chapter,
              ),
            }
          : c,
      ),
    );
    setAddingEvent(null);
    setNewEvent({ chapter: 1, label: "", type: "intro" });
  };

  const deleteEvent = (charId, eventId) => {
    setCharacters(
      characters.map((c) =>
        c.id === charId
          ? { ...c, events: c.events.filter((e) => e.id !== eventId) }
          : c,
      ),
    );
  };

  const chapters = Array.from({ length: TOTAL_CHAPTERS }, (_, i) => i + 1);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <p style={{ color: C.textLight, fontSize: 13 }}>
          📌 Timeline {TOTAL_CHAPTERS} chương · Mỗi hàng là một nhân vật
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addCharacter}
          style={{
            background: C.red,
            color: C.white,
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={14} /> Thêm nhân vật
        </motion.button>
      </div>

      <div
        style={{
          background: C.white,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${C.grid}`,
          overflowX: "auto",
        }}
      >
        {/* Chapter headers */}
        <div style={{ display: "flex", borderBottom: `2px solid ${C.grid}` }}>
          <div
            style={{
              width: 140,
              minWidth: 140,
              padding: "10px 16px",
              fontWeight: 700,
              color: C.red,
              fontSize: 12,
              borderRight: `1px solid ${C.grid}`,
            }}
          >
            Nhân vật
          </div>
          {chapters.map((ch) => (
            <div
              key={ch}
              style={{
                flex: 1,
                minWidth: 64,
                textAlign: "center",
                padding: "10px 4px",
                fontSize: 12,
                fontWeight: 600,
                color: C.textLight,
                borderRight:
                  ch < TOTAL_CHAPTERS ? `1px solid ${C.grid}` : "none",
                background: ch % 2 === 0 ? C.pinkPale : C.white,
              }}
            >
              Ch.{ch}
            </div>
          ))}
        </div>

        {/* Character rows */}
        {characters.map((char) => (
          <div
            key={char.id}
            style={{
              display: "flex",
              borderBottom: `1px solid ${C.grid}`,
              minHeight: 60,
            }}
          >
            {/* Character name */}
            <div
              style={{
                width: 140,
                minWidth: 140,
                padding: "8px 12px",
                borderRight: `1px solid ${C.grid}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.pinkPale,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: char.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                  {char.name}
                </span>
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                <button
                  onClick={() => {
                    setAddingEvent(char.id);
                    setNewEvent({ chapter: 1, label: "", type: "intro" });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: C.red,
                    padding: 2,
                  }}
                  title="Thêm sự kiện"
                >
                  <Plus size={13} />
                </button>
                <button
                  onClick={() => deleteCharacter(char.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: C.redLight,
                    padding: 2,
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Chapter cells */}
            {chapters.map((ch) => {
              const event = char.events.find((e) => e.chapter === ch);
              return (
                <div
                  key={ch}
                  style={{
                    flex: 1,
                    minWidth: 64,
                    position: "relative",
                    borderRight:
                      ch < TOTAL_CHAPTERS ? `1px solid ${C.grid}` : "none",
                    background: ch % 2 === 0 ? "#fdf9fb" : C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                  }}
                >
                  {event && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        background: char.color + "22",
                        border: `2px solid ${char.color}`,
                        borderRadius: 8,
                        padding: "3px 6px",
                        fontSize: 10,
                        fontWeight: 600,
                        color: C.text,
                        textAlign: "center",
                        lineHeight: 1.3,
                        cursor: "pointer",
                        maxWidth: "100%",
                      }}
                      title={event.label}
                      onClick={() => deleteEvent(char.id, event.id)}
                    >
                      <div style={{ fontSize: 14 }}>
                        {EVENT_ICONS[event.type]}
                      </div>
                      <div style={{ fontSize: 9, color: C.textLight }}>
                        {event.label.slice(0, 10)}
                        {event.label.length > 10 ? "…" : ""}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Add event dialog */}
      <AnimatePresence>
        {addingEvent && (
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
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                background: C.bg,
                borderRadius: 20,
                padding: 28,
                width: 360,
                border: `2px solid ${C.grid}`,
                boxShadow: `0 20px 60px ${C.shadow}`,
              }}
            >
              <h3
                style={{
                  color: C.red,
                  fontWeight: 700,
                  marginBottom: 16,
                  fontSize: 16,
                }}
              >
                ➕ Thêm sự kiện
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Chương
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={TOTAL_CHAPTERS}
                    value={newEvent.chapter}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        chapter: Number(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.grid}`,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Tên sự kiện
                  </label>
                  <input
                    type="text"
                    value={newEvent.label}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, label: e.target.value })
                    }
                    placeholder="VD: Phát hiện bí mật..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: `1px solid ${C.grid}`,
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Loại sự kiện
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {Object.entries(EVENT_ICONS).map(([type, icon]) => (
                      <button
                        key={type}
                        onClick={() => setNewEvent({ ...newEvent, type })}
                        style={{
                          flex: 1,
                          padding: "8px 4px",
                          borderRadius: 10,
                          border: `2px solid`,
                          borderColor: newEvent.type === type ? C.red : C.grid,
                          background:
                            newEvent.type === type ? C.redPale : C.white,
                          cursor: "pointer",
                          fontSize: 18,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {icon}
                        <span style={{ fontSize: 9, color: C.textLight }}>
                          {type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => setAddingEvent(null)}
                    style={{
                      flex: 1,
                      padding: "10px",
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
                    onClick={() => saveEvent(addingEvent)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 12,
                      border: "none",
                      background: C.red,
                      color: C.white,
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}
      >
        {Object.entries(EVENT_ICONS).map(([type, icon]) => (
          <div
            key={type}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span style={{ fontSize: 11, color: C.textLight }}>
              {
                {
                  intro: "Giới thiệu",
                  twist: "Bước ngoặt",
                  conflict: "Xung đột",
                  end: "Kết thúc",
                }[type]
              }
            </span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: C.textLight }}>
          · Click sự kiện để xóa
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTERS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const defaultChapters = [
  {
    id: 1,
    title: "Chương 1: Khởi Đầu",
    summary: "Giới thiệu nhân vật chính và thế giới câu chuyện",
    wordGoal: 2000,
    wordDone: 2150,
    status: "done",
    scenes: ["Cảnh mở đầu", "Gặp gỡ nhân vật phụ"],
  },
  {
    id: 2,
    title: "Chương 2: Bóng Tối",
    summary: "Giới thiệu phản diện, mâu thuẫn bắt đầu nảy sinh",
    wordGoal: 2500,
    wordDone: 1800,
    status: "writing",
    scenes: ["Xuất hiện bóng tối", "Cảnh căng thẳng đầu tiên"],
  },
  {
    id: 3,
    title: "Chương 3: Hành Trình",
    summary: "Nhân vật chính bắt đầu hành trình khám phá",
    wordGoal: 3000,
    wordDone: 0,
    status: "planned",
    scenes: [],
  },
];

const STATUS_CONFIG = {
  done: { label: "✅ Hoàn thành", color: "#4caf50", bg: "#e8f5e9" },
  writing: { label: "✍️ Đang viết", color: C.red, bg: C.redPale },
  planned: { label: "📝 Kế hoạch", color: C.blue, bg: C.bluePale },
};

const ChaptersTab = () => {
  const [chapters, setChapters] = useState(defaultChapters);
  const [expanded, setExpanded] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: "",
    summary: "",
    wordGoal: 2000,
    status: "planned",
  });
  const [newScene, setNewScene] = useState("");

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  const updateChapter = (id, updates) =>
    setChapters(chapters.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const deleteChapter = (id) =>
    setChapters(chapters.filter((c) => c.id !== id));

  const addChapter = () => {
    if (!newChapter.title.trim()) return;
    setChapters([
      ...chapters,
      { ...newChapter, id: Date.now(), wordDone: 0, scenes: [] },
    ]);
    setNewChapter({
      title: "",
      summary: "",
      wordGoal: 2000,
      status: "planned",
    });
    setShowAdd(false);
  };

  const addScene = (chapterId) => {
    if (!newScene.trim()) return;
    setChapters(
      chapters.map((c) =>
        c.id === chapterId ? { ...c, scenes: [...c.scenes, newScene] } : c,
      ),
    );
    setNewScene("");
  };

  const removeScene = (chapterId, idx) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? { ...c, scenes: c.scenes.filter((_, i) => i !== idx) }
          : c,
      ),
    );
  };

  const totalGoal = chapters.reduce((s, c) => s + c.wordGoal, 0);
  const totalDone = chapters.reduce((s, c) => s + c.wordDone, 0);
  const doneCount = chapters.filter((c) => c.status === "done").length;

  return (
    <div>
      {/* Stats */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        {[
          { label: "Tổng chương", value: chapters.length, color: C.red },
          { label: "Hoàn thành", value: doneCount, color: "#4caf50" },
          {
            label: "Từ đã viết",
            value: totalDone.toLocaleString(),
            color: C.blue,
          },
          {
            label: "Mục tiêu",
            value: totalGoal.toLocaleString(),
            color: C.yellow,
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: C.white,
              border: `1px solid ${C.grid}`,
              borderRadius: 12,
              padding: "10px 16px",
              flex: 1,
              minWidth: 100,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: C.textLight }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, color: C.textLight }}>
            Tiến độ tổng thể
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>
            {Math.round((totalDone / totalGoal) * 100)}%
          </span>
        </div>
        <div
          style={{
            height: 10,
            background: C.grid,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((totalDone / totalGoal) * 100, 100)}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${C.redLight}, ${C.red})`,
              borderRadius: 5,
            }}
          />
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {chapters.map((ch, idx) => {
          const pct =
            ch.wordGoal > 0
              ? Math.min((ch.wordDone / ch.wordGoal) * 100, 100)
              : 0;
          const st = STATUS_CONFIG[ch.status];
          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: C.white,
                border: `2px solid`,
                borderColor: expanded === ch.id ? C.redLight : C.grid,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow:
                  expanded === ch.id ? `0 4px 20px ${C.shadow}` : "none",
                transition: "all 0.2s",
              }}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(ch.id)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: expanded === ch.id ? C.pinkPale : C.white,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: st.bg,
                    color: st.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: C.text,
                      marginBottom: 2,
                    }}
                  >
                    {ch.title}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        height: 4,
                        width: 80,
                        background: C.grid,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: C.red,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: C.textLight }}>
                      {ch.wordDone}/{ch.wordGoal} từ
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: st.color,
                    background: st.bg,
                    padding: "3px 10px",
                    borderRadius: 20,
                    flexShrink: 0,
                  }}
                >
                  {st.label}
                </div>
                {expanded === ch.id ? (
                  <ChevronUp size={16} color={C.red} />
                ) : (
                  <ChevronDown size={16} color={C.textLight} />
                )}
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {expanded === ch.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        padding: "0 16px 16px",
                        borderTop: `1px solid ${C.grid}`,
                      }}
                    >
                      {/* Summary */}
                      <div style={{ marginTop: 12 }}>
                        <label
                          style={{
                            fontSize: 11,
                            color: C.textLight,
                            fontWeight: 600,
                          }}
                        >
                          TÓM TẮT
                        </label>
                        <p
                          style={{
                            fontSize: 13,
                            color: C.text,
                            marginTop: 4,
                            lineHeight: 1.6,
                          }}
                        >
                          {ch.summary || "Chưa có tóm tắt"}
                        </p>
                      </div>

                      {/* Word count editor */}
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          marginTop: 12,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: 11,
                              color: C.textLight,
                              display: "block",
                              marginBottom: 2,
                            }}
                          >
                            Từ đã viết
                          </label>
                          <input
                            type="number"
                            value={ch.wordDone}
                            onChange={(e) =>
                              updateChapter(ch.id, {
                                wordDone: Number(e.target.value),
                              })
                            }
                            style={{
                              width: 90,
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: `1px solid ${C.grid}`,
                              fontSize: 13,
                              outline: "none",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 11,
                              color: C.textLight,
                              display: "block",
                              marginBottom: 2,
                            }}
                          >
                            Mục tiêu
                          </label>
                          <input
                            type="number"
                            value={ch.wordGoal}
                            onChange={(e) =>
                              updateChapter(ch.id, {
                                wordGoal: Number(e.target.value),
                              })
                            }
                            style={{
                              width: 90,
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: `1px solid ${C.grid}`,
                              fontSize: 13,
                              outline: "none",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 11,
                              color: C.textLight,
                              display: "block",
                              marginBottom: 2,
                            }}
                          >
                            Trạng thái
                          </label>
                          <select
                            value={ch.status}
                            onChange={(e) =>
                              updateChapter(ch.id, { status: e.target.value })
                            }
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 8,
                              border: `1px solid ${C.grid}`,
                              fontSize: 13,
                              outline: "none",
                              background: C.white,
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Scenes */}
                      <div style={{ marginTop: 14 }}>
                        <label
                          style={{
                            fontSize: 11,
                            color: C.textLight,
                            fontWeight: 600,
                          }}
                        >
                          CẢNH TRONG CHƯƠNG
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            marginTop: 6,
                          }}
                        >
                          {ch.scenes.map((scene, si) => (
                            <div
                              key={si}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 10px",
                                background: C.pinkPale,
                                borderRadius: 8,
                                fontSize: 13,
                              }}
                            >
                              <span style={{ color: C.red, fontWeight: 700 }}>
                                ·
                              </span>
                              <span style={{ flex: 1, color: C.text }}>
                                {scene}
                              </span>
                              <button
                                onClick={() => removeScene(ch.id, si)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: C.redLight,
                                  padding: 2,
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: 6 }}>
                            <input
                              placeholder="Thêm cảnh mới..."
                              value={newScene}
                              onChange={(e) => setNewScene(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && addScene(ch.id)
                              }
                              style={{
                                flex: 1,
                                padding: "6px 10px",
                                borderRadius: 8,
                                border: `1px solid ${C.grid}`,
                                fontSize: 13,
                                outline: "none",
                              }}
                            />
                            <button
                              onClick={() => addScene(ch.id)}
                              style={{
                                background: C.red,
                                color: C.white,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontWeight: 700,
                                fontSize: 13,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 12,
                        }}
                      >
                        <button
                          onClick={() => deleteChapter(ch.id)}
                          style={{
                            background: "none",
                            border: `1px solid ${C.redLight}`,
                            color: C.redLight,
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Trash2 size={12} /> Xóa chương
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add chapter */}
      <AnimatePresence>
        {showAdd ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: C.white,
              border: `2px solid ${C.redLight}`,
              borderRadius: 14,
              padding: 16,
              marginTop: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                placeholder="Tên chương..."
                value={newChapter.title}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, title: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${C.grid}`,
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <input
                placeholder="Tóm tắt..."
                value={newChapter.summary}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, summary: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${C.grid}`,
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Mục tiêu từ"
                  value={newChapter.wordGoal}
                  onChange={(e) =>
                    setNewChapter({
                      ...newChapter,
                      wordGoal: Number(e.target.value),
                    })
                  }
                  style={{
                    width: 120,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.grid}`,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <select
                  value={newChapter.status}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, status: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1px solid ${C.grid}`,
                    fontSize: 13,
                    outline: "none",
                    background: C.white,
                  }}
                >
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setShowAdd(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
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
                  onClick={addChapter}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: C.red,
                    color: C.white,
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Thêm chương
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdd(true)}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "12px",
              border: `2px dashed ${C.redLight}`,
              borderRadius: 14,
              background: "transparent",
              cursor: "pointer",
              color: C.redLight,
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Plus size={16} /> Thêm chương mới
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WORKFLOW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const WorkflowDetail = ({ workflow, onBack }) => {
  const [activeTab, setActiveTab] = useState("mindmap");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 32px 60px",
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    >
      {/* Nút quay lại */}
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
          marginBottom: 20,
        }}
      >
        <ArrowLeft size={14} /> Quay lại
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: C.red,
            fontFamily: "Georgia, serif",
            margin: 0,
          }}
        >
          🗂️ {workflow.name}
        </h1>
        {workflow.description && (
          <p style={{ color: C.textLight, marginTop: 4, fontSize: 14 }}>
            {workflow.description}
          </p>
        )}
      </motion.div>

      {/* Tabs */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}
      >
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              borderRadius: 40,
              border: "2px solid",
              borderColor: activeTab === tab.id ? C.red : C.grid,
              background: activeTab === tab.id ? C.red : C.white,
              color: activeTab === tab.id ? C.white : C.textLight,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              transition: "all 0.15s",
            }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "mindmap" && <MindmapTab />}
          {activeTab === "timeline" && <TimelineTab />}
          {activeTab === "chapters" && <ChaptersTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANG DANH SÁCH WORKFLOW
// ═══════════════════════════════════════════════════════════════════════════════
const Workflow = () => {
  const { workflows, addWorkflow, deleteWorkflow } = useStoryStore();
  const [openWorkflow, setOpenWorkflow] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Nếu đang mở 1 workflow thì hiện trang detail
  if (openWorkflow) {
    return (
      <WorkflowDetail
        workflow={openWorkflow}
        onBack={() => setOpenWorkflow(null)}
      />
    );
  }

  const handleCreate = () => {
    if (!newName.trim()) return;
    addWorkflow({ name: newName.trim(), description: newDesc.trim() });
    setNewName("");
    setNewDesc("");
    setShowCreate(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 32px 60px",
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
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
              fontFamily: "Georgia, serif",
              margin: 0,
            }}
          >
            🗂️ Workflow
          </h1>
          <p style={{ color: C.textLight, marginTop: 4, fontSize: 14 }}>
            Lên kế hoạch · Sơ đồ cốt truyện · Timeline nhân vật
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
          <Plus size={16} /> Tạo Workflow
        </motion.button>
      </motion.div>

      {/* Danh sách workflow */}
      {workflows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "80px 0", color: C.textLight }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>Chưa có workflow nào</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Bấm "Tạo Workflow" để bắt đầu nhé!
          </p>
        </motion.div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {workflows.map((wf, idx) => (
            <motion.div
              key={wf.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4, boxShadow: `0 12px 32px ${C.shadow}` }}
              onClick={() => setOpenWorkflow(wf)}
              style={{
                background: C.white,
                borderRadius: 18,
                border: `2px solid ${C.grid}`,
                padding: 20,
                cursor: "pointer",
                boxShadow: `0 2px 8px ${C.shadow}`,
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {/* Nút xóa */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteWorkflow(wf.id);
                }}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.redLight,
                  padding: 4,
                  borderRadius: 8,
                  opacity: 0.6,
                }}
              >
                <Trash2 size={14} />
              </button>

              <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: C.text,
                  marginBottom: 4,
                  paddingRight: 24,
                }}
              >
                {wf.name}
              </div>
              {wf.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.textLight,
                    marginBottom: 10,
                    lineHeight: 1.5,
                  }}
                >
                  {wf.description}
                </div>
              )}
              <div style={{ fontSize: 11, color: C.redLight, marginTop: 8 }}>
                Tạo: {new Date(wf.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog tạo workflow */}
      <AnimatePresence>
        {showCreate && (
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
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: C.bg,
                borderRadius: 24,
                padding: 32,
                width: 400,
                border: `2px solid ${C.grid}`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.2)`,
              }}
            >
              <h2
                style={{
                  color: C.red,
                  fontWeight: 800,
                  fontSize: 20,
                  marginBottom: 6,
                }}
              >
                🗂️ Tạo Workflow Mới
              </h2>
              <p style={{ color: C.textLight, fontSize: 13, marginBottom: 20 }}>
                Lên kế hoạch cho từng truyện riêng biệt
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.red,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Tên Workflow *
                  </label>
                  <input
                    autoFocus
                    placeholder="VD: Truyện ngắn mùa hè..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: `1.5px solid ${C.grid}`,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      background: C.white,
                      color: C.text,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.red,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Mô tả (tuỳ chọn)
                  </label>
                  <textarea
                    placeholder="VD: Câu chuyện về hai người gặp nhau vào mùa hè..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: `1.5px solid ${C.grid}`,
                      fontSize: 13,
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                      background: C.white,
                      fontFamily: "inherit",
                      color: C.text,
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setNewName("");
                      setNewDesc("");
                    }}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: 12,
                      border: `1px solid ${C.grid}`,
                      background: C.white,
                      cursor: "pointer",
                      fontWeight: 600,
                      color: C.textLight,
                      fontSize: 14,
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCreate}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: 12,
                      border: "none",
                      background: C.red,
                      color: C.white,
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Tạo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workflow;
