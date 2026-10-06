function dummy(blogs) {
    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce((prev, curr) => prev + curr.likes, 0);
}

function favoriteBlog(blogs) {
    const result = blogs.reduce(
        (max, blog) => (blog.likes > max.likes ? blog : max),
        { likes: -1 },
    );

    return result.likes !== -1 ? result : null;
}

module.exports = { dummy, totalLikes, favoriteBlog };
