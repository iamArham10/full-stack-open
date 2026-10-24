const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("blog App", () => {
    beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000");
    });

    test("login form is displayed", async ({ page }) => {
        await page.getByRole("button", { name: "login" }).click();

        const usernameField = page.getByRole("textbox", {
            name: "username",
        });

        const passwordField = page.getByRole("textbox", {
            name: "password",
        });

        await expect(usernameField).toBeVisible();
        await expect(passwordField).toBeVisible();
    });
});
