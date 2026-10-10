const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: String,
    url: {
        type: String,
        required: true,
    },
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
