// src/pages/UserPage.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers, getProjects, getTasks } from "../lib/api"; 
import { 
  Users, Search, ShieldCheck, User as UserIcon, Mail, Calendar,
  Loader2, TerminalSquare, Filter, FileText, FolderGit2, CheckSquare, X
} from "lucide-react";

const UserPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null); // Tracks who we are inspecting

  // 1. Fetch ALL data (React Query caches this, making it instant!)
  const { data: users = [], isLoading: usersLoading } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: tasksRes } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  
  const tasks = tasksRes || [];

  // Filter Users for the main list
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate specific data for the selected user (The Dossier Logic)
  const userProjects = selectedUser 
    ? projects.filter(p => p.members?.some(m => m._id === selectedUser._id)) 
    : [];
    
  const userTasks = selectedUser 
    ? tasks.filter(t => t.assignedTo?._id === selectedUser._id) 
    : [];

  return (
    <div className="relative space-y-6 sm:space-y-8 animate-in fade-in duration-500 z-10 p-4 sm:p-8 min-h-screen">
      
      {/* AMBIENT GLOWS */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-base-content/10 pb-6">
        <div className="w-full xl:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60">
            <Users className="text-primary size-8 sm:size-10" /> Operative Directory
          </h1>
          <p className="text-sm opacity-60 mt-2 font-mono flex items-center gap-2">
            <TerminalSquare className="size-4" /> System personnel and clearance management
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-3.5 size-4 opacity-50" />
            <select 
              className="select select-bordered pl-10 w-full bg-base-200/50 backdrop-blur-sm focus:border-primary font-mono text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Clearances</option>
              <option value="admin">Admins Only</option>
              <option value="member">Members Only</option>
            </select>
          </div>
          <div className="relative w-full md:w-64 lg:w-72 flex gap-2">
            <Search className="absolute left-1 top-3.5 size-4 opacity-50" />
            <input type="text" placeholder="  Search personnel..." className="input input-bordered ml-5 w-full bg-base-200/50" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {usersLoading && <div className="flex justify-center py-32"><Loader2 className="animate-spin size-12 text-primary" /></div>}
      
      {!usersLoading && filteredUsers.length === 0 && (
        <div className="text-center py-24 border border-dashed border-base-content/20 rounded-3xl bg-base-200/20">
          <Users className="mx-auto size-16 text-base-content/20 mb-4" />
          <h3 className="font-bold text-xl tracking-wide">No Personnel Found</h3>
        </div>
      )}

      {/* PERSONNEL LIST */}
      <div className="flex flex-col gap-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="group relative bg-base-100/60 backdrop-blur-xl border border-base-content/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-primary/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
              <div className="avatar">
                <div className={`w-12 sm:w-14 rounded-xl ring-2 ring-offset-2 ring-offset-base-100 ${user.role === 'admin' ? 'ring-secondary' : 'ring-primary/50'}`}>
                  <img src={user.profilePic || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`} alt="avatar" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
                  {user.fullName} {user.role === 'admin' && <ShieldCheck className="size-4 text-secondary" />}
                </h3>
                <span className="font-mono text-xs opacity-50 bg-base-200 px-2 py-1 rounded-md mt-1 inline-block">ID: {user._id.slice(-6)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 relative z-10 w-full md:w-auto border-t md:border-none border-base-content/5 pt-4 md:pt-0">
              <div className="flex items-center gap-2 text-sm opacity-80 font-mono"><Mail className="size-4 text-primary" />{user.email}</div>
              <div className="flex items-center gap-2 text-sm opacity-80 font-mono"><Calendar className="size-4 opacity-50" /> Joined {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="relative z-10 w-full md:w-auto flex justify-end gap-3">
              <div className={`badge badge-lg font-mono uppercase text-xs border-none hidden lg:flex ${user.role === 'admin' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {user.role}
              </div>
              {/* THE MAGIC BUTTON */}
              <button onClick={() => setSelectedUser(user)} className="btn btn-sm btn-primary shadow-[0_0_10px_rgba(var(--tw-color-primary),0.3)]">
                <FileText className="size-4" /> Inspect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 OPERATIVE DOSSIER MODAL 🔹 */}
      <dialog className={`modal ${selectedUser ? "modal-open" : ""}`}>
        <div className="modal-box w-11/12 max-w-4xl bg-base-100/95 backdrop-blur-3xl border border-base-content/10 shadow-2xl p-0 overflow-hidden">
          
          {/* Header */}
          <div className="bg-base-200/50 p-6 border-b border-base-content/10 flex justify-between items-start">
            <div className="flex items-center gap-4">
               <div className="avatar">
                  <div className={`w-16 rounded-2xl ring-4 ring-offset-2 ring-offset-base-100 ${selectedUser?.role === 'admin' ? 'ring-secondary' : 'ring-primary'}`}>
                    <img src={selectedUser?.profilePic || "https://avatar.iran.liara.run/public"} alt="avatar" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedUser?.fullName}</h2>
                  <p className="font-mono text-sm opacity-60 flex items-center gap-2"><Mail className="size-3" /> {selectedUser?.email}</p>
                  <div className={`badge badge-sm mt-2 font-mono uppercase border-none ${selectedUser?.role === 'admin' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    Clearance: {selectedUser?.role}
                  </div>
                </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-circle bg-base-300 hover:bg-error hover:text-error-content"><X className="size-5" /></button>
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto">
            
            {/* Left Column: Assigned Tasks */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-3 border-b border-base-content/10 pb-2">
                <CheckSquare className="size-5 text-primary" /> Active Tasks ({userTasks.length})
              </h3>
              {userTasks.length === 0 ? (
                <p className="text-sm font-mono opacity-50 p-4 bg-base-200/30 rounded-xl border border-dashed border-base-content/10">No tasks currently assigned.</p>
              ) : (
                <div className="space-y-3">
                  {userTasks.map(task => (
                    <div key={task._id} className="bg-base-200/50 p-4 rounded-xl border border-base-content/5 flex flex-col justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{task.title}</p>
                        <p className="text-xs font-mono opacity-60 mt-1 flex items-center gap-1"><FolderGit2 className="size-3"/> {task.project?.name}</p>
                      </div>
                      <div className={`badge badge-sm font-mono text-xs mt-1 ${
                        task.status === 'done' ? 'badge-success' : task.status === 'in-progress' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Associated Projects */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2 border-b border-base-content/10 pb-2">
                <FolderGit2 className="size-5 text-secondary" /> Associated Projects ({userProjects.length})
              </h3>
              {userProjects.length === 0 ? (
                <p className="text-sm font-mono opacity-50 p-4 bg-base-200/30 rounded-xl border border-dashed border-base-content/10">Not assigned to any projects.</p>
              ) : (
                <div className="space-y-3">
                  {userProjects.map(project => (
                    <div key={project._id} className="bg-base-200/50 p-4 rounded-xl border border-base-content/5">
                      <p className="font-bold text-sm">{project.name}</p>
                      <p className="text-xs font-mono opacity-60 mt-1">ID: {project._id.slice(-6)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setSelectedUser(null)}><button>close</button></form>
      </dialog>

    </div>
  );
};

export default UserPage;