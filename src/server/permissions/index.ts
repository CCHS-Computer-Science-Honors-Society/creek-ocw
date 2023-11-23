export const permissions = [
  "basics",
  "read:users",
  "add:lessons",
  "add:tags",
  "add:courses",
  "edit:lessons",
  "edit:tags",
  "edit:courses",
  "activites",
] as const;

export type Permission = (typeof permissions)[number];
export type Permissions = Permission[];
