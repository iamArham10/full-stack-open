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

function mostBlogs(blogs) {
    const countMap = new Map();

    for (const blog of blogs) {
        countMap.set(blog.author, (countMap.get(blog.author) || 0) + 1);
    }

    let maxAuthor = null;
    let maxCount = 0;

    for (const [author, count] of countMap) {
        if (count > maxCount) {
            maxAuthor = author;
            maxCount = count;
        }
    }

    return {
        author: maxAuthor,
        blogs: maxCount,
    };
}

function mostLikes(blogs) {
    const countMap = new Map();

    for (const blog of blogs) {
        countMap.set(
            blog.author,
            (countMap.get(blog.authir) || 0) + blog.likes,
        );
    }

    let maxAuthor = null;
    let maxLikes = 0;

    for (const [author, likes] of countMap) {
        if (likes > maxLikes) {
            maxAuthor = author;
            maxLikes = likes;
        }
    }

    return {
        author: maxAuthor,
        like: maxLikes,
    };
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
