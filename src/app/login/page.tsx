"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useAuthHydrated } from "@/lib/auth/use-auth-hydrated";
import * as authService from "@/lib/services/auth-service";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { token, setSession } = useAuthStore();
  const hydrated = useAuthHydrated();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && token) router.replace("/dashboard");
  }, [hydrated, token, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim()) { setError("请输入用户名"); return; }
    if (!password) { setError("请输入密码"); return; }

    setLoading(true);
    setError("");

    try {
      const session = await authService.login({ username: username.trim(), password, remember: false });
      setSession(session.token, session.user);
      router.replace("/dashboard");
    } catch {
      setError("登录失败，请检查账号或稍后重试");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-orange-500" />
      </main>
    );
  }

  if (token) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-foreground text-xl font-bold text-background">
            WB
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">WeBase</h1>
          <p className="mt-2 text-sm text-muted-foreground">登录管理控制台</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField label="用户名" htmlFor="username" className="space-y-1.5">
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="h-11 rounded-xl"
              placeholder="请输入用户名"
            />
          </FormField>

          <FormField label="密码" htmlFor="password" className="space-y-1.5">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="h-11 rounded-xl"
              placeholder="请输入密码"
            />
          </FormField>

          {error && (
            <Alert variant="danger" description={error} className="py-2.5" />
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
          >
            {loading ? "正在登录..." : "登录"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          演示账号 admin / admin123
        </p>
      </div>
    </main>
  );
}
