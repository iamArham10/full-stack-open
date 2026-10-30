import { useState } from "react";

const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
};

const Blog = ({ blog, user, onLike, onDelete }) => {
    const [visible, setVisible] = useState(false);

    const canDelete = blog.user && user && blog.user.username === user.username;

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            onDelete(blog);
        }
    };

    return (
        <div style={blogStyle} className="blog">
            <div className="blogSummary">
                {blog.title} {blog.author}{" "}
                <button
                    className="view-button"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? "hide" : "view"}
                </button>
            </div>

            {visible && (
                <div className="blogDetail">
                    <div>{blog.url}</div>
                    <div>
                        likes: {blog.likes}{" "}
                        {user && (
                            <button
                                className="like-button"
                                onClick={() => onLike(blog)}
                            >
                                like
                            </button>
                        )}
                    </div>
                    <div>{blog.user?.name}</div>
                    {canDelete && (
                        <button onClick={handleDelete}>remove</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Blog;
