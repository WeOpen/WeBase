import nextVitals from "eslint-config-next/core-web-vitals";

const sourceFileExtensionPattern = /\.(?:[cm]?[jt]sx?|d\.ts)$/;
const kebabCaseFileNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const routeFileNames = new Set([
  "default",
  "error",
  "global-error",
  "layout",
  "loading",
  "middleware",
  "not-found",
  "page",
  "route",
  "template",
]);
const rawInteractiveControls = new Set(["button", "input", "select", "textarea"]);
const serviceFunctionNamePattern =
  /^(?:list|get|create|update|delete|login|logout|refresh|reset|enable|disable|validate)(?:[A-Z][A-Za-z0-9]*)?$/;
const storeHookNamePattern = /^use[A-Z][A-Za-z0-9]*Store$/;
const decorativeCommentPattern =
  /(?:[─━═]{3,}|[-_=]{8,}|^[\s─━═\-_=]*(?:constants|helpers|page|header|sidebar nav|main content|colors|typography|button|badge|chip|avatar|card|input|textarea|select|checkbox|switch|radio group|form field|tabs|accordion|tooltip|progress|spinner|alert|dialog|sheet|confirm dialog|toast|shared dialogs)[\s─━═\-_=]*$)/i;

function normalizeFilePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function isSourceFile(filePath) {
  const normalizedFilePath = normalizeFilePath(filePath);
  return normalizedFilePath.startsWith("src/") || normalizedFilePath.includes("/src/");
}

function isInsidePath(filePath, pathFragment) {
  const normalizedFilePath = normalizeFilePath(filePath);
  return normalizedFilePath.startsWith(`${pathFragment}/`) || normalizedFilePath.includes(`/${pathFragment}/`);
}

function getFileStem(filePath) {
  const fileName = normalizeFilePath(filePath).split("/").pop() ?? "";
  return fileName.replace(/\.d\.ts$/, "").replace(/\.[cm]?[jt]sx?$/, "");
}

function getExportedDeclarationNames(node) {
  const declaration = node.declaration;

  if (!declaration) {
    return [];
  }

  if (
    (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") &&
    declaration.id?.type === "Identifier"
  ) {
    return [declaration.id];
  }

  if (declaration.type === "VariableDeclaration") {
    return declaration.declarations
      .map((item) => item.id)
      .filter((id) => id.type === "Identifier");
  }

  return [];
}

const webasePlugin = {
  rules: {
    "file-name-kebab-case": {
      meta: {
        type: "problem",
        docs: {
          description: "Require source file names to use kebab-case, except framework route files.",
        },
        messages: {
          invalid:
            "Source file name '{{name}}' must use kebab-case. Framework route files like page.tsx and layout.tsx are allowed.",
        },
        schema: [],
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.filename;

            if (!isSourceFile(filePath) || !sourceFileExtensionPattern.test(filePath)) {
              return;
            }

            const fileStem = getFileStem(filePath);

            if (
              routeFileNames.has(fileStem) ||
              fileStem.startsWith("[") ||
              kebabCaseFileNamePattern.test(fileStem)
            ) {
              return;
            }

            context.report({
              node,
              messageId: "invalid",
              data: { name: `${fileStem}${filePath.slice(filePath.lastIndexOf("."))}` },
            });
          },
        };
      },
    },
    "no-decorative-comments": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Disallow decorative banner comments that only divide sections.",
        },
        messages: {
          decorative: "Decorative banner comments are not allowed. Use clear code structure instead.",
        },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode;

        return {
          Program() {
            for (const comment of sourceCode.getAllComments()) {
              if (decorativeCommentPattern.test(comment.value.trim())) {
                context.report({ loc: comment.loc, messageId: "decorative" });
              }
            }
          },
        };
      },
    },
    "no-raw-interactive-controls": {
      meta: {
        type: "problem",
        docs: {
          description: "Require feature code to use local design-system controls.",
        },
        messages: {
          rawControl:
            "Use the local design-system component instead of raw <{{name}}> outside src/components/ui.",
        },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.type !== "JSXIdentifier" || !rawInteractiveControls.has(node.name.name)) {
              return;
            }

            context.report({
              node: node.name,
              messageId: "rawControl",
              data: { name: node.name.name },
            });
          },
        };
      },
    },
    "service-function-verb": {
      meta: {
        type: "problem",
        docs: {
          description: "Require service exports to use approved verb-based names.",
        },
        messages: {
          invalid:
            "Service export '{{name}}' must start with an approved verb: list, get, create, update, delete, login, logout, refresh, reset, enable, disable, or validate.",
        },
        schema: [],
      },
      create(context) {
        const filePath = context.filename;

        if (!isInsidePath(filePath, "src/lib/services")) {
          return {};
        }

        return {
          ExportNamedDeclaration(node) {
            for (const id of getExportedDeclarationNames(node)) {
              if (!serviceFunctionNamePattern.test(id.name)) {
                context.report({
                  node: id,
                  messageId: "invalid",
                  data: { name: id.name },
                });
              }
            }
          },
        };
      },
    },
    "store-hook-name": {
      meta: {
        type: "problem",
        docs: {
          description: "Require Zustand stores to use hook-style useXStore names.",
        },
        messages: {
          invalid: "Store export '{{name}}' must use the hook-style name useXStore.",
        },
        schema: [],
      },
      create(context) {
        const filePath = context.filename;

        if (!isInsidePath(filePath, "src/lib/stores")) {
          return {};
        }

        return {
          ExportNamedDeclaration(node) {
            for (const id of getExportedDeclarationNames(node)) {
              if (!storeHookNamePattern.test(id.name)) {
                context.report({
                  node: id,
                  messageId: "invalid",
                  data: { name: id.name },
                });
              }
            }
          },
        };
      },
    },
  },
};

function restrictedImportPatterns(patterns) {
  return [
    "error",
    {
      patterns,
    },
  ];
}

const eslintConfig = [
  {
    ignores: [
      ".claude/**",
      ".next/**",
      "node_modules/**",
      "thesvg/**",
    ],
  },
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    plugins: {
      webase: webasePlugin,
    },
    rules: {
      "webase/file-name-kebab-case": "error",
      "webase/no-decorative-comments": "error",
      "webase/service-function-verb": "error",
      "webase/store-hook-name": "error",
    },
  },
  {
    files: ["src/app/**/*.{tsx,jsx}", "src/components/**/*.{tsx,jsx}"],
    ignores: ["src/components/ui/**/*"],
    rules: {
      "webase/no-raw-interactive-controls": "error",
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx,js,jsx}"],
    ignores: ["src/components/ui/**/*"],
    rules: {
      "no-restricted-imports": restrictedImportPatterns([
        {
          group: ["@/app", "@/app/*"],
          message: "Components must not import app routes. Pass route data through props or move orchestration to src/app.",
        },
        {
          group: ["@/lib/services", "@/lib/services/*"],
          message: "Components must not import services. Load or mutate data in src/app and pass callbacks/data down.",
        },
      ]),
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": restrictedImportPatterns([
        {
          group: [
            "@/app",
            "@/app/*",
            "@/components/auth/*",
            "@/components/dashboard/*",
            "@/components/data-table/*",
            "@/components/layout/*",
            "@/components/system/*",
            "@/lib/api",
            "@/lib/api/*",
            "@/lib/navigation",
            "@/lib/navigation/*",
            "@/lib/services",
            "@/lib/services/*",
            "@/lib/stores",
            "@/lib/stores/*",
          ],
          message: "UI primitives must stay generic and must not import app, feature, API, navigation, service, or store layers.",
        },
      ]),
    },
  },
  {
    files: ["src/lib/services/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": restrictedImportPatterns([
        {
          group: [
            "@/app",
            "@/app/*",
            "@/components",
            "@/components/*",
            "@/lib/navigation",
            "@/lib/navigation/*",
            "@/lib/stores",
            "@/lib/stores/*",
          ],
          message: "Services must stay API-facing and must not import app, component, navigation, or store layers.",
        },
      ]),
    },
  },
  {
    files: ["src/lib/api/**/*.{ts,tsx,js,jsx}", "src/lib/navigation/**/*.{ts,tsx,js,jsx}", "src/lib/stores/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": restrictedImportPatterns([
        {
          group: ["@/app", "@/app/*", "@/components", "@/components/*", "@/lib/services", "@/lib/services/*"],
          message: "Shared lib infrastructure must not import app, component, or service layers.",
        },
      ]),
    },
  },
];

export default eslintConfig;
