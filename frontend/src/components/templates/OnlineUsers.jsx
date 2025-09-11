import { useState } from 'react';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import { Users, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import useAuthUser from '../../hooks/useAuthUser';

const OnlineUsers = () => {
  const { onlineUsers, onlineCount, currentUserStatus, isConnected } = useOnlineUsers();
  const {authUser} = useAuthUser();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!authUser) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-gray-400';
      default: return 'text-yellow-500';
    }
  };

  const getConnectionStatusColor = () => {
    return isConnected ? 'text-green-500' : 'text-red-500';
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const UserAvatar = ({ user: userInfo, isCurrentUser = false }) => (
    <div className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg transition-colors">
      <div className="relative">
        {userInfo.profilePicture ? (
          <img 
            src={userInfo.profilePicture} 
            alt={userInfo.fullName || userInfo.email}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-semibold">
            {(userInfo.fullName || userInfo.email || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <Circle 
          className={`absolute -bottom-1 -right-1 w-3 h-3 fill-current ${getStatusColor('online')}`}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {userInfo.fullName || userInfo.email}
            {isCurrentUser && <span className="text-xs text-base-content/60 ml-1">(You)</span>}
          </span>
        </div>
        <div className="text-xs text-base-content/60">
          {isCurrentUser ? 'Online' : formatLastSeen(userInfo.lastSeen)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Online Users Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-ghost btn-sm flex items-center gap-2 hover:bg-base-200"
        title={`${onlineCount} user${onlineCount !== 1 ? 's' : ''} online`}
      >
        <div className="relative">
          <Users className="w-4 h-4" />
          <Circle 
            className={`absolute -top-1 -right-1 w-2 h-2 fill-current ${getConnectionStatusColor()}`}
          />
        </div>
        <span className="text-sm font-medium">{onlineCount}</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Online Users</h3>
              <div className="flex items-center gap-2">
                <Circle className={`w-2 h-2 fill-current ${getConnectionStatusColor()}`} />
                <span className="text-xs text-base-content/60">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
            </div>

            {/* Current User */}
            {authUser && (
              <div className="mb-3">
                <div className="text-xs text-base-content/60 mb-2 px-2">You</div>
                <UserAvatar user={authUser} isCurrentUser={true} />
              </div>
            )}

            {/* Other Online Users */}
            {onlineUsers.length > 0 && (
              <div>
                <div className="text-xs text-base-content/60 mb-2 px-2">
                  Others ({onlineUsers.length})
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {onlineUsers.map((onlineUser) => (
                    <UserAvatar 
                      key={onlineUser.id} 
                      user={onlineUser}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No other users online */}
            {onlineUsers.length === 0 && (
              <div className="text-center py-4 text-sm text-base-content/60">
                No other users online
              </div>
            )}

            {/* Connection Status */}
            <div className="mt-4 pt-3 border-t border-base-300">
              <div className="flex items-center justify-between text-xs text-base-content/60">
                <span>Your status:</span>
                <div className="flex items-center gap-2">
                  <Circle className={`w-2 h-2 fill-current ${getStatusColor(currentUserStatus)}`} />
                  <span className="capitalize">{currentUserStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default OnlineUsers;