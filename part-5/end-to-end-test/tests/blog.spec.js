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

        test("user cannot login with wrong credentials", async ({ page }) => {
            await page.getByRole("button", { name: "login" }).click();

            await page.getByLabel("username").fill("arham");
            await page.getByLabel("password").fill("4321");

            await page.getByRole("button", { name: "login" }).click();

            await expect(page.getByText("Wrong Credentials")).toBeVisible();
        });
    });

    describe("logged in", () => {
        // log in user
        beforeEach(async ({ page }) => {
            await page.getByRole("button", { name: "login" }).click();

            await page.getByLabel("username").fill("arham");
            await page.getByLabel("password").fill("1234");

            await page.getByRole("button", { name: "login" }).click();
        });

        test("new blog can be created", async ({ page }) => {
            await page.getByRole("button", { name: "create new blog" }).click();

            await page.getByLabel("title").fill("new blog");
            await page.getByLabel("author").fill("arham");
            await page.getByLabel("url").fill("www.fakeurl.com");

            await page.getByRole("button", { name: "add" }).click();

            await expect(page.getByText("new blog arham")).toBeVisible();
        });

        describe("blogged can be liked", () => {
            beforeEach(async ({ page }) => {
                // Create two blogs
                await page
                    .getByRole("button", { name: "create new blog" })
                    .click();

                await page.getByLabel("title").fill("first blog");
                await page.getByLabel("author").fill("arham");
                await page.getByLabel("url").fill("www.first-blog.com");

                await page.getByRole("button", { name: "add" }).click();

                await page
                    .getByRole("button", { name: "create new blog" })
                    .click();

                await page.getByLabel("title").fill("second blog");
                await page.getByLabel("author").fill("arham");
                await page.getByLabel("url").fill("www.second-blog.com");

                await page.getByRole("button", { name: "add" }).click();
            });

            test("blog can be liked", async ({ page }) => {
                const blogLocator = page
                    .locator(".blog")
                    .filter({ hasText: "second blog" });
                await blogLocator.getByRole("button", { name: "view" }).click();

                // now blog detail will be shown
                const blogDetail = blogLocator.locator(".blogDetail");
                await blogDetail.getByRole("button", { name: "like" }).click();
                await expect(blogDetail).toContainText("likes 1");
            });
        });
    });

    describe("two users logged in, blog created for them", () => {
        beforeEach(async ({ page, request }) => {
            await request.post("http://localhost:3000/api/users", {
                data: {
                    name: "otherUser",
                    username: "otherUser",
                    password: "1234",
                },
            });

            await page.getByRole("button", { name: "login" }).click();
            await page.getByLabel("username").fill("otherUser");
            await page.getByLabel("password").fill("1234");

            await page.getByRole("button", { name: "login" }).click();

            // create a new blog
            await page.getByRole("button", { name: "create new blog" }).click();

            await page.getByLabel("title").fill("other user blog");
            await page.getByLabel("author").fill("otherUser");
            await page.getByLabel("url").fill("www.fakeurl.com");
            await page.getByRole("button", { name: "add" }).click();

            // log out
            await page.getByRole("button", { name: "logout" }).click();

            // other user log in

            await page.getByRole("button", { name: "login" }).click();

            await page.getByLabel("username").fill("arham");
            await page.getByLabel("password").fill("1234");

            await page.getByRole("button", { name: "login" }).click();

            // new glo

            await page.getByRole("button", { name: "create new blog" }).click();

            await page.getByLabel("title").fill("arham blog");
            await page.getByLabel("author").fill("arham");
            await page.getByLabel("url").fill("www.fakeurl.com");
            await page.getByRole("button", { name: "add" }).click();
        });

        test("test user who added the blog can delete a blog", async ({
            page,
        }) => {
            const blogElement = page
                .locator(".blog")
                .filter({ hasText: "arham blog" });

            await blogElement.getByRole("button", { name: "view" }).click();

            page.once("dialog", async (dialog) => {
                await dialog.accept();
            });

            await blogElement
                .locator(".blogDetail")
                .getByRole("button", { name: "remove" })
                .click();

            await expect(blogElement).not.toBeVisible();
        });

        test("whether the user whose blog its not cannot see the delete button", async ({
            page,
        }) => {
            const blogElement = page
                .locator(".blog")
                .filter({ hasText: "other user blog" });

            await blogElement.getByRole("button", { name: "view" }).click();

            await expect(
                blogElement
                    .locator(".blogDetail")
                    .getByRole("button", { name: "remove" }),
            ).not.toBeVisible();
        });
    });
});
