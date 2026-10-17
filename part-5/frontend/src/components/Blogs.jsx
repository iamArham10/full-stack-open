import { useState } from "react";
import Blog from "./Blog";

export default function Blogs({ blogs, user, onLike, onDelete }) {
    const [sortByLikes, setSortByLikes] = useState(false);

    const shownBlogs = sortByLikes
        ? [...blogs].sort((a, b) => b.likes - a.likes)
        : blogs;

    return (
        <>
            <button onClick={() => setSortByLikes(!sortByLikes)}>
                {sortByLikes ? "original order" : "sort by likes"}
            </button>
            {shownBlogs.map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    user={user}
                    onLike={onLike}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
}
