import { ESLint } from "eslint";

const eslint = new ESLint({ overrideConfigFile: "eslint.config.mjs" });

const cases = [
  {
    name: "component files use kebab-case and no raw controls",
    filePath: "src/components/BadWidget.tsx",
    code: "export function BadWidget() { return <button type=\"button\">Save</button>; }",
    expectedRuleIds: ["webase/file-name-kebab-case", "webase/no-raw-interactive-controls"],
  },
  {
    name: "components do not import services",
    filePath: "src/components/user-widget.tsx",
    code: "import { listUsers } from \"@/lib/services/user-service\";\nexport function UserWidget() { return null; }",
    expectedRuleIds: ["no-restricted-imports"],
  },
  {
    name: "ui primitives do not import business data",
    filePath: "src/components/ui/rogue.tsx",
    code: "import { users } from \"@/lib/api/mock-data\";\nexport function Rogue() { return null; }",
    expectedRuleIds: ["no-restricted-imports"],
  },
  {
    name: "service exports use approved verb names",
    filePath: "src/lib/services/bad-service.ts",
    code: "export async function fetchThing() { return null; }",
    expectedRuleIds: ["webase/service-function-verb"],
  },
  {
    name: "stores use hook-style store names",
    filePath: "src/lib/stores/bad-store.ts",
    code: "export const authStore = null;",
    expectedRuleIds: ["webase/store-hook-name"],
  },
  {
    name: "decorative source comments are rejected",
    filePath: "src/components/comment-demo.tsx",
    code: "/* ───── helpers ───── */\nexport function CommentDemo() { return null; }",
    expectedRuleIds: ["webase/no-decorative-comments"],
  },
];

let failures = 0;

for (const testCase of cases) {
  const [result] = await eslint.lintText(testCase.code, { filePath: testCase.filePath });
  const ruleIds = new Set(result.messages.map((message) => message.ruleId));
  const missingRuleIds = testCase.expectedRuleIds.filter((ruleId) => !ruleIds.has(ruleId));

  if (missingRuleIds.length > 0) {
    failures += 1;
    console.error(`FAIL ${testCase.name}`);
    console.error(`  Missing: ${missingRuleIds.join(", ")}`);
    console.error(`  Actual: ${[...ruleIds].filter(Boolean).join(", ") || "(none)"}`);
  }
}

if (failures > 0) {
  process.exitCode = 1;
} else {
  console.log(`PASS ${cases.length} lint standard checks`);
}
