import React from 'react';
import { useAgentConfig } from '../../context/useAgentContext';
import { predefinedTemplates, Template } from '../../lib/AgentTemplates';

interface TemplateSelectorProps {
  onTemplatesChange: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplatesChange
}) => {
  const { updateConfig } = useAgentConfig();

  const applyTemplate = (template: Template) => {
    updateConfig({
      type: 'APPLY_TEMPLATE',
      payload: template.config
    });
  };

  // FIXME get from one source
  const categories = ['analytics', 'trading', 'social', 'research', 'official'] as const;

  return (
    <div className="space-y-6">
      
      {categories.map(category => {
        const templates = predefinedTemplates.filter(t => t.category === category);
        if (templates.length === 0) return null;
        
        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm text-blue-400 capitalize">{category}</h3>
            <div className="grid gap-3">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 hover:border-purple-500/50 cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-purple-300">{template.name}</h4>
                    <button 
                      className="px-2 py-1 text-xs bg-purple-500/20 rounded hover:bg-purple-500/30 text-purple-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        /*
                        if (confirm('Are you sure you want to apply this template? This will override your current configuration.')) {
                          applyTemplate(template);
                        }
                          */
                        applyTemplate(template);
                        onTemplatesChange();
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">{template.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.config.data?.enabledViews?.map(view => (
                      <span key={view} className="px-2 py-1 text-xs bg-blue-500/20 rounded-full text-blue-300">
                        {view}
                      </span>
                    ))}
                    {template.config.tools?.enabledTools?.map(tool => (
                      <span key={tool} className="px-2 py-1 text-xs bg-green-500/20 rounded-full text-green-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="border-t border-gray-800 pt-4 mt-6">
        <button
          onClick={() => updateConfig({ type: 'RESET_CONFIG' })}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-sm"
        >
          Reset Configuration
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;