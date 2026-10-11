const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (_object, outputObject) => {
        outputObject.id = outputObject._id;
        delete outputObject._id;
        delete outputObject.password;
        delete outputObject.__v;
    },
});

module.exports = mongoose.Model("User", userSchema);
