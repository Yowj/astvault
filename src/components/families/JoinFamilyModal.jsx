import { useState } from "react";
import { X, KeyRound, LoaderIcon } from "lucide-react";
import { useJoinFamily } from "../../hooks/useFamilies";

const JoinFamilyModal = ({ onClose }) => {
  const [code, setCode] = useState("");
  const { joinFamilyMutate, joinFamilyIsPending } = useJoinFamily();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    joinFamilyMutate(code.trim(), {
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
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content">Join Family</h2>
              <p className="text-xs text-base-content/50">Enter the invite code you received</p>
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
              <span className="label-text font-semibold">Invite Code</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:input-secondary font-mono tracking-widest text-center uppercase"
              placeholder="A3K7P2"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={8}
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={joinFamilyIsPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-secondary gap-2"
              disabled={joinFamilyIsPending || !code.trim()}
            >
              {joinFamilyIsPending ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Joining...
                </>
              ) : (
                "Join Family"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinFamilyModal;
