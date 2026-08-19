import React from "react";
import { motion } from "framer-motion";
import { useStoryStore } from "../../store";
import btnSOS from "../../assets/1 - button SOS.png";
import btnBYC from "../../assets/2 - Button BYC.png";
import btnWF from "../../assets/3- Button WF.png";
import logo2 from "../../assets/logo2.png";
import { mockCharacters } from "../../data/mockData";
import { supabase } from "../../lib/supabaseClient";
import { createStory } from "../../services/storyService";
import Cropper from "react-easy-crop";

const Home = () => {
  const {
    setCurrentTab,
setCurrentStory,
setStories,
stories,
    moodboardCollections,
    workflows,
    worlds,
    addWorkflow,
    setCurrentWorkflow,
  } = useStoryStore();

  const allChars = (worlds || []).flatMap(w => w.characters || []);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showWorkflowDialog, setShowWorkflowDialog] = React.useState(false);
  const [newWorkflow, setNewWorkflow] = React.useState({
    title: "",
    description: "",
    storyName: "",
  });
  const [hovering, setHovering] = React.useState(false);
  const [hoveringBYC, setHoveringBYC] = React.useState(false);
  const [hoveringWF, setHoveringWF] = React.useState(false);
  const [newStory, setNewStory] = React.useState({
  title: "",
  description: "",
  category: "",
  coverImage: null,
});

const [cropSrc, setCropSrc] = React.useState(null);
const [crop, setCrop] = React.useState({ x: 0, y: 0 });
const [zoom, setZoom] = React.useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

const onCropComplete = React.useCallback(
  (_, pixels) => setCroppedAreaPixels(pixels),
  [],
);

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = url;
  });

const getCroppedImg = async (src, crop) => {
  const image = await createImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 212;

  const ctx = canvas.getContext("2d");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    160,
    212,
  );

  return canvas.toDataURL("image/jpeg", 0.92);
};

const handleConfirmCrop = async () => {
  const cropped = await getCroppedImg(cropSrc, croppedAreaPixels);

  setNewStory((prev) => ({
    ...prev,
    coverImage: cropped,
  }));

  setCropSrc(null);
};

  const handleCreateStory = async () => {
    if (!newStory.title.trim()) {
      alert("Vui lòng nhập tiêu đề truyện");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      return;
    }

    try {
      const created = await createStory(user.id, {
        title: newStory.title,
        description: newStory.description,
        category: newStory.category || "Không xác định",
        coverImage: newStory.coverImage,
        status: "ongoing",
        content: "",
        wordCount: 0,
        chapters: 0,
      });

      setStories([...stories, created]);
setCurrentStory(created);
      setShowCreateDialog(false);
      setCurrentTab("write");
    } catch (err) {
      console.error("Lỗi khi tạo truyện:", err);
      alert("Tạo truyện thất bại, vui lòng thử lại.");
    }
  };

  const handleCoverImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    setCropSrc(ev.target.result);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  reader.readAsDataURL(file);
};

  const folders = [
    {
      id: "moodboard",
      label: "Style Of Story",
      color: "#c9a0a8",
      tabColor: "#d4b0b8",
      description: "Mood, aesthetic & cảm hứng",
      icon: "🎨",
      items: ["Moodboard", "Màu sắc", "References"],
    },
    {
      id: "characters",
      label: "Build Your Character",
      color: "#8fafc4",
      tabColor: "#9fbdd4",
      description: "Xây dựng nhân vật của bạn",
      icon: "👤",
      items: ["Nhân vật chính", "Phản diện", "Phụ"],
    },
    {
      id: "workflow",
      label: "Workflow",
      color: "#b5aa98",
      tabColor: "#c5baaa",
      description: "Lên kế hoạch & sơ đồ cốt truyện",
      icon: "🗂️",
      items: ["Timeline", "Plot", "Chapters"],
    },
  ];

  return (
    <div
      className="h-screen overflow-hidden p-8 pt-4"
      style={{
        backgroundColor: "#fdf6f0",
        backgroundImage:
          "linear-gradient(#e8c8c8 1px, transparent 1px), linear-gradient(90deg, #e8c8c8 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    >
      {/* Top Bar + Logo cùng hàng */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateDialog(true)}
          className="px-6 py-3 rounded-full text-white font-bold text-base shadow-lg flex items-center gap-2"
          style={{ backgroundColor: "#DD7E83" }}
        >
          Bắt Đầu Viết ✨
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={logo2}
            alt="Show Your Weird"
            style={{ maxWidth: "300px", width: "100%" }}
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentTab("notes")}
          className="px-6 py-3 rounded-full text-white font-bold text-base shadow-lg"
          style={{ backgroundColor: "#DD7E83" }}
        >
          Ghi Chú ✨
        </motion.button>
      </div>

      {/* Folders */}
      <div
        className="relative w-full mt-4 flex flex-col items-center"
        style={{ gap: "0px" }}
      >
        <div
          className="relative w-full"
          style={{
            marginBottom: "-120px",
            zIndex: 1,
            display: "flex",
            justifyContent: "flex-start",
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Preview moodboard khi hover */}
          <motion.div
            animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 flex gap-6 pointer-events-none"
            style={{
              zIndex: -1,
              top: "-40px",
              right: "10px",
              left: "auto",
              transform: "none",
            }}
          >
            {moodboardCollections.slice(0, 4).map((col, i) => (
              <div
                key={col.id}
                className="w-32 h-32 rounded-xl shadow-xl flex items-center justify-center text-sm font-bold text-white overflow-hidden"
                style={{
                  backgroundColor: "#c9a0a8",
                  transform: `rotate(${(i - 1.5) * 6}deg)`,
                  backgroundImage: col.images?.[0]?.url
                    ? `url(${col.images[0].url})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!col.images?.[0]?.url && col.name?.charAt(0)}
              </div>
            ))}
          </motion.div>

          <motion.img
            src={btnSOS}
            initial={{ opacity: 0, x: -40 }}
            animate={{
              opacity: 1,
              x: 0,
              y: hovering ? -12 : 0,
              scale: hovering ? 1.02 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: hovering ? 0 : 0.1,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentTab("moodboard")}
            className="w-full cursor-pointer"
            style={{ maxWidth: "98%", marginLeft: "1%" }}
          />
        </div>
        <div
          className="relative w-full"
          style={{ marginBottom: "-120px", zIndex: 2 }}
          onMouseEnter={() => setHoveringBYC(true)}
          onMouseLeave={() => setHoveringBYC(false)}
        >
          <motion.div
            animate={{ opacity: hoveringBYC ? 1 : 0, y: hoveringBYC ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 flex gap-6 pointer-events-none"
            style={{
              zIndex: -1,
              top: "-40px",
              left: "10px",
              left: "auto",
              transform: "none",
            }}
          >
            {worlds.slice(0, 4).map((world, i) => (
              <div
                key={world.id}
                className="w-32 h-32 rounded-xl shadow-xl flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
                style={{
                  backgroundColor: "#8fafc4",
                  transform: `rotate(${(i - 1.5) * 6}deg)`,
                  backgroundImage: world.cover && world.coverType !== 'emoji' ? `url(${world.cover})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {(!world.cover || world.coverType === 'emoji') ? (world.emoji || '🌍') : ''}
              </div>
            ))}
          </motion.div>

          <motion.img
            src={btnBYC}
            initial={{ opacity: 0, x: 40 }}
            animate={{
              opacity: 1,
              x: 0,
              y: hoveringBYC ? -12 : 0,
              scale: hoveringBYC ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentTab("characters")}
            className="w-full cursor-pointer"
            style={{ maxWidth: "100%" }}
          />
        </div>
        <div
          className="relative w-full"
          style={{ zIndex: 3 }}
          onMouseEnter={() => setHoveringWF(true)}
          onMouseLeave={() => setHoveringWF(false)}
        >
          <motion.div
            animate={{ opacity: hoveringWF ? 1 : 0, y: hoveringWF ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 flex gap-6 pointer-events-none"
            style={{
              zIndex: -1,
              top: "-40px",
              right: "10px",
              left: "auto",
              transform: "none",
            }}
          >
            {workflows.slice(0, 4).map((wf, i) => (
              <div
                key={wf.id}
                className="w-32 h-32 rounded-xl shadow-xl flex items-center justify-center text-2xl font-bold overflow-hidden"
                style={{
                  backgroundColor: "#b5aa98",
                  transform: `rotate(${(i - 1.5) * 6}deg)`,
                  color: "#fff",
                  fontSize: 13,
                  padding: 8,
                  textAlign: "center",
                }}
              >
                🗺️
                <br />
                <span style={{ fontSize: 11 }}>{wf.name}</span>
              </div>
            ))}
          </motion.div>

          <motion.img
            src={btnWF}
            initial={{ opacity: 0, x: -40 }}
            animate={{
              opacity: 1,
              x: 0,
              y: hoveringWF ? -12 : 0,
              scale: hoveringWF ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentTab("workflow")}
            className="w-full cursor-pointer"
            style={{ maxWidth: "100%" }}
          />
        </div>
      </div>
      <div style={{ paddingBottom: "40px" }} />

      {/* Create Workflow Dialog */}
      {showWorkflowDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 w-[480px] border shadow-2xl"
            style={{ backgroundColor: "#fdf6f0", borderColor: "#e8c8c8" }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#9b2335" }}
            >
              🗂️ Tạo Workflow Mới
            </h2>
            <p className="text-sm mb-6" style={{ color: "#7a4a4a" }}>
              Lên kế hoạch cho từng truyện riêng biệt
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm mb-1 font-semibold"
                  style={{ color: "#9b2335" }}
                >
                  Tên Workflow *
                </label>
                <input
                  type="text"
                  value={newWorkflow.title}
                  onChange={(e) =>
                    setNewWorkflow({ ...newWorkflow, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e8c8c8",
                    color: "#2d0a0a",
                  }}
                  placeholder="VD: Workflow - Thành phố những giấc mơ..."
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1 font-semibold"
                  style={{ color: "#9b2335" }}
                >
                  Tên Truyện
                </label>
                <input
                  type="text"
                  value={newWorkflow.storyName}
                  onChange={(e) =>
                    setNewWorkflow({
                      ...newWorkflow,
                      storyName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e8c8c8",
                    color: "#2d0a0a",
                  }}
                  placeholder="Truyện này thuộc về..."
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-1 font-semibold"
                  style={{ color: "#9b2335" }}
                >
                  Mô Tả
                </label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) =>
                    setNewWorkflow({
                      ...newWorkflow,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none resize-none"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#e8c8c8",
                    color: "#2d0a0a",
                  }}
                  placeholder="Mô tả ngắn về workflow này..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWorkflowDialog(false)}
                className="flex-1 py-2 rounded-lg"
                style={{ backgroundColor: "#e8c8c8", color: "#9b2335" }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newWorkflow.title.trim()) {
                    alert("Vui lòng nhập tên workflow");
                    return;
                  }
                  const wf = { ...newWorkflow };
                  addWorkflow(wf);
                  setCurrentWorkflow(wf);
                  setShowWorkflowDialog(false);
                  setNewWorkflow({ title: "", description: "", storyName: "" });
                  setCurrentTab("workflow");
                }}
                className="flex-1 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: "#9b2335" }}
              >
                Tạo Workflow ✨
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Story Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl p-8 w-[560px] border shadow-2xl"
            style={{ backgroundColor: "#fdf6f0", borderColor: "#e8c8c8" }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#9b2335" }}
            >
              📖 Tạo Truyện Mới
            </h2>
            <div className="flex gap-6">
              <div
                onClick={() => document.getElementById("coverInput").click()}
                className="w-36 h-52 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all flex-shrink-0 overflow-hidden"
                style={{
                  borderColor: "#c9a0a8",
                  background: newStory.coverImage
                    ? `url(${newStory.coverImage}) center/cover`
                    : "#fff0f0",
                }}
              >
                {!newStory.coverImage && (
                  <>
                    <span className="text-3xl mb-2">🖼️</span>
                    <span
                      className="text-xs text-center px-2"
                      style={{ color: "#c9a0a8" }}
                    >
                      Thêm ảnh bìa
                    </span>
                  </>
                )}
                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImage}
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {[
                  {
                    label: "Tiêu đề *",
                    key: "title",
                    placeholder: "Tên truyện của bạn...",
                  },
                  {
                    label: "Thể loại",
                    key: "category",
                    placeholder: "Tình cảm, Hành động...",
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "#9b2335" }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={newStory[field.key]}
                      onChange={(e) =>
                        setNewStory({
                          ...newStory,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                      style={{
                        backgroundColor: "#fff",
                        borderColor: "#e8c8c8",
                        color: "#2d0a0a",
                      }}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: "#9b2335" }}
                  >
                    Mô tả
                  </label>
                  <textarea
                    value={newStory.description}
                    onChange={(e) =>
                      setNewStory({ ...newStory, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none resize-none"
                    style={{
                      backgroundColor: "#fff",
                      borderColor: "#e8c8c8",
                      color: "#2d0a0a",
                    }}
                    placeholder="Tóm tắt nội dung..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 py-2 rounded-lg"
                style={{ backgroundColor: "#e8c8c8", color: "#9b2335" }}
              >
                Hủy
              </button>
              <button
                onClick={handleCreateStory}
                className="flex-1 py-2 rounded-lg font-semibold text-white"
                style={{ backgroundColor: "#9b2335" }}
              >
                Bắt Đầu Viết ✨
              </button>
            </div>
          </motion.div>
        </div>
      )}
            {cropSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-4">
              Căn chỉnh bìa sách
            </h3>

            <div className="relative w-full h-[280px] bg-black rounded-lg overflow-hidden">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={160 / 212}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-4"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCropSrc(null)}
                className="flex-1 py-2 rounded-lg bg-gray-200"
              >
                Hủy
              </button>

              <button
                onClick={handleConfirmCrop}
                className="flex-1 py-2 rounded-lg bg-[#DD7E83] text-white"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
