// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router"; // Use react-router-dom
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
  MenuIcon,
  XIcon
} from "lucide-react";

import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = authUser?.role === "admin";

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out");
    },
  });

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 md:py-2 md:px-3 rounded-xl md:rounded-lg transition-all font-mono md:font-sans ${
      location.pathname === path
        ? "bg-primary/10 text-primary md:shadow-none shadow-[0_0_10px_rgba(var(--tw-color-primary),0.2)]"
        : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
    }`;

  // Helper to close sidebar when clicking a link on mobile
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-base-200/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-30 h-16 flex items-center transition-colors duration-300">
        <div className="container mx-auto px-4 flex items-center justify-between">

          {/* LEFT - LOGO & MOBILE HAMBURGER */}
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon className="size-6" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* CENTER - DESKTOP NAV LINKS */}
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
          </div>

          {/* RIGHT - AVATAR, THEME & LOGOUT */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSelector />

            <div className="avatar hidden sm:flex">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic || "https://avatar.iran.liara.run/public"} alt="user" />
              </div>
            </div>

            <button onClick={logoutMutation} className="btn btn-ghost btn-circle hidden md:flex hover:bg-error/20 hover:text-error transition-colors">
              <LogOutIcon className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </div>
      </nav>

      {/* 🔹 MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={closeMenu}
        ></div>
      )}

      {/* 🔹 MOBILE SIDEBAR DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-base-100 shadow-2xl z-50 transform transition-transform duration-300 md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={authUser?.profilePic || "https://avatar.iran.liara.run/public"} alt="user" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm line-clamp-1">{authUser?.fullName}</p>
              <p className="text-xs opacity-60 font-mono uppercase">{authUser?.role}</p>
            </div>
          </div>
          <button onClick={closeMenu} className="btn btn-ghost btn-circle btn-sm">
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <Link to="/" onClick={closeMenu} className={navLinkClass("/")}>
            <LayoutDashboardIcon size={20} /> Dashboard
          </Link>
          <Link to="/projects" onClick={closeMenu} className={navLinkClass("/projects")}>
            <FolderIcon size={20} /> Projects
          </Link>
          <Link to="/tasks" onClick={closeMenu} className={navLinkClass("/tasks")}>
            <CheckSquareIcon size={20} /> Tasks
          </Link>
          {isAdmin && (
            <Link to="/users" onClick={closeMenu} className={navLinkClass("/users")}>
              <UsersIcon size={20} /> Users
            </Link>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-base-300">
          <button 
            onClick={() => { closeMenu(); logoutMutation(); }} 
            className="btn btn-outline border-base-content/20 hover:bg-error hover:text-error-content hover:border-error w-full gap-2 font-mono"
          >
            <LogOutIcon className="size-5" /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;