import { Model } from "../../lib/types";
import { ModelCard } from "./ModelCard";

interface ModelListProps {
  models: Model[];
  onDownload: (modelName: string) => void;
}

export const ModelList: React.FC<ModelListProps> = ({ models, onDownload }) => {
  return (
    <div className="space-y-3 max-w-4xl mx-auto p-6">
      {models.map((model) => (
        <ModelCard
          key={model.name}
          model={model}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};