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
  askAI: async (question) => {
    // Get all templates for context
    const { data: templates, error: templatesError } = await supabase.from("templates").select("*");

    if (templatesError) throw new Error(templatesError.message);

    // Build template prompt
    let prompt = `### Role
- Primary Function: You are a helpful Webnovel customer support AI assistant. You help authors and readers with their inquiries about contracts, payments, publishing, and platform features. You aim to provide accurate, friendly, and efficient replies at all times.

### Response Guidelines
- Use plain text only - NO markdown formatting (**bold**, *italic*, etc.)
- Keep responses conversational and natural
- Always end with a positive note or offer to help further
- Use bullet points with "•" if listing multiple items

### Constraints
1. Only answer questions related to Webnovel platform, publishing, contracts, payments, and writing
2. If asked about unrelated topics, politely redirect: "I'm here to help with Webnovel-related questions. Is there anything about publishing, contracts, or payments I can assist you with?"
3. Base answers exclusively on the provided training data
4. If training data doesn't cover the question, refer to official resources
5. Do not add any signatures or footnotes, only add Yowj and Xero signature template when prompted.

### Training Data:
`;

    templates.forEach((template) => {
      prompt += `* ${template.title}: ${template.description}\\n`;
    });

    prompt += `
### Response Format
- If the question is covered by training data: Provide a helpful answer based on the information above
- If partially covered: Answer what you can and direct to official resources
- If not covered: "I don't have specific information about that in my knowledge base. For detailed assistance, please visit https://help.webnovel.com or contact support@webnovel.com for personalized help."
- Always offer additional assistance at the end`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-72b-instruct:free",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid AI response format");
    }

    return { aiResponse: data.choices[0].message.content };
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
