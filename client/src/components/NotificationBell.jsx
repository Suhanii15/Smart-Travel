import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notification", {
        headers: { token }
      });
      if (res.data?.success) setNotifications(res.data.notifications);
    };
    fetch();
    
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    await axios.patch("http://localhost:5000/api/notification/read-all", {}, {
      headers: { token }
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition">
        <Bell size={22} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <span className="text-xs text-blue-600 cursor-pointer" onClick={markAllRead}>
              Mark all read
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => { navigate(`/itinerary/${n.tripId}`); setOpen(false); }}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-slate-50 transition ${!n.read ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-sm text-gray-700">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;