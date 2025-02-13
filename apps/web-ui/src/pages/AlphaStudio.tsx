import { useEffect, useState } from 'react'
import { NavSection, NavSidebar } from '../fragments/NavSidebar';
import { ConfigPanel } from '../fragments/ConfigPanel';
import { Bot, Brain, Database, Rocket, Zap } from 'lucide-react';
import { MainContent } from '../fragments/MainContent';
import { Header } from '../fragments/Header';
import { AgentConfig } from '../lib/AgentConfig';
import { AgentProvider } from '../context/useAgentContext';
import { AgentBasicConfig } from '../fragments/config/AgentBasicConfig';
import LLMConfig from '../fragments/config/LlmConfig';
import { DatasourceConfig } from '../fragments/config/DatasourceConfig';
import ActionsConfig from '../fragments/config/actions/ActionConfig';
import { useParams } from 'react-router'
import { useApi } from '../hooks/useApi';
import { predefinedTemplates } from '../lib/AgentTemplates';
import { TriggersConfig } from '../fragments/config/triggers/TriggersConfig';

function AlphaStudioContent() {

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
    triggers: true,
    actions: true
  });

  // Available sections configuration
  const sections: NavSection[] = [
    { id: 'info', icon: Bot, label: 'Info', component: AgentBasicConfig },
    { id: 'data', icon: Database, label: 'Data', component: DatasourceConfig },
    { id: 'llm', icon: Brain, label: 'LLM', component: LLMConfig },
    { id: 'triggers', icon: Zap, label: 'Triggers', component: TriggersConfig },
    { id: 'actions', icon: Rocket, label: 'Actions', component: ActionsConfig },
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

// Wrap the content with the provider
export const AlphaStudio = () => {

  const { uuid } = useParams();
  const { getUserAgentConfig } = useApi();
  const [loadAgentError, setLoadAgentError] = useState('')
  const [agent, setAgent] = useState<Partial<AgentConfig | undefined>>(undefined)

  useEffect(() => {

    if (!uuid) {
      const agent = predefinedTemplates[1].config
      setAgent(agent)
      return
    }

    getUserAgentConfig(uuid)
      .then(agent => setAgent(agent))
      .catch(_e => setLoadAgentError('Unhandled error'))
  
    return () => {
    }
  }, [uuid])

  if (loadAgentError) {
    return <div>Failed to load agent</div>
  }

  if (!agent) {
    return <div>Loading agent config {uuid}...</div>
  }
  console.log('start with config', agent)
  return (
    <AgentProvider initialConfig={agent}>
      <AlphaStudioContent />
    </AgentProvider>
  )
}
