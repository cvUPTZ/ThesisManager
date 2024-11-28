import React, { useState } from 'react';
import { useThesisStore } from '../store/thesisStore';
import { useAuth } from '../components/auth/AuthProvider';
import { 
  BookOpen, 
  FileText, 
  BookmarkPlus, 
  BarChart2, 
  Settings as SettingsIcon,
  Image,
  Clock,
  Tag,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { FiguresPanel } from './FiguresPanel';
import { KeywordsPanel } from './KeywordsPanel';
import { SettingsPanel } from './SettingsPanel';

export function Sidebar() {
  const { chapters, references } = useThesisStore();
  const { signOut } = useAuth();
  const [activePanel, setActivePanel] = useState<'figures' | 'keywords' | 'settings' | null>(null);

  const totalWords = chapters.reduce((acc, chapter) => 
    acc + chapter.sections.reduce((secAcc, section) => 
      secAcc + section.content.trim().split(/\s+/).length, 0
    ), 0
  );

  const stats = [
    { label: 'Chapters', value: chapters.length, icon: FileText },
    { label: 'References', value: references.length, icon: BookmarkPlus },
    { label: 'Total Words', value: totalWords, icon: BarChart2 },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col">
        <div className="p-6 flex-grow">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Thesis Navigator
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-semibold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'figures' ? null : 'figures')}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Figures
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'keywords' ? null : 'keywords')}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Keywords
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePanel(activePanel === 'settings' ? null : 'settings')}
                className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Settings
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Side Panels */}
      {activePanel === 'figures' && <FiguresPanel />}
      {activePanel === 'keywords' && <KeywordsPanel />}
      {activePanel === 'settings' && <SettingsPanel />}
    </>
  );
}