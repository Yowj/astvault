import supabase from "./supabase.js";

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const supabaseFamiliesAPI = {
  getUserFamilies: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("family_members")
      .select("role, joined_at, families(id, name, invite_code, created_by, created_at)")
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);

    return (data || []).map((row) => ({
      ...row.families,
      role: row.role,
      joined_at: row.joined_at,
    }));
  },

  getFamilyMembers: async (familyId) => {
    const { data: members, error } = await supabase
      .from("family_members")
      .select("user_id, role, joined_at")
      .eq("family_id", familyId);

    if (error) throw new Error(error.message);
    if (!members || members.length === 0) return [];

    const userIds = members.map((m) => m.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, profile_picture")
      .in("id", userIds);

    const profileMap = {};
    (profiles || []).forEach((p) => {
      profileMap[p.id] = p;
    });

    return members.map((m) => ({
      user_id: m.user_id,
      role: m.role,
      joined_at: m.joined_at,
      full_name: profileMap[m.user_id]?.full_name || "Unknown",
      profile_picture: profileMap[m.user_id]?.profile_picture || null,
    }));
  },

  createFamily: async (name) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    let family = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const inviteCode = generateInviteCode();

      const { data, error } = await supabase
        .from("families")
        .insert([{ name, invite_code: inviteCode, created_by: user.id }])
        .select()
        .single();

      if (!error) {
        family = data;
        break;
      }

      if (error.code !== "23505") throw new Error(error.message);
    }

    if (!family) throw new Error("Failed to generate a unique invite code. Try again.");

    const { error: memberError } = await supabase
      .from("family_members")
      .insert([{ family_id: family.id, user_id: user.id, role: "admin" }]);

    if (memberError) throw new Error(memberError.message);

    return family;
  },

  joinFamilyByCode: async (inviteCode) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: family, error: findError } = await supabase
      .from("families")
      .select("id, name")
      .eq("invite_code", inviteCode.trim().toUpperCase())
      .maybeSingle();

    if (findError) throw new Error(findError.message);
    if (!family) throw new Error("Invalid invite code. Family not found.");

    const { data: existing } = await supabase
      .from("family_members")
      .select("user_id")
      .eq("family_id", family.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) throw new Error("You are already a member of this family.");

    const { error } = await supabase
      .from("family_members")
      .insert([{ family_id: family.id, user_id: user.id, role: "member" }]);

    if (error) throw new Error(error.message);

    return family;
  },

  leaveFamily: async (familyId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("family_id", familyId)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return { message: "Left family successfully" };
  },

  deleteFamily: async (familyId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("families")
      .delete()
      .eq("id", familyId)
      .eq("created_by", user.id);

    if (error) throw new Error(error.message);
    return { message: "Family deleted successfully" };
  },

  removeMember: async (familyId, userId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: adminCheck } = await supabase
      .from("families")
      .select("id")
      .eq("id", familyId)
      .eq("created_by", user.id)
      .maybeSingle();

    if (!adminCheck) throw new Error("Only admins can remove members.");

    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("family_id", familyId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { message: "Member removed" };
  },

  regenerateInviteCode: async (familyId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    for (let attempt = 0; attempt < 5; attempt++) {
      const newCode = generateInviteCode();

      const { data, error } = await supabase
        .from("families")
        .update({ invite_code: newCode })
        .eq("id", familyId)
        .eq("created_by", user.id)
        .select()
        .maybeSingle();

      if (!error && data) return data;
      if (error && error.code !== "23505") throw new Error(error.message);
    }

    throw new Error("Failed to regenerate invite code. Try again.");
  },
};
