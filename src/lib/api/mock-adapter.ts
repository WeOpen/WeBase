import {
  activityItems,
  currentUser,
  dashboardMetrics,
  menus,
  roles,
  systemSettings,
  users,
} from "./mock-data";
import type {
  ApiResponse,
  LoginPayload,
  LoginResult,
  MenuRecord,
  PageResult,
  RoleRecord,
  Status,
  SystemSettings,
  UserRecord,
} from "./types";

const DELAY_MS = 150;
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

interface UserListParams {
  keyword?: string;
  status?: Status;
  page?: number;
  pageSize?: number;
}

type RecordPayload<T extends { id: string }> = Omit<T, "id">;

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

const ok = <T>(data: T, message = "success"): ApiResponse<T> => ({
  code: 0,
  message,
  data,
});

const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

const normalizePath = (url: string) => url.split("?")[0] ?? url;

const listUsers = (params?: UserListParams): PageResult<UserRecord> => {
  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, params?.pageSize ?? 10);
  const keyword = params?.keyword?.trim().toLowerCase();

  const filtered = users.filter((user) => {
    const matchesKeyword = keyword
      ? [user.username, user.name, user.email, user.role].some((value) => value.toLowerCase().includes(keyword))
      : true;
    const matchesStatus = params?.status ? user.status === params.status : true;

    return matchesKeyword && matchesStatus;
  });

  const start = (page - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
};

const replaceById = <T extends { id: string }>(items: T[], id: string, payload: Partial<RecordPayload<T>>): T => {
  const index = items.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error(`Record not found: ${id}`);
  }

  const updated = { ...items[index], ...payload } as T;
  items[index] = updated;

  return updated;
};

const deleteById = <T extends { id: string }>(items: T[], id: string): { id: string } => {
  const index = items.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error(`Record not found: ${id}`);
  }

  items.splice(index, 1);

  return { id };
};

export async function mockGet<T>(url: string, params?: object): Promise<ApiResponse<T>> {
  await wait();

  const path = normalizePath(url);

  switch (path) {
    case "/auth/current-user":
      return ok(currentUser) as ApiResponse<T>;
    case "/dashboard/overview":
      return ok({ metrics: dashboardMetrics, activities: activityItems }) as ApiResponse<T>;
    case "/users":
      return ok(listUsers(params as UserListParams | undefined)) as ApiResponse<T>;
    case "/roles":
      return ok(roles) as ApiResponse<T>;
    case "/menus":
      return ok([...menus].sort((a, b) => a.sort - b.sort)) as ApiResponse<T>;
    case "/settings":
      return ok(systemSettings) as ApiResponse<T>;
    default:
      throw new Error(`Unhandled mock GET: ${url}`);
  }
}

export async function mockPost<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  await wait();

  const path = normalizePath(url);

  switch (path) {
    case "/auth/login": {
      const payload = body as LoginPayload;
      const username = payload.username.trim();

      if (username !== DEMO_USERNAME || payload.password !== DEMO_PASSWORD) {
        throw new Error("Invalid username or password.");
      }

      const result: LoginResult = {
        token: `mock-token-${payload.remember ? "remember" : "session"}`,
        user: { ...currentUser, username },
      };

      return ok(result, "login success") as ApiResponse<T>;
    }
    case "/users": {
      const record = { id: nextId("u"), ...(body as RecordPayload<UserRecord>) };
      users.unshift(record);

      return ok(record, "created") as ApiResponse<T>;
    }
    case "/roles": {
      const record = { id: nextId("r"), ...(body as RecordPayload<RoleRecord>) };
      roles.unshift(record);

      return ok(record, "created") as ApiResponse<T>;
    }
    case "/menus": {
      const record = { id: nextId("m"), ...(body as RecordPayload<MenuRecord>) };
      menus.unshift(record);

      return ok(record, "created") as ApiResponse<T>;
    }
    default:
      throw new Error(`Unhandled mock POST: ${url}`);
  }
}

export async function mockPut<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  await wait();

  const path = normalizePath(url);
  const id = path.split("/").at(-1) ?? "";

  if (path.startsWith("/users/")) {
    return ok(replaceById(users, id, body as Partial<RecordPayload<UserRecord>>), "updated") as ApiResponse<T>;
  }

  if (path.startsWith("/roles/")) {
    return ok(replaceById(roles, id, body as Partial<RecordPayload<RoleRecord>>), "updated") as ApiResponse<T>;
  }

  if (path.startsWith("/menus/")) {
    return ok(replaceById(menus, id, body as Partial<RecordPayload<MenuRecord>>), "updated") as ApiResponse<T>;
  }

  if (path === "/settings") {
    Object.assign(systemSettings, body as Partial<SystemSettings>);

    return ok(systemSettings, "updated") as ApiResponse<T>;
  }

  throw new Error(`Unhandled mock PUT: ${url}`);
}

export async function mockDelete<T>(url: string): Promise<ApiResponse<T>> {
  await wait();

  const path = normalizePath(url);
  const id = path.split("/").at(-1) ?? "";

  if (path.startsWith("/users/")) {
    return ok(deleteById(users, id), "deleted") as ApiResponse<T>;
  }

  if (path.startsWith("/roles/")) {
    return ok(deleteById(roles, id), "deleted") as ApiResponse<T>;
  }

  if (path.startsWith("/menus/")) {
    return ok(deleteById(menus, id), "deleted") as ApiResponse<T>;
  }

  throw new Error(`Unhandled mock DELETE: ${url}`);
}
