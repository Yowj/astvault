import { useState } from "react";
import { Camera, Mail, User, Edit2 } from "lucide-react";
import { supabase, updateUserMetadata } from "../../services";
import toast from "react-hot-toast";
import useAuthUser from "../../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState("");

  const updateProfile = async (updates) => {
    if (!authUser) {
      toast.error("No user logged in");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: authUser.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Profile updated successfully");
      return data;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Profile update failed");
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profile_picture: base64Image });
    };
  };

  const handleNameUpdate = async () => {
    if (!newFullName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateUserMetadata({ fullName: newFullName });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Name updated successfully");
      setIsEditingName(false);
      setNewFullName("");
    } catch (error) {
      console.error("Name update error:", error);
      toast.error(error.message || "Failed to update name");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePicture || "/kratos.png"}
                alt="Profile"
                className="size-32  object-cover border-primary/80 border-5 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105 hover:bg-secondary
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
                {!isEditingName && (authUser?.fullName === "No Name Set" || !authUser?.fullName) && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="ml-auto text-primary hover:text-primary-focus"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input flex-1"
                    autoFocus
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={isUpdatingProfile}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewFullName("");
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1">
                    {authUser?.fullName || "No Name Set"}
                  </p>
                  {authUser?.fullName && authUser?.fullName !== "No Name Set" && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-primary hover:text-primary-focus p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;