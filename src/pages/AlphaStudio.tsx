import { useEffect, useState } from 'react'
import { NavSection, NavSidebar } from '../fragments/NavSidebar';
import { ConfigPanel } from '../fragments/ConfigPanel';
import { Bot } from 'lucide-react';
import { MainContent } from '../fragments/MainContent';
import { Header } from '../fragments/Header';

function AlphaStudio() {

  // missing injected
  const isActivated = true;

  // State management
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);
  const [enabledSections, setEnabledSections] = useState<any>({
    data: true,
    llm: true,
    tools: false,
    info: true,
    triggers: false,
    actions: true
  });


  // Available sections configuration
  const sections: NavSection[] = [
    { id: 'info', icon: Bot, label: 'Info' },
    //{ id: 'data', icon: Database, label: 'Data', component: DatasourceConfig },
    //{ id: 'llm', icon: Brain, label: 'LLM', component: LLMConfig },
    //{ id: 'triggers', icon: Zap, label: 'Triggers', component: TriggersConfig },
    //{ id: 'actions', icon: Rocket, label: 'Actions', component: ActionsConfig },
    //{ id: 'knowledge', icon: GraduationCap, label: 'Knowledge' },
    //{ id: 'code', icon: Code, label: 'Code' },
    //{ id: 'tools', icon: Wrench, label: 'Tools' },
  ];

  // Resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = Math.max(200, Math.min(1200, e.clientX - 64));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Effect for resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Section handlers
  const handleSectionSelect = (sectionId: string) => {
    if (enabledSections[sectionId]) {
      setSelectedSection(sectionId);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setEnabledSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };


  return (
    <div className="flex-1 bg-[#0D0D12] text-gray-200">

      <Header 
        isActivated={isActivated}
      />

      <div className="flex h-[calc(100vh-50px)]">
        <NavSidebar
          sections={sections}
          selectedSection={selectedSection}
          enabledSections={enabledSections}
          onSectionSelect={handleSectionSelect}
          onToggleSection={handleToggleSection}
        />

        {selectedSection && (
          <ConfigPanel
            width={sidebarWidth}
            title={`${sections.find(s => s.id === selectedSection)?.label} Configuration`}
            onClose={() => setSelectedSection(null)}
            onResize={handleMouseDown}
          >
            {/* Render the appropriate configuration component */}
            {(() => {
              const section = sections.find(s => s.id === selectedSection);
              if (section?.component) {
                const Component = section.component;
                return <Component isActivated={isActivated} />;
              }
              return null;
            })()}
          </ConfigPanel>
        )}

        <MainContent isResizing={isResizing} />

      </div>
    </div>
  )
}

export default AlphaStudio