import { Box, Button, Paper, Stack } from "@mui/material";
import { useState } from "react";

const Blog = ({ blog, user, onLike, onDelete }) => {
    const [visible, setVisible] = useState(false);

    const canDelete = blog.user && user && blog.user.username === user.username;

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            onDelete(blog);
        }
    };

    return (
        <Paper
            className="blog"
            square
            variant="outlined"
            sx={{ p: 2, borderRadius: 0 }}
        >
            <Stack
                className="blogSummary"
                direction="row"
                alignItems="center"
                gap={1.5}
            >
                <Box component="span" sx={{ lineHeight: 1 }}>
                    {blog.title}
                </Box>
                <Box component="span" sx={{ lineHeight: 1 }}>
                    {blog.author}
                </Box>
                <Button
                    className="view-button"
                    size="small"
                    variant="outlined"
                    sx={{
                        borderRadius: 0,
                        minWidth: 0,
                        px: 1,
                        py: 0.25,
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                        ml: 0.5,
                    }}
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? "hide" : "view"}
                </Button>
            </Stack>

            {visible && (
                <Stack className="blogDetail" spacing={1.5} sx={{ mt: 2 }}>
                    <Box>{blog.url}</Box>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box component="span" sx={{ lineHeight: 1 }}>
                            likes: {blog.likes}
                        </Box>
                        {user && (
                            <Button
                                className="like-button"
                                size="small"
                                variant="contained"
                                sx={{
                                    borderRadius: 0,
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.25,
                                    fontSize: "0.75rem",
                                    lineHeight: 1.2,
                                }}
                                onClick={() => onLike(blog)}
                            >
                                like
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{
                                    borderRadius: 0,
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.25,
                                    fontSize: "0.75rem",
                                    lineHeight: 1.2,
                                }}
                                onClick={handleDelete}
                            >
                                remove
                            </Button>
                        )}
                    </Stack>
                    <Box>{blog.user?.name}</Box>
                </Stack>
            )}
        </Paper>
    );
};

export default Blog;
