import { useState } from "react";
import {
  X,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  LogOut,
  UserX,
  LoaderIcon,
  Crown,
  User,
} from "lucide-react";
import { useFamilyMembers, useDeleteFamily, useLeaveFamily, useRemoveMember, useRegenerateInviteCode } from "../../hooks/useFamilies";
import useAuthUser from "../../hooks/useAuthUser";

const FamilyManageModal = ({ family, onClose }) => {
  const { authUser } = useAuthUser();
  const { members, membersIsPending } = useFamilyMembers(family.id);
  const { deleteFamilyMutate, deleteFamilyIsPending } = useDeleteFamily();
  const { leaveFamilyMutate, leaveFamilyIsPending } = useLeaveFamily();
  const { removeMemberMutate, removeMemberIsPending } = useRemoveMember();
  const { regenerateCodeMutate, regenerateCodeIsPending } = useRegenerateInviteCode();

  const [codeCopied, setCodeCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const isAdmin = family.role === "admin";
  const currentCode = family.invite_code;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDelete = () => {
    deleteFamilyMutate(family.id, { onSuccess: onClose });
  };

  const handleLeave = () => {
    leaveFamilyMutate(family.id, { onSuccess: onClose });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-base-content">{family.name}</h2>
            <p className="text-xs text-base-content/50 flex items-center gap-1 mt-0.5">
              {isAdmin ? (
                <><Crown className="w-3 h-3 text-warning" /> Admin</>
              ) : (
                <><User className="w-3 h-3" /> Member</>
              )}
            </p>
          </div>
          <button
            className="p-2 hover:bg-base-200 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-base-content/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Invite Code */}
          <div>
            <p className="text-sm font-semibold text-base-content mb-2">Invite Code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-base-200 rounded-lg px-4 py-2.5 font-mono text-lg tracking-widest text-center font-bold text-primary">
                {currentCode}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={copyCode}
                title="Copy code"
              >
                {codeCopied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              {isAdmin && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => regenerateCodeMutate(family.id)}
                  disabled={regenerateCodeIsPending}
                  title="Generate new code"
                >
                  {regenerateCodeIsPending ? (
                    <LoaderIcon className="animate-spin w-4 h-4" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-base-content/40 mt-1.5">
              Share this code with people you want to invite
            </p>
          </div>

          {/* Members */}
          <div>
            <p className="text-sm font-semibold text-base-content mb-2">
              Members ({members.length})
            </p>

            {membersIsPending ? (
              <div className="flex justify-center py-4">
                <LoaderIcon className="animate-spin w-5 h-5 text-base-content/40" />
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-3 p-2.5 bg-base-200/60 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-base-300 overflow-hidden shrink-0 flex items-center justify-center">
                      {member.profile_picture ? (
                        <img
                          src={member.profile_picture}
                          alt={member.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-base-content/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.full_name}
                        {member.user_id === authUser?.id && (
                          <span className="text-xs text-base-content/40 ml-1">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-base-content/40 capitalize">{member.role}</p>
                    </div>
                    {isAdmin && member.user_id !== authUser?.id && (
                      <button
                        className="btn btn-ghost btn-xs text-error hover:btn-error shrink-0"
                        onClick={() =>
                          removeMemberMutate({ familyId: family.id, userId: member.user_id })
                        }
                        disabled={removeMemberIsPending}
                        title="Remove member"
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-base-300 shrink-0 space-y-2">
          {isAdmin ? (
            confirmDelete ? (
              <div className="flex gap-2">
                <button
                  className="btn btn-outline flex-1 btn-sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error flex-1 btn-sm"
                  onClick={handleDelete}
                  disabled={deleteFamilyIsPending}
                >
                  {deleteFamilyIsPending ? (
                    <LoaderIcon className="animate-spin w-4 h-4" />
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            ) : (
              <button
                className="btn btn-error btn-outline w-full btn-sm gap-2"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Family
              </button>
            )
          ) : confirmLeave ? (
            <div className="flex gap-2">
              <button
                className="btn btn-outline flex-1 btn-sm"
                onClick={() => setConfirmLeave(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning flex-1 btn-sm"
                onClick={handleLeave}
                disabled={leaveFamilyIsPending}
              >
                {leaveFamilyIsPending ? (
                  <LoaderIcon className="animate-spin w-4 h-4" />
                ) : (
                  "Confirm Leave"
                )}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-warning btn-outline w-full btn-sm gap-2"
              onClick={() => setConfirmLeave(true)}
            >
              <LogOut className="w-4 h-4" />
              Leave Family
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyManageModal;
