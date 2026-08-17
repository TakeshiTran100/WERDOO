import { create } from 'zustand';

const STORAGE_KEY = 'storyRoom_store';

// Helper function to convert dates in object to Date objects
const reviveDates = (obj) => {
  if (!obj) return obj;
  
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item => {
        if (typeof item === 'object' && item !== null) {
          return reviveDates(item);
        }
        return item;
      });
    } else if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj[key])) {
      // Try to parse ISO date strings
      obj[key] = new Date(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      reviveDates(obj[key]);
    }
  }
  
  return obj;
};

// Load initial state from localStorage
const loadInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return reviveDates(parsed);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

export const useStoryStore = create((set) => {
  const initialState = loadInitialState();

  // Helper function to save state to localStorage
  const saveToStorage = (newState) => {
    try {
      const stringified = JSON.stringify(newState, (key, value) => {
        // Keep Date objects as ISO strings, which will be parsed back in reviveDates
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      localStorage.setItem(STORAGE_KEY, stringified);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    return newState;
  };

  return {
    currentTheme: initialState?.currentTheme || 'cozy',
    setTheme: (theme) => set((state) => {
      const newState = { ...state, currentTheme: theme };
      return saveToStorage(newState);
    }),
    
    isDarkMode: initialState?.isDarkMode !== undefined ? initialState.isDarkMode : true,
    setDarkMode: (value) => set((state) => {
      const newState = { ...state, isDarkMode: value };
      return saveToStorage(newState);
    }),

    // Font settings
    editorFont: initialState?.editorFont || 'BeVietnamPro',
    setEditorFont: (font) => set((state) => {
      const newState = { ...state, editorFont: font };
      return saveToStorage(newState);
    }),
    editorFontWeight: initialState?.editorFontWeight || '400',
    setEditorFontWeight: (weight) => set((state) => {
      const newState = { ...state, editorFontWeight: weight };
      return saveToStorage(newState);
    }),
    editorFontSize: initialState?.editorFontSize || 16,
    setEditorFontSize: (size) => set((state) => {
      const newState = { ...state, editorFontSize: size };
      return saveToStorage(newState);
    }),
    
    currentStory: initialState?.currentStory || null,
    setCurrentStory: (story) => set((state) => {
      const newState = { ...state, currentStory: story };
      return saveToStorage(newState);
    }),
    updateCurrentStory: (updates) => set((state) => {
      const newState = {
        ...state,
        currentStory: state.currentStory ? { ...state.currentStory, ...updates } : null
      };
      return saveToStorage(newState);
    }),
    
    currentTab: initialState?.currentTab || 'home',
    setCurrentTab: (tab) => set((state) => {
      const newState = { ...state, currentTab: tab };
      return saveToStorage(newState);
    }),
    
    // Write tab state
    isWriteFullscreen: initialState?.isWriteFullscreen || false,
    setIsWriteFullscreen: (value) => set((state) => {
      const newState = { ...state, isWriteFullscreen: value };
      return saveToStorage(newState);
    }),
    
    stories: initialState?.stories || [],
    setStories: (stories) => set((state) => {
      const newState = { ...state, stories };
      return saveToStorage(newState);
    }),
    addStory: (story) => set((state) => {
      const newState = { 
        ...state,
        stories: [...state.stories, { ...story, id: Date.now(), createdAt: new Date(), updatedAt: new Date() }] 
      };
      return saveToStorage(newState);
    }),
    updateStory: (id, updates) => set((state) => {
      const newState = {
        ...state,
        stories: state.stories.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s)
      };
      return saveToStorage(newState);
    }),
    deleteStory: (id) => set((state) => {
      const newState = {
        ...state,
        stories: state.stories.filter(s => s.id !== id)
      };
      return saveToStorage(newState);
    }),
    
    // Moodboard collections
    moodboardCollections: initialState?.moodboardCollections || [],
    setMoodboardCollections: (collections) => set((state) => {
      const newState = { ...state, moodboardCollections: collections };
      return saveToStorage(newState);
    }),
    addMoodboardCollection: (collection) => set((state) => {
      const newState = {
        ...state,
        moodboardCollections: [...state.moodboardCollections, { ...collection, id: Date.now(), createdAt: new Date() }]
      };
      return saveToStorage(newState);
    }),
    updateMoodboardCollection: (id, updates) => set((state) => {
      const newState = {
        ...state,
        moodboardCollections: state.moodboardCollections.map(c => c.id === id ? { ...c, ...updates } : c)
      };
      return saveToStorage(newState);
    }),
    addImageToCollection: (collectionId, image) => set((state) => {
      const newState = {
        ...state,
        moodboardCollections: state.moodboardCollections.map(c => 
          c.id === collectionId 
            ? { ...c, images: [...(c.images || []), { ...image, id: Date.now() }] }
            : c
        )
      };
      return saveToStorage(newState);
    }),
    deleteMoodboardCollection: (id) => set((state) => {
      const newState = {
        ...state,
        moodboardCollections: state.moodboardCollections.filter(c => c.id !== id)
      };
      return saveToStorage(newState);
    }),
    
    moodboards: initialState?.moodboards || [],
    addMoodboardItem: (item) => set((state) => {
      const newState = {
        ...state,
        moodboards: [...state.moodboards, { ...item, id: Date.now() }]
      };
      return saveToStorage(newState);
    }),
    
    notes: initialState?.notes || [],
addNote: (note) => set((state) => {
      const newState = {
        ...state,
        notes: [...state.notes, { ...note, id: Date.now(), createdAt: new Date() }]
      };
      return saveToStorage(newState);
    }),
    updateNote: (id, updates) => set((state) => {
      const newState = {
        ...state,
        notes: state.notes.map(n => n.id === id ? { ...n, ...updates } : n)
      };
      return saveToStorage(newState);
    }),
    deleteNote: (id) => set((state) => {
  const newState = {
    ...state,
    notes: state.notes.filter(n => n.id !== id)
  };
  return saveToStorage(newState);
}),

    worlds: initialState?.worlds || [],
addWorld: (world) => set((state) => {
  const newState = {
    ...state,
    worlds: [...state.worlds, { ...world, id: Date.now(), createdAt: new Date(), characters: [] }]
  };
  return saveToStorage(newState);
}),
updateWorld: (id, updates) => set((state) => {
  const newState = {
    ...state,
    worlds: state.worlds.map(w => w.id === id ? { ...w, ...updates } : w)
  };
  return saveToStorage(newState);
}),
deleteWorld: (id) => set((state) => {
  const newState = {
    ...state,
    worlds: state.worlds.filter(w => w.id !== id)
  };
  return saveToStorage(newState);
}),
addCharacterToWorld: (worldId, char) => set((state) => {
  const newState = {
    ...state,
    worlds: state.worlds.map(w => w.id === worldId
      ? { ...w, characters: [...(w.characters || []), { ...char, id: Date.now(), createdAt: new Date() }] }
      : w
    )
  };
  return saveToStorage(newState);
}),
deleteCharacterFromWorld: (worldId, charId) => set((state) => {
  const newState = {
    ...state,
    worlds: state.worlds.map(w => w.id === worldId
      ? { ...w, characters: w.characters.filter(c => c.id !== charId) }
      : w
    )
  };
  return saveToStorage(newState);
}),

characters: initialState?.characters || [],
    addCharacter: (char) => set((state) => {
      const newState = {
        ...state,
        characters: [...state.characters, { ...char, id: Date.now(), createdAt: new Date() }]
      };
      return saveToStorage(newState);
    }),
    updateCharacter: (id, updates) => set((state) => {
      const newState = {
        ...state,
        characters: state.characters.map(c => c.id === id ? { ...c, ...updates } : c)
      };
      return saveToStorage(newState);
    }),
    deleteCharacter: (id) => set((state) => {
      const newState = {
        ...state,
        characters: state.characters.filter(c => c.id !== id)
      };
      return saveToStorage(newState);
    }),

    // Workflows
    workflows: initialState?.workflows || [],
    currentWorkflow: initialState?.currentWorkflow || null,
    setCurrentWorkflow: (workflow) => set((state) => {
      const newState = { ...state, currentWorkflow: workflow };
      return saveToStorage(newState);
    }),
    addWorkflow: (workflow) => set((state) => {
      const newState = {
        ...state,
        workflows: [...state.workflows, { ...workflow, id: Date.now(), createdAt: new Date() }]
      };
      return saveToStorage(newState);
    }),
    deleteWorkflow: (id) => set((state) => {
      const newState = {
        ...state,
        workflows: state.workflows.filter(w => w.id !== id)
      };
      return saveToStorage(newState);
    }),
  };
});
