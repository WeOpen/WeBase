"use client";

import { Bell, CheckCircle2, MousePointerClick, ShieldCheck } from "lucide-react";
import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

const roleOptions = [
  { label: "Owner", value: "owner" },
  { label: "Operator", value: "operator" },
  { label: "Auditor", value: "auditor" },
];

const channelOptions = [
  {
    label: "Email digest",
    value: "email",
    description: "Send a daily operational summary to configured admins.",
  },
  {
    label: "In-app inbox",
    value: "in-app",
    description: "Keep updates inside the admin shell notification center.",
  },
  {
    label: "Security stream",
    value: "security",
    description: "Highlight policy and access events for reviewers.",
  },
];

function ShowcaseCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-surface overflow-hidden p-5">
      <div className="flex items-start gap-4 border-b border-border/70 pb-5 dark:border-white/[0.06]">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border/50 bg-muted/50 text-orange-500 shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
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

export default function ComponentsPage() {
  const { toast } = useToast();
  const [role, setRole] = React.useState("operator");
  const [channel, setChannel] = React.useState("email");
  const [enabled, setEnabled] = React.useState(true);
  const [checked, setChecked] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [sampleName, setSampleName] = React.useState("WeBase Admin");
  const [sampleNotes, setSampleNotes] = React.useState(
    "Reusable components stay calm, compact, and accessible.",
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">
              System / Components
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
              Component gallery
            </h1>
          </div>
          <Badge variant="outline" className="w-fit bg-muted/40 text-muted-foreground">
            Full custom UI coverage
          </Badge>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ShowcaseCard
            title="Form controls"
            description="Native fields wrapped with consistent labels, helper text, and orange focus states."
            icon={ShieldCheck}
          >
            <FormField
              label="Workspace name"
              description="Input stays controlled so previews mirror production form behavior."
              htmlFor="component-name"
            >
              <Input
                id="component-name"
                value={sampleName}
                onChange={(event) => setSampleName(event.target.value)}
                placeholder="Enter workspace name"
              />
            </FormField>

            <FormField
              label="Component notes"
              description="Textarea supports longer controlled copy without changing the compact layout."
              htmlFor="component-notes"
            >
              <Textarea
                id="component-notes"
                value={sampleNotes}
                onChange={(event) => setSampleNotes(event.target.value)}
                placeholder="Describe the component behavior"
              />
            </FormField>

            <FormField
              label="Default access role"
              description="Select keeps browser semantics while matching admin-surface layers."
              htmlFor="component-role"
            >
              <Select
                id="component-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <label className="flex items-start justify-between gap-4 rounded-2xl border border-border/50 bg-muted/40 p-4 text-sm shadow-inner dark:border-white/[0.06] dark:bg-white/[0.04]">
              <span>
                <span className="block font-medium text-card-foreground">Require review</span>
                <span className="mt-1 block leading-6 text-muted-foreground">
                  Checkbox state is currently {checked ? "enabled" : "disabled"} for {role} previews.
                </span>
              </span>
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                aria-label="Require review"
                className="mt-1"
              />
            </label>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <div>
                <p className="text-sm font-medium text-card-foreground">Live component flag</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Switches expose controlled state through accessible button semantics.
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Live component flag" />
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            title="Choice controls"
            description="Radio groups make scoped decisions clear without adding a custom dependency."
            icon={MousePointerClick}
          >
            <RadioGroup
              name="component-channel"
              value={channel}
              options={channelOptions}
              onValueChange={setChannel}
              aria-label="Notification channel"
            />
            <div className="rounded-2xl border border-orange-200/50 bg-orange-50/80 p-4 text-sm leading-6 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
              Selected channel: <span className="font-semibold">{channel}</span>
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            title="Feedback"
            description="Buttons, badges, and toast variants keep operational feedback compact and consistent."
            icon={Bell}
          >
            <div className="flex flex-wrap gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <Button>Default button</Button>
              <Button variant="outline">Outline button</Button>
              <Button variant="destructive">Destructive button</Button>
              <Button disabled>Disabled button</Button>
            </div>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-border/50 bg-muted/40 p-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
              <Badge>default</Badge>
              <Badge variant="outline" className="bg-background/60 text-muted-foreground">
                outline
              </Badge>
              <Badge variant="destructive">destructive</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: "Component note queued",
                    description: "Default toast confirms a neutral admin event.",
                  })
                }
              >
                Default toast
              </Button>
              <Button
                onClick={() =>
                  toast({
                    title: "Preview saved",
                    description: "Success styling uses the WeBase orange accent.",
                    variant: "success",
                  })
                }
              >
                Success toast
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  toast({
                    title: "Validation preview failed",
                    description: "Destructive feedback is reserved for attention-worthy states.",
                    variant: "destructive",
                  })
                }
              >
                Destructive toast
              </Button>
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            title="Dialogs and panels"
            description="Dialog, confirmation, and sheet primitives keep focused interactions accessible."
            icon={CheckCircle2}
          >
            <div className="rounded-2xl border border-border/50 bg-card/60 p-4 text-sm leading-6 text-muted-foreground dark:border-white/[0.06] dark:bg-white/[0.03]">
              Open product-safe overlays. These previews acknowledge UI review only and do not mutate mock data.
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
              <Button variant="outline" onClick={() => setSheetOpen(true)}>
                Open sheet
              </Button>
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                Open confirmation
              </Button>
            </div>
          </ShowcaseCard>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Standard dialog preview">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>This dialog demonstrates the base accessible modal primitive.</p>
            <Button onClick={() => setDialogOpen(false)}>Close dialog</Button>
          </div>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="Admin sheet preview">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Sheets keep supporting details available without leaving the current page.</p>
            <Button onClick={() => setSheetOpen(false)}>Close sheet</Button>
          </div>
        </Sheet>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Approve component preview?"
          description="This confirms the showcase interaction only. No users, roles, menus, or settings will be changed."
          confirmLabel="Approve preview"
          cancelLabel="Keep reviewing"
          onConfirm={() => {
            setConfirmOpen(false);
            toast({
              title: "Preview approved",
              description: "Confirmation flow completed without changing product data.",
              variant: "success",
            });
          }}
        />
      </div>
    </AppShell>
  );
}
