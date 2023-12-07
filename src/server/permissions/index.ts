export const permissions = ["basics", "activites"] as const;

export type Permission = (typeof permissions)[number];
export type Permissions = Permission[];

export const course_permissions = [
  "read:users",
  "add:lessons",
  "add:tags",
  "add:courses",
  "edit:lessons",
  "edit:tags",
  "edit:courses",
] as const;

export type CoursePermission = (typeof course_permissions)[number];
export type CoursePermissions = CoursePermission[];

export const subject_permissions = ["read:users", "add:courses"];
export type SubjectPermission = (typeof subject_permissions)[number];
export type SubjectPermissions = SubjectPermission[];
