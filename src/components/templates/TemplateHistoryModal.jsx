import { useState } from "react";
import { History, X, RotateCcw, LoaderIcon, ChevronDown } from "lucide-react";
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import { useTemplateHistory, useUpdateTemplate } from "../../hooks/useTemplates";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TemplateHistoryModal = ({
  templateId,
  currentTitle,
  onClose,
  canRestore,
}) => {
  const { history, historyIsPending } = useTemplateHistory(templateId);
  const { updateTemplateMutate, updateTemplateIsPending } = useUpdateTemplate();
  const [expandedId, setExpandedId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const handleRestore = (entry) => {
    updateTemplateMutate(
      {
        id: templateId,
        title: entry.title,
        description: entry.description,
        category: entry.category,
        imageUrl: entry.image_url,
        fileUrl: entry.file_url,
      },
      { onSuccess: onClose }
    );
    setConfirmingId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-lg flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-warning/10 rounded-xl flex items-center justify-center">
              <History className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content">Change History</h2>
              <p className="text-xs text-base-content/50 truncate max-w-[220px]">
                Previous versions of &quot;{currentTitle}&quot;
              </p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-base-content/60" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {historyIsPending ? (
            <div className="flex justify-center py-10">
              <LoaderIcon className="animate-spin w-5 h-5 text-base-content/40" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <History className="w-8 h-8 text-base-content/20" />
              <p className="text-sm text-base-content/40">No change history yet</p>
              <p className="text-xs text-base-content/30">
                A snapshot is saved each time the template is edited
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span className="text-xs font-medium text-primary">Current version</span>
              </div>

              {history.map((entry, index) => {
                const versionNum = history.length - index;
                const isExpanded = expandedId === entry.id;
                const isConfirming = confirmingId === entry.id;

                return (
                  <div key={entry.id} className="border border-base-300 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-base-200/50 transition-colors text-left"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center shrink-0">
                        <span className="text-xs font-mono text-base-content/60">v{versionNum}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">{entry.title}</p>
                        <p className="text-xs text-base-content/50">
                          {formatDate(entry.changed_at)} &middot; {entry.changed_by_name}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-base-content/40 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 border-t border-base-200 space-y-2">
                            <div className="bg-base-200/50 rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="badge badge-ghost badge-xs">{entry.category}</span>
                                {entry.image_url && (
                                  <span className="badge badge-ghost badge-xs text-primary/70">Image</span>
                                )}
                                {entry.file_url && (
                                  <span className="badge badge-ghost badge-xs text-secondary/70">File</span>
                                )}
                              </div>
                              <p className="text-xs text-base-content/70 leading-relaxed line-clamp-5 whitespace-pre-wrap">
                                {entry.description}
                              </p>
                            </div>

                            {canRestore && (
                              <div className="flex justify-end">
                                {isConfirming ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-base-content/60">
                                      Restore this version?
                                    </span>
                                    <button
                                      className="btn btn-ghost btn-xs"
                                      onClick={() => setConfirmingId(null)}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-warning btn-xs gap-1"
                                      onClick={() => handleRestore(entry)}
                                      disabled={updateTemplateIsPending}
                                    >
                                      {updateTemplateIsPending ? (
                                        <LoaderIcon className="animate-spin w-3 h-3" />
                                      ) : (
                                        <RotateCcw className="w-3 h-3" />
                                      )}
                                      Confirm
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="btn btn-ghost btn-xs gap-1 text-warning hover:btn-warning"
                                    onClick={() => setConfirmingId(entry.id)}
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    Restore
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateHistoryModal;
