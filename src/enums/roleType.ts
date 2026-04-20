export enum RoleType {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MECHANIC = "mechanic",
  CUSTOMER = "customer",
}

export interface RoleMeta {
  value: RoleType;
  label: string;
  color: string;
}

export const ROLE_OPTIONS: RoleMeta[] = [
  { value: RoleType.SUPER_ADMIN, label: "Super Admin", color: "green" },
  { value: RoleType.ADMIN, label: "Admin", color: "blue" },
  { value: RoleType.MECHANIC, label: "Mechanic", color: "orange" },
  { value: RoleType.CUSTOMER, label: "Customer", color: "default" },
];

export const getRoleMeta = (value: string): RoleMeta | undefined => {
  return ROLE_OPTIONS.find((role) => role.value === value);
};

export const getRoleLabel = (value: string): string => {
  return getRoleMeta(value)?.label ?? value;
};

export const getRoleColor = (value: string): string => {
  return getRoleMeta(value)?.color ?? "default";
};