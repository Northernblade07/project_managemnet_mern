// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";

import {
  LayoutDashboardIcon,
  FolderIcon,
  CheckSquareIcon,
  UsersIcon,
  ShieldIcon,
  ShipWheelIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const isAdmin = authUser?.role === "admin";

  const navItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all
      ${
        currentPath === to
          ? "bg-primary/10 text-primary"
          : "hover:bg-base-300"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-base-200/80 backdrop-blur-xl border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">

      {/* LOGO */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2">
          <ShipWheelIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2">

        {navItem("/", <LayoutDashboardIcon size={18} />, "Dashboard")}

        {navItem("/projects", <FolderIcon size={18} />, "Projects")}

        {navItem("/tasks", <CheckSquareIcon size={18} />, "Tasks")}

        {/* ADMIN ONLY */}
        {isAdmin && navItem("/users", <UsersIcon size={18} />, "Users")}

        {isAdmin &&
          navItem("/admin", <ShieldIcon size={18} />, "Admin Panel")}
      </nav>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3">

          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  authUser?.profilePic ||
                  "https://avatar.iran.liara.run/public"
                }
                alt="avatar"
              />
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">
              {authUser?.fullName}
            </p>
            <p className="text-xs opacity-70 capitalize">
              {authUser?.role}
            </p>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;