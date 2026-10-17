import Blog from "./Blog";

export default function Blogs({ blogs, user, onLike, onDelete }) {
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

    return (
        <>
            {sortedBlogs.map((blog) => (
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
