import { axiosInstance } from "./axios";
// AUTH APIs
export const signUp = async (data) => {
  const res = await axiosInstance.post("/auth/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
};


export const getProjects = async () => {
  const res = await axiosInstance.get("/projects");
  console.log(res.data)
  return res.data.data;
};

export const createProject = async (data) => {
  const res = await axiosInstance.post("/projects", data);
  console.log(res.data)
  return res.data;
};

export const getTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data.data;
};

export const createTask = async (data) => {
  const res = await axiosInstance.post("/tasks", data);
  console.log(res.data)
  return res.data;
};

export const updateTask = async ({ id, status }) => {
  const res = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  console.log(res.data)
  return res.data;
};

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  console.log(res.data)
  return res.data.data;
};