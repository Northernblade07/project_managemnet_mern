// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";

import {
  LayoutDashboardIcon,
  FolderIcon,
  CheckSquareIcon,
  UsersIcon,
  LogOutIcon,
  ShipWheelIcon,
} from "lucide-react";

import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isAdmin = authUser?.role === "admin";

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out");
    },
  });

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-primary/10 text-primary"
        : "hover:bg-base-300"
    }`;

  return (
    <nav className="bg-base-200/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* LEFT - LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <ShipWheelIcon className="size-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>

        {/* CENTER - NAV LINKS */}
        <div className="hidden md:flex items-center gap-2">

          <Link to="/" className={navLinkClass("/")}>
            <LayoutDashboardIcon size={18} />
            Dashboard
          </Link>

          <Link to="/projects" className={navLinkClass("/projects")}>
            <FolderIcon size={18} />
            Projects
          </Link>

          <Link to="/tasks" className={navLinkClass("/tasks")}>
            <CheckSquareIcon size={18} />
            Tasks
          </Link>

          {isAdmin && (
            <Link to="/users" className={navLinkClass("/users")}>
              <UsersIcon size={18} />
              Users
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className={navLinkClass("/admin")}>
              <LayoutDashboardIcon size={18} />
              Admin
            </Link>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <ThemeSelector />

          {/* user avatar */}
          <div className="avatar">
            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  authUser?.profilePic ||
                  "https://avatar.iran.liara.run/public"
                }
                alt="user"
              />
            </div>
          </div>

          {/* logout */}
          <button
            onClick={logoutMutation}
            className="btn btn-ghost btn-circle"
          >
            <LogOutIcon className="w-5 h-5 opacity-70" />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;