"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Layers,
  MousePointerClick,
  Palette,
  Sparkles,
  Type,
  UserRound,
} from "lucide-react";
import * as React from "react";

import { Accordion } from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { CodeBlock } from "@/components/ui/code-block";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { id: "colors", label: "色彩", icon: Palette },
  { id: "typography", label: "字体", icon: Type },
  { id: "button", label: "Button", icon: Layers },
  { id: "badge", label: "Badge", icon: Layers },
  { id: "chip", label: "Chip", icon: Layers },
  { id: "avatar", label: "Avatar", icon: Layers },
  { id: "card", label: "Card", icon: Layers },
  { id: "input", label: "Input", icon: Layers },
  { id: "textarea", label: "Textarea", icon: Layers },
  { id: "select", label: "Select", icon: Layers },
  { id: "checkbox", label: "Checkbox", icon: Layers },
  { id: "switch", label: "Switch", icon: Layers },
  { id: "radio", label: "RadioGroup", icon: Layers },
  { id: "formfield", label: "FormField", icon: Layers },
  { id: "tabs", label: "Tabs", icon: Layers },
  { id: "accordion", label: "Accordion", icon: Layers },
  { id: "tooltip", label: "Tooltip", icon: Layers },
  { id: "progress", label: "Progress", icon: Layers },
  { id: "spinner", label: "Spinner", icon: Layers },
  { id: "alert", label: "Alert", icon: Layers },
  { id: "dialog", label: "Dialog", icon: Layers },
  { id: "sheet", label: "Sheet", icon: Layers },
  { id: "confirm", label: "ConfirmDialog", icon: Layers },
  { id: "toast", label: "Toast", icon: Layers },
] as const;

const ROLE_OPTIONS = [
  { label: "Owner", value: "owner" },
  { label: "Operator", value: "operator" },
  { label: "Auditor", value: "auditor" },
];

const CHANNEL_OPTIONS = [
  { label: "Email digest", value: "email", description: "Daily summary to configured admins." },
  { label: "In-app inbox", value: "in-app", description: "Updates inside the admin shell." },
  { label: "Security stream", value: "security", description: "Policy and access events for reviewers." },
];

const SEMANTIC_COLORS = [
  { name: "primary", var: "--primary", fg: "--primary-foreground", label: "Primary" },
  { name: "secondary", var: "--secondary", fg: "--secondary-foreground", label: "Secondary" },
  { name: "muted", var: "--muted", fg: "--muted-foreground", label: "Muted" },
  { name: "accent", var: "--accent", fg: "--accent-foreground", label: "Accent" },
  { name: "destructive", var: "--destructive", fg: null, label: "Destructive" },
  { name: "card", var: "--card", fg: "--card-foreground", label: "Card" },
  { name: "background", var: "--background", fg: "--foreground", label: "Background" },
];

const BRAND_COLORS = [
  { name: "orange-500", class: "bg-orange-500", text: "text-white" },
  { name: "orange-400", class: "bg-orange-400", text: "text-white" },
  { name: "orange-600", class: "bg-orange-600", text: "text-white" },
  { name: "orange-100", class: "bg-orange-100", text: "text-orange-700" },
  { name: "orange-50", class: "bg-orange-50", text: "text-orange-600" },
];

const FONT_SIZES = [
  { name: "text-xs", size: "0.75rem", sample: "管理后台 12px" },
  { name: "text-sm", size: "0.875rem", sample: "管理后台 14px" },
  { name: "text-base", size: "1rem", sample: "管理后台 16px" },
  { name: "text-lg", size: "1.125rem", sample: "管理后台 18px" },
  { name: "text-xl", size: "1.25rem", sample: "管理后台 20px" },
  { name: "text-2xl", size: "1.5rem", sample: "管理后台 24px" },
  { name: "text-3xl", size: "1.875rem", sample: "管理后台 30px" },
];

function SectionTitle({
  id,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-500">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ComponentSection({
  id,
  title,
  description,
  children,
  code,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  code?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
        {children}
      </div>
      {code && <CodeBlock code={code} />}
    </div>
  );
}

export default function DesignSystemPage() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = React.useState("colors");

  const [role, setRole] = React.useState("operator");
  const [channel, setChannel] = React.useState("email");
  const [enabled, setEnabled] = React.useState(true);
  const [checked, setChecked] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [sampleText, setSampleText] = React.useState("WeBase Admin");
  const [sampleArea, setSampleArea] = React.useState("Reusable components stay calm and compact.");
  const [progressValue, setProgressValue] = React.useState(68);
  const [chips, setChips] = React.useState(["用户管理", "角色权限", "菜单管理"]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    for (const section of NAV_SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <AppShell>
      <div className="flex gap-6">
        <nav className="sticky top-20 hidden h-fit w-44 shrink-0 lg:block">
          <div className="space-y-0.5">
            {NAV_SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active ? "bg-orange-500/10 font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{section.label}</span>
                  {active && <ChevronRight className="ml-auto h-3 w-3 text-orange-500" />}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="min-w-0 flex-1 space-y-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400">System / Design System</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Design System</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              WeBase 管理后台完整设计系统，包含色彩、字体和全部 UI 组件的变体、用法与代码示例。参考 HeroUI 设计语言。
            </p>
          </div>

          <section className="space-y-6">
            <SectionTitle id="colors" title="色彩" description="语义化色彩令牌与品牌色板，支持亮色/暗色主题自动切换。" icon={Palette} />
            <ComponentSection
              id="colors-semantic"
              title="语义色板"
              description="通过 CSS 变量定义的语义色彩，自动适配暗色模式。"
              code={`/* globals.css — :root / .dark */\n--primary: oklch(0.205 0 0);\n--destructive: oklch(0.58 0.22 27);\n--muted-foreground: oklch(0.5 0 0);`}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {SEMANTIC_COLORS.map((color) => (
                  <div key={color.name} className="space-y-2">
                    <div className="flex h-16 items-end rounded-xl border border-border/50 p-3 dark:border-white/[0.06]" style={{ backgroundColor: `var(${color.var})` }}>
                      <span className="text-xs font-medium" style={{ color: color.fg ? `var(${color.fg})` : "#fff" }}>{color.label}</span>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground">{color.var}</p>
                  </div>
                ))}
              </div>
            </ComponentSection>
            <ComponentSection
              id="colors-brand"
              title="品牌色"
              description="WeBase 使用橙色作为品牌强调色，用于关键操作和高亮。"
              code={`/* Tailwind classes */\nbg-orange-500   text-orange-500\nbg-orange-400   border-orange-500/20`}
            >
              <div className="flex flex-wrap gap-3">
                {BRAND_COLORS.map((color) => (
                  <div key={color.name} className="space-y-2 text-center">
                    <div className={cn("h-16 w-20 rounded-xl", color.class, color.text, "flex items-center justify-center text-xs font-medium")}>Aa</div>
                    <p className="font-mono text-[11px] text-muted-foreground">{color.name}</p>
                  </div>
                ))}
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="typography" title="字体排版" description="基于 HarmonyOS Sans 的字体栈，配合系统字体回退。" icon={Type} />
            <ComponentSection
              id="typography-scale"
              title="字号层级"
              description="使用 Tailwind CSS 的标准字号，保持紧凑的后台排版节奏。"
              code={`--font-sans: "HarmonyOS Sans", "PingFang SC",\n  "Microsoft YaHei", sans-serif;\n\ntext-xs    // 12px — labels\n\ntext-sm    // 14px — body\n\ntext-base  // 16px — default`}
            >
              <div className="space-y-3">
                {FONT_SIZES.map((fs) => (
                  <div key={fs.name} className="flex items-baseline gap-4 border-b border-border/30 pb-3 dark:border-white/[0.04]">
                    <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">{fs.name}</span>
                    <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground/60">{fs.size}</span>
                    <span className={cn(fs.name, "text-foreground")}>{fs.sample}</span>
                  </div>
                ))}
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="button" title="Button 按钮" description="触发操作的交互元素，提供多种变体和尺寸。" icon={Layers} />
            <ComponentSection
              id="button-variants"
              title="变体"
              description="五种语义变体：default、secondary、ghost、outline、destructive。"
              code={`<Button>Default</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="destructive">Destructive</Button>`}
            >
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </ComponentSection>
            <ComponentSection
              id="button-sizes"
              title="尺寸"
              description="四种尺寸：sm、default、lg、icon。"
              code={`<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon"><Sparkles /></Button>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Sparkles className="h-4 w-4" /></Button>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="badge" title="Badge 徽标" description="状态标记、标签和计数的紧凑元素。" icon={Layers} />
            <ComponentSection
              id="badge-variants"
              title="变体"
              description="default、secondary、outline、destructive。"
              code={`<Badge>Default</Badge>\n<Badge variant="secondary">Secondary</Badge>\n<Badge variant="outline">Outline</Badge>\n<Badge variant="destructive">Destructive</Badge>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="chip" title="Chip 标签" description="比 Badge 更丰富的标签组件，支持关闭、图标和多种颜色。" icon={Layers} />
            <ComponentSection
              id="chip-variants"
              title="变体与尺寸"
              description="五种颜色变体（default、secondary、success、warning、danger），三种尺寸（sm、md、lg）。"
              code={`<Chip>Default</Chip>\n<Chip variant="success">Success</Chip>\n<Chip variant="warning">Warning</Chip>\n<Chip variant="danger">Danger</Chip>\n<Chip isClosable onClose={() => {}}>Closable</Chip>`}
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip>Default</Chip>
                  <Chip variant="secondary">Secondary</Chip>
                  <Chip variant="success">Success</Chip>
                  <Chip variant="warning">Warning</Chip>
                  <Chip variant="danger">Danger</Chip>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm">Small</Chip>
                  <Chip size="md">Medium</Chip>
                  <Chip size="lg">Large</Chip>
                  <Chip isClosable onClose={() => toast({ title: "标签已移除" })}>可关闭</Chip>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {chips.map((chip) => (
                    <Chip
                      key={chip}
                      variant="success"
                      isClosable
                      onClose={() => setChips((prev) => prev.filter((c) => c !== chip))}
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="avatar" title="Avatar 头像" description="用户头像展示，支持图片、文字回退和多种颜色。" icon={UserRound} />
            <ComponentSection
              id="avatar-sizes"
              title="尺寸与颜色"
              description="四种尺寸（sm、md、lg、xl），六种颜色变体。图片加载失败自动显示首字母回退。"
              code={`<Avatar name="Admin User" size="sm" />\n<Avatar name="Admin User" size="md" color="success" />\n<Avatar name="Admin User" size="lg" color="warning" />\n<Avatar name="Admin User" size="xl" isBordered />`}
            >
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <Avatar name="Admin" size="sm" />
                  <Avatar name="Admin User" size="md" />
                  <Avatar name="Admin User" size="lg" />
                  <Avatar name="Admin User" size="xl" />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name="Default" color="default" />
                  <Avatar name="Primary" color="primary" />
                  <Avatar name="Success" color="success" />
                  <Avatar name="Warning" color="warning" />
                  <Avatar name="Danger" color="danger" />
                  <Avatar name="Bordered User" isBordered color="success" />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar src="https://i.pravatar.cc/150?u=admin" name="Admin" size="lg" />
                  <Avatar src="https://invalid-url.test/broken.jpg" name="Fallback User" size="lg" color="warning" />
                  <span className="text-xs text-muted-foreground">← 图片加载失败自动显示首字母</span>
                </div>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="card" title="Card 卡片" description="复合组件模式的卡片容器，支持 Header/Title/Description/Body/Footer 子组件。" icon={Layers} />
            <ComponentSection
              id="card-variants"
              title="变体与交互"
              description="三种变体（default、outlined、flat），支持 isHoverable 和 isPressable 交互效果。"
              code={`<Card variant="default" isHoverable>\n  <Card.Header>\n    <Card.Title>标题</Card.Title>\n    <Card.Description>描述信息</Card.Description>\n  </Card.Header>\n  <Card.Body>内容</Card.Body>\n  <Card.Footer>\n    <Button size="sm">操作</Button>\n  </Card.Footer>\n</Card>`}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card isHoverable>
                  <Card.Header>
                    <Card.Title>默认卡片</Card.Title>
                    <Card.Description>hover 时阴影加深</Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-sm text-muted-foreground">这是 Card.Body 区域的内容。</p>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm" variant="outline">查看</Button>
                  </Card.Footer>
                </Card>
                <Card variant="outlined">
                  <Card.Header>
                    <Card.Title>描边卡片</Card.Title>
                    <Card.Description>无背景色的描边变体</Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-sm text-muted-foreground">适合嵌套在有色背景上。</p>
                  </Card.Body>
                </Card>
                <Card variant="flat" isPressable onClick={() => toast({ title: "卡片被点击", variant: "success" })}>
                  <Card.Header>
                    <Card.Title>扁平卡片</Card.Title>
                    <Card.Description>点击试试看</Card.Description>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-sm text-muted-foreground">isPressable 提供按压缩放效果。</p>
                  </Card.Body>
                </Card>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="input" title="Input 输入框" description="单行文本输入，支持所有原生 input 属性。" icon={Layers} />
            <ComponentSection
              id="input-default"
              title="基础用法"
              description="受控组件，支持 placeholder 和 disabled。"
              code={`<Input value={value} onChange={...} placeholder="请输入" />\n<Input disabled placeholder="禁用状态" />`}
            >
              <div className="max-w-md space-y-3">
                <Input value={sampleText} onChange={(e) => setSampleText(e.target.value)} placeholder="请输入内容" />
                <Input disabled placeholder="禁用状态" />
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="textarea" title="Textarea 文本域" description="多行文本输入，支持拖拽调整高度。" icon={Layers} />
            <ComponentSection id="textarea-default" title="基础用法" description="受控模式，min-h-24 确保最小高度。" code={`<Textarea value={notes} onChange={...} placeholder="备注" />`}>
              <div className="max-w-md">
                <Textarea value={sampleArea} onChange={(e) => setSampleArea(e.target.value)} placeholder="请输入备注" />
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="select" title="Select 下拉选择" description="自定义下拉选择组件，支持亮色/暗色主题，橙色高亮选中项。" icon={Layers} />
            <ComponentSection
              id="select-default"
              title="基础用法"
              description="复合组件模式：Select + Select.Content + Select.Option，选中项带橙色对勾。"
              code={`<Select value={value} onValueChange={setValue}>\n  <Select.Content>\n    <Select.Option value="owner">Owner</Select.Option>\n    <Select.Option value="operator">Operator</Select.Option>\n  </Select.Content>\n</Select>`}
            >
              <div className="max-w-xs space-y-2">
                <Select value={role} onValueChange={setRole}>
                  <Select.Content>
                    {ROLE_OPTIONS.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>{opt.label}</Select.Option>
                    ))}
                  </Select.Content>
                </Select>
                <p className="text-xs text-muted-foreground">当前：<span className="font-medium text-foreground">{role}</span></p>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="checkbox" title="Checkbox 复选框" description="原生复选框，accent-orange-500 匹配品牌色。" icon={Layers} />
            <ComponentSection id="checkbox-default" title="基础用法" description="受控组件，通过 checked + onChange 管理状态。" code={`<Checkbox checked={checked} onChange={...} />`}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                <span>同意服务条款（{checked ? "已勾选" : "未勾选"}）</span>
              </label>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="switch" title="Switch 开关" description="二态切换控件，role=switch 语义。" icon={Layers} />
            <ComponentSection id="switch-default" title="基础用法" description="橙色激活态，圆形滑块带平滑过渡。" code={`<Switch checked={enabled} onCheckedChange={setEnabled} />`}>
              <div className="flex items-center gap-4">
                <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="启用通知" />
                <span className="text-sm text-muted-foreground">状态：<span className="font-medium text-foreground">{enabled ? "已启用" : "已禁用"}</span></span>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="radio" title="RadioGroup 单选组" description="带描述卡片样式的单选组。" icon={Layers} />
            <ComponentSection id="radio-default" title="基础用法" description="通过 options 数组传入，支持 label + description。" code={`<RadioGroup name="channel" value={channel}\n  options={options} onValueChange={setChannel} />`}>
              <div className="max-w-md space-y-3">
                <RadioGroup name="ds-channel" value={channel} options={CHANNEL_OPTIONS} onValueChange={setChannel} />
                <p className="text-xs text-muted-foreground">渠道：<span className="font-medium text-foreground">{channel}</span></p>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="formfield" title="FormField 表单字段" description="统一的标签、描述和错误信息布局。" icon={Layers} />
            <ComponentSection id="formfield-default" title="基础用法" description="包装任意表单控件，自动处理标签关联和错误提示。" code={`<FormField label="名称" description="描述" htmlFor="name">\n  <Input id="name" />\n</FormField>`}>
              <div className="max-w-md space-y-4">
                <FormField label="工作区名称" description="用于标识当前管理空间" htmlFor="ds-ws">
                  <Input id="ds-ws" value={sampleText} onChange={(e) => setSampleText(e.target.value)} />
                </FormField>
                <FormField label="邮箱地址" error="请输入有效的邮箱格式" htmlFor="ds-email">
                  <Input id="ds-email" placeholder="admin@example.com" />
                </FormField>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="tabs" title="Tabs 标签页" description="复合组件模式，支持 underline 和 pill 两种变体，带滑动指示器动画。" icon={Layers} />
            <ComponentSection
              id="tabs-default"
              title="下划线变体"
              description="默认变体，橙色下划线指示器在选中项之间平滑过渡。"
              code={`<Tabs defaultActiveKey="tab1">\n  <Tabs.List>\n    <Tabs.Tab tabKey="tab1">标签一</Tabs.Tab>\n    <Tabs.Tab tabKey="tab2">标签二</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel panelKey="tab1">内容一</Tabs.Panel>\n  <Tabs.Panel panelKey="tab2">内容二</Tabs.Panel>\n</Tabs>`}
            >
              <Tabs defaultActiveKey="overview">
                <Tabs.List>
                  <Tabs.Tab tabKey="overview">概览</Tabs.Tab>
                  <Tabs.Tab tabKey="analytics">分析</Tabs.Tab>
                  <Tabs.Tab tabKey="settings">设置</Tabs.Tab>
                  <Tabs.Tab tabKey="disabled" isDisabled>禁用</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel panelKey="overview">
                  <p className="text-sm text-muted-foreground">概览面板内容 — 默认选中项。</p>
                </Tabs.Panel>
                <Tabs.Panel panelKey="analytics">
                  <p className="text-sm text-muted-foreground">分析面板内容 — 查看数据趋势和指标。</p>
                </Tabs.Panel>
                <Tabs.Panel panelKey="settings">
                  <p className="text-sm text-muted-foreground">设置面板内容 — 配置系统参数。</p>
                </Tabs.Panel>
              </Tabs>
            </ComponentSection>
            <ComponentSection
              id="tabs-pill"
              title="胶囊变体"
              description="pill 变体，选中项以圆角背景高亮，适合工具栏场景。"
              code={`<Tabs variant="pill" defaultActiveKey="tab1">`}>
              <Tabs variant="pill" defaultActiveKey="users">
                <Tabs.List>
                  <Tabs.Tab tabKey="users">用户</Tabs.Tab>
                  <Tabs.Tab tabKey="roles">角色</Tabs.Tab>
                  <Tabs.Tab tabKey="menus">菜单</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel panelKey="users"><p className="text-sm text-muted-foreground">用户管理面板。</p></Tabs.Panel>
                <Tabs.Panel panelKey="roles"><p className="text-sm text-muted-foreground">角色权限面板。</p></Tabs.Panel>
                <Tabs.Panel panelKey="menus"><p className="text-sm text-muted-foreground">菜单配置面板。</p></Tabs.Panel>
              </Tabs>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="accordion" title="Accordion 折叠面板" description="复合组件，支持 default、bordered、splitted 三种变体，单选/多选模式。" icon={Layers} />
            <ComponentSection
              id="accordion-default"
              title="默认变体"
              description="带分隔线的内联折叠面板，支持多选展开。"
              code={`<Accordion defaultExpandedKeys=["a1"]>\n  <Accordion.Item itemKey="a1" title="标题">\n    内容\n  </Accordion.Item>\n</Accordion>`}
            >
              <Accordion defaultExpandedKeys={["a1"]}>
                <Accordion.Item itemKey="a1" title="什么是 WeBase？" subtitle="基础概念">
                  WeBase 是一个基于 Next.js + Tailwind CSS 的管理后台前端模板，提供完整的用户、角色、菜单和系统设置管理功能。
                </Accordion.Item>
                <Accordion.Item itemKey="a2" title="如何自定义主题？" subtitle="主题配置">
                  通过修改 globals.css 中的 CSS 变量即可自定义色彩、圆角等设计令牌。暗色模式通过 .dark 类自动切换。
                </Accordion.Item>
                <Accordion.Item itemKey="a3" title="支持哪些组件？" subtitle="组件库">
                  包含 Button、Badge、Card、Tabs、Accordion、Avatar、Tooltip、Progress、Spinner、Alert、Chip 等 20+ 组件。
                </Accordion.Item>
              </Accordion>
            </ComponentSection>
            <ComponentSection
              id="accordion-bordered"
              title="边框变体"
              description="每个面板独立带边框，视觉分离更清晰。"
              code={`<Accordion variant="bordered">`}>
              <Accordion variant="bordered">
                <Accordion.Item itemKey="b1" title="会话管理">
                  用户登录后会话信息存储在 localStorage 中，支持记住登录状态。
                </Accordion.Item>
                <Accordion.Item itemKey="b2" title="权限控制">
                  基于角色的访问控制，通过 AuthGuard 组件实现路由级别的权限保护。
                </Accordion.Item>
              </Accordion>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="tooltip" title="Tooltip 提示" description="悬停时显示的上下文信息，支持四个方向。" icon={Layers} />
            <ComponentSection
              id="tooltip-default"
              title="方向与延迟"
              description="支持 top、bottom、left、right 四个方向，可配置显示延迟。"
              code={`<Tooltip content="提示内容" placement="top">\n  <Button>悬停查看</Button>\n</Tooltip>`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip content="顶部提示" placement="top">
                  <Button variant="outline" size="sm">Top</Button>
                </Tooltip>
                <Tooltip content="底部提示" placement="bottom">
                  <Button variant="outline" size="sm">Bottom</Button>
                </Tooltip>
                <Tooltip content="左侧提示" placement="left">
                  <Button variant="outline" size="sm">Left</Button>
                </Tooltip>
                <Tooltip content="右侧提示" placement="right">
                  <Button variant="outline" size="sm">Right</Button>
                </Tooltip>
                <Tooltip content="延迟 800ms 显示" delay={800}>
                  <Button variant="ghost" size="sm">延迟提示</Button>
                </Tooltip>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="progress" title="Progress 进度条" description="进度指示器，支持确定和不确定两种模式。" icon={Layers} />
            <ComponentSection
              id="progress-default"
              title="尺寸与颜色"
              description="三种尺寸、五种颜色，支持标签和百分比显示。"
              code={`<Progress value={68} color="success" label="CPU" showValueLabel />\n<Progress isIndeterminate color="warning" />`}
            >
              <div className="max-w-md space-y-5">
                <Progress value={progressValue} color="default" label="存储空间" showValueLabel />
                <Progress value={85} color="success" label="API 可用性" showValueLabel />
                <Progress value={42} color="warning" label="队列负载" showValueLabel />
                <Progress value={12} color="danger" label="磁盘剩余" showValueLabel />
                <Progress isIndeterminate color="primary" label="同步中..." />
                <div className="flex items-center gap-3 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setProgressValue((v) => Math.max(0, v - 10))}>-10</Button>
                  <span className="w-12 text-center font-mono text-sm">{progressValue}%</span>
                  <Button size="sm" variant="outline" onClick={() => setProgressValue((v) => Math.min(100, v + 10))}>+10</Button>
                </div>
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="spinner" title="Spinner 加载" description="加载指示器，四种尺寸五种颜色。" icon={Layers} />
            <ComponentSection
              id="spinner-default"
              title="尺寸与颜色"
              description="纯 CSS 动画，无 JavaScript 驱动。"
              code={`<Spinner size="sm" />\n<Spinner size="md" color="primary" label="加载中" />\n<Spinner size="lg" color="success" />\n<Spinner size="xl" color="danger" />`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
                <div className="flex items-center gap-4">
                  <Spinner size="md" color="default" />
                  <Spinner size="md" color="primary" />
                  <Spinner size="md" color="success" />
                  <Spinner size="md" color="warning" />
                  <Spinner size="md" color="danger" />
                </div>
                <Spinner size="lg" color="primary" label="正在加载数据..." />
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="alert" title="Alert 警告" description="四种语义的警告/提示横幅，支持标题、描述和关闭按钮。" icon={Layers} />
            <ComponentSection
              id="alert-variants"
              title="变体"
              description="default（中性）、success（成功）、warning（警告）、danger（危险）。"
              code={`<Alert variant="default" title="提示" description="操作说明" />\n<Alert variant="success" title="成功" description="数据已保存" />\n<Alert variant="warning" title="警告" description="请检查配置" />\n<Alert variant="danger" title="错误" description="操作失败" isClosable />`}
            >
              <div className="space-y-3">
                <Alert variant="default" title="系统提示" description="新版本 v2.1 已发布，请查看更新日志了解详情。" />
                <Alert variant="success" title="操作成功" description="用户信息已更新，变更将在下次登录时生效。" />
                <Alert variant="warning" title="注意" description="当前会话将在 10 分钟后过期，请及时保存工作。" />
                <Alert variant="danger" title="操作失败" description="无法连接到数据库，请检查网络配置后重试。" isClosable onClose={() => toast({ title: "警告已关闭" })} />
              </div>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="dialog" title="Dialog 对话框" description="模态对话框，支持焦点陷阱和 ESC 关闭。" icon={Layers} />
            <ComponentSection id="dialog-default" title="基础用法" description="通过 open + onOpenChange 控制显隐。" code={`<Dialog open={open} onOpenChange={setOpen} title="标题">\n  内容\n</Dialog>`}>
              <Button onClick={() => setDialogOpen(true)}>打开对话框</Button>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="sheet" title="Sheet 侧边抽屉" description="从侧边滑入的面板，不离开当前页面。" icon={Layers} />
            <ComponentSection id="sheet-default" title="基础用法" description="支持 left/right 方向。" code={`<Sheet open={open} onOpenChange={setOpen} title="详情">\n  内容\n</Sheet>`}>
              <Button variant="outline" onClick={() => setSheetOpen(true)}>打开侧边抽屉</Button>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="confirm" title="ConfirmDialog 确认" description="基于 Dialog 的确认弹窗，带警告样式。" icon={Layers} />
            <ComponentSection id="confirm-default" title="基础用法" description="传入 title、description、confirmLabel 和 onConfirm 回调。" code={`<ConfirmDialog open={open} title="确认？"\n  description="此操作不可撤销"\n  onConfirm={handleConfirm} />`}>
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>打开确认弹窗</Button>
            </ComponentSection>
          </section>

          <section className="space-y-6">
            <SectionTitle id="toast" title="Toast 消息" description="右上角浮层通知，4.2 秒自动消失。" icon={Layers} />
            <ComponentSection id="toast-variants" title="变体" description="default（中性）、success（成功）、destructive（错误）。" code={`toast({ title: "成功", variant: "success" });\ntoast({ title: "失败", variant: "destructive" });`}>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => toast({ title: "默认通知", description: "中性消息提示。" })}>Default</Button>
                <Button onClick={() => toast({ title: "操作成功", description: "数据已保存。", variant: "success" })}>Success</Button>
                <Button variant="destructive" onClick={() => toast({ title: "操作失败", description: "请检查参数。", variant: "destructive" })}>Destructive</Button>
              </div>
            </ComponentSection>
          </section>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="对话框示例">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Dialog 组件交互示例，支持焦点陷阱和 ESC 关闭。</p>
              <Button onClick={() => setDialogOpen(false)}>关闭</Button>
            </div>
          </Dialog>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title="侧边抽屉示例">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Sheet 组件交互示例，从右侧滑入。</p>
              <Button onClick={() => setSheetOpen(false)}>关闭</Button>
            </div>
          </Sheet>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="确认操作？"
            description="确认对话框示例，点击确认后触发回调。"
            confirmLabel="确认"
            cancelLabel="取消"
            onConfirm={() => { setConfirmOpen(false); toast({ title: "已确认", variant: "success" }); }}
          />
        </div>
      </div>
    </AppShell>
  );
}
