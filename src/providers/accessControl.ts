import type { AccessControlProvider } from "@refinedev/core";
import { PERMISSIONS_KEY, IS_SUPER_ADMIN_KEY } from "./constants";

// Map Refine CRUD actions to API permission prefixes
const actionPermissionMap: Record<string, string> = {
  list: "view_any",
  show: "view",
  create: "create",
  edit: "update",
  delete: "delete",
};

// Special sub-actions that map to specific permissions
const resourceActionPermissionMap: Record<string, Record<string, string>> = {
  work_orders: {
    diagnose: "diagnose_work_order",
    approve: "approve_work_order",
    complete: "complete_work_order",
    cancel: "cancel_work_order",
    mark_invoiced: "mark_invoiced_work_order",
    record_complaint: "record_complaint_work_order",
    assign_mechanic: "assign_mechanic_work_order",
    start_service: "start_work_order_service",
    complete_service: "complete_work_order_service",
  },
  complaints: {
    reassign: "reassign_complaint",
    resolve: "resolve_complaint",
    reject: "reject_complaint",
    assign_mechanic: "assign_mechanic_complaint",
  },
  invoices: {
    send: "send_invoice",
    pay: "pay_invoice",
    cancel: "cancel_invoice",
  },
  mechanic_assignments: {
    start: "start_mechanic_assignment",
    complete: "complete_mechanic_assignment",
    cancel: "cancel_mechanic_assignment",
  },
  services: {
    toggle_active: "toggle_active_service",
  },
  users: {
    impersonate: "impersonate_user",
    change_role: "change_role_user",
    toggle_active: "toggle_active_user",
  },
  roles: {
    restore: "restore_role",
    force_delete: "force_delete_role",
    replicate: "replicate_role",
    reorder: "reorder_role",
  },
};

const getPermissions = (): string[] => {
  const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
  if (permissionsStr) {
    return JSON.parse(permissionsStr);
  }
  return [];
};

const isSuperAdmin = (): boolean => {
  return localStorage.getItem(IS_SUPER_ADMIN_KEY) === "true";
};

// Singularize a resource name (simple heuristic)
const singularize = (resource: string): string => {
  if (resource.endsWith("ies")) {
    return resource.slice(0, -3) + "y"; // e.g., categories -> category
  }
  if (resource.endsWith("ses")) {
    return resource.slice(0, -2); // e.g., addresses -> address
  }
  if (resource.endsWith("s")) {
    return resource.slice(0, -1); // e.g., cars -> car, users -> user
  }
  return resource;
};

export const accessControlProvider: AccessControlProvider = {
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },

  can: async ({ resource, action, params }) => {
    // Super admin has full access
    if (isSuperAdmin()) {
      return { can: true };
    }

    const permissions = getPermissions();

    if (permissions.length === 0) {
      return { can: false };
    }

    // If a specific permission is passed via meta, check directly
    if (params?.permission) {
      return {
        can: permissions.includes(params.permission as string),
      };
    }

    // Check resource-specific sub-actions first
    if (
      resource &&
      resourceActionPermissionMap[resource] &&
      resourceActionPermissionMap[resource][action]
    ) {
      return {
        can: permissions.includes(
          resourceActionPermissionMap[resource][action],
        ),
      };
    }

    // Map standard CRUD actions to permission strings
    const prefix = actionPermissionMap[action];
    if (prefix && resource) {
      const singular = singularize(resource);
      const permission = `${prefix}_${singular}`;
      return {
        can: permissions.includes(permission),
      };
    }

    // For any other action, check if the raw permission exists
    if (action && permissions.includes(action)) {
      return { can: true };
    }

    // Default deny
    return { can: false };
  },
};
