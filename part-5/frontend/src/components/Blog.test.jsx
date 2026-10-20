import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

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
    expect(detail).toHaveTextContent(`likes ${blog.likes}`);
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
    render(<Blog blog={blog} onLike={onLike} />);

    const button = screen.getByText("view");
    await user.click(button);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(onLike.mock.calls).toHaveLength(2);
});
