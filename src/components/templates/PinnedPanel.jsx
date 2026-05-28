import { Pin, Copy, PinOff } from "lucide-react";
import toast from "react-hot-toast";

const PinnedPanel = ({ pinnedTemplates, onUnpin }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-80 xl:w-96 p-3 lg:p-4 space-y-3 lg:space-y-4 h-full border-l border-base-300">
      <div className="flex items-center gap-2">
        <Pin className="w-4 h-4 text-primary shrink-0" />
        <h2 className="font-semibold text-sm lg:text-base text-base-content">Pinned</h2>
        {pinnedTemplates.length > 0 && (
          <span className="badge badge-primary badge-sm ml-auto">{pinnedTemplates.length}</span>
        )}
      </div>

      {pinnedTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-base-content/40 gap-2 py-8">
          <Pin className="w-8 h-8 opacity-30" />
          <p className="text-xs leading-relaxed">Pin templates for quick access</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {pinnedTemplates.map((template) => (
            <div
              key={template.id}
              className="flex items-start gap-2 p-3 rounded-lg bg-base-200 hover:bg-base-300 transition-colors group"
            >
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => copyToClipboard(template.description)}
              >
                <p
                  className="text-sm font-medium text-base-content truncate hover:text-primary transition-colors"
                  title={template.title}
                >
                  {template.title}
                </p>
                <p className="text-xs text-base-content/60 line-clamp-2 mt-0.5 leading-relaxed">
                  {template.description}
                </p>
              </div>
              <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyToClipboard(template.description)}
                  className="btn btn-ghost btn-xs p-1"
                  title="Copy content"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onUnpin(template.id)}
                  className="btn btn-ghost btn-xs p-1 hover:text-error"
                  title="Unpin"
                >
                  <PinOff className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default PinnedPanel;
