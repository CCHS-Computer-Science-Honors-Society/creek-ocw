import { type Course, type Subject, type User } from "@/server/db/schema";

export const ADMIN_USER: User = {
  id: "admin",
  name: "admin",
  email: "admin@e2e.e2e",
  image: "https://example.com/image",
  roles: ["activites"],
  emailVerified: new Date(),
};

export const NORMAL_USER: User = {
  id: "normal",
  name: "normal",
  emailVerified: new Date(),
  image: "https://example.com/image",
  email: "normal@#e2e.e2e",
  roles: ["basics"],
};

export const TEST_SUBJECT: Subject = {
  id: "test-subject",
  createdAt: new Date(),
  name: "test-subject",
  image: "https://example.com/image",
  catagory: "Computer Science",
};
export const TEST_COURSE: Course = {
  id: "test-course",
  createdAt: new Date(),
  name: "test-course",
  image: "https://example.com/image",
  description: "test-course",
  subjectId: "test-subject",
};
