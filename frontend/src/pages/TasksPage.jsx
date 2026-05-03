// src/pages/TasksPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask, getProjects, createTask } from "../lib/api.js";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  Plus,  
  Calendar, 
  User, 
  FolderGit2,
  Loader2,
  Kanban
} from "lucide-react";

const TasksPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new Task
  const [newTask, setNewTask] = useState({ title: "", project: "", assignedTo: "", dueDate: "" });

  // Fetch Data (Notice we no longer need to fetch ALL users!)
  const { data: tasksRes, isLoading: tasksLoading } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const { data: projectsRes } = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  const tasks = tasksRes || [];
  const projects = projectsRes || [];

  // Mutations
  const { mutate: updateStatus } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Status updated");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update status"),
  });

  const { mutate: createNewTask, isPending: creatingTask } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsModalOpen(false);
      setNewTask({ title: "", project: "", assignedTo: "", dueDate: "" });
      toast.success("Task deployed to grid");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to deploy task"),
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.project || !newTask.assignedTo || !newTask.dueDate) {
      return toast.error("All parameters are required to deploy a task.");
    }
    createNewTask(newTask);
  };

  // 🔥 THE MAGIC LOGIC: Find the selected project and extract ONLY its members
  const selectedProjectObj = projects.find(p => p._id === newTask.project);
  const availableOperatives = selectedProjectObj?.members || [];

  // Auto-reset operative when project changes
  const handleProjectChange = (e) => {
    setNewTask({ ...newTask, project: e.target.value, assignedTo: "" });
  };

  // Helper function to render Kanban columns
  const renderColumn = (title, status, icon, colorClass, gradientClass) => {
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
      <div className={`flex flex-col bg-base-300/40 backdrop-blur-md rounded-3xl border border-base-content/5 p-4 sm:p-6 overflow-hidden relative`}>
        {/* Column Ambient Glow */}
        <div className={`absolute top-0 inset-x-0 h-1 ${gradientClass}`}></div>
        
        <div className="flex items-center justify-between mb-6 pt-2">
          <h2 className="text-lg font-bold flex items-center gap-2 tracking-wide">
            {icon} {title}
          </h2>
          <span className="badge badge-sm font-mono opacity-70">{columnTasks.length}</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {columnTasks.map((task) => (
            <div key={task._id} className="group relative bg-base-300/60 backdrop-blur-xl border border-base-content/10 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:border-base-content/30">
              
              <h3 className="font-bold text-base-content mb-3">{task.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono opacity-70 text-primary">
                  <FolderGit2 className="size-3" />
                  <span className="truncate">{task.project?.name || "Unknown Project"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono opacity-70">
                  <User className="size-3" />
                  <span>{task.assignedTo?.fullName || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono opacity-70">
                  <Calendar className="size-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Updater Dropdown */}
              <select 
                className={`select select-sm w-full bg-base-200/50 text-xs font-mono border-none outline-none focus:ring-1 ${colorClass}`}
                value={task.status}
                onChange={(e) => updateStatus({ id: task._id, status: e.target.value })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}

          {columnTasks.length === 0 && (
            <div className="py-10 text-center opacity-40 border-2 border-dashed border-base-content/10 rounded-2xl font-mono text-sm">
              No active protocols
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative space-y-6 sm:space-y-8 animate-in fade-in duration-500 z-10 p-4 sm:p-8 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-base-content/10 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-base-content to-base-content/60">
            <Kanban className="text-primary size-8 sm:size-10" />
            Task Grid
          </h1>
          <p className="text-sm opacity-60 mt-2 font-mono">Operative assignment and status tracking.</p>
        </div>

        {authUser?.role === "admin" && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary shadow-[0_0_15px_rgba(var(--tw-color-primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--tw-color-primary),0.6)] border-none">
            <Plus className="size-5" /> Deploy Task
          </button>
        )}
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin size-12 text-primary" /></div>
      ) : (
        /* KANBAN BOARD GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[60vh]">
          {renderColumn("Awaiting", "todo", <CircleDashed className="size-5 text-error" />, "focus:ring-error text-error", "bg-gradient-to-r from-error/40 to-transparent")}
          {renderColumn("In Progress", "in-progress", <Clock className="size-5 text-warning" />, "focus:ring-warning text-warning", "bg-gradient-to-r from-warning/40 to-transparent")}
          {renderColumn("Completed", "done", <CheckCircle2 className="size-5 text-success" />, "focus:ring-success text-success", "bg-gradient-to-r from-success/40 to-transparent")}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-base-100/90 backdrop-blur-2xl border border-base-content/10 shadow-2xl overflow-visible">
          <h3 className="font-bold text-xl mb-6">Initialize New Task</h3>
          
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Task Designation</span></label>
              <input type="text" className="input input-bordered bg-base-200/50" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Upgrade security firewall" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Target Project</span></label>
              <select className="select select-bordered bg-base-200/50" value={newTask.project} onChange={handleProjectChange}>
                <option value="" disabled>Select a project...</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Assign Operative</span></label>
              <select 
                className="select select-bordered bg-base-200/50" 
                value={newTask.assignedTo} 
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                disabled={!newTask.project || availableOperatives.length === 0}
              >
                <option value="" disabled>
                  {!newTask.project 
                    ? "Select a project first" 
                    : availableOperatives.length === 0 
                      ? "No operatives in this project" 
                      : "Select operative..."}
                </option>
                {availableOperatives.map(member => (
                  <option key={member._id} value={member._id}>{member.fullName}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-mono text-xs">Deadline</span></label>
              <input type="date" className="input input-bordered bg-base-200/50" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
            </div>

            <div className="modal-action mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Abort</button>
              <button type="submit" className="btn btn-primary" disabled={creatingTask}>
                {creatingTask ? <Loader2 className="animate-spin size-5" /> : "Deploy"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}><button>close</button></form>
      </dialog>

    </div>
  );
};

export default TasksPage;