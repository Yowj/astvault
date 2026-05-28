import supabase from "./supabase.js";

export const supabasePinsAPI = {
  getAll: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("pinned_templates")
      .select("template_id")
      .eq("user_id", user.id)
      .order("pinned_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map((row) => row.template_id);
  },

  pin: async (templateId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("pinned_templates")
      .upsert(
        { user_id: user.id, template_id: templateId },
        { onConflict: "user_id,template_id", ignoreDuplicates: true }
      );

    if (error) throw new Error(error.message);
  },

  unpin: async (templateId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("pinned_templates")
      .delete()
      .eq("user_id", user.id)
      .eq("template_id", templateId);

    if (error) throw new Error(error.message);
  },
};
