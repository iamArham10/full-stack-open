const mongoose = require("mongoose")


const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    like: Number,
});

module.exports = mongoose.model("Blog", blogSchema);
