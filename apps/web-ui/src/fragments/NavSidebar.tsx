"use client";
import React from 'react';

export interface NavSection {
  id: string;
  icon: any; //typeof Database | typeof Brain | typeof Wrench | typeof Info;
  label: string;
  component?: any //React.ComponentType
}

interface NavSidebarProps {
  sections: NavSection[];
  selectedSection: string | null;
  enabledSections: Record<string, boolean>;
  onSectionSelect: (sectionId: string) => void;
  onToggleSection: (sectionId: string) => void;
}

export const NavSidebar: React.FC<NavSidebarProps> = ({
  sections,
  selectedSection,
  enabledSections,
  onSectionSelect,
  onToggleSection,
}) => {
  return (
    <div className="w-16 bg-[#12131A] border-r border-gray-800">
      {sections.map(section => (
        <div key={section.id} className="relative group">
          <button
            onClick={() => onSectionSelect(section.id)}
            className={`w-full p-4 flex flex-col items-center gap-1 text-xs
              ${selectedSection === section.id ? 'bg-gray-800/50' : ''}
              ${enabledSections[section.id] 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-gray-600 hover:text-gray-500'}
              ${selectedSection !== section.id ? 'opacity-60' : ''}
              `
            }
            disabled={!enabledSections[section.id]}
          >
            <section.icon size={20} />
            {section.label}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSection(section.id);
            }}
            className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className={`w-2 h-2 rounded-full ${
              enabledSections[section.id] ? 'bg-green-400' : 'bg-gray-600'
            }`} />
          </button>
        </div>
      ))}
    </div>
  );
};
