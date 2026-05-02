import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { login } from '../lib/api.js';
import { HexagonIcon } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {
  const queryClient = useQueryClient();
  const [loginData, setloginData] = useState({ email: "", password: "" });

  const { mutate: loginMutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Uplink Established", {
        style: { background: '#333', color: '#00ffcc', border: '1px solid #00ffcc' }
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(loginData);
    loginMutate(loginData);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-base-300' data-theme='dracula'>
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>

      <div className='relative z-10 border border-secondary/20 flex flex-col lg:flex-row-reverse w-full max-w-5xl mx-auto bg-base-100/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden'>
        
        {/* Left section (Form) */}
        <div className='w-full lg:w-1/2 p-8 flex flex-col justify-center'>
          
          <div className='mb-8 flex items-center justify-start gap-3'>
            <HexagonIcon className='size-10 text-secondary animate-pulse' />
            <span className='text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent'>
              TASKNOVA
            </span>
          </div>

          {error && (
            <div className='alert alert-error mb-4 shadow-lg shadow-error/20'>
              <span>{error.response?.data?.message || "Authentication Failed"}</span>
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleLogin}>
              <div className='space-y-6'>
                <div>
                  <h2 className='font-bold text-2xl text-base-content'>Authorization Required</h2>
                  <p className='text-base-content/60 font-mono mt-1 text-sm'>Enter credentials to access the grid.</p>
                </div>

                <div className='flex flex-col gap-4'>
                  <div className='form-control w-full'>
                    <label className='label'><span className='label-text font-mono text-xs uppercase tracking-wider'>Comm-Link</span></label>
                    <input className='input input-bordered bg-base-200/50 focus:border-secondary focus:ring-1 focus:ring-secondary w-full transition-all' type="email" onChange={(e) => setloginData({ ...loginData, email: e.target.value })} placeholder='operator@tasknova.net' value={loginData.email} required />
                  </div>

                  <div className='form-control w-full'>
                    <label className='label'><span className='label-text font-mono text-xs uppercase tracking-wider'>Access Code</span></label>
                    <input type="password" value={loginData.password} onChange={(e) => setloginData({ ...loginData, password: e.target.value })} className='input input-bordered bg-base-200/50 focus:border-secondary focus:ring-1 focus:ring-secondary w-full transition-all' placeholder='••••••••' required />
                  </div>

                  <button type='submit' className='btn btn-secondary w-full mt-4 shadow-[0_0_15px_rgba(var(--tw-color-secondary),0.4)] hover:shadow-[0_0_25px_rgba(var(--tw-color-secondary),0.6)] border-none' disabled={isPending}>
                    {isPending ? <span className='animate-spin loading loading-spinner loading-md'></span> : "ESTABLISH UPLINK"}
                  </button>

                  <div className='text-center mt-6'>
                    <p className='text-sm text-base-content/60'>
                      No clearance profile? {' '}
                      <Link className='text-primary font-semibold hover:text-primary-focus transition-colors' to={'/signup'}>Initialize here</Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right scene (Graphic) */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-gradient-to-bl from-base-300 to-base-200 items-center justify-center relative border-r border-base-content/5'>
           <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className='max-w-md p-8 relative z-10 text-center space-y-6'>
            <div className='relative w-64 h-64 mx-auto flex items-center justify-center'>
               <div className="absolute inset-0 bg-gradient-to-bl from-secondary to-accent rounded-full animate-pulse opacity-20 blur-xl"></div>
               <HexagonIcon className='size-32 text-secondary/80 relative z-10 drop-shadow-[0_0_15px_rgba(var(--tw-color-secondary),0.8)]' />
            </div>

            <div className='space-y-2'>
              <h2 className='text-2xl font-bold tracking-wide text-base-content'>SECURE CONNECTION</h2>
              <p className='text-base-content/60 font-mono text-sm leading-relaxed'>End-to-end encrypted session. Activity is logged and monitored by central command.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;