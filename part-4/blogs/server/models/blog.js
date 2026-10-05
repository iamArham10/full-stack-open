const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    like: Number,
});

blogSchema.set("toJSON", {
    transform: (_object, outputObject) => {
        outputObject.id = outputObject._id;
        delete outputObject._id;
        delete outputObject.__v;
    },
});

module.exports = mongoose.model("Blog", blogSchema);
