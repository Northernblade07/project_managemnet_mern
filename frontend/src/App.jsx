import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import useAuthUser from "./hooks/useAuthUser";
import { useThemeStore } from "./store/useThemeStore";

import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";

// Auth
import SignupPage from "./pages/SignupPages";
import LoginPage from "./pages/LoginPage";

// Core pages
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import UserPage from "./pages/UserPage";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  const isAuthenticated = Boolean(authUser);
  const isAdmin = authUser?.role === "admin";

  return (
 <div className="min-h-screen bg-base-100" data-theme={theme}>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />

        {/* PROTECTED ROOT */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <DashboardPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PROJECTS */}
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <Layout>
                <ProjectsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* TASKS */}
        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              <Layout>
                <TasksPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* USERS (ADMIN ONLY) */}
        <Route
          path="/users"
          element={
            isAuthenticated && isAdmin ? (
              <Layout>
                <UserPage />
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;