import { useState, useEffect } from 'react';
import { subscribeToOnlineUsers, trackUserPresence, subscribeToChannel } from '../services';
import useAuthUser from './useAuthUser';

export const useOnlineUsers = () => {
  const { authUser } = useAuthUser();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!authUser) {
      // Clean up when user logs out
      if (channel) {
        channel.unsubscribe();
        setChannel(null);
      }
      setOnlineUsers([]);
      setIsConnected(false);
      return;
    }

    // Create presence channel
    const presenceChannel = subscribeToOnlineUsers(authUser.id, (data) => {
      if (data.type === 'join') {
        setOnlineUsers(prev => {
          const exists = prev.find(user => user.id === data.user.id);
          if (exists) return prev;
          return [...prev, { ...data.user, lastSeen: new Date().toISOString() }];
        });
      } else if (data.type === 'leave') {
        setOnlineUsers(prev => prev.filter(user => user.id !== data.userId));
      } else if (data.users) {
        setOnlineUsers(data.users);
        setIsConnected(data.isConnected);
      }
    });

    setChannel(presenceChannel);

    // Subscribe to channel and track presence
    subscribeToChannel(presenceChannel).then((connected) => {
      setIsConnected(connected);
      if (connected) {
        trackUserPresence(presenceChannel, authUser);
      }
    });

    // Set up heartbeat for presence
    const heartbeat = setInterval(() => {
      if (isConnected && presenceChannel) {
        trackUserPresence(presenceChannel, authUser);
      }
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(heartbeat);
      if (presenceChannel) {
        presenceChannel.unsubscribe();
      }
    };
  }, [authUser, isConnected]);

  const getOnlineCount = () => {
    return onlineUsers.length + (authUser ? 1 : 0); // Include current user
  };

  const getCurrentUserStatus = () => {
    return isConnected ? 'online' : 'offline';
  };

  return {
    onlineUsers,
    isConnected,
    onlineCount: getOnlineCount(),
    currentUserStatus: getCurrentUserStatus()
  };
};