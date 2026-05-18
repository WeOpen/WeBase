"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as authService from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store";

type LoginErrorField = "username" | "password" | "form" | null;

const loginErrorId = "login-error";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<LoginErrorField>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUsername = username.trim();

    if (!nextUsername) {
      setError("请输入用户名");
      setErrorField("username");
      return;
    }

    if (!password) {
      setError("请输入密码");
      setErrorField("password");
      return;
    }

    setLoading(true);
    setError("");
    setErrorField(null);

    try {
      const session = await authService.login({
        username: nextUsername,
        password,
        remember,
      });

      setSession(session.token, session.user);
      router.replace("/dashboard");
    } catch {
      setError("登录失败，请检查账号或稍后重试");
      setErrorField("form");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090f] text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-18rem] h-[34rem] w-[34rem] rounded-full bg-sky-500/16 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[30rem] w-[30rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-blue-950/40 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_92px)] opacity-[0.06]" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="hidden lg:block">
            <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.32em] text-sky-100/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
              WeBase Control Surface
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white xl:text-6xl">
              以清晰、克制的方式掌控后台运营。
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300/78">
              为管理场景准备的暗色优先模板：稳定的层级、精细的玻璃质感，以及面向高频操作的低干扰界面。
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["01", "会话安全"],
                ["02", "权限治理"],
                ["03", "系统洞察"],
              ].map(([index, label]) => (
                <div
                  key={index}
                  className="rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="text-xs text-sky-100/50">{index}</div>
                  <div className="mt-5 text-sm font-medium text-slate-100">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-white/12 bg-[#0f141d]/72 p-2 shadow-[0_32px_90px_rgba(0,0,0,0.44)] backdrop-blur-2xl">
              <div className="rounded-[1.55rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-8 sm:p-9">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200/15 bg-sky-300/10 text-lg font-semibold text-sky-100 shadow-lg shadow-sky-950/30">
                      W
                    </div>
                    <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                      登录 WeBase
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300/72">
                      使用演示账号进入管理控制台。
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100/90">
                    Demo
                  </span>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100" htmlFor="username">
                      用户名
                    </label>
                    <Input
                      id="username"
                      autoComplete="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      aria-invalid={errorField === "username"}
                      aria-describedby={errorField === "username" ? loginErrorId : undefined}
                      className="h-12 rounded-2xl border-white/10 bg-black/20 px-4 text-white placeholder:text-slate-500 focus-visible:ring-sky-300/70"
                      placeholder="请输入用户名"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-100" htmlFor="password">
                      密码
                    </label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      aria-invalid={errorField === "password"}
                      aria-describedby={errorField === "password" ? loginErrorId : undefined}
                      className="h-12 rounded-2xl border-white/10 bg-black/20 px-4 text-white placeholder:text-slate-500 focus-visible:ring-sky-300/70"
                      placeholder="请输入密码"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="inline-flex cursor-pointer items-center gap-3 text-slate-300/78">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-black/30 accent-sky-400"
                      />
                      记住登录状态
                    </label>
                    <span className="text-xs text-slate-400">admin / admin123</span>
                  </div>

                  {error ? (
                    <div
                      id={loginErrorId}
                      role="alert"
                      className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-100"
                    >
                      {error}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-2xl border border-sky-200/20 bg-sky-300/16 text-base font-semibold text-white shadow-[0_18px_45px_rgba(56,189,248,0.16)] hover:bg-sky-300/22"
                  >
                    {loading ? "正在登录..." : "进入控制台"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
