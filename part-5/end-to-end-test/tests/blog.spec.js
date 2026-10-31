const { test, expect, beforeEach, describe } = require("@playwright/test");
const {
    createUser,
    loginWith,
    logout,
    createBlog,
    getBlog,
    likeBlog,
} = require("./helper");

describe("blog App", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3000/api/testing/reset");
        await createUser(request, {
            name: "arham",
            username: "arham",
            password: "1234",
        });
        await page.goto("http://localhost:3000");
    });

    test("login form is displayed", async ({ page }) => {
        await page.getByRole("link", { name: "login" }).click();

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
            await loginWith(page, "arham", "1234");

            await expect(page.getByText("arham logged in")).toBeVisible();
        });

        test("user cannot login with wrong credentials", async ({ page }) => {
            await loginWith(page, "arham", "4321");

            await expect(page.getByText("Wrong Credentials")).toBeVisible();
        });
    });

    describe("logged in", () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, "arham", "1234");
        });

        test("new blog can be created", async ({ page }) => {
            await createBlog(page, {
                title: "new blog",
                author: "arham",
                url: "www.fakeurl.com",
            });

            await expect(page.getByText("new blog")).toBeVisible();
        });

        describe("blog can be liked", () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, {
                    title: "first blog",
                    author: "arham",
                    url: "www.first-blog.com",
                });
                await createBlog(page, {
                    title: "second blog",
                    author: "arham",
                    url: "www.second-blog.com",
                });
            });

            test("blog can be liked", async ({ page }) => {
                await likeBlog(page, "second blog");
                await expect(page.locator(".blogDetail")).toContainText(
                    "likes: 1",
                );
            });
        });

        describe("blogs can be sorted", () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, {
                    title: "first",
                    author: "arham",
                    url: "www.fakeurl.com",
                });
                await likeBlog(page, "first", 3);

                await createBlog(page, {
                    title: "second",
                    author: "arham",
                    url: "www.fakeurl.com",
                });
                await likeBlog(page, "second", 1);

                await createBlog(page, {
                    title: "third",
                    author: "arham",
                    url: "www.fakeurl.com",
                });
                await likeBlog(page, "third", 5);

                await createBlog(page, {
                    title: "fourth",
                    author: "arham",
                    url: "www.fakeurl.com",
                });
                await likeBlog(page, "fourth", 2);
                await page.goto("http://localhost:3000");
            });

            test("blogs are sorted", async ({ page }) => {
                await page
                    .getByRole("button", { name: "sort by likes" })
                    .click();

                const blogs = page.getByRole("list").getByRole("link");

                await expect(blogs.nth(0)).toContainText("third");
                await expect(blogs.nth(1)).toContainText("first");
                await expect(blogs.nth(2)).toContainText("fourth");
                await expect(blogs.nth(3)).toContainText("second");
            });
        });
    });

    describe("two users logged in, blog created for them", () => {
        beforeEach(async ({ page, request }) => {
            await createUser(request, {
                name: "otherUser",
                username: "otherUser",
                password: "1234",
            });

            await loginWith(page, "otherUser", "1234");
            await createBlog(page, {
                title: "other user blog",
                author: "otherUser",
                url: "www.fakeurl.com",
            });

            await logout(page);

            await loginWith(page, "arham", "1234");
            await createBlog(page, {
                title: "arham blog",
                author: "arham",
                url: "www.fakeurl.com",
            });
        });

        test("test user who added the blog can delete a blog", async ({
            page,
        }) => {
            const blogElement = await getBlog(page, "arham blog");

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
            const blogElement = await getBlog(page, "other user blog");

            await blogElement.getByRole("button", { name: "view" }).click();

            await expect(
                blogElement
                    .locator(".blogDetail")
                    .getByRole("button", { name: "remove" }),
            ).not.toBeVisible();
        });
    });
});
