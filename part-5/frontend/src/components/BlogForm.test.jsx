import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("New blog form calls event handler with right details", async () => {
    const newBlog = {
        title: "johns blog",
        author: "john",
        url: "www.john.com",
    };

    const user = userEvent.setup();
    const onAddMock = vi.fn();
    render(<BlogForm onAdd={onAddMock} />);

    const titleInput = screen.getByPlaceholderText("title");
    const authorInput = screen.getByPlaceholderText("author");
    const urlInput = screen.getByPlaceholderText("url");
    const submitButton = screen.getByText("add");

    await user.type(titleInput, newBlog.title);
    await user.type(authorInput, newBlog.author);
    await user.type(urlInput, newBlog.url);
    await user.click(submitButton);

    expect(onAddMock.mock.calls).toHaveLength(1);
    expect(onAddMock.mock.calls[0][0]).toEqual({
        title: "johns blog",
        author: "john",
        url: "www.john.com",
    });
});
