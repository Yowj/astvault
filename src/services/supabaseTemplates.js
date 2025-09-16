import supabase from "./supabase.js";

export const supabaseTemplatesAPI = {
  // Get all templates
  getAll: async () => {
    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  // Get single template by ID
  getById: async (id) => {
    const { data, error } = await supabase.from("templates").select("*").eq("id", id).single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Create new template
  create: async (templateData) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get user profile for creator_name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase
      .from("templates")
      .insert([
        {
          creator_id: user.id,
          creator_name: profile?.full_name || "",
          title: templateData.title,
          description: templateData.description,
          category: templateData.category,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Template created successfully", template: data };
  },

  // Update existing template
  update: async ({ id, title, description, category }) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("templates")
      .update({ title, description, category })
      .eq("id", id)
      .eq("creator_id", user.id) // Ensure user can only update their own templates
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("Template not found or not authorized");

    return { message: "Template updated successfully", template: data };
  },

  // Delete template
  delete: async (id) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("templates")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id) // Ensure user can only delete their own templates
      .select();

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error("Template not found or not authorized");

    return { message: "Template deleted successfully" };
  },

  // Ask AI with templates context
  askAI: async (input) => {
    const { data, error } = await supabase.functions.invoke("super-action", {
      body: { input },
    });
    if (error) {
      throw new Error(`AI chatbot error: ${error.message}`);
    }
    return data;
  },

  // Grammar enhance
  grammarEnhance: async (input) => {
    const { data, error } = await supabase.functions.invoke("grammar-enhancer-edge", {
      body: { input },
    });
    if (error) {
      throw new Error(`Grammar enhancement failed: ${error.message}`);
    }
    return data;
  },
};
