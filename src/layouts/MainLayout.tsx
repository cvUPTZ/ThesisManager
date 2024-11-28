import React from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { Navbar } from '../components/Navbar';
import { ThesisEditor } from '../components/ThesisEditor';
import { CommandBar } from '../components/CommandBar';
import { Toolbar } from '../components/Toolbar';
import { ReferenceManager } from '../components/ReferenceManager';
import { Sidebar } from '../components/Sidebar';
import { Timeline } from '../components/Timeline';
import { Settings } from '../components/Settings';
import { Header } from './Header';

export function MainLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar - Fixed width on left side */}
        <div className="w-64 bg-gray-100 p-4 border-r">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-6 overflow-auto">
          {/* Page Header */}
          <Header />

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Top Action Bars */}
            <div className="space-y-4">
              <CommandBar />
              <Toolbar />
            </div>

            {/* Main Editing Area */}
            <ThesisEditor />

            {/* Supporting Components */}
            <div className="grid md:grid-cols-2 gap-6">
              <ReferenceManager />
              <Timeline />
            </div>

            {/* Settings */}
            <Settings />
          </div>
        </div>
      </div>
    </div>
  );
}