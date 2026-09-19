"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Gamepad2, Sparkles } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      username: form.username,
      password: form.password,
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid username or password");
      return;
    }
    router.push("/main/main");
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      setSuccess("Account created! Logging you in...");
      const loginRes = await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false
      });
      if (loginRes?.error) {
        setError("Account created but login failed. Please sign in.");
        setMode("login");
      } else {
        router.push("/main/main");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-surface-950 via-surface-900 to-cool-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cool-600 mb-4 shadow-lg shadow-cool-600/30">
            <Gamepad2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            COOLBLOX<span className="text-cool-400">-GROX</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm">Create • Play • Share</p>
        </div>

        <div className="bg-surface-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex gap-1 p-1 bg-surface-900 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                mode === "login" ? "bg-cool-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                mode === "register" ? "bg-cool-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">{success}</div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Display Name</label>
                <input name="displayName" value={form.displayName} onChange={handleChange} placeholder="Your display name" className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cool-500 outline-none" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{mode === "login" ? "Username or Email" : "Username"}</label>
              <input name="username" value={form.username} onChange={handleChange} required placeholder={mode === "login" ? "username or email" : "unique username"} className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cool-500 outline-none" />
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cool-500 outline-none" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-slate-700 text-white placeholder-slate-500 focus:border-cool-500 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-cool-600 hover:bg-cool-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />{mode === "login" ? "Signing in..." : "Creating account..."}</> : <><Sparkles className="w-5 h-5" />{mode === "login" ? "Enter COOLBLOX" : "Create Account"}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
