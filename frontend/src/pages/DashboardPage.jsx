// src/pages/DashboardPage.jsx
import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getTasks, getUsers } from "../lib/api";
import { 
  Activity, 
  FolderGit2, 
  Kanban, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  User as UserIcon,
  Zap
} from "lucide-react";
import { Link } from "react-router";

const DashboardPage = () => {
  const { authUser } = useAuthUser();
  const isAdmin = authUser?.role === "admin";

  // Fetch data (React Query caches this, so it's super fast)
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  
  // Only fetch users if the person looking is an Admin
  const { data: users = [] } = useQuery({ 
    queryKey: ["users"], 
    queryFn: getUsers, 
    enabled: isAdmin 
  });

  // Analytics Calculations
  const pendingTasks = tasks.filter(t => t.status !== "done").length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;

  // Reusable Stat Card Component for the grid
  const StatCard = ({ title, value, icon, colorClass, delay }) => (
    <div className={`bg-base-100/60 backdrop-blur-xl border border-base-content/10 rounded-3xl p-6 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700 ${delay}`}>
      <div className={`absolute -right-6 -top-6 size-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${colorClass.replace('text-', 'bg-')}`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-mono opacity-60 mb-1">{title}</p>
          <h3 className="text-4xl font-black">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-base-200/50 ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative space-y-8 p-4 sm:p-8 min-h-screen z-10">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-40 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-base-300/60 to-base-200/40 backdrop-blur-md border-2 border-base-600 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
            <div className="size-20 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-center relative z-10">
              {isAdmin ? <ShieldCheck className="size-10 text-primary" /> : <UserIcon className="size-10 text-secondary" />}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{authUser?.fullName}</span>
            </h1>
            <p className="font-mono text-sm opacity-60 mt-1 flex items-center gap-2">
              <Activity className="size-4 text-success" /> System secure. Clearance level: <span className="uppercase font-bold text-base-content">{authUser?.role}</span>
            </p>
          </div>
        </div>
        
        {/* Quick Actions (Role Based) */}
        <div className="flex gap-3 w-full md:w-auto">
          {isAdmin && (
            <Link to="/users" className="btn btn-outline border-base-content/20 hover:bg-primary hover:text-primary-content hover:border-primary border-dashed font-mono">
              <Users className="size-4" /> Manage Grid
            </Link>
          )}
          <Link to="/tasks" className="btn btn-primary shadow-[0_0_15px_rgba(var(--tw-color-primary),0.3)] border-none font-mono">
            <Zap className="size-4" /> Active Tasks
          </Link>
        </div>
      </div>

      {/* METRICS GRID */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="text-primary size-5" /> 
          {isAdmin ? "Global System Metrics" : "Personal Operative HUD"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title={isAdmin ? "Total Projects" : "Active Workspaces"} 
            value={projects.length} 
            icon={<FolderGit2 className="size-6" />} 
            colorClass="text-primary" 
            delay="delay-0"
          />
          <StatCard 
            title={isAdmin ? "Total Tasks" : "My Assigned Tasks"} 
            value={tasks.length} 
            icon={<Kanban className="size-6" />} 
            colorClass="text-secondary" 
            delay="delay-75"
          />
          <StatCard 
            title="In Progress" 
            value={inProgressTasks} 
            icon={<Clock className="size-6" />} 
            colorClass="text-warning" 
            delay="delay-150"
          />
          <StatCard 
            title="Completed" 
            value={completedTasks} 
            icon={<CheckCircle2 className="size-6" />} 
            colorClass="text-success" 
            delay="delay-200"
          />
        </div>
      </div>

      {/* ADMIN EXCLUSIVE WIDGET (Only renders if admin) */}
      {isAdmin && (
        <div className="mt-8 bg-base-100/40 backdrop-blur-xl border border-base-content/10 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Users className="size-5 text-accent" /> Operative Roster</h3>
            <span className="badge badge-accent badge-outline font-mono">{users.length} Active</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Just a quick preview of users to make the dashboard look alive */}
            {users.slice(0, 8).map(user => (
              <div key={user._id} className="flex items-center gap-2 px-4 py-2 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-mono">
                <div className={`size-2 rounded-full ${user.role === 'admin' ? 'bg-primary' : 'bg-success'}`}></div>
                {user.fullName}
              </div>
            ))}
            {users.length > 8 && <div className="px-4 py-2 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-mono opacity-50">+{users.length - 8} more</div>}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;