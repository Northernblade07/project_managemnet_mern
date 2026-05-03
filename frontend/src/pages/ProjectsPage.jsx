// src/pages/ProjectsPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects, getUsers } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import {
  FolderGit2,
  Plus,
  Loader2,
  Search,
  Users,
  Calendar,
  ChevronRight,
  TerminalSquare,
  ShieldCheck,
  CheckSquare
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New State for handling name AND multiple members
  const [newProject, setNewProject] = useState({ name: "", members: [] });

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  // Fetch Projects & Users
  const { data: projects = [], isLoading } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: getUsers, enabled: authUser?.role === "admin" });

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setNewProject({ name: "", members: [] });
      setIsModalOpen(false);
      toast.success("Project initialized successfully");
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Failed to initialize project"),
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return toast.error("Enter project designation");
    mutate(newProject);
  };

  const toggleMember = (userId) => {
    setNewProject(prev => {
      const isSelected = prev.members.includes(userId);
      return {
        ...prev,
        members: isSelected 
          ? prev.members.filter(id => id !== userId) // Remove if already selected
          : [...prev.members, userId]                // Add if not selected
      };
    });
  };

  const filteredProjects = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative space-y-6 sm:space-y-8 animate-in fade-in duration-500 z-10 p-4 sm:p-8">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      {/* 🔹 HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 border-b border-base-content/10 pb-6">
        <div className="w-full xl:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60">
            <FolderGit2 className="text-primary size-8" />
            Project Matrix
          </h1>
          <p className="text-sm opacity-60 mt-2 font-mono flex items-center gap-2">
            <TerminalSquare className="size-4" /> Active workspaces and deployment zones
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-64 lg:w-72">
            <Search className="absolute left-3 top-3.5 size-4 opacity-50" />
            <input type="text" placeholder="Search databases..." className="input input-bordered pl-10 w-full bg-base-200/50 backdrop-blur-sm focus:border-primary" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {authUser?.role === "admin" && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-[0_0_15px_rgba(var(--tw-color-primary),0.3)] border-none">
              <Plus className="size-5" /> <span className="hidden sm:inline font-mono">INIT PROJECT</span>
            </button>
          )}
        </div>
      </div>

      {/* 🔹 LOADING & EMPTY STATES */}
      {isLoading && <div className="flex justify-center py-32"><Loader2 className="animate-spin size-12 text-primary" /></div>}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-24 border border-dashed border-base-content/20 rounded-3xl bg-base-200/20 backdrop-blur-sm">
          <FolderGit2 className="mx-auto size-16 text-base-content/20 mb-4" />
          <h3 className="font-bold text-xl">No Records Found</h3>
        </div>
      )}

      {/* 🔹 PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProjects.map((p) => (
          <div key={p._id} className="group relative bg-base-200/60 backdrop-blur-xl border-2 border-base-content rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20"><FolderGit2 className="text-primary size-6" /></div>
                <span className="badge badge-sm badge-outline font-mono text-[10px] opacity-60">SYS-{p._id.slice(-5).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{p.name}</h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm font-mono opacity-80"><ShieldCheck className="size-4 text-secondary" /> <span className="truncate">Admin: {p.createdBy?.fullName || "System"}</span></div>
                <div className="flex items-center gap-3 text-sm font-mono opacity-80"><Users className="size-4 text-accent" /> <span>{p.members?.length || 0} Operatives</span></div>
                <div className="flex items-center gap-3 text-sm font-mono opacity-80"><Calendar className="size-4 opacity-70" /> <span>{new Date(p.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>
            <div className="relative z-10 mt-6 pt-4 border-t border-base-content/10">
              <button className="btn btn-sm w-full bg-base-200/50 hover:bg-primary hover:text-primary-content border-none font-mono text-xs flex justify-between items-center">
                Access Uplink <ChevronRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 CREATE PROJECT MODAL */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-base-100/90 backdrop-blur-2xl border border-base-content/10 shadow-2xl">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><FolderGit2 className="text-primary"/> Initialize Workspace</h3>
          
          <form onSubmit={handleCreateProject} className="space-y-6">
            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Project Designation</span></label>
              <input type="text" className="input input-bordered bg-base-200/50" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. Operation Firewall" />
            </div>

            {/* MULTI-SELECT MEMBERS LIST */}
            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Assign Operatives (Optional)</span></label>
              <div className="bg-base-200/50 rounded-xl p-2 max-h-48 overflow-y-auto border border-base-content/10 space-y-1">
                {users.map(user => (
                  <label key={user._id} className="flex items-center gap-3 p-2 hover:bg-base-100 rounded-lg cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm checkbox-primary" 
                      checked={newProject.members.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.fullName}</span>
                      <span className="text-[10px] font-mono opacity-50">{user.role}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-action mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Abort</button>
              <button type="submit" className="btn btn-primary" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin size-5" /> : "Deploy Project"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}><button>close</button></form>
      </dialog>

    </div>
  );
};

export default ProjectsPage;