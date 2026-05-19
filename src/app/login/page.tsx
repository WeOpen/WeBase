"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full px-2 pb-0 pt-2 sm:px-3 sm:pt-2.5">
        <div className="mx-auto max-w-[1800px] rounded-2xl border border-black/[0.06] bg-background/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-black/60 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="flex h-12 items-center justify-between gap-3 px-2.5 sm:px-4">
            <Link href="/login" className="group/logo flex items-center gap-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-foreground text-xs font-bold text-background transition-transform duration-200 group-hover/logo:scale-105">
                WB
              </span>
              <span className="text-[15px] font-bold tracking-tight text-foreground">
                We<span className="text-orange-500">Base</span>
              </span>
            </Link>
            <span className="hidden rounded-lg border border-border/50 px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex dark:border-white/[0.06]">
              Admin scaffold
            </span>
          </div>
        </div>
      </header>

      <section className="px-2 py-12 sm:px-3 sm:py-16">
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="hidden lg:block">
            <div className="mb-5 inline-flex rounded-full border border-orange-200/50 bg-orange-50/80 px-3 py-1.5 text-xs font-medium text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
              WeBase Control Surface
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground xl:text-6xl">
              以清晰、克制的方式掌控后台运营。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              通过紧凑圆角、半透明导航和中性卡片层级，聚焦后台管理的用户、角色、菜单和设置内容。
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["01", "会话安全"],
                ["02", "权限治理"],
                ["03", "系统洞察"],
              ].map(([index, label]) => (
                <div
                  key={index}
                  className="rounded-xl border border-border/40 bg-card/80 p-4 transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md"
                >
                  <div className="text-xs text-muted-foreground/60">{index}</div>
                  <div className="mt-5 text-sm font-medium text-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-xl border border-border/40 bg-card/80 p-2 shadow-lg shadow-black/5 dark:shadow-black/20">
            <div className="rounded-xl border border-border/40 bg-background/70 p-6 sm:p-7 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-foreground text-lg font-semibold text-background">
                    W
                  </div>
                  <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground">
                    登录 WeBase
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    使用演示账号进入管理控制台。
                  </p>
                </div>
                <span className="rounded-full border border-orange-200/50 bg-orange-50/80 px-3 py-1 text-xs font-medium text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
                  Demo
                </span>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="username">
                    用户名
                  </label>
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    aria-invalid={errorField === "username"}
                    aria-describedby={errorField === "username" ? loginErrorId : undefined}
                    className="h-11 rounded-xl border-border bg-muted/40 px-4 dark:border-white/[0.08] dark:bg-white/[0.04]"
                    placeholder="请输入用户名"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">
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
                    className="h-11 rounded-xl border-border bg-muted/40 px-4 dark:border-white/[0.08] dark:bg-white/[0.04]"
                    placeholder="请输入密码"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="inline-flex cursor-pointer items-center gap-3 text-muted-foreground">
                    <Checkbox
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />
                    记住登录状态
                  </label>
                  <span className="text-xs text-muted-foreground">admin / admin123</span>
                </div>

                {error ? (
                  <div
                    id={loginErrorId}
                    role="alert"
                    className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-foreground text-base font-semibold text-background hover:bg-foreground/90"
                >
                  {loading ? "正在登录..." : "进入控制台"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
