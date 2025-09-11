import supabase from "./supabase";

// Auth API functions
export const getAuthUser = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    // Check kung may session at user
    if (!session?.user) {
      return null;
    }

    const profile = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: profile?.data?.full_name || null,
        ...session.user.user_metadata,
      },
    };
  } catch (error) {
    console.error("Error in getAuthUser:", error);
    return null;
  }
};

export const signUp = async ({ email, password, fullName }) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return { success: true };
};

export const updateUserMetadata = async ({ fullName }) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

// Online Users / Presence API functions
export const subscribeToOnlineUsers = (userId, callback) => {
  const channel = supabase.channel("online-users", {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  // Track presence events
  channel.on("presence", { event: "sync" }, () => {
    const presenceState = channel.presenceState();
    const users = [];

    for (const userIdKey in presenceState) {
      // Skip current user to avoid double display
      if (userIdKey === userId) continue;

      const userPresences = presenceState[userIdKey];
      if (userPresences.length > 0) {
        const userInfo = userPresences[0];
        users.push({
          id: userIdKey,
          ...userInfo,
          lastSeen: new Date().toISOString(),
        });
      }
    }

    callback({ users, isConnected: true });
  });

  channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
    if (key !== userId && newPresences[0]) {
      // Handle new user joining
      callback({ type: "join", user: { id: key, ...newPresences[0] } });
    }
  });

  channel.on("presence", { event: "leave" }, ({ key }) => {
    if (key !== userId) {
      // Handle user leaving
      callback({ type: "leave", userId: key });
    }
  });

  return channel;
};

export const trackUserPresence = async (channel, user) => {
  await channel.track({
    user_id: user.id,
    email: user.email,
    fullName: user.fullName || user.profileName || user.email,
    profilePicture: user.profilePicture || "",
    online: true,
    joinedAt: new Date().toISOString(),
  });
};

export const subscribeToChannel = async (channel) => {
  return new Promise((resolve) => {
    channel.subscribe(async (status) => {
      resolve(status === "SUBSCRIBED");
    });
  });
};
