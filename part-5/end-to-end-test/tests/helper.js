const { expect } = require("@playwright/test");

const createUser = async (request, { name, username, password }) => {
    await request.post("http://localhost:3000/api/users", {
        data: { name, username, password },
    });
};

const loginWith = async (page, username, password) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill(username);
    await page.getByLabel("password").fill(password);
    await page.getByRole("button", { name: "login" }).click();
};

const logout = async (page) => {
    await page.getByRole("button", { name: "logout" }).click();
};

const createBlog = async (page, { title, author, url }) => {
    await page.getByRole("button", { name: "create new blog" }).click();
    await page.getByLabel("title").fill(title);
    await page.getByLabel("author").fill(author);
    await page.getByLabel("url").fill(url);
    await page.getByRole("button", { name: "add" }).click();
    await expect(getBlog(page, title)).toBeVisible();
};

const getBlog = (page, text) => {
    return page.locator(".blog").filter({ hasText: text });
};

const likeBlog = async (page, title, times = 1) => {
    const blog = getBlog(page, title);
    await expect(blog).toBeVisible();

    const viewButton = blog.getByRole("button", { name: "view" });
    if (await viewButton.isVisible()) {
        await viewButton.click();
    }

    const blogDetail = blog.locator(".blogDetail");
    await expect(blogDetail).toBeVisible();

    const likeButton = blogDetail.getByRole("button", { name: "like" });

    for (let i = 0; i < times; i++) {
        const text = await blogDetail.textContent();
        const currentLikes = Number(text.match(/likes\s+(\d+)/)[1]);
        await likeButton.click();
        await expect(blogDetail).toContainText(`likes ${currentLikes + 1}`);
    }
};

module.exports = {
    createUser,
    loginWith,
    logout,
    createBlog,
    getBlog,
    likeBlog,
};
