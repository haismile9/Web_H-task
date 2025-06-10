type PermissionKey =
  | "canViewDashboard"
  | "canManageProjects"
  | "canViewTasks"
  | "canCreateTasks"
  | "canAssignTasks"
  | "isAdmin";

type Permissions = Record<PermissionKey, boolean>;

type Role = "admin" | "leader" | "member";

const rolePermissions: Record<Role, Permissions> = {
  admin: {
    canViewDashboard: true,
    canManageProjects: true,
    canViewTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    isAdmin: true,
  },
  leader: {
    canViewDashboard: true,
    canManageProjects: true,
    canViewTasks: true,
    canCreateTasks: true,
    canAssignTasks: true,
    isAdmin: false,
  },
  member: {
    canViewDashboard: true,
    canManageProjects: false,
    canViewTasks: true,
    canCreateTasks: false,
    canAssignTasks: false,
    isAdmin: false,
  },
};

// ✅ Hàm truy cập quyền
export const accessControl = (role: string): Permissions => {
  return rolePermissions[role as Role] ?? {
    canViewDashboard: false,
    canManageProjects: false,
    canViewTasks: false,
    canCreateTasks: false,
    canAssignTasks: false,
    isAdmin: false,
  };
};
