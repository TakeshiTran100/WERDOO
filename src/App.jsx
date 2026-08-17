import React from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from './store';
import Sidebar from './components/Sidebar';
import Home from './components/pages/Home';
import Library from './components/pages/Library';
import LibraryFull from './components/pages/LibraryFull';
import Write from './components/pages/Write';
import Moodboard from './components/pages/Moodboard';
import Notes from './components/pages/Notes';
import Characters from './components/pages/Characters';
import Settings from './components/pages/Settings';
import Workflow from './components/pages/Workflow';
import './App.css';

function App() {
  const { currentTab, isDarkMode, setStories, setCurrentStory, stories, isWriteFullscreen } = useStoryStore();

  React.useEffect(() => {
    // Không tự động load mock data nữa
    // Data được load từ localStorage qua store
  }, []);

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return <Home />;
      case 'library':
        return <Library />;
      case 'libraryFull':
        return <LibraryFull />;
      case 'write':
        return <Write />;
      case 'moodboard':
        return <Moodboard />;
      case 'notes':
        return <Notes />;
      case 'characters':
        return <Characters />;
      case 'workflow':
        return <Workflow />;
      case 'moodboard':
        return <Moodboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  const { currentTheme } = useStoryStore();

  return (
    <div className={`${isDarkMode ? 'dark' : ''} theme-${currentTheme}`}>
      <div className="flex h-screen bg-gray-900 dark:bg-gray-950 text-gray-900 dark:text-gray-50 overflow-hidden">
        {!isWriteFullscreen && <Sidebar />}
        <main className={`${isWriteFullscreen ? 'w-full' : 'flex-1'} overflow-auto`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;