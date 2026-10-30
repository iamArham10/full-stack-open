import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("blog information and number of likes are displayed to user but not buttons", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com",
        likes: 7,
    };

    const user = userEvent.setup();
    const { container } = render(<Blog blog={blog} />);

    // check whether blog information is visible
    const blogSummary = container.querySelector(".blogSummary");
    expect(blogSummary).toHaveTextContent("React patterns");
    expect(blogSummary).toHaveTextContent("Michael Chan");

    await user.click(blogSummary.querySelector(".view-button"));

    const blogDetail = container.querySelector(".blogDetail");

    expect(blogDetail).not.toBeNull();
    expect(blogDetail).toHaveTextContent("https://reactpatterns.com");
    expect(blogDetail).toHaveTextContent("likes: 7");

    expect(blogDetail.querySelector(".like-button")).toBeNull();
    expect(screen.queryByText("remove")).toBeNull();
});

test("authenticated users who are not the blog creator are shown only the like button", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "mchan",
            name: "Michael Chan",
        },
    };

    const user = userEvent.setup();

    const loggedInUser = { username: "testuser", name: "testuser" };
    const { container } = render(<Blog blog={blog} user={loggedInUser} />);

    await user.click(screen.getByRole("button", { name: "view" }));

    const blogDetail = container.querySelector(".blogDetail");

    expect(blogDetail.querySelector(".like-button")).toBeVisible();
    expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
});

test("test blog component renders title and author but not url and likes by default", () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "mchan",
            name: "Michael Chan",
        },
    };

    const { container } = render(<Blog blog={blog} />);

    const summary = container.querySelector(".blogSummary");
    expect(summary).toHaveTextContent("React patterns");
    expect(summary).toHaveTextContent("Michael Chan");

    const detail = container.querySelector(".blogDetail");
    expect(detail).toBeNull();
});

test("test blog creator is also shown the delete button", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "mchan",
            name: "Michael Chan",
        },
    };
    const loggedInUser = {
        username: "mchan",
        name: "Michael Chan",
    };

    const user = userEvent.setup();

    render(<Blog blog={blog} user={loggedInUser} />);
    await user.click(screen.getByRole("button", { name: "view" }));

    expect(screen.getByRole("button", { name: "remove" })).toBeVisible();
});

test("test blog component shows details when user presses view", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "mchan",
            name: "Michael Chan",
        },
    };

    const user = userEvent.setup();

    const { container } = render(<Blog blog={blog} />);
    const viewButton = container.querySelector(".view-button");
    await user.click(viewButton);

    const detail = container.querySelector(".blogDetail");

    expect(detail).not.toBeNull();
    expect(detail).toHaveTextContent("https://reactpatterns.com/");
    expect(detail).toHaveTextContent(`likes: ${blog.likes}`);
    expect(detail).toHaveTextContent(`${blog.user.name}`);
});

test("check if like is clicked twice, appropriate event handler is also called twice", async () => {
    const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        user: {
            username: "mchan",
            name: "Michael Chan",
        },
    };

    const user = userEvent.setup();

    const onLike = vi.fn();
    const loggedInUser = { username: "testuser", name: "testuser" };
    render(<Blog blog={blog} user={loggedInUser} onLike={onLike} />);

    const button = screen.getByText("view");
    await user.click(button);

    const likeButton = screen.getByRole("button", { name: "like" });
    await user.click(likeButton);
    await user.click(likeButton);

    expect(onLike.mock.calls).toHaveLength(2);
});
