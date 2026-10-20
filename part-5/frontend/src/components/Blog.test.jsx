import { queryByText, render, screen } from "@testing-library/react";
import Blog from "./Blog";

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

