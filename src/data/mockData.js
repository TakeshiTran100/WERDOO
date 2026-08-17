export const mockStories = [
  {
    id: 1,
    title: 'Thành phố những giấc mơ',
    description: 'Một thành phố nơi con người có thể du hành qua các giấc mơ của nhau',
    content: 'Chương 1: Sáng sớm trên đường phố tĩnh lặng...',
    status: 'ongoing',
    wordCount: 45320,
    chapters: 12,
    tags: ['fantasy', 'adventure'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-04-25'),
    color: '#e879f9',
  },
  {
    id: 2,
    title: 'Tìm kiếm ánh sáng',
    description: 'Hành trình của một cô gái trong đêm tối',
    content: 'Lúc nửa đêm, Em bỗng tỉnh dậy...',
    status: 'draft',
    wordCount: 12450,
    chapters: 3,
    tags: ['romance', 'mystery'],
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-04-26'),
    color: '#60a5fa',
  },
  {
    id: 3,
    title: 'Bí mật của cánh rừng',
    description: 'Các bí mật ẩn giấu trong sâu rừng xanh',
    content: 'Sáng hôm đó, mưa tuôn rơi...',
    status: 'completed',
    wordCount: 87650,
    chapters: 24,
    tags: ['fantasy', 'nature'],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-02-14'),
    color: '#34d399',
  },
];

export const mockMoodboardItems = [
  {
    id: 1,
    storyId: 1,
    type: 'image',
    title: 'Thành phố đêm',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
    tags: ['cityscape', 'night'],
  },
  {
    id: 2,
    storyId: 1,
    type: 'color',
    title: 'Màu sắc chính',
    color: '#1a1a2e',
    tags: ['palette'],
  },
  {
    id: 3,
    storyId: 2,
    type: 'image',
    title: 'Con đường tối',
    url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    tags: ['road', 'night'],
  },
];

export const mockNotes = [
  {
    id: 1,
    storyId: 1,
    title: 'Ý tưởng chính',
    content: 'Thành phố nơi người ta có thể du hành vào giấc mơ của nhau - rất thú vị!',
    color: '#fef3c7',
    createdAt: new Date('2024-04-20'),
  },
  {
    id: 2,
    storyId: 2,
    title: 'Tính cách nhân vật',
    content: 'Nữ chính: Tính tình mạnh mẽ, quyết đoán nhưng có phần tổn thương bên trong',
    color: '#dbeafe',
    createdAt: new Date('2024-04-18'),
  },
  {
    id: 3,
    storyId: 1,
    title: 'Đốc của câu chuyện',
    content: 'Phải có điểm twist ở chương 15 khi người đã chết xuất hiện',
    color: '#f8a5a5',
    createdAt: new Date('2024-04-24'),
  },
];

export const mockCharacters = [
  {
    id: 1,
    storyId: 1,
    name: 'Minh Anh',
    age: 24,
    role: 'Nữ chính',
    description: 'Cô gái bình thường với khả năng nhìn thấy cơn mơ của người khác',
    traits: ['Tốt bụng', 'Tò mò', 'Can đảm'],
    secrets: 'Cha cô chết vì tình cờ, mẹ cô không bao giờ quay lại',
  },
];

export const mockThemes = [
  {
    id: 'cozy',
    name: 'Phòng Ấm Cúng',
    icon: '🔥',
    colors: {
      bg: 'bg-amber-50',
      accent: 'text-amber-900',
      primary: '#d97706',
    },
  },
  {
    id: 'library',
    name: 'Thư Viện Cổ',
    icon: '📚',
    colors: {
      bg: 'bg-amber-900',
      accent: 'text-amber-100',
      primary: '#b45309',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Neon Có Lai',
    icon: '⚡',
    colors: {
      bg: 'bg-slate-900',
      accent: 'text-cyan-400',
      primary: '#06b6d4',
    },
  },
  {
    id: 'minimal',
    name: 'Tối Giản Trắng',
    icon: '✨',
    colors: {
      bg: 'bg-white',
      accent: 'text-gray-900',
      primary: '#000000',
    },
  },
  {
    id: 'fantasy',
    name: 'Phòng Phù Thủy',
    icon: '🌙',
    colors: {
      bg: 'bg-indigo-950',
      accent: 'text-purple-200',
      primary: '#a78bfa',
    },
  },
  {
    id: 'hellokitty',
    name: 'Hello Kitty',
    icon: '🎀',
    colors: {
      bg: 'bg-white',
      accent: 'text-red-500',
      primary: '#e63946',
    },
  },
];
