const { test, describe } = require("node:test");
const assert = require("node:assert");
const { dummy, totalLikes, favoriteBlog } = require("../utils/list_helper");

describe("list", () => {
    const blogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0,
        },
    ];

    test("dummy returns one", () => {
        const result = dummy(blogs);
        assert.strictEqual(result, 1);
    });

    test("when a list has only one blog, equals to the likes of that", () => {
        const result = totalLikes(blogs);
        assert.strictEqual(result, 7);
    });
});
