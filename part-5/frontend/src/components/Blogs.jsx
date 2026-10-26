import { useState } from "react";
import { Link } from "react-router-dom";

export default function Blogs({ blogs }) {
    const [sortByLikes, setSortByLikes] = useState(false);

    const shownBlogs = sortByLikes
        ? [...blogs].sort((a, b) => b.likes - a.likes)
        : blogs;

    return (
        <>
            <button onClick={() => setSortByLikes(!sortByLikes)}>
                {sortByLikes ? "original order" : "sort by likes"}
            </button>
            <ul>
                {shownBlogs.map((blog) => (
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
