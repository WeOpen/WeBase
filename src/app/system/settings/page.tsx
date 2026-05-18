"use client";

import { Bell, CheckCircle2, LockKeyhole, RefreshCw, Save, Settings, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SystemSettings } from "@/lib/api/types";
import { getSettings, updateSettings } from "@/lib/services/settings-service";

type SettingCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
};

const emptySettings: SystemSettings = {
  systemName: "",
  logoText: "",
  defaultTheme: "system",
  sessionTimeout: 30,
  passwordPolicy: "",
  emailNotification: false,
  inAppNotification: false,
};

const themeOptions: Array<{ label: string; value: SystemSettings["defaultTheme"] }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

function SettingCard({ title, description, icon: Icon, children }: SettingCardProps) {
  return (
    <section className="admin-surface overflow-hidden p-5 shadow-2xl shadow-black/10">
      <div className="flex items-start gap-4 border-b border-border/70 pb-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-background/55 text-primary shadow-inner">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4 pt-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<SystemSettings>(emptySettings);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const updateValue = <Key extends keyof SystemSettings>(key: Key, value: SystemSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const loadSettings = React.useCallback(async (options?: { preserveMessage?: boolean }) => {
    setLoading(true);
    if (!options?.preserveMessage) {
      setMessage(null);
    }

    try {
      const record = await getSettings();
      setSettings(record);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    void getSettings()
      .then((record) => {
        if (!active) {
          return;
        }

        setSettings(record);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Failed to load settings.");
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const savedSettings = await updateSettings({
        ...settings,
        systemName: settings.systemName.trim(),
        logoText: settings.logoText.trim(),
        sessionTimeout: Math.max(1, Math.round(settings.sessionTimeout)),
        passwordPolicy: settings.passwordPolicy.trim(),
      });

      setSettings(savedSettings);
      setMessage("Settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="admin-surface relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgb(56_189_248_/_16%),transparent_18rem),radial-gradient(circle_at_92%_0%,rgb(16_185_129_/_12%),transparent_16rem)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.28em] text-primary">
                <Settings className="h-4 w-4" aria-hidden="true" />
                System / Settings
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-card-foreground sm:text-5xl">
                System preferences tuned from one calm console.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Adjust the admin identity, session policy, and notification channels backed by the existing settings service.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-background/45 p-4 shadow-inner sm:min-w-72">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Theme</p>
                <p className="mt-2 text-2xl font-semibold capitalize text-card-foreground">{settings.defaultTheme}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Session</p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">{settings.sessionTimeout}m</p>
              </div>
            </div>
          </div>
        </section>

        {message ? (
          <div className="admin-surface flex items-center justify-between gap-3 p-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
              {message}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setMessage(null)}>
              Dismiss
            </Button>
          </div>
        ) : null}

        <div className="relative grid gap-5 xl:grid-cols-3">
          <SettingCard
            title="Base config"
            description="Set the product identity and the default visual preference for the scaffold."
            icon={SlidersHorizontal}
          >
            <label className="space-y-2 text-sm font-medium text-card-foreground">
              <span>System name</span>
              <Input
                required
                value={settings.systemName}
                onChange={(event) => updateValue("systemName", event.target.value)}
                placeholder="WeBase Admin"
                className="bg-background/55"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-card-foreground">
              <span>Logo text</span>
              <Input
                required
                maxLength={6}
                value={settings.logoText}
                onChange={(event) => updateValue("logoText", event.target.value)}
                placeholder="WB"
                className="bg-background/55"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-card-foreground">
              <span>Default theme</span>
              <select
                value={settings.defaultTheme}
                onChange={(event) => updateValue("defaultTheme", event.target.value as SystemSettings["defaultTheme"])}
                className="h-10 w-full rounded-md border border-border bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </SettingCard>

          <SettingCard
            title="Security config"
            description="Keep session lifetime and password guidance visible without adding auth guards."
            icon={LockKeyhole}
          >
            <label className="space-y-2 text-sm font-medium text-card-foreground">
              <span>Session timeout</span>
              <div className="flex items-center gap-3">
                <Input
                  required
                  min={1}
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(event) => updateValue("sessionTimeout", Number(event.target.value))}
                  className="bg-background/55"
                />
                <Badge variant="outline" className="border-sky-400/25 bg-sky-400/10 text-sky-200">
                  minutes
                </Badge>
              </div>
            </label>

            <label className="space-y-2 text-sm font-medium text-card-foreground">
              <span>Password policy</span>
              <Textarea
                required
                value={settings.passwordPolicy}
                onChange={(event) => updateValue("passwordPolicy", event.target.value)}
                placeholder="Minimum 8 characters with letters and numbers."
                className="min-h-36 bg-background/55"
              />
            </label>
          </SettingCard>

          <SettingCard
            title="Notification config"
            description="Choose which channels receive operational admin updates."
            icon={Bell}
          >
            <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-background/45 p-4 text-sm text-card-foreground shadow-inner">
              <span>
                <span className="block font-medium">Email notifications</span>
                <span className="mt-1 block leading-6 text-muted-foreground">Send important system notices by email.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotification}
                onChange={(event) => updateValue("emailNotification", event.target.checked)}
                className="mt-1 h-5 w-5 accent-primary"
              />
            </label>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-background/45 p-4 text-sm text-card-foreground shadow-inner">
              <span>
                <span className="block font-medium">In-app notifications</span>
                <span className="mt-1 block leading-6 text-muted-foreground">Show lightweight updates inside the admin shell.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.inAppNotification}
                onChange={(event) => updateValue("inAppNotification", event.target.checked)}
                className="mt-1 h-5 w-5 accent-primary"
              />
            </label>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
              Active channels: {[settings.emailNotification && "Email", settings.inAppNotification && "In-app"].filter(Boolean).join(" + ") || "None"}
            </div>
          </SettingCard>

          {loading ? (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/45 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-card/90 px-4 py-2 text-sm text-muted-foreground shadow-xl">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading settings
              </div>
            </div>
          ) : null}
        </div>

        <div className="admin-surface flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Route convention: /system/settings</span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void loadSettings()} disabled={loading || submitting}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
            <Button type="submit" disabled={loading || submitting}>
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
