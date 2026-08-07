import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Plane, Notebook, LogOut, Compass, User, Mail, ChevronDown } from 'lucide-react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${isActive
    ? 'bg-blue-600 dark:bg-blue-500 text-white'
    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
  }`;

const Header = () => {
  const navigate = useNavigate();
  const { user, logoutUser, updateUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const openEdit = (field) => {
    setEditField(field);
    setEditValue(field === "name" ? (user?.name || "") : (user?.email || ""));
    setError("");
    setMessage("");
    setMenuOpen(false);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) { setError("This field cannot be empty"); return; }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const payload = editField === "name" ? { name: editValue.trim() } : { email: editValue.trim() };
      const res = await fetch("https://smart-travel-hvla.onrender.com/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        updateUser(data.user);
        setMessage(editField === "name"
          ? "Name updated successfully"
          : "Email updated. Use the new email to login next time.");
        setEditField(null);
      } else {
        setError(data.message || "Failed to update");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between w-full px-4 lg:px-6 py-3 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <NavLink to="/mytrips" className="flex items-center gap-2">
        <div className="p-2 h-10 bg-blue-500/10 dark:bg-blue-400/20 rounded-full">
          <Compass className="text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-600 dark:text-gray-300">
          Smart<span className="text-blue-500 dark:text-blue-400">Travel</span>
        </span>
      </NavLink>

      <div className="flex items-center gap-1 lg:gap-2">
        <NotificationBell />
        <NavLink to="/mytrips" className={navLinkClass}>
          <Plane size={16} className="hidden lg:block" />
          My Trips
        </NavLink>
        <NavLink to="/planner" className={navLinkClass}>
          <Notebook size={16} className="hidden lg:block" />
          Planner
        </NavLink>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 ml-2 px-2 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold dark:bg-blue-500">
              {user?.name?.[0] || "U"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.name || "User"}
            </span>
            <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-40 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => openEdit("name")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <User size={16} className="text-gray-400 dark:text-gray-500" />
                  Edit Name
                </button>
                <button
                  onClick={() => openEdit("email")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                  Edit Email
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {editField && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 w-[90vw] max-w-[380px] rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Edit {editField === "name" ? "Name" : "Email"}
            </h2>
            <input
              type={editField === "email" ? "email" : "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={editField === "name" ? "Full Name" : "Email"}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-2xl p-4 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition dark:bg-slate-700 dark:text-gray-200"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {message && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{message}</p>}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => { setEditField(null); setMessage(""); setError(""); }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-semibold text-sm hover:bg-blue-700 dark:hover:bg-blue-400 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header
