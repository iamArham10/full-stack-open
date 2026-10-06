function dummy(blogs) {
    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce((prev, curr) => prev + curr.likes, 0);
}

module.exports = { dummy, totalLikes };
