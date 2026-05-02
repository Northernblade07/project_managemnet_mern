// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../lib/api";

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" data-theme="synthwave">

      {/* glow bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent blur-3xl opacity-40"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row border border-white/10 backdrop-blur-xl bg-base-100/80 rounded-2xl shadow-2xl overflow-hidden">

          {/* LEFT */}
          <div className="w-full lg:w-1/2 p-8">
            
            {/* logo */}
            <div className="flex items-center gap-2 mb-6">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            {/* error */}
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error?.response?.data?.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Create your workspace</h2>
                <p className="opacity-70 text-sm">
                  Manage projects, assign tasks, track progress.
                </p>
              </div>

              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button className="btn btn-primary w-full">
                {isPending ? "Creating..." : "Create Account"}
              </button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold">Stay productive</h2>
              <p className="opacity-70 mt-2">
                Organize tasks and collaborate with your team.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;