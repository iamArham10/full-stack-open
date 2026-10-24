const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("blog App", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3000/api/testing/reset");
        await request.post("http://localhost:3000/api/users", {
            data: {
                name: "arham",
                username: "arham",
                password: "1234",
            },
        });
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

    describe("login", () => {
        test("user can login with correct credentials", async ({ page }) => {
            await page.getByRole("button", { name: "login" }).click();

            // entering username and password
            await page.getByLabel("username").fill("arham");
            await page.getByLabel("password").fill("1234");

            await page.getByRole("button", { name: "login" }).click();

            await expect(page.getByText("arham logged in")).toBeVisible();
        });
    });
});
