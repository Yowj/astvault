import { useState } from "react";
import { X, Users, LoaderIcon } from "lucide-react";
import { useCreateFamily } from "../../hooks/useFamilies";

const CreateFamilyModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const { createFamilyMutate, createFamilyIsPending } = useCreateFamily();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createFamilyMutate(name.trim(), {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content">Create Family</h2>
              <p className="text-xs text-base-content/50">An invite code will be generated</p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-base-content/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Family Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:input-primary"
              placeholder="e.g. Smith Family, Team Alpha..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={createFamilyIsPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={createFamilyIsPending || !name.trim()}
            >
              {createFamilyIsPending ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Creating...
                </>
              ) : (
                "Create Family"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFamilyModal;
