import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const TEST_COURSE_ID = "intro-cs";
const TEST_SUBJECT_ID = "intro-cs";

test("user to lesson workflow", async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.getByRole("textbox")).toBeVisible();
  await expect(page.getByText("Select a catagory...")).toBeVisible();
  await page.getByRole("link", { name: TEST_SUBJECT_ID }).click();
  await page.getByRole("link", { name: TEST_COURSE_ID }).click();
  await page.getByRole("button", { name: "Introduction" }).click();
  await page.getByRole("link", { name: "Test Day" }).click();
  await page.goto(
    "http://localhost:3000/courses/intro-cs/units/1/lessons/test-day",
  );
  await expect(page.locator("h1")).toContainText("Test Day");
});
