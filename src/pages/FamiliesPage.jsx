import { useState } from "react";
import { Users, Plus, KeyRound, Settings, Crown, User } from "lucide-react";
import { useUserFamilies } from "../hooks/useFamilies";
import CreateFamilyModal from "../components/families/CreateFamilyModal";
import JoinFamilyModal from "../components/families/JoinFamilyModal";
import FamilyManageModal from "../components/families/FamilyManageModal";

const FamiliesPage = () => {
  const { families, familiesIsPending } = useUserFamilies();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [managingFamily, setManagingFamily] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            My Families
          </h1>
          <p className="text-sm text-base-content/50 mt-1">
            Share templates privately with your group or family
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-sm gap-2"
            onClick={() => setShowJoin(true)}
          >
            <KeyRound className="w-4 h-4" />
            Join
          </button>
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Family Cards */}
      {familiesIsPending ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      ) : families.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 bg-base-200 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-base-content/30" />
          </div>
          <div>
            <p className="font-semibold text-base-content/70">No families yet</p>
            <p className="text-sm text-base-content/40 mt-1">
              Create a family or join one with an invite code
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              className="btn btn-outline btn-sm gap-2"
              onClick={() => setShowJoin(true)}
            >
              <KeyRound className="w-4 h-4" />
              Join with code
            </button>
            <button
              className="btn btn-primary btn-sm gap-2"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-4 h-4" />
              Create family
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {families.map((family) => (
            <FamilyCard
              key={family.id}
              family={family}
              onManage={() => setManagingFamily(family)}
            />
          ))}
        </div>
      )}

      {showCreate && <CreateFamilyModal onClose={() => setShowCreate(false)} />}
      {showJoin && <JoinFamilyModal onClose={() => setShowJoin(false)} />}
      {managingFamily && (
        <FamilyManageModal
          family={managingFamily}
          onClose={() => setManagingFamily(null)}
        />
      )}
    </div>
  );
};

const FamilyCard = ({ family, onManage }) => {
  const isAdmin = family.role === "admin";

  return (
    <div className="bg-base-100 border border-base-300 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base-content truncate">{family.name}</h3>
            <div className="flex items-center gap-1 text-xs text-base-content/50 mt-0.5">
              {isAdmin ? (
                <>
                  <Crown className="w-3 h-3 text-warning" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>Member</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-xs bg-base-200 px-2.5 py-1 rounded-md text-base-content/60 tracking-wider">
          {family.invite_code}
        </div>
        <button
          className="btn btn-ghost btn-sm gap-1.5"
          onClick={onManage}
        >
          <Settings className="w-3.5 h-3.5" />
          Manage
        </button>
      </div>
    </div>
  );
};

export default FamiliesPage;
